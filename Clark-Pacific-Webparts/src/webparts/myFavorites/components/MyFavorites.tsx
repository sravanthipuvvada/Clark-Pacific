import * as React from 'react';
import './MyFavorites.module.scss';
import { IMyFavoritesProps } from './IMyFavoritesProps';
import { IMyFavoritesStates } from './IMyFavoritesStates';
import { escape } from '@microsoft/sp-lodash-subset';
import * as jquery from 'jquery';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import { default as pnp, ItemAddResult, Web, List, Item } from "sp-pnp-js";
import { Dialog, CommandBar, DialogType, DialogFooter } from 'office-ui-fabric-react';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import * as strings from 'MyFavoritesWebPartStrings';
import { MessageBar } from "office-ui-fabric-react/lib/MessageBar";
import {
  DetailsList,
  DetailsListLayoutMode,
  Selection,
  SelectionMode,
  IColumn,
  IDetailsList
} from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
const _columns: IColumn[] = [
  {
    key: 'column1',
    name: 'Title',
    fieldName: 'Title',
    minWidth: 100,
    maxWidth: 200,
    isResizable: true,
    ariaLabel: 'Operations for name'
  },
  {
    key: 'column2',
    name: 'Url',
    fieldName: 'Url',
    minWidth: 100,
    maxWidth: 200,
    isResizable: true,
    ariaLabel: 'Operations for value'
  }
];
export default class MyFavorites extends React.Component<IMyFavoritesProps, IMyFavoritesStates> {
  private _selection: Selection;
  constructor(props: IMyFavoritesProps) {
    super(props);
    this.state = {
      hideDialog: true,
      hideDialogNew: true,
      linksHTML: '',
      links: null,
      selectionDetails: {},
      items: null,
      editLinkTitle: '',
      editLinkUrl: '',
      hideEditDialog: true,
      titleErrorMessage: '',
      URLErrorMessage: '',
      editTitleErrorMessage: '',
      editURLErrorMessage: ''
    };
    this._selection = new Selection({
    });

    this._getErrorMessage = this._getErrorMessage.bind(this);
    this.changeValue = this.changeValue.bind(this);
  }
  //fetch items from list
  public fetchDataFromSharePointList(): any {
    let LinkItems;
    if (this.props.listName) {
      let apiUrl;
      if (this.props.linksType == "Personal") {
        //build api based on the created by himself 
        //apiUrl = "/_api/web/lists/getbytitle('" + this.props.listName + "')/items?&$Filter=Author/EMail eq '" + this.props.userEmail + "' or Default eq '1'&$orderby=ID asc" + `&$top=${this.props.numerOfLinks == 0 || this.props.numerOfLinks === undefined || this.props.numerOfLinks === null ? 5 : this.props.numerOfLinks}`;
        apiUrl = "/_api/web/lists/getbytitle('" + this.props.listName + "')/items?&$Filter=Author/EMail eq '" + this.props.userEmail + "' &$orderby=ID asc" + `&$top=${this.props.numerOfLinks == 0 || this.props.numerOfLinks === undefined || this.props.numerOfLinks === null ? 5 : this.props.numerOfLinks}`;

        if (apiUrl) {
          LinkItems = this.getDataAjaxRequest(apiUrl);
        }
      } else {
        //api for General links
        apiUrl = "/_api/web/lists/getbytitle('" + this.props.listName + "')/items?&$orderby=ID asc" + `&$top=${this.props.numerOfLinks == 0 || this.props.numerOfLinks === undefined || this.props.numerOfLinks === null ? 5 : this.props.numerOfLinks}`;
        if (apiUrl) {
          LinkItems = this.getDataAjaxRequest(apiUrl);
        }
      }
    }
    return LinkItems;
  }


