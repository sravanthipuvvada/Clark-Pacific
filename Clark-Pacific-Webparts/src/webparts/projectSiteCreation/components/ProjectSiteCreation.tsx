import * as React from 'react';
import { IProjectSiteCreationProps } from './IProjectSiteCreationProps';
import { IProjectSiteCreationStates, IDropDown, ISPListColumn } from './IProjectSiteCreationStates';
import { escape, keys } from '@microsoft/sp-lodash-subset';
import './ProjectSiteCreation.module.scss';
import { SPHttpClient } from '@microsoft/sp-http';
import { Dropdown, DropdownMenuItemType, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { Dialog, CommandBar, DialogType, DialogFooter } from 'office-ui-fabric-react';
import { PrimaryButton, DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { default as pnp, ItemAddResult, Web, List, Item } from "sp-pnp-js";
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import * as jquery from 'jquery';
import { string, any, array } from 'prop-types';

export default class ProjectSiteCreation extends React.Component<IProjectSiteCreationProps, IProjectSiteCreationStates> {
  
  
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
      memberUsersEmailArray: [],
      siteTypeErrorMessage: '',
      siteTitleErrorMessage: '',
      sitURLErrorMessage: "",
      productTypeErrorMessage: '',
      buildingTypesErrorMessage: '',
      contractValueErrorMessage: '',
      deliveryModeErrorMessage: '',
      clientErrorMessage: '',
      jurisdictionUserId: null,
      spmUserId: null,
      pmUserId: null,
      apmUserId: null,
      peUserId: null,
      memberUsersIdArray: null,
      selectedSiteType: null,
      selectedProductType: null,
      selectedBuildingType: null,
      selectedContractValue: null,
      selectedDeliveryMethodValue: null,
      jobIdErrorMessage: '',

      jobId: '',
      siteURL:'',
      siteType:'',
      siteTitle:'',
      client:'',
      productType: [],
      projectType: [],
      buildingType: [],
      contractValue: [],
      deliveryMode: []
    };

    //this._onChoiceSiteTypeChange = this._onChoiceSiteTypeChange.bind(this);
    this._getErrorMessage = this._getErrorMessage.bind(this);
    this.changeValue = this.changeValue.bind(this);
    //this._submitRequest=this._submitRequest.bind(this);
  }

  // Bind dropdowns on componentDidMount
  private BindDropDowns() {

    let productTypeArray: Array<IDropDown> = new Array<IDropDown>(), 
    BuildingTypeArray: Array<IDropDown> = new Array<IDropDown>(), 
    contractValueArray: Array<IDropDown> = new Array<IDropDown>(), 
    projectValueArray: Array<IDropDown> = new Array<IDropDown>(), 
    deliveryModeArray : Array<IDropDown> = new Array<IDropDown>();
    debugger;
    // Bind Product Type
    this._getListProjectProductTypePnp().then((data: any) => {
      
      data.Choices.map((element) => {
      if (element) {
        productTypeArray.push({
        key: element,
        text: element
        });
      }
      });
    });

    // Bind Building Type
    this._getListProjectBuildingTypePnp().then((data: any) => {
      data.Choices.map((element) => {
      if (element) {
        BuildingTypeArray.push({
        key: element,
        text: element
        });
      }
      });
    });

     // Bind Choice Value contract
    this._getListProjectContractValuePnp().then((data: any) => {
      data.Choices.map(
      (element) => {
        if (element) {
        contractValueArray.push({
          key: element,
          text: element
        });
        }
      });
    });

    // Bind Project Type
    this._getListProjectValuePnp().then((data: any) => {
      data.Choices.map(element => {
      if (element) {
        projectValueArray.push({
        key: element,
        text: element
        });
      }
      });
    });

    // Bind Delivery Mode 
    this._getListDeliveryModePnp().then((data: any) => {
      data.Choices.map(element => {
      if (element) {
        deliveryModeArray.push({
        key: element,
        text: element
        });
      }
      });
    });

    //Set states
    this.setState({
      productType: productTypeArray,
      buildingType: BuildingTypeArray,
      contractValue: contractValueArray,
      projectType: projectValueArray,
      deliveryMode: deliveryModeArray
    });
  }

  public componentDidMount () {
    this.BindDropDowns();
  }


  //Get Product type
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

  //Get Building type
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

  //Get Contract Value
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

  //Get Project Value
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

  //Get Delivery Mode
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

  //this is declared for clearing values from all peoplepickers 
  public myPicker: PeoplePicker;

  //Add Request / Item to Projects
  public AddItem(): any {
    debugger;
    const web: Web = new Web(this.props.siteUrl);
    let jobId = document.getElementById('txtJobId')["value"];
    let siteTitle = document.getElementById('txtSiteTitle')["value"];
    let siteUrl = document.getElementById('txtSiteURL')["value"];
    let client = document.getElementById('txtClient')["value"];

    web.lists.getByTitle(this.props.listName).items.add({

      'Title': siteTitle,
      'JOBID': jobId,
      'Client': client,
      'JurisdictionId': (this.state.jurisdictionUserId==null) ? -1 :this.state.jurisdictionUserId,
      'SPMId': (this.state.spmUserId==null) ? -1 :this.state.spmUserId,
      'PMId': (this.state.pmUserId==null) ? -1 :this.state.pmUserId,
      'APMId': (this.state.apmUserId==null) ? -1 :this.state.apmUserId,
      'PEId': (this.state.peUserId==null) ? -1 :this.state.peUserId,
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
        results: (this.state.memberUsersIdArray == null) ? [0] : this.state.memberUsersIdArray 
      }
    }).then((iar: ItemAddResult) => {
      alert('New Project Site creation request has been submitted successfully !!');
      this.ClearControlValue();
    });

  }

