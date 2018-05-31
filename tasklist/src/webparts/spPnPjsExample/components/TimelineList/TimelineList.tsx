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
      item: {}
    };
    this._setDateArray = this._setDateArray.bind(this);
    this._taskDetails = this._taskDetails.bind(this);
    this._formatListDates = this._formatListDates.bind(this);
    this._formatMonthDay = this._formatMonthDay.bind(this);
    this._handleClickData = this._handleClickData.bind(this);
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
                      <div onClick={this._handleClickData(taskItem)}>
                        {this._taskDetails(taskItem)}
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

  private _handleClickData(data: any): any {
    this.setState({
      check_info: !this.state.check_info,
      item: data
    });
    console.log(
      "this is check {from handle-click-data}: ",
      this.state.check_info
    );
    console.log("this is item {from handle-click-data}: ", this.state.item);
    //this._taskDetails(this.state.item);
  }

  private _taskDetails(data: any): any {
    console.log("task-details");
    console.log("handle-click-data");
    if (this.state.check_info) {
      console.log("data clicked");
      return (
        <div className={styles.popup}>
          <div className={styles.popup_inner}>
            <p>Title: {data.Title}</p>
            <p>Due Date: {this._formatMonthDay(data.DueDate)}</p>
            <p>Assigned To: {data.AuthorId}</p>
            <p>Due {this._dueDatePeriod()} days ago</p>
          </div>
        </div>
      );
    }
  }

  private _dueDatePeriod(): string {
    console.log("due-date-period");
    let num: number = 6;
    return `${num}`;
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