  //call to sharepoint list to get the data
  public getDataAjaxRequest(apiUrl): any {
    let LinkItems;
    jquery.ajax({
      url: `${this.props.siteUrl}` + apiUrl,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: (resultData) => {
        LinkItems = resultData.d.results;
      },
      error: (jqXHR, textStatus, errorThrown) => { }
    });
    return LinkItems;
  }

  //Create the html for links
  public createLinkHTML(linksItems): any {
    let htmlStrTxt = "";
    if (linksItems) {
      linksItems.map((element) => {
        if (element.Title && element.Url) {
          htmlStrTxt += "<li><i class='fa fa-link linkTitleIcon'></i><a class='linksElement' href='" + element.Url.Url + "'>" + element.Title + "</a></li>";
        }
      });
    }
    return htmlStrTxt;
  }

  //Add items to link list
  public AddItem(): any {
    const web: Web = new Web(this.props.siteUrl);
    //Check Link title and Url is provided
    //Note- Have problem with hyperlink column type
    if (document.getElementById('linkTitle')["value"] && document.getElementById('linkUrl')["value"]) {
      web.lists.getByTitle(this.props.listName).items.add({
        'Title': document.getElementById('linkTitle')["value"],
        'Url': {
          '__metadata': { 'type': 'SP.FieldUrlValue' },
          'Description': document.getElementById('linkUrl')["value"],
          'Url': document.getElementById('linkUrl')["value"]
        },
      }).then((iar: ItemAddResult) => {
        //Update links on the UI once new link added
        this.getLinksData();
      });
    }
  }
  //Delete Quicklink Item
  public deleteQuickItem(): any {
    //collect the id from selected row
    let itemId = (this._selection.getSelection()[0] as any).key;
    if (itemId) {
      const web: Web = new Web(this.props.siteUrl);
      let list = web.lists.getByTitle(this.props.listName);
      list.items.getById(itemId).delete().then(_ => {
        //Update links on the UI once new link added
        this.getLinksData();
      });
    }
  }
  //Update Quicklink item
  public upateQuickLinkItem(): any {
    //collect the id from selected row
    let itemId = (this._selection.getSelection()[0] as any).key;
    if (itemId) {
      const web: Web = new Web(this.props.siteUrl);
      let list = web.lists.getByTitle(this.props.listName);
      list.items.getById(itemId).update({
        'Title': document.getElementById('editLinkTitle')["value"],
        'Url': {
          '__metadata': { 'type': 'SP.FieldUrlValue' },
          'Description': document.getElementById('editLinkUrl')["value"],
          'Url': document.getElementById('editLinkUrl')["value"]
        },
      }).then(i => {
        //Update links on the UI once new link added
        this.getLinksData();
      });
    }
  }

  //Get links data(function calls)
  public getLinksData(): any {
    var linksItems;
    //Get Data from SharePoint list
    linksItems = this.fetchDataFromSharePointList();
    const _items: any[] = [];
    if (_items.length === 0 && linksItems != undefined) {
      for (let i = 0; i < linksItems.length; i++) {
        _items.push({
          key: linksItems[i].ID,
          Title: linksItems[i].Title,
          Url: linksItems[i].Url.Url
        });
      }
    }
    this.setState({
      linksHTML: this.createLinkHTML(linksItems),
      links: linksItems,
      items: _items
    });
  }

  //Component Event
  public componentDidMount() {
    this.getLinksData();
  }
  private _showDialog = (): void => {
    this.setState({ hideDialog: false });
  }

  private _closeDialog = (): void => {
    this.setState({ hideDialog: true });
  }

