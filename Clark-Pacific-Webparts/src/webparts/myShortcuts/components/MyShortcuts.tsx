import * as React from 'react';
import './MyShortcuts.module.scss';
import { IMyShortcutsProps } from './IMyShortcutsProps';
import { IMyShortcutsStates, ILinkItem } from './IMyShortcutsStates';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPHttpClient } from '@microsoft/sp-http';
import Constants from "../../../constants/constant";
import { MessageBar } from 'office-ui-fabric-react/lib/MessageBar';
import { IconButton } from 'office-ui-fabric-react/lib/Button';

export default class MyShortcuts extends React.Component<IMyShortcutsProps, IMyShortcutsStates> {
  constructor(props) {
    super(props);
    this.state = {
      linkItems: [],
      linkJSX: null
    };
  }
  public _getLinkData(): any {
    return new Promise((resolve, reject) => {
      let that = this;
      if (this.props.listName !== undefined) {
        let apiUrl;
        //Get the links which are added by me
        if (this.props.linksType == "Personal") {
          apiUrl = that.props.siteUrl + `/_api/web/lists/GetByTitle('${this.props.listName}')/Items?$select=ID,Title,${Constants.createdBy}/Id,${Constants.createdBy}/Title,${Constants.createdBy}/EMail,${Constants.url},${Constants.displayOrder},${Constants.icon}&$expand=${Constants.createdBy}&$top=${that.props.numberOfItems == 0 || that.props.numberOfItems === undefined || that.props.numberOfItems === null ? 4 : that.props.numberOfItems}&$orderby=${Constants.displayOrder} asc&$Filter=${Constants.createdBy}/EMail eq '${this.props.userEmail}'`;
        } else {
          //Get all teh links
          apiUrl = that.props.siteUrl + `/_api/web/lists/GetByTitle('${this.props.listName}')/Items?$select=ID,Title,${Constants.createdBy}/Id,${Constants.createdBy}/Title,${Constants.createdBy}/EMail,${Constants.url},${Constants.displayOrder},${Constants.icon}&$expand=${Constants.createdBy}&$top=${that.props.numberOfItems == 0 || that.props.numberOfItems === undefined || that.props.numberOfItems === null ? 4 : that.props.numberOfItems}&$orderby=${Constants.displayOrder} asc`;
        }

        that.props.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1)
          .then((response) => {
            return response.json();
          })
          .then((responseJSON) => {
            let items: any = responseJSON.value;
            if (items !== undefined) {
              let linkItemsArray: ILinkItem[] = new Array();
              items.map((item) => {
                let linkItemObject: ILinkItem = {
                  Id: item[`ID`],
                  Title: item[`Title`],
                  Url: item[`${Constants.url}`].Url,
                  DisplayOrder: item[`${Constants.displayOrder}`],
                  Icon: item[`${Constants.icon}`]
                };
                linkItemsArray.push(linkItemObject);
              });
              that.setState({
                linkItems: linkItemsArray
              }, () => { this._createLinkJSX(); });
            }
          });
      }
    });
  }
  public _createLinkJSX() {
    if (this.state.linkItems === null || this.state.linkItems === undefined || this.state.linkItems.length === 0) {
      let linkData = <MessageBar>No data found.</MessageBar>;
      this.setState({
        linkJSX: linkData,
      });
    } else {
      let linkData: JSX.Element[] = this.state.linkItems.map((linkItem, index) => {
        const onPopupClick = (): any => {
          window.open(linkItem.Url);
        };
        return (
          <div className="linkItem" onClick={onPopupClick}>
            <span><IconButton iconProps={{ iconName: linkItem.Icon }}  className="linkIcon" /> <span className="linkItemTitle"> {linkItem.Title}</span> </span>
          </div>
        );
      });
      if (linkData.length > 0) {
        this.setState({
          linkJSX: linkData,
        });
      }
    }
  }

  public componentDidMount(): any {
    this._getLinkData();
  }

  public render(): React.ReactElement<IMyShortcutsProps> {
    return (
      <div className="myShortcutSection">
         <div className="esHeader"> <i className="ms-Icon ms-Icon--Link esHeaderIcon" aria-hidden="true"></i>{this.props.title}</div> 
        <div className="myShortcutContent">
          {this.state.linkJSX}
        </div>
      </div>
    );

  }
}
