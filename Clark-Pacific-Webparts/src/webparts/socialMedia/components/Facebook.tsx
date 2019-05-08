import * as React from 'react';
import { Resizable } from 'on-el-resize/lib/components';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

export default class Facebook extends React.Component<any, any>{
  constructor(props) {
    super(props);
  }

  private buildIFrameUrl(width: number): string {
    return `https://www.facebook.com/plugins/page.php?` +
      `href=${encodeURIComponent(`https://www.facebook.com/${this.props.facebookUserName || 'Microsoft'}`)}&` +
      `width=${width}&` +
      `height=${this.props.facebookPageHeight || 500}&` +
      `small_header=${typeof this.props.facebookPageSmallHeader !== 'undefined' ? this.props.facebookPageSmallHeader : true}&` +
      `hide_cover=${typeof this.props.facebookPageHideCover !== 'undefined' ? this.props.facebookPageHideCover : true}&` +
      `show_facepile=${typeof this.props.facebookPageShowFacepile !== 'undefined' ? this.props.facebookPageShowFacepile : false}&` +
      `adapt_container_width=true&` +
      `tabs=timeline`;
  }

  public render() {
    console.log(this.props);
    return (
      <div className="facebookPageContainerMain">
        {
          this.props.facebookUserName !== undefined && this.props.facebookUserName !== null && this.props.facebookUserName !== ""
            ?
            <Resizable
              className="facebookPageContainer"
              render={({ width }) => {
                return (
                  <iframe
                    src={this.buildIFrameUrl(width)}
                    width={width}
                    height={this.props.height || 300}
                    style={{
                      border: 'none',
                      overflow: 'hidden',
                      width: '100%'
                    }}
                    scrolling='no'
                    allowTransparency={true}
                  />
                );
              }}
            />
            :
            <div className="ms-MessageBar-content">
              <div className="ms-MessageBar-text">
                <MessageBar>No data found.</MessageBar>
              </div>
            </div>
        }
      </div>
    );
  }
}