  //Add Link Popup Events
  private _showDialogNew = (): void => {
    this.setState({ hideDialogNew: false });
  }
  private _closeDialogNew = (): void => {
    this.setState({ hideDialogNew: true });
  }
  private _saveDialogNew = (): void => {
    //Below validation are used to check length of input characters if user clicks on save button directly after page load
    if (document.getElementById('linkTitle')["value"].length > 0) {
      this.setState({ titleErrorMessage: "" });
      if (document.getElementById('linkUrl')["value"].length > 0) {
        this.setState({ URLErrorMessage: "" });
        if (document.getElementById('linkTitle').parentElement.classList.toString().indexOf("invalid") == -1 && document.getElementById('linkUrl').parentElement.classList.toString().indexOf("invalid") == -1) {
          let url = document.getElementById('linkUrl')["value"];
          if (this._validateUrl(url)) {
            this.AddItem();
            this.setState({ hideDialogNew: true });
          }
          else {
            this.setState({ URLErrorMessage: "Invalid Url : " + url });
          }
        }
      } else {
        this.setState({ URLErrorMessage: "You can't leave this blank" });
      }
    }
    else {
      this.setState({ titleErrorMessage: "You can't leave this blank" });
    }
  }
  //Validate Url RegX
  private _validateUrl = (url) => {
    var regexp = new RegExp(/((?:https?\:\/\/)(?:[-a-z0-9]+\.)*[-a-z0-9]+.*)/i);
    if (!regexp.test(url)) {
      return false;
    } else {
      return true;
    }
  }

  private _onItemInvoked = (item: any, index: number): void => {
    console.log('Item invoked', item, index);
  }

  // Edit Link Dialog Event
  private _showEditDialog = (): void => {
    this.setState({
      hideEditDialog: false,
      editLinkTitle: (this._selection.getSelection()[0] as any).Title,
      editLinkUrl: (this._selection.getSelection()[0] as any).Url,
    });
  }
  private _closeEditDialog = (): void => {
    this.setState({
      hideEditDialog: true,
      editURLErrorMessage: ''
    });
  }
  private _saveEditDialog = (): void => {
    let url = document.getElementById('editLinkUrl')["value"];
    if (this._validateUrl(url)) {
      this.upateQuickLinkItem();
      this.setState({
        hideEditDialog: true,
        editLinkTitle: '',
        editLinkUrl: '',
        editURLErrorMessage: ''
      });
    }
    else {
      this.setState({
        editURLErrorMessage: "Invalid Url : " + url,
        editLinkUrl: url
      });
    }
  }

  private _editQuickItem = (): void => {
    this._showEditDialog();
  }

  // This method is used as property method for office-ui-fabric component TextField
  // It takes input string as parameter and returns error string depending upon validation
  private _getErrorMessage(value: string): string {
    if (value.length <= 0)
      return "You can't leave this blank";
    else {
      return value.length < 256 ? '' : `Input Exceeded the maximum length of 255`;
    }
  }
  // Below method is used to reset the state variables & clear error messages on KeyUp event
  private changeValue(event) {
    if (event.target.value.length > 0) {
      if (event.target.id == "linkTitle") {
        this.setState({ titleErrorMessage: "" });
      }
      if (event.target.id == "linkUrl") {
        this.setState({ URLErrorMessage: "" });
      }
    }
  }

