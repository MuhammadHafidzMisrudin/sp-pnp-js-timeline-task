import * as React from "react";
import { ITimelineListProps } from "../TimelineList";
import { ITimelineListState } from "../TimelineList";
import pnp from "sp-pnp-js";

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
      dates: [
        "2018-05-21T14:00:00Z",
        "2018-05-22T14:00:00Z",
        "2018-05-23T14:00:00Z",
        "2018-05-24T14:00:00Z",
        "2018-05-25T14:00:00Z",
        "2018-05-26T14:00:00Z",
        "2018-05-27T14:00:00Z"
      ],
      start_date: this.props.start_date
    };
  }

  public render(): React.ReactElement<ITimelineListProps> {
    console.log("test-render");
    return (
      <div>
        {this.state.dates.map((date, index) => {
          // get an array of objects and iterate through each object.
          const taskItems = this.state.list.filter(x => x.StartDate == date); // get an array of objects with filter of start date.
          return (
            <div>
              <table>
                <tr>
                  <th>{date}</th>
                </tr>
                <tr>
                  <th>
                    {taskItems.map(taskItem => {
                      return (
                        <div>
                          <div>Task Title: {taskItem.Title}</div>
                          <div>Task Startdate: {taskItem.StartDate}</div>
                        </div>
                      );
                    })}
                  </th>
                </tr>
              </table>
            </div>
          );
        })}
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
          list: items
        });
      });
  }

  private _getTask(taskId: any): any {
    console.log("get-tasks");
    return this.state.list.filter(
      (task: any) => task.AuthorId == taskId.taskId
    );
  }

  private _getDate(index: number): string {
    console.log("get-date");
    let thisDate: string = this.state.dates[index];
    return thisDate;
  }

  private _checkTaskWithStartDate(): string {
    console.log("check-task-startdate");
    let start_date: string;
    for (let i = 0; i < this.state.list.length; i++) {
      for (let j = 0; j < this.state.dates.length; j++) {
        if (this.state.list[i].StartDate == this.state.dates[j]) {
          return (start_date = this._getDate(j));
        }
      }
    }
  }

  private _getWebDetails(): void {
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
