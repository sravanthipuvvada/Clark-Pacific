import * as React from 'react';
import { IProjectSiteRequestProps } from './IProjectSiteRequestProps';
import { IProjectSiteRequestStates, IDropDown, ISPListColumn } from './IProjectSiteRequestStates';
import { escape } from '@microsoft/sp-lodash-subset';
import './ProjectSiteRequest.module.scss';
import { SPHttpClient } from '@microsoft/sp-http';
import { Dropdown, DropdownMenuItemType, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Dialog, CommandBar, DialogType, DialogFooter } from 'office-ui-fabric-react';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { default as pnp, ItemAddResult, Web, List, Item } from "sp-pnp-js";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import * as jquery from 'jquery';

export default class ProjectSiteRequest extends React.Component<IProjectSiteRequestProps, IProjectSiteRequestStates> {
  public deliveryModeArray: any;
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      jurisdictionUserEmail: '',
      spmUserEmail: '',
      pmUserEmail: '',
      apmUserEmail: '',
      peUserEmail: '',
      memberUsersEmailArray: null,
      siteTypeErrorMessage: '',
      siteTitleErrorMessage: '',
      sitURLErrorMessage: '',
      productTypeErrorMessage: '',
      buildingTypesErrorMessage: '',
      contractValueErrorMessage: '',
      jurisdictionErrorMessage: '',
      deliveryModeErrorMessage: '',
      clientErrorMessage: '',
      spmErrorMessage: '',
      pmErrorMessage: '',
      apmErrorMessage: '',
      peErrorMessage: '',
      membersErrorMessage: '',
      jurisdictionUserId: null,
      spmUserId: null,
      pmUserId: null,
      apmUserId: null,
      peUserId: null,
      memberUsersIdArray: null,
      selectedSiteType: '',
      selectedProductType: '',
      selectedBuildingType: '',
      selectedContractValue: '',
      selectedDeliveryMethodValue: '',
      jobIdErrorMessage: '',

