import * as React from 'react';
import { IRectangle } from 'office-ui-fabric-react/lib/Utilities';
import ISocialMediaState from './ISocialMediaState';
import { InstagramItem } from './InstagramItem';
import { FocusZone } from 'office-ui-fabric-react/lib/FocusZone';
import { List } from 'office-ui-fabric-react/lib/List';
import { Link } from 'office-ui-fabric-react/lib/Link';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import * as $ from "jquery";

const ROWS_PER_PAGE = 3;
const MAX_ROW_HEIGHT = 250;
export default class Instagram extends React.Component<any, ISocialMediaState>{
  private _columnCount: number;
  private _columnWidth: number;
  private _rowHeight: number;
  constructor(props) {
    super(props);
    this.state = {
      instagramItems: []
    };
  }

  public componentDidMount() {
    //We are passing instagram username and access key from parent component social media to instagram component through 
    // properties .
    if ((this.props.instagramUserName !== undefined && this.props.instagramUserName !== "") 
    && (this.props.insagramAccessKey !== undefined && this.props.insagramAccessKey !== "")) 
    {
      this._getInstagramFeeds();
    }
  }

 /**
   *  This method is used to get instagram feeds using Instagram API.
   */
 public _getInstagramFeeds() {
  $.ajax({
    url: `https://api.instagram.com/v1/users/self/media/recent/?access_token=${this.props.insagramAccessKey}&callback=?`,
    error:(error)=>{
      console.log(error);
    },
    success:(response)=>{
     console.log(response);
     let instagramItems: InstagramItem[] = new Array();
     response.data.map((element) => {
            let instagramItem: InstagramItem = {
              id: element.id,
              imageSourceURL: element.images.thumbnail.url
            };
            instagramItems.push(instagramItem);
          });
          this.setState({
            instagramItems
          });
    },
    type: 'GET',
    dataType: "jsonp" 
 });
 }

  private _getItemCountForPage = (itemIndex: number, surfaceRect: IRectangle): number => {
    if (itemIndex === 0) {
      this._columnCount = Math.ceil(surfaceRect.width / MAX_ROW_HEIGHT);
      this._columnWidth = Math.floor(surfaceRect.width / this._columnCount);
      this._rowHeight = this._columnWidth;
    }

    return this._columnCount * ROWS_PER_PAGE;
  }

  private _getPageHeight = (): number => {
    return this._rowHeight * ROWS_PER_PAGE;
  }

  private _onRenderCell = (item: any, index: number | undefined): JSX.Element => {
    return (
      <Link href={`https://www.instagram.com/${this.props.instagramUserName}`} target="_blank">
        <div
          className="instagramItemMainSection"
          data-is-focusable={true}
          style={{
            width: 100 / this._columnCount + '%'
          }}
        >
          <div className="instagramItemSizer">
            <div className="instagramItemPadder">
              <img src={item.imageSourceURL} className="instagramItemImage" />
            </div>
          </div>
        </div>
      </Link>
    );
  }
 
  public render() {
    return (
      <div className="instagramModuleSection">
        <FocusZone>
          {
            this.state.instagramItems == null || this.state.instagramItems.length == 0
              ? <MessageBar>No data found.</MessageBar>
              :
              <List
                className="instagramFeedList"
                items={this.state.instagramItems}
                getItemCountForPage={this._getItemCountForPage}
                getPageHeight={this._getPageHeight}
                renderedWindowsAhead={4}
                onRenderCell={this._onRenderCell}
              />
          }
        </FocusZone>
      </div>
    );
  }
}
