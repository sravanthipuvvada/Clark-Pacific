import * as React from 'react';
import { IProjectSiteCreationProps } from './IProjectSiteCreationProps';
import { IProjectSiteCreationStates, IDropDown, ISPListColumn } from './IProjectSiteCreationStates';
import { escape } from '@microsoft/sp-lodash-subset';
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
import { string } from 'prop-types';

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
      memberUsersEmailArray: null,
      siteTypeErrorMessage: '',
      siteTitleErrorMessage: '',
      sitURLErrorMessage: "",
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

      jobId: undefined,
      siteURL:'',
      siteType:'',
      siteTitle:'',
      client:'',
      productType: [],
      projectType: [],
      buildingType: [],
      contractValue: [],
      deliveryMode: [],

      resetProjectType:"- Select -"
    };

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

  //this is declared for reseting peoplepickers 
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
      //this.ClearControlValue();
      this.myPicker.setState ({
        selectedPersons: []
      });
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
    return (document.getElementById(`${controlID}`)["value"].length > 0 )?true:false;
  }

  public _validateDDField(controlID: string): boolean {
    return (controlID != "")?(controlID != "- Select -")?true:false : false;
  }

  private _submitRequest = (): void => {

    debugger;

    let _txtJobId : boolean = this._validateTextField('txtJobId');
    let _txtSiteTitle : boolean = this._validateTextField('txtJobId');
    let _txtSiteURL : boolean = this._validateTextField('txtSiteURL');
    //let _ddlSiteType : boolean = this._validateDDField('ddlSiteType');
    let _ddlSiteType : boolean = this._validateDDField(this.state.selectedSiteType);
    let _ddProductType : boolean = this._validateDDField(this.state.selectedProductType);
    let _ddlBuildingType : boolean = this._validateDDField(this.state.selectedBuildingType);
    let _ddlContractValue : boolean = this._validateDDField(this.state.selectedContractValue);
    let _ddlDeliveryMethod : boolean = this._validateDDField(this.state.selectedDeliveryMethodValue);


  //1
    if (document.getElementById('txtJobId')["value"].length > 0) {
      this.setState({ jobIdErrorMessage: "" });
  //2
      if(_ddlSiteType) {
        this.setState({  siteTypeErrorMessage:"" });
  //3
       if (document.getElementById('txtSiteTitle')["value"].length > 0) {
        this.setState({ siteTitleErrorMessage : "" });
  //4
          if (document.getElementById('txtSiteURL')["value"].length > 0) {
            this.setState({ sitURLErrorMessage: "" });
  //5            
            if(_ddProductType) {
              this.setState({  productTypeErrorMessage:"" });
  //6
              if(_ddlBuildingType) {
                this.setState({  buildingTypesErrorMessage:"" });
  //7
                if(_ddlContractValue) {
                  this.setState({  contractValueErrorMessage:"" });
  //8
                  if (_ddlDeliveryMethod) {
                    this.setState({ deliveryModeErrorMessage: "" });
  //9
                    if(document.getElementById('txtClient')["value"].length > 0) {
                      this.setState({  clientErrorMessage:"" });
  //10
                          if (document.getElementById('txtJobId').parentElement.classList.toString().indexOf("invalid") == -1 && 
                              document.getElementById('txtSiteTitle').parentElement.classList.toString().indexOf("invalid") == -1 &&
                              document.getElementById('txtSiteURL').parentElement.classList.toString().indexOf("invalid") == -1)
                              {
                                let url = document.getElementById('txtSiteURL')["value"];
                                if (this._validateUrl(url)) {
                                  // Add Project Request
                                  this.AddItem();
                                }
                                else {
                                  this.setState({ sitURLErrorMessage: "Invalid Url : " + url });
                                }
//10 end
                              }
//9 end
                      } 
                      else {
                          this.setState({ clientErrorMessage: "You can't leave this blank" });
                      }
//8 end            
                    }
                    else {
                      this.setState({ deliveryModeErrorMessage: "You can't leave this blank or fill with 'Select'" });
                    }
//7 end        
                  }
                  else {
                    this.setState({ contractValueErrorMessage: "You can't leave this blank or fill with 'Select'" });
                  }
//6 end
                }
                else {
                  this.setState({ buildingTypesErrorMessage: "You can't leave this blank or fill with 'Select'" });
                }
//5 end
              }
              else {
                this.setState({ productTypeErrorMessage: "You can't leave this blank or fill with 'Select'" });
              }
//4 end
            }
            else {
              this.setState({ sitURLErrorMessage: "You can't leave this blank" });
            }
//3 end
          }
          else {
            this.setState({ siteTitleErrorMessage: "You can't leave this blank" });
          }
//2 end
        }
        else {
          this.setState({ siteTypeErrorMessage: "You can't leave this blank or fill with 'Select'" });
        }
//1 end
      }
      else {
        this.setState({ jobIdErrorMessage: "You can't leave this blank" });
      }






  }

  private _cancelRequest = (e) => {
    e.preventDefault();
    debugger;
    this.setState({
      jobId:undefined,
      siteTitle:'',
      siteURL:'',
      client:'',
      resetProjectType:"- Select -"
    });

    this.myPicker.setState ({
      selectedPersons: []
    });

    //this.ClearControlValue();
   
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
  
    
    // document.getElementById('txtJobId')["value"] = "";
    // document.getElementById('txtSiteTitle')["value"] = "";
    // document.getElementById('txtSiteURL')["value"] = "";
    // document.getElementById('txtclient')["value"] = "";
    // this.setState({
    //   jobIdErrorMessage: "",
    //   siteTitleErrorMessage: "",
    //   sitURLErrorMessage: "",
    //   clientErrorMessage: ""
    // });

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

  private _assignJobID=(newValue: any) => {
      this.setState({
        jobId:newValue
      });
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

    // if(id==="txtJobId"){
    //   this.setState({
    //     jobId:newValue
    //   })
    // }else if(id==="txtSiteTitle"){
    //   this.setState({
    //     siteTitle:newValue
    //   })
    // }

      
  }

  public render(): React.ReactElement<IProjectSiteCreationProps> {
    return (
      <div className="projectSiteRequestSection">
        <div className="ms-sm12 ms-md12 ms-lg12 siteURLSection">
          <TextField type="number" label="Job ID" id="txtJobId" 
              required={true} onGetErrorMessage={this._getErrorMessage} onKeyUp={this.changeValue}
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
            defaultSelectedKey={this.state.resetProjectType}
            options={this.state.projectType}
            onChanged={this._onChoiceSiteTypeChange.bind(this)}
            defaultValue={String(this.state.projectType)}
            errorMessage={this.state.siteTypeErrorMessage}
          />
        </div>

        <div className="ms-sm12 ms-md12 ms-lg12 siteTitleSection">
          <TextField label="Site Title" id="txtSiteTitle" 
              required={true} onGetErrorMessage={this._getErrorMessage} 
              errorMessage={this.state.siteTitleErrorMessage} 
              validateOnLoad={false} 
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
            options={this.state.productType}
            onChanged={this._onChoiceProductTypeChange.bind(this)}
            defaultValue={String(this.state.productType)}
            errorMessage={this.state.productTypeErrorMessage}
          />
        </div>

        <div className="ms-sm12 ms-md12 ms-lg12 buildingTypeSection">
          <Dropdown
            label="Building Types"
            id="ddlBuildingTypes"
            options={this.state.buildingType}
            onChanged={this._onChoiceBuildingTypeChange.bind(this)}
            defaultValue={String(this.state.buildingType)}
            errorMessage={this.state.buildingTypesErrorMessage}
          />
        </div>

        <div className="ms-sm12 ms-md12 ms-lg12 contractSection">
          <Dropdown
            label="Precast Contract Value"
            id="ContractValue"
            options={this.state.contractValue}
            onChanged={this._onChoiceContractValueChange.bind(this)}
            defaultValue={String(this.state.contractValue)}
            errorMessage={this.state.contractValueErrorMessage}
          />
        </div>

        <div className="ms-sm12 ms-md12 ms-lg12 jurisdictionSection">
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
            id="txtDeliveryMethod"
            options={this.state.deliveryMode}
            onChanged={this._onChoiceDeliveryMethodChange.bind(this)}
            defaultValue={String(this.state.deliveryMode)}
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
