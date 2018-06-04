import * as React from "react";
import { ITimelineListProps } from "../TimelineList";
import { ITimelineListState } from "../TimelineList";
import pnp, { Item, sp } from "sp-pnp-js";
import { List } from "office-ui-fabric-react/lib/List";
import styles from "../SpPnPjsExample.module.scss";
import { values } from "@uifabric/utilities/lib";

interface web {
  Title: string;
  Url: string;
  Id: string;
}

export class TimelineList extends React.Component<
  ITimelineListProps,
  ITimelineListState
> {
  constructor(props: ITimelineListProps) {
    super(props);
    this.state = {
      list: [],
      date_range: [],
      check_info: false,
      selected_item: {},
      data_closed: true
    };
    this._setDateArray = this._setDateArray.bind(this);
    this._taskDetails = this._taskDetails.bind(this);
    this._formatListDates = this._formatListDates.bind(this);
    this._formatMonthDay = this._formatMonthDay.bind(this);
    this._handleClickData = this._handleClickData.bind(this);
    this._handleCloseButton = this._handleCloseButton.bind(this);
    this._taskDetails = this._taskDetails.bind(this);
    this._dueDatePeriod = this._dueDatePeriod.bind(this);
  }

  public render(): React.ReactElement<ITimelineListProps> {
    //console.log("test-render");
    //console.dir(this.state.date_range);
    return (
      <div>
        <div className={styles.containerTable}>
          {this.state.date_range.map((date, index) => {
            //console.log("------");
            //console.log(date);
            //console.log("------");
            const taskItems = this.state.list.filter(
              x => this._formatListDates(x.StartDate) == date
            );
            //console.dir(date);
            //console.log(taskItems);
            return (
              // note: JSX cannot output objects.
              // must convert to string.
              <ul className={styles.mainTable}>
                <li className={styles.listDateCell}>
                  <span className={styles.date}>
                    {this._formatMonthDay(date)}
                  </span>
                  {taskItems.map((taskItem, index) => {
                    return (
                      <div onClick={() => this._handleClickData(taskItem)}>
                        <ul className={styles.infoCell}>
                          <li className={styles.listInfoTask}>
                            <span>{taskItem.Title}</span>
                          </li>
                          <li className={styles.listInfoTask}>
                            <span>
                              {this._formatMonthDay(taskItem.StartDate)} -{" "}
                              {this._formatMonthDay(taskItem.DueDate)}
                            </span>
                          </li>
                        </ul>
                      </div>
                    );
                  })}
                </li>
              </ul>
            );
          })}
          {this.state.selected_item !== null && (
            <div>
              Add popup section{" "}
              {this._taskDetails(
                this.state.selected_item,
                this.state.check_info
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  public componentDidMount() {
    console.log("load-items");
    pnp.sp.web.lists
      .getByTitle("TimelineTasks")
      .items.get()
      .then((items: any[]) => {
        console.log(items);
        this.setState({
          list: items,
          date_range: this._setDateArray() // set the state of date range.
        });
      });
  }

  private _setDateArray(): any[] {
    console.log("set-date-array");
    let s_date = new Date("2018-05-14");
    let e_date = new Date("2018-06-14");
    let current_date = new Date();
    //console.log(current_date);
    let start_date = new Date(
      current_date.setDate(current_date.getDate() - 13)
    );
    //console.log(start_date);
    let end_date = new Date(current_date.setDate(current_date.getDate() + 10));
    let newEndDate = current_date.setDate(current_date.getDate() + 10);
    end_date = new Date(newEndDate);
    //console.log(end_date);

    let date_array = new Array();
    while (start_date <= end_date) {
      date_array.push(start_date);
      let countDate = start_date.setDate(start_date.getDate() + 1);
      start_date = new Date(countDate);
    }
    //console.log(date_array);
    date_array = this._formatDates(date_array);
    return date_array;
  }

  private _formatDates(array: any[]): any[] {
    //console.log("test-format-date");
    let temp = new Array();
    for (let index = 0; index < array.length; index++) {
      let dateFormat = new Date(array[index]);
      temp.push(dateFormat.toDateString());
    }
    //console.log(temp);
    return temp;
  }

  private _formatListDates(x: any): any {
    //console.log("format-list-dates");
    let newDateFormat = new Date(x);
    //console.log(newDateFormat.toDateString());
    return newDateFormat.toDateString();
  }

  private _formatMonthDay(x: any): any {
    console.log("format-month-day");
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    let newDateFormat = new Date(x);
    let month = newDateFormat.getMonth();
    let day = newDateFormat.getDate();
    //console.log(monthNames[month]);
    //console.log(day);
    let newFormat = `${monthNames[month]} ${day}`;
    //console.log(newFormat);
    return newFormat;
  }

  private _handleClickData(event): any {
    console.log("handle-click-data");
    console.log("this object {from handle-click-data}: ", event);
    this.setState({
      check_info: !this.state.check_info,
      selected_item: event,
      data_closed: false
    });
    console.log("item checked: ", this.state.check_info);
    console.log("selected item: ", this.state.selected_item);
    return <div>{this._taskDetails(event, this.state.check_info)}</div>;
  }

  private _handleCloseButton(event): any {
    console.log("closed.");
    event = null;
    this.setState({
      selected_item: event,
      check_info: !this.state.check_info
    });
  }

  private _taskDetails(event, _clicked: boolean): any {
    console.log("task-details-show-info");
    console.log("this is object {from task-details}: ", event);
    let c_date = new Date();
    if (_clicked) {
      console.log("data-clicked-show-info", _clicked);
      return (
        <div className={styles.popup}>
          <div className={styles.popup_inner}>
            <button
              type="button"
              onClick={() => this._handleCloseButton(event)}
            >
              X
            </button>
            <p>Title: {event.Title}</p>
            <p>Due Date: {this._formatMonthDay(event.DueDate)}</p>
            <p>Assigned To: {event.AuthorId}</p>
            <p>Due {this._dueDatePeriod(c_date, event.DueDate)}</p>
          </div>
        </div>
      );
    }
  }

  private _dueDatePeriod(curr_date: any, due_date: any): any {
    console.log("due-date-period");
    let date1 = new Date(curr_date);
    //let date1 = new Date("2018-06-3");
    //console.log("current date: ", date1);
    let date2 = new Date(due_date);
    //console.log("due date: ", date2);
    let date_date1 = date1.getDate();
    let month_date1 = date1.getMonth();
    let date_date2 = date2.getDate();
    let month_date2 = date2.getMonth();
    let due_period: any = 0;
    let outputInterval: any;
    console.log("date for curr_date date1: ", date_date1);
    console.log("month for curr_date date1: ", month_date1);
    console.log("date for due_date date2: ", date_date2);
    console.log("month for due_date date2: ", month_date2);
    //console.log(month_date2 % 2);

    if (month_date1 == month_date2) {
      // dates are in the same month
      if (date_date1 > date_date2) {
        due_period = date_date1 - date_date2;
        outputInterval = `${due_period} days ago.`;
      } else {
        due_period = date_date2 - date_date1;
        outputInterval = `in ${due_period} days.`;
      }
    } else {
      // dates are in different month
      if (month_date1 > month_date2) {
        console.log("dates are in different month");
        if (month_date2 % 2 == 0) {
          if (date_date1 > date_date2) {
            date_date2 = 31 - date_date2;
            due_period = date_date1 + date_date2;
            outputInterval = `${due_period} days ago.`;
          } else {
            date_date2 = 31 - date_date2;
            due_period = date_date2 + date_date1;
            outputInterval = `${due_period} days ago.`;
          }
        } else {
          if (date_date1 > date_date2) {
            date_date2 = 30 - date_date2;
            due_period = date_date1 + date_date2;
            outputInterval = `${due_period} days ago.`;
          } else {
            date_date2 = 30 - date_date2;
            due_period = date_date2 + date_date1;
            outputInterval = `${due_period} days ago.`;
          }
        }
      }
    }
    return outputInterval;
  }

  // debug test
  private _getWebDetails(): void {
    console.log("test-web-details");
    let html: string = "";
    const element: HTMLElement = document.getElementById("click");
    pnp.sp.web.get().then(response => {
      html += response.Title + "<br/>";
      html += response.Url;
      html += response.Id;
      element.innerHTML = html;
    });
  }
}

/*(this.state.selected_item !== null) ? (<div>Info</div>) : (<div>Null</div>)
  implement Popup.

  private _taskDetails(event, _clicked: boolean): any {
  console.log("task-details-show-info");
  console.log("this is object {from task-details}: ", event);
  let c_date = new Date();
  if (_clicked) {
    console.log("data-clicked-show-info", _clicked);
    return (
      <div className={styles.popup}>
        <div className={styles.popup_inner}>
          <p>Title: {event.Title}</p>
          <p>Due Date: {this._formatMonthDay(event.DueDate)}</p>
          <p>Assigned To: {event.AuthorId}</p>
          <p>Due {this._dueDatePeriod(c_date, event.DueDate)} days ago</p>
        </div>
      </div>
    );
  } else {
    console.log("data-not-clicked", _clicked);
    return (
      <div className={styles.popup}>
        <div className={styles.popup_inner}>
          <p>Title: {event.Title}</p>
          <p>Due Date: {this._formatMonthDay(event.DueDate)}</p>
          <p>Assigned To: {event.AuthorId}</p>
          <p>Due {this._dueDatePeriod(c_date, event.DueDate)} days ago</p>
        </div>
      </div>
    );
  }
}
*/

/*
<table className={styles.mainTable}>
  <tr className={styles.rowTable}>
    <th className={styles.headerTable}>
      {this._formatMonthDay(date)}
    </th>
  </tr>
  <tr className={styles.rowTable}>
    <td className={styles.standardCell}>
      {taskItems.map(taskItems => {
        return (
          <div>
            <p className={styles.info}>{taskItems.Title}</p>
            <p>
              {this._formatMonthDay(taskItems.StartDate)} -{" "}
              {this._formatMonthDay(taskItems.DueDate)}
            </p>
          </div>
        );
      })}
    </td>
  </tr>
</table>

<tr className={styles.rowTable}>
  <td>
    {taskItems.map(taskItems => {
      return (
        <div>
          <span>{taskItems.Title}</span>&nbsp;
          <span>
            {this._formatMonthDay(taskItems.StartDate)} -{" "}
            {this._formatMonthDay(taskItems.DueDate)}
          </span>
        </div>
      );
    })}
  </td>
</tr>
*/