  public render(): React.ReactElement<IMyFavoritesProps> {
    var cmdBarData = [
      {
        key: 'newItem',
        name: 'New',
        cacheKey: 'myCacheKey',
        iconProps: {
          iconName: 'Add'
        },
        onClick: () => { this._showDialogNew(); }
      },
      {
        key: 'edit',
        name: 'Edit',
        iconProps: {
          iconName: 'Edit'
        },
        onClick: () => { this._editQuickItem(); }
      },
      {
        key: 'delete',
        name: 'Delete',
        iconProps: {
          iconName: 'Delete'
        },
        onClick: () => { this.deleteQuickItem(); }
      }
    ];
    let linksJSXElement = <div className="mfNoDataText"><MessageBar className="facility-MessageBar">No data found.</MessageBar></div>;
    if (this.state.linksHTML) {
      linksJSXElement = <div className={"ms-Grid linksSection"}>
        <div className="ms-Grid-row">
          <div className="ms-Grid-col ms-sm12">
            <ul>{ReactHtmlParser(this.state.linksHTML)}</ul>
          </div>
        </div>
      </div>;
    }   
  
    //Show Manage links based on Personal or General Links Type
    let showManageLinks;
    if(this.props.linksType=="Personal"){
      showManageLinks= <DefaultButton onClick={this._showDialog} text="Manage Links" iconProps={{ iconName: 'Link' }} />;
    }
    return (
      <div className="myLinks">
        <div className="esHeader"><i className="ms-Icon ms-Icon--Link esHeaderIcon" aria-hidden="true"></i>{this.props.title}</div>
        <div className="myLinksItems">
          {linksJSXElement}
        </div>
        <div className="addNewLinkSection">
         {showManageLinks}
          <Dialog
            hidden={this.state.hideDialog}
            onDismiss={this._closeDialog}
            dialogContentProps={{
              type: DialogType.normal
            }}
            modalProps={{
              isBlocking: false,
              containerClassName: 'ms-dialogMainOverrideEvents'
            }}
          >
            <div className='commandBarSection'>
              <CommandBar items={cmdBarData} />
              <div className={"ms-Grid linksSection"}>
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-sm12">
                    <MarqueeSelection selection={this._selection}>
                      <DetailsList
                        items={this.state.items}
                        columns={_columns}
                        layoutMode={DetailsListLayoutMode.fixedColumns}
                        selection={this._selection}
                        onItemInvoked={this._onItemInvoked}
                        selectionMode={SelectionMode.single}
                      />
                    </MarqueeSelection>
                  </div>
                </div>
              </div>
              {/* New Dialog box */}
              <Dialog
                hidden={this.state.hideDialogNew}
                onDismiss={this._closeDialogNew}
                dialogContentProps={{
                  type: DialogType.largeHeader,
                  title: 'Add New Link'
                }}
                modalProps={{
                  isBlocking: true,
                  containerClassName: 'ms-dialogMainOverrideLink'
                }}
              >
                <TextField label="Title" id="linkTitle" required={true} onGetErrorMessage={this._getErrorMessage} validateOnLoad={false} errorMessage={this.state.titleErrorMessage} onKeyUp={this.changeValue} />
                <TextField type="url" label="Url" id="linkUrl" required={true} onGetErrorMessage={this._getErrorMessage} validateOnLoad={false} errorMessage={this.state.URLErrorMessage} onKeyUp={this.changeValue} />

                <DialogFooter>
                  <PrimaryButton onClick={this._saveDialogNew} text="Save" iconProps={{ iconName: 'Add' }} />
                  <DefaultButton onClick={this._closeDialogNew} text="Cancel" iconProps={{ iconName: 'Clear' }} />
                </DialogFooter>
              </Dialog>

              {/* Edit Dialog box */}
              <Dialog
                hidden={this.state.hideEditDialog}
                onDismiss={this._closeEditDialog}
                dialogContentProps={{
                  type: DialogType.largeHeader,
                  title: 'Update Link'
                }}
                modalProps={{
                  isBlocking: true,
                  containerClassName: 'ms-dialogMainOverrideLink'
                }}
              >
                <TextField label="Title" id="editLinkTitle" required={true} value={this.state.editLinkTitle} onGetErrorMessage={this._getErrorMessage} validateOnLoad={false} />
                <TextField type="url" label="Url" id="editLinkUrl" required={true} value={this.state.editLinkUrl} onGetErrorMessage={this._getErrorMessage} errorMessage={this.state.editURLErrorMessage} validateOnLoad={false} />
                <DialogFooter>
                  <PrimaryButton onClick={this._saveEditDialog} text="Update" iconProps={{ iconName: 'Accept' }} />
                  <DefaultButton onClick={this._closeEditDialog} text="Cancel" iconProps={{ iconName: 'Clear' }} />
                </DialogFooter>
              </Dialog>

            </div>
          </Dialog>
        </div>
      </div>
    );
  }
}