// ensure user and returning id
  public getUserId(email: string): Promise<number> {
    const web: Web = new Web(this.props.siteUrl);
    return web.ensureUser(email).then(result => {
      return result.data.Id;
    });
  }

  //get peoplepicker by userid
  public _getPeoplePickerJurisdictionItems(items: any[]) {
    debugger;
    console.log('Items:', items);
    if (items.length > 0) {
      var userEmail = items[0].secondaryText;
      
      this.getUserId(userEmail).then((userId) => {
        this.setState({
          jurisdictionUserEmail: userEmail,
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
          spmUserEmail: userEmail,
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
          pmUserEmail: userEmail,
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
          apmUserEmail:userEmail,
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
          peUserEmail: userEmail,
          peUserId: userId
        });
      });
    }
  }

  public _getPeoplePickerMemberItems(items: any[]) {
    console.log('Items:', items);
    let emailArrayColl = new Array();
    let userIdColl = new Array();
    if(items.length > 0){
      for (let item in items)
      {   
        emailArrayColl.push(items[item].secondaryText);
        userIdColl.push(items[item].id);
      }
    }

    console.log('Emails : ' + emailArrayColl);
    console.log('User IDs : ' + userIdColl);

    this.setState({
        memberUsersEmailArray: emailArrayColl,
        memberUsersIdArray:userIdColl
    });
  }

  private _onChoiceSiteTypeChange(item) {
    this.setState({
      selectedSiteType: item.text,
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

  public _validateTextField(controlID: string): boolean {
    return ((document.getElementById(`${controlID}`)["value"].length > 0) && (document.getElementById(`${controlID}`).parentElement.classList.toString().indexOf("invalid") == -1))?true:false;
  }

  public _validateDDField(controlID: string): boolean {
    return (controlID != "") ? (controlID != "- Select -") ? (controlID != null)?true:false : false : false;
  }

  private _validateAllFields(): boolean{
    let _txtJobId : boolean = this._validateTextField('txtJobId');
    let _ddlSiteType : boolean = this._validateDDField(this.state.selectedSiteType);
    let _txtSiteTitle : boolean = this._validateTextField('txtSiteTitle');
    let _txtSiteURL : boolean = this._validateTextField('txtSiteURL');
    let _ddProductType : boolean = this._validateDDField(this.state.selectedProductType);
    let _ddlBuildingType : boolean = this._validateDDField(this.state.selectedBuildingType);
    let _ddlContractValue : boolean = this._validateDDField(this.state.selectedContractValue);
    let _ddlDeliveryMethod : boolean = this._validateDDField(this.state.selectedDeliveryMethodValue);
    let _txtClient : boolean = this._validateTextField('txtClient');

    if(_txtJobId){      this.setState({ jobIdErrorMessage: "" });    } 
    else { this.setState({ jobIdErrorMessage: "You can't leave this blank" }); }

    if(_ddlSiteType){      this.setState({ siteTypeErrorMessage: "" });    } 
    else { this.setState({ siteTypeErrorMessage: "You can't leave this blank or fill with 'Select'" }); }

    if(_txtSiteTitle){      this.setState({ siteTitleErrorMessage: "" });    } 
    else { this.setState({ siteTitleErrorMessage: "You can't leave this blank" }); }

    if(_txtSiteURL){      
        let url = document.getElementById('txtSiteURL')["value"];
        if (this._validateUrl(url)) {  this.setState({ sitURLErrorMessage: "" });    } 
        else{ this.setState({ sitURLErrorMessage: "Invalid Url : " + url }); } }
    else {this.setState({ sitURLErrorMessage: "You can't leave this blank" }); }

    if(_ddProductType){      this.setState({ productTypeErrorMessage: "" });    } 
    else { this.setState({ productTypeErrorMessage: "You can't leave this blank or fill with 'Select'" }); }

    if(_ddlBuildingType){      this.setState({ buildingTypesErrorMessage: "" });    } 
    else { this.setState({ buildingTypesErrorMessage: "You can't leave this blank or fill with 'Select'" }); }

    if(_ddlContractValue){      this.setState({ contractValueErrorMessage: "" });    } 
    else { this.setState({ contractValueErrorMessage: "You can't leave this blank or fill with 'Select'" }); }

    if(_ddlDeliveryMethod){      this.setState({ deliveryModeErrorMessage: "" });    } 
    else { this.setState({ deliveryModeErrorMessage: "You can't leave this blank or fill with 'Select'" }); }

    if(_txtClient){      this.setState({ clientErrorMessage: "" });    } 
    else { this.setState({ clientErrorMessage: "You can't leave this blank" }); }


    return (_txtJobId && _txtSiteTitle && _txtSiteURL &&
            _ddlSiteType && _ddProductType && _ddlBuildingType &&
            _ddlContractValue && _ddlDeliveryMethod && _txtClient) ? true : false;

  }

  private _submitRequest = (): void => {
    debugger;
    if(this._validateAllFields()){
      // Add Project Request
      this.AddItem();
    }
  }

  private _cancelRequest = () => {
    debugger;
    this.ClearControlValue();
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

  //still not in use
  private ClearControlValue() {

    this.setState({
      jobId:'',
      siteTitle:'',
      siteURL:'',
      client:'',
      selectedSiteType: null,
      selectedBuildingType:null,
      selectedContractValue:null,
      selectedDeliveryMethodValue:null,
      selectedProductType:null,
      contractValue:[],
      productType:[],
      projectType:[],
      buildingType:[],
      jurisdictionUserId:null,
      jurisdictionUserEmail:'',
      spmUserId:null,
      spmUserEmail:'',
      pmUserId:null,
      pmUserEmail:'',
      apmUserId:null,
      apmUserEmail:'',
      peUserId:null,
      peUserEmail:'',
      memberUsersEmailArray:[],
      memberUsersIdArray:[]



      
    });

    this.BindDropDowns();
  }

  // This method is used as property method for office-ui-fabric component TextField
  // It takes input string as parameter and returns error string depending upon validation
  private _getErrorMessage(value: string): string {
    debugger;
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
        this.setState({ jobIdErrorMessage: "" });
      }
      if (event.target.id == "linkUrl") {
        this.setState({ sitURLErrorMessage: "" });
      }
    }
  }

 
  //this method is used to set default value to text control 
  private _assignDefaultValue=(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: any) => {
    let e:any= event.target;
    let id=e.id;

    switch(id) {
      case 'txtJobId':
        return (this.setState({
                  jobId:newValue
                }));
      case 'txtSiteTitle':
        return (this.setState({
                  siteTitle:newValue
                }));
      case 'txtSiteURL':
        return (this.setState({
                  siteURL:newValue
                }));
      case 'txtClient':
        return (this.setState({
                  client:newValue
                }));
      default:
        return null;
    }
        
  }

  public render(): React.ReactElement<IProjectSiteCreationProps> {
    debugger;
    return (
      <div className="projectSiteRequestSection">
        <div className="ms-sm12 ms-md12 ms-lg12 siteTypeSection">
          <div className="esHeader"><i className="ms-Icon ms-Icon--Link esHeaderIcon" aria-hidden="true"></i>{this.props.title}</div>
        </div>
        <div className="ms-sm12 ms-md12 ms-lg12 siteURLSection">
          <TextField label="Job ID" id="txtJobId" 
              required={true} onGetErrorMessage={this._getErrorMessage} 
              //onKeyUp={this.changeValue}
              errorMessage={this.state.jobIdErrorMessage} 
              validateOnLoad={false}
              name="txtJobId"  
              //defaultValue={null}
              onChange={this._assignDefaultValue}
              //onChanged={this._assignJobID}
              value={String(this.state.jobId)}
               />
        </div>
        
        <div className="ms-sm12 ms-md12 ms-lg12 siteTypeSection">
          <Dropdown
            label="Site Type"
            id="ddlSiteType"
            required={true}
            defaultSelectedKey={this.state.selectedSiteType}
            options={this.state.projectType}
            onChanged={this._onChoiceSiteTypeChange.bind(this)}
            //defaultValue={String(this.state.projectType)}
            errorMessage={this.state.siteTypeErrorMessage}
          />
        </div>

        <div className="ms-sm12 ms-md12 ms-lg12 siteTitleSection">
          <TextField label="Site Title" id="txtSiteTitle" 
              required={true} onGetErrorMessage={this._getErrorMessage} 
              errorMessage={this.state.siteTitleErrorMessage} 
              validateOnLoad={false} 
              name="txtSiteTitle"
              onChange={this._assignDefaultValue}
              value={String(this.state.siteTitle)}
              />
          
        </div>

        <div className="ms-sm12 ms-md12 ms-lg12 siteURLSection">
          <TextField type="url" label="Site URL" id="txtSiteURL" 
              required={true} onGetErrorMessage={this._getErrorMessage}  onKeyUp={this.changeValue}
              errorMessage={this.state.sitURLErrorMessage} 
              validateOnLoad={false} 
              onChange={this._assignDefaultValue}
              value={String(this.state.siteURL)} />
        </div>

        <div className="ms-sm12 ms-md12 ms-lg12 productTypeSection">

          <Dropdown
            label="Primary Product Type"
            id="ddlProductType"
            defaultSelectedKey={this.state.selectedProductType}
            options={this.state.productType}
            onChanged={this._onChoiceProductTypeChange.bind(this)}
            //defaultValue={String(this.state.productType)}
            errorMessage={this.state.productTypeErrorMessage}
          />
        </div>

        <div className="ms-sm12 ms-md12 ms-lg12 buildingTypeSection">
          <Dropdown
            label="Building Types"
            id="ddlBuildingTypes"
            defaultSelectedKey={this.state.selectedBuildingType}
            options={this.state.buildingType}
            onChanged={this._onChoiceBuildingTypeChange.bind(this)}
            //defaultValue={String(this.state.buildingType)}
            errorMessage={this.state.buildingTypesErrorMessage}
          />
        </div>

        <div className="ms-sm12 ms-md12 ms-lg12 contractSection">
          <Dropdown
            label="Precast Contract Value"
            id="ContractValue"
            defaultSelectedKey={this.state.selectedContractValue}
            options={this.state.contractValue}
            onChanged={this._onChoiceContractValueChange.bind(this)}
            //defaultValue={String(this.state.contractValue)}
            errorMessage={this.state.contractValueErrorMessage}
          />
        </div>

        <div className="ms-sm12 ms-md12 ms-lg12 jurisdictionSection">
          <PeoplePicker
            
            context={this.props.context}
            titleText="Jurisdiction"
            personSelectionLimit={1}
            showtooltip={true}
            isRequired={true}
            defaultSelectedUsers={(this.state.jurisdictionUserEmail) ? [this.state.jurisdictionUserEmail] : []}
            selectedItems={ this._getPeoplePickerJurisdictionItems.bind(this)}
            showHiddenInUI={false}
            principalTypes={[PrincipalType.User]}
            resolveDelay={1000} 
            
            />
        </div>

        <div className="ms-sm12 ms-md12 ms-lg12 deliveryMethodSection">
          <Dropdown
            label="Delivery Method"
            id="txtDeliveryMethod"
            defaultSelectedKey={this.state.selectedDeliveryMethodValue}
            required={true}
            options={this.state.deliveryMode}
            onChanged={this._onChoiceDeliveryMethodChange.bind(this)}
            //defaultValue={String(this.state.deliveryMode)}
            errorMessage={this.state.deliveryModeErrorMessage}
          />
        </div>

        <div className="ms-sm12 ms-md12 ms-lg12 clientSection">
          <TextField label="Client" id="txtClient"  
            required={true} onGetErrorMessage={this._getErrorMessage} 
            errorMessage={this.state.clientErrorMessage} 
            validateOnLoad={false} 
            onChange={this._assignDefaultValue}
            value={String(this.state.client)}
          />
        </div>

        <div className="ms-sm12 ms-md12 ms-lg12 spmSection">

          <PeoplePicker
            context={this.props.context}
            titleText="Senior Project Manager"
            personSelectionLimit={1}
            showtooltip={true}
            isRequired={true}
            defaultSelectedUsers={(this.state.spmUserEmail) ? [this.state.spmUserEmail] : []}
            selectedItems={this._getPeoplePickerSPMItems.bind(this)}
            showHiddenInUI={false}
            principalTypes={[PrincipalType.User]}
            resolveDelay={1000} />

        </div>

        <div className="ms-sm12 ms-md12 ms-lg12 pmSection">

          <PeoplePicker
            context={this.props.context}
            titleText="Project Manager"
            personSelectionLimit={1}
            showtooltip={true}
            isRequired={true}
            defaultSelectedUsers={(this.state.pmUserEmail) ? [this.state.pmUserEmail] : []}
            selectedItems={this._getPeoplePickerPMItems.bind(this)}
            showHiddenInUI={false}
            principalTypes={[PrincipalType.User]}
            resolveDelay={1000} />

        </div>

        <div className="ms-sm12 ms-md12 ms-lg12 apmSection">

          <PeoplePicker
            context={this.props.context}
            titleText="Associate Project Manager"
            personSelectionLimit={1}
            showtooltip={true}
            isRequired={true}
            defaultSelectedUsers={(this.state.apmUserEmail) ? [this.state.apmUserEmail] : []}
            selectedItems={this._getPeoplePickerAPMItems.bind(this)}
            showHiddenInUI={false}
            principalTypes={[PrincipalType.User]}
            resolveDelay={1000} />
          
        </div>

        <div className="ms-sm12 ms-md12 ms-lg12 peSection">

          <PeoplePicker
            context={this.props.context}
            titleText="Project Engineer"
            personSelectionLimit={1}
            showtooltip={true}
            isRequired={true}
            defaultSelectedUsers={(this.state.peUserEmail) ? [this.state.peUserEmail] : []}
            selectedItems={this._getPeoplePickerPEItems.bind(this)}
            showHiddenInUI={false}
            principalTypes={[PrincipalType.User]}
            resolveDelay={1000} />

        </div>

        <div className="ms-sm12 ms-md12 ms-lg12 peSection">
          <PeoplePicker
            context={this.props.context}
            titleText="Other Members"
            personSelectionLimit={20}
            showtooltip={true}
            isRequired={true}
            ensureUser={true}
            defaultSelectedUsers={(this.state.memberUsersEmailArray.length) ? this.state.memberUsersEmailArray : []}
            selectedItems={this._getPeoplePickerMemberItems.bind(this)}
            showHiddenInUI={false}
            principalTypes={[PrincipalType.User]}
            resolveDelay={1000} />
        </div>
        <div className="ms-sm12 ms-md12 ms-lg12 peSection">
        <DialogFooter>
          <PrimaryButton onClick={this._submitRequest} text="Submit Request" iconProps={{ iconName: 'Accept' }} />
          <DefaultButton onClick={this._cancelRequest} text="Cancel Request" iconProps={{ iconName: 'Clear' }} />
        </DialogFooter>
        </div>

      </div>
    );
  }
}