      jobId: null,
      productType: [],
      projectType: [],
      buildingType: [],
      contractValue: [],
      deliveryMode: []
    };
  }

  private BindDropDowns() {

    // Bind Product Type
    this._getListProjectProductTypePnp().then((data: any) => {
      //let arrayDrpDownValue:IDropDown[];

      let productTypeArray: Array<IDropDown> = new Array<IDropDown>();

      data.Choices.map((element) => {
        if (element) {
          productTypeArray.push({
            key: element,
            text: element
          });
        }
      });
      debugger;
      this.setState({
        productType: productTypeArray
      });
      // console.log(data);
    });

    // Bind Building Type
    this._getListProjectBuildingTypePnp().then((data: any) => {

      let BuildingTypeArray: Array<IDropDown> = new Array<IDropDown>();

      data.Choices.map((element) => {
        if (element) {
          BuildingTypeArray.push({
            key: element,
            text: element
          });
        }
      });

      this.setState({
        buildingType: BuildingTypeArray
      });
      // console.log(data);
    });

    // Bind Choice Value contract
    this._getListProjectContractValuePnp().then((data: any) => {
      //let arrayDrpDownValue:IDropDown[];

      let contractValueArray: Array<IDropDown> = new Array<IDropDown>();

      data.Choices.map(
        (element) => {
          if (element) {
            contractValueArray.push({
              key: element,
              text: element
            });
          }
        });

      this.setState({
        contractValue: contractValueArray
      });
      // console.log(data);
    });

    // Bind Project Type
    this._getListProjectValuePnp().then((data: any) => {
      //let arrayDrpDownValue:IDropDown[];

      let projectValueArray: Array<IDropDown> = new Array<IDropDown>();

      data.Choices.map(element => {
        if (element) {
          projectValueArray.push({
            key: element,
            text: element
          });
        }
      });

      this.setState({
        projectType: projectValueArray
      });
      // console.log(data);
    });

    // Bind Delivery Mode 
    this._getListDeliveryModePnp().then((data: any) => {
      debugger;
      let deliveryModeArray: Array<IDropDown> = new Array<IDropDown>();

      data.Choices.map(element => {
        if (element) {
          deliveryModeArray.push({
            key: element,
            text: element
          });
        }
      });

      this.setState({
        deliveryMode: deliveryModeArray
      }, () => {
        this.deliveryModeArray = deliveryModeArray;
      });
      // console.log(data);
    });

  }

  public componentDidMount(){
    this.BindDropDowns();
  }

  private _getListProjectProductTypePnp(): Promise<ISPListColumn[]> {
    return pnp.sp.web.lists
      .getByTitle(`${this.props.listName}`)
      .fields
      .getByInternalNameOrTitle("ProductType")
      .get()
      .then((response: any[]) => {
        return response;
      });
  }

  private _getListProjectBuildingTypePnp(): Promise<ISPListColumn[]> {
    return pnp.sp.web.lists
      .getByTitle(`${this.props.listName}`)
      .fields
      .getByInternalNameOrTitle("BuildingType")
      .get()
      .then((response: any[]) => {
        return response;
      });
  }

  private _getListProjectContractValuePnp(): Promise<ISPListColumn[]> {
    return pnp.sp.web.lists
      .getByTitle(`${this.props.listName}`)
      .fields
      .getByInternalNameOrTitle("ContractValue")
      .get()
      .then((response: any[]) => {
        return response;
      });
  }

  private _getListProjectValuePnp(): Promise<ISPListColumn[]> {
    return pnp.sp.web.lists
      .getByTitle(`${this.props.listName}`)
      .fields
      .getByInternalNameOrTitle("ProjectType")
      .get()
      .then((response: any[]) => {
        return response;
      });
  }

  private _getListDeliveryModePnp(): Promise<ISPListColumn[]> {
    return pnp.sp.web.lists
      .getByTitle(`${this.props.listName}`)
      .fields
      .getByInternalNameOrTitle("DeliveryMode")
      .get()
      .then((response: any[]) => {
        return response;
      });
  }

  public AddItem(): any {
    var jurisdictionUserId = '';
    var spmUserId = '';
    const web: Web = new Web(this.props.siteUrl);
    var jobId = document.getElementById('txtJobId')["value"];
    var siteTitle = document.getElementById('txtSiteTitle')["value"];
    var siteUrl = document.getElementById('txtSiteURL')["value"];
    var client = document.getElementById('txtclient')["value"];

    if (jobId != null && jobId !== undefined && jobId != "") {
      if (siteTitle != null && siteTitle !== undefined && siteTitle != "") {
        if (siteUrl != null && siteUrl !== undefined && siteUrl != "") {
          if (this._validateUrl(siteUrl)) {
            web.lists.getByTitle(this.props.listName).items.add({

              'Title': siteTitle,
              'JOBID': jobId,
              'Client': client,
              'JurisdictionId': this.state.jurisdictionUserId,
              'SPMId': this.state.spmUserId,
              'PMId': this.state.pmUserId,
              'APMId': this.state.apmUserId,
              'PEId': this.state.peUserId,
              'ProjectSiteLink': {
                '__metadata': { 'type': 'SP.FieldUrlValue' },
                'Description': siteUrl,
                'Url': siteUrl
              },
              'ProductType': this.state.selectedProductType,
              'BuildingType': this.state.selectedBuildingType,
              'ContractValue': this.state.selectedContractValue,
              'DeliveryMode': this.state.selectedDeliveryMethodValue,
              'ProjectType': this.state.selectedSiteType,
              'MembersId': {
                results: this.state.memberUsersIdArray
              }
              // 'JOBID': "0000", - SLT (auto incremental)             
              // 'Members' - People - Allow multiple users
            }).then((iar: ItemAddResult) => {
              alert('New Project Site creation request has been submitted successfully !!');
            });
          } else {
            this.setState({ sitURLErrorMessage: "Invalid Site Url." });
          }
        } else {
          this.setState({ sitURLErrorMessage: "You can't leave this field blank." });
        }
      } else {
        this.setState({ siteTitleErrorMessage: "You can't leave this field blank." });
      }
    } else {
      this.setState({ jobIdErrorMessage: "You can't leave this field blank." });
    }
  }



  public getUserId(email: string): Promise<number> {
    const web: Web = new Web(this.props.siteUrl);
    return web.ensureUser(email).then(result => {
      return result.data.Id;
    });
  }
  public _getPeoplePickerJurisdictionItems(items: any[]) {
    console.log('Items:', items);
    if (items.length > 0) {
      var userEmail = items[0].secondaryText;
      this.getUserId(userEmail).then((userId) => {
        this.setState({
          jurisdictionUserId: userId
        });
      });
    }
  }
  public _getPeoplePickerSPMItems(items: any[]) {
    console.log('Items:', items);
    if (items.length > 0) {
      var userEmail = items[0].secondaryText;
      this.getUserId(userEmail).then((spmId) => {
        this.setState({
          spmUserId: spmId
        });
      });
    }
  }

  public _getPeoplePickerPMItems(items: any[]) {
    console.log('Items:', items);
    if (items.length > 0) {
      var userEmail = items[0].secondaryText;
      this.getUserId(userEmail).then((userId) => {
        this.setState({
          pmUserId: userId
        });
      });
    }
  }
  public _getPeoplePickerAPMItems(items: any[]) {
    console.log('Items:', items);
    if (items.length > 0) {
      var userEmail = items[0].secondaryText;
      this.getUserId(userEmail).then((userId) => {
        this.setState({
          apmUserId: userId
        });
      });
    }
  }

  public _getPeoplePickerPEItems(items: any[]) {
    console.log('Items:', items);
    if (items.length > 0) {
      var userEmail = items[0].secondaryText;
      this.getUserId(userEmail).then((userId) => {
        this.setState({
          peUserId: userId
        });
      });
    }
  }

  public _getPeoplePickerMemberItems(items: any[]) {
    console.log('Items:', items);
    var memberUsersIDCollection = new Array();
    if (items.length > 0) {
      for (let index = 0; index < items.length; index++) {
        var userEmail = items[index];
        if (userEmail != null && userEmail.secondaryText != null) {
          this.getUserId(userEmail.secondaryText).then((userId) => {
            if (memberUsersIDCollection.indexOf(userId) === -1)
              memberUsersIDCollection.push(userId);
            this.setState({
              memberUsersIdArray: memberUsersIDCollection
            });
          });
        }
      }
    }
  }

  public _onChoiceSiteTypeChange(item) {
    this.setState({
      selectedSiteType: item.text
    });
  }

  public _onChoiceProductTypeChange(item) {
    this.setState({
      selectedProductType: item.text
    });
  }
  public _onChoiceBuildingTypeChange(item) {
    this.setState({
      selectedBuildingType: item.text
    });
  }
  public _onChoiceContractValueChange(item) {
    this.setState({
      selectedContractValue: item.text
    });
  }

  public _onChoiceDeliveryMethodChange(item) {
    this.setState({
      selectedDeliveryMethodValue: item.text
    });
  }

  private _submitRequest = (): void => {
    this.AddItem();
  }

  private _cancelRequest = (): void => {
    debugger;
    //Below validation are used to check length of input characters if user clicks on save button directly after page load

    // document.getElementById('txtJobId')["value"] = "";
    // this.setState({ jobIdErrorMessage: "" });

    // document.getElementById('txtSiteTitle')["value"] = "";
    // this.setState({ siteTitleErrorMessage: "" });

    // document.getElementById('txtSiteURL')["value"] = "";
    // this.setState({ sitURLErrorMessage: "" });

    // document.getElementById('txtclient')["value"] = "";
    // this.setState({ clientErrorMessage: "" });

    this.setState({
      deliveryMode: this.deliveryModeArray
    });

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

  public render(): React.ReactElement<IProjectSiteRequestProps> {
    return (
      <div className="projectSiteRequestSection">

        {/* <div className="ms-sm12 ms-md12 ms-lg12 requestedBySection">
          <label className="ms-Label">Requested By</label>
          <label id="RequestedBy_PSR" className="ms-Label">Pradip Gophane</label>
        </div> */}

        <div className="ms-sm12 ms-md12 ms-lg12 siteURLSection">
          <TextField type="text" label="Job ID" id="txtJobId" />
        </div>

        <div className="ms-sm12 ms-md12 ms-lg12 siteTypeSection">
          <Dropdown
            label="Site Type"
            id="ddlSiteType"
            options={this.state.projectType}
            // options={[
            //   { key: 'Header', text: 'Options', itemType: DropdownMenuItemType.Header },
            //   { key: 'Construction Project', text: 'Construction Project', data: { icon: 'Memo' } },
            //   { key: 'ClarkParc Project', text: 'ClarkParc Project', data: { icon: 'Print' } },
            //   { key: 'Facade Project', text: 'Facade Project', data: { icon: 'ShoppingCart' } },
            //   { key: 'Genaral Project', text: 'Genaral Project', data: { icon: 'Train' } },
            //   { key: 'Department Project', text: 'Department Project', data: { icon: 'Train' } }
            // ]}
            onChanged={this._onChoiceSiteTypeChange.bind(this)}
          />
        </div>

        <div className="ms-sm12 ms-md12 ms-lg12 siteTitleSection">
          {/* <label className="ms-Label">Site Title</label>
             <input className="ms-TextField-field" id="txtSiteTitle" type="text" value="" placeholder="Enter Site Title"/> */}
          <TextField type="text" label="Site Title" id="txtSiteTitle" />

        </div>

        <div className="ms-sm12 ms-md12 ms-lg12 siteURLSection">
          {/* <label className="ms-Label">Site URL</label>
             <input className="ms-TextField-field" id="txtSiteURL" type="text" value="" placeholder="Enter Site URL"/> */}
          <TextField type="url" label="Site URL" id="txtSiteURL" />
        </div>

        <div className="ms-sm12 ms-md12 ms-lg12 productTypeSection">

          <Dropdown
            label="Primary Product Type"
            id="ddlProductType"
            options={this.state.productType}
            // options={[
            //   { key: 'Header', text: 'Options', itemType: DropdownMenuItemType.Header },
            //   { key: 'Structural', text: 'Structural', data: { icon: 'Memo' } },
            //   { key: 'Architectural', text: 'Architectural', data: { icon: 'Print' } }
            // ]}
            onChanged={this._onChoiceProductTypeChange.bind(this)}
          />
        </div>

        <div className="ms-sm12 ms-md12 ms-lg12 buildingTypeSection">

          <Dropdown
            label="Building Types"
            id="ddlBuildingTypes"
            options={this.state.buildingType}
            // options={[
            //   { key: 'Header', text: 'Options', itemType: DropdownMenuItemType.Header },
            //   { key: 'Post and Beam Parking Garage', text: 'Post and Beam Parking Garage', data: { icon: 'Memo' } },
            //   { key: 'Full Precast Office', text: 'Full Precast Office', data: { icon: 'Print' } },
            //   { key: 'HMF Office', text: 'HMF Office', data: { icon: 'ShoppingCart' } }
            // ]}
            onChanged={this._onChoiceBuildingTypeChange.bind(this)}
          />

        </div>

        <div className="ms-sm12 ms-md12 ms-lg12 contractSection">
          <Dropdown
            label="Precast Contract Value"
            id="ContractValue"
            options={this.state.contractValue}
            // options={[
            //   { key: 'Header', text: 'Options', itemType: DropdownMenuItemType.Header },
            //   { key: '<$1M', text: '<$1M', data: { icon: 'Memo' } },
            //   { key: '$1-2M', text: '$1-2M', data: { icon: 'Print' } },
            //   { key: '$2-5M', text: '$2-5M', data: { icon: 'ShoppingCart' } },
            //   { key: '$5-10M', text: '$5-10M', data: { icon: 'Train' } },
            //   { key: '$10-20M', text: '$10-20M', data: { icon: 'Train' } },
            //   { key: '$20-50M', text: '$20-50M', data: { icon: 'Train' } },
            //   { key: '$50-100M', text: '$50-100M', data: { icon: 'Train' } },
            //   { key: '$100M+', text: '$100M+', data: { icon: 'Train' } },
            //   { key: 'TBD', text: 'TBD', data: { icon: 'Train' } }
            // ]}
            onChanged={this._onChoiceContractValueChange.bind(this)}
          />
        </div>

        <div className="ms-sm12 ms-md12 ms-lg12 jurisdictionSection">
          {/* <label className="ms-Label">Jurisdiction</label>
            <input className="ms-TextField-field" id="txtJurisdiction" type="text" value="Enter Jurisdiction here" /> */}
          {/* <TextField type="text" label="Jurisdiction" id="txtJurisdiction1"   /> */}

          <PeoplePicker
            context={this.props.context}
            titleText="Jurisdiction"
            //id="pplpkrJurisdiction"
            personSelectionLimit={1}
            //groupName={} // Leave this blank in case you want to filter from all users
            showtooltip={true}
            isRequired={true}
            selectedItems={this._getPeoplePickerJurisdictionItems.bind(this)}
            showHiddenInUI={false}
            principalTypes={[PrincipalType.User]}
            resolveDelay={1000} />

        </div>

        <div className="ms-sm12 ms-md12 ms-lg12 deliveryMethodSection">
          <Dropdown
            label="Delivery Method"
            id="deliveryMethod"
            options={this.state.deliveryMode}
            onChanged={this._onChoiceDeliveryMethodChange.bind(this)}
            defaultSelectedKey="TurnKey"
          // options={[
          //   { key: 'Header', text: 'Options', itemType: DropdownMenuItemType.Header },
          //   { key: 'DesignBuild', text: 'Design Build', data: { icon: 'Memo' } },
          //   { key: 'TurnKey', text: 'TurnKey', data: { icon: 'Print' } },
          //   { key: 'Design-Bid-Build', text: 'Design-Bid-Build', data: { icon: 'ShoppingCart' } },
          //   { key: 'Design Build - Negotiated', text: 'Design Build - Negotiated', data: { icon: 'Train' } },
          //   { key: 'Design Build - Competition', text: 'Design Build - Competition', data: { icon: 'Train' } },
          //   { key: 'Cost Plus With GMP', text: 'Cost Plus With GMP', data: { icon: 'Train' } }

          // ]}
          />
        </div>

        <div className="ms-sm12 ms-md12 ms-lg12 clientSection">
          <TextField type="text" label="Client" id="txtclient" />
        </div>

        <div className="ms-sm12 ms-md12 ms-lg12 spmSection">

          <PeoplePicker
            context={this.props.context}
            titleText="SPM"
            // id="pplpkrSPM"
            personSelectionLimit={1}
            //groupName={} // Leave this blank in case you want to filter from all users
            showtooltip={true}
            isRequired={true}
            selectedItems={this._getPeoplePickerSPMItems.bind(this)}
            showHiddenInUI={false}
            principalTypes={[PrincipalType.User]}
            resolveDelay={1000} />
        </div>

        <div className="ms-sm12 ms-md12 ms-lg12 pmSection">

          <PeoplePicker
            context={this.props.context}
            titleText="PM"
            // id="pplpkrPM"
            personSelectionLimit={1}
            //groupName={} // Leave this blank in case you want to filter from all users
            showtooltip={true}
            isRequired={true}
            selectedItems={this._getPeoplePickerPMItems.bind(this)}
            showHiddenInUI={false}
            principalTypes={[PrincipalType.User]}
            resolveDelay={1000} />
        </div>

        <div className="ms-sm12 ms-md12 ms-lg12 apmSection">

          <PeoplePicker
            context={this.props.context}
            titleText="APM"
            // id="pplpkrAPM"
            personSelectionLimit={1}
            //groupName={} // Leave this blank in case you want to filter from all users
            showtooltip={true}
            isRequired={true}
            selectedItems={this._getPeoplePickerAPMItems.bind(this)}
            showHiddenInUI={false}
            principalTypes={[PrincipalType.User]}
            resolveDelay={1000} />
        </div>

        <div className="ms-sm12 ms-md12 ms-lg12 peSection">

          <PeoplePicker
            context={this.props.context}
            titleText="PE"
            // id="pplpkrPE"
            personSelectionLimit={1}
            //groupName={} // Leave this blank in case you want to filter from all users
            showtooltip={true}
            isRequired={true}
            selectedItems={this._getPeoplePickerPEItems.bind(this)}
            showHiddenInUI={false}
            principalTypes={[PrincipalType.User]}
            resolveDelay={1000} />
        </div>

        <div className="ms-sm12 ms-md12 ms-lg12 peSection">
          <PeoplePicker
            context={this.props.context}
            titleText="Other Members"
            // id="pplpkrOtherMembers"
            personSelectionLimit={20}
            //groupName={} // Leave this blank in case you want to filter from all users
            showtooltip={true}
            isRequired={true}
            selectedItems={this._getPeoplePickerMemberItems.bind(this)}
            showHiddenInUI={false}
            principalTypes={[PrincipalType.User]}
            resolveDelay={1000} />
        </div>


        <DialogFooter>
          <PrimaryButton onClick={this._submitRequest} text="Submit Request" iconProps={{ iconName: 'Accept' }} />
          <DefaultButton onClick={this._cancelRequest} text="Cancel Request" iconProps={{ iconName: 'Clear' }} />
        </DialogFooter>
      </div>
    );
  }
}
