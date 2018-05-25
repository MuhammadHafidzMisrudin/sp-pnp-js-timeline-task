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
      list: []
    };
  }

  public render(): React.ReactElement<ITimelineListProps> {
    console.log("test-render");
    return (
      <div>
        {this.state.list.map((item, i) => {
          console.log(item.Title);
          console.log(item.StartDate);
          console.log(item.Status);
          console.log(item.Priority);
          return (
            <div key={i}>
              <div>{item.Title}</div>
              <div>{item.Status}</div>
              <div>{item.Priority}</div>
              <div>{item.StartDate}</div>
              <div>{item.AuthorId}</div>
              <div>{item.DueDate}</div>
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
