import * as React from "react";
import { ITimelineListProps } from "../TimelineList";
import { ITimelineListState } from "../TimelineList";
import pnp, { Item, sp } from "sp-pnp-js";
import { List } from "office-ui-fabric-react/lib/List";
import styles from "../SpPnPjsExample.module.scss";

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
      date_range: []
    };
    this._setDateArray = this._setDateArray.bind(this);
    this._taskDetails = this._taskDetails.bind(this);
    this._formatListDates = this._formatListDates.bind(this);
    this._formatMonthDay = this._formatMonthDay.bind(this);
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
                  {taskItems.map(taskItems => {
                    return (
                      <ul className={styles.infoCell}>
                        <li className={styles.listInfoTask}>
                          <span>{taskItems.Title}</span>
                        </li>
                        <li className={styles.listInfoTask}>
                          <span>
                            {this._formatMonthDay(taskItems.StartDate)} -{" "}
                            {this._formatMonthDay(taskItems.DueDate)}
                          </span>
                        </li>
                      </ul>
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
    console.log("test-format-date");
    let temp = new Array();
    for (let index = 0; index < array.length; index++) {
      let dateFormat = new Date(array[index]);
      temp.push(dateFormat.toDateString());
    }
    //console.log(temp);
    return temp;
  }

  private _formatListDates(x: any): any {
    console.log("format-list-dates");
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

  private _taskDetails(x: any): any {
    console.log("task-details");
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
