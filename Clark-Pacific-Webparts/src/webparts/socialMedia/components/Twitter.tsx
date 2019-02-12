import * as React from "react";
import * as strings from "SocialMediaWebPartStrings";
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
let twttr: any = require("twitter");
export default class Twitter extends React.Component<any, any> {
  constructor(props) {
    super(props);
  }

public componentDidMount(){
  twttr.widgets.load();
}

  public render() {
    console.log(this.props);

    if (this.props.twitterAccount == null || this.props.twitterAccount == "") {
      return (
        <div className="ms-twitter-MessageBar">
        <div className="ms-MessageBar-content">
          <div className="ms-MessageBar-text">
          <MessageBar>No data found.</MessageBar>
          </div>
        </div>
      </div>
      );
    }

    var dataChrome = '';
    if (this.props.twitterFooter === false)
      dataChrome += "nofooter ";
    if (this.props.twitterHeader === false)
      dataChrome += "noheader ";
    if (this.props.twitterBorders === false)
      dataChrome += "noborders ";
    if (this.props.twitterScrollbars === false)
      dataChrome += "noscrollbar ";
    let twtterURL=`https://twitter.com/${this.props.twitterAccount}`;
    return (
      <a className="twitter-timeline" data-tweet-limit={this.props.twitterLimit}
      data-chrome={dataChrome}
      href={twtterURL}>
      Tweets by
      {this.props.twitterAccount}
      </a>
    );
  }
}
