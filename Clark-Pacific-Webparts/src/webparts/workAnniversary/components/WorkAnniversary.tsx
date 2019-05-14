import * as React from 'react';
import './WorkAnniversary.module.scss';
import { IWorkAnniversaryProps } from './IWorkAnniversaryProps';
import { IWorkAnniversaryStates, IPersonInformation, IEmployee, IWorkAnniversary } from './IWorkAnniversaryStates';
import { escape } from '@microsoft/sp-lodash-subset';
import { IPersonaSharedProps, Persona, PersonaSize, PersonaPresence } from 'office-ui-fabric-react/lib/Persona';
import { SPHttpClient } from '@microsoft/sp-http';
import { MessageBar } from 'office-ui-fabric-react/lib/MessageBar';
import Constants from "../../../constants/constant";
import * as jquery from 'jquery';
import * as moment from 'moment';
import { default as pnp, ItemAddResult, Web, List, Item } from "sp-pnp-js";
import { Link } from 'office-ui-fabric-react/lib/Link';

export default class WorkAnniversary extends React.Component<IWorkAnniversaryProps, IWorkAnniversaryStates> {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      employeeCollection: [],
      renderPersonaDetails: true,
      personaJSX: null,
      lastExecItemID: null
    };
  }

  // Get employee data from user profile
  public _getEmployeeData() {
    let that = this;
    let getEmployeeDataUrl = that.props.siteUrl + `/_api/web/lists/GetByTitle('${that.props.workAnniversaryList}')/Items?$select=Id,NoOfYears,${Constants.employeeEmailLookUp}/EMail,${Constants.employeeEmailLookUp}/Title,${Constants.employeeEmailLookUp}/JobTitle,${Constants.employeeEmailLookUp}/Department&$expand=${Constants.employeeEmailExpand}&$orderby=${Constants.modified} desc`;
    return new Promise((resolve, reject) => {
      that.props.spHttpClient.get(getEmployeeDataUrl, SPHttpClient.configurations.v1)
        .then((response) => {
          return response.json();
        })
        .then((responseJSON) => {
          if (responseJSON.value !== undefined) {
            let employees: IPersonInformation[] = new Array();
            responseJSON.value.map((employee) => {
              let employeeObject: IPersonInformation = {
                imageUrl: `${this.props.siteUrl}/_layouts/15/userphoto.aspx?size=L&username=${employee.Email.EMail}`,
                imageInitials: employee.Email.Title,
                text: employee.Email.Title,
                secondaryText: employee.Email.JobTitle,
                tertiaryText: employee.Email.Department,
                optionalText: employee.Email.JobTitle,
                showSecondaryText: false,
                email: employee.Email.EMail
              };
              employees.push(employeeObject);
            });
            this.setState({
              employees
            }, () => {
              that._createPersonaJSX();
            });
          }
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  // Create Persona of each employee
  public _createPersonaJSX() {
    const { renderPersonaDetails } = this.state;
    if (this.state.employees === null || this.state.employees === undefined||this.state.employees.length===0) {
      let noDataElement = <MessageBar>No data found.</MessageBar>;
      this.setState({
        personaJSX: noDataElement,
      });
    } else {
      let personaElement: JSX.Element[] = this.state.employees.map((employeeItem, index) => {
        let userProfileURL = `${this.props.siteUrl.split(".sharepoint.com")[0]}-my.sharepoint.com/_layouts/15/me.aspx/?p=${employeeItem.email}&v=work`;
        return (
          <div className="personaItem" >
            <Link href={userProfileURL} target="_blank">
              <Persona {...employeeItem} presence={PersonaPresence.none} size={PersonaSize.size72} coinSize={72} hidePersonaDetails={!renderPersonaDetails} />
            </Link>
          </div>
        );
      });
      this.setState({
        personaJSX: personaElement,
      });
    }
  }

  // Api call to sharepoint list to get the data
  public getDataAjaxRequest(apiUrl): any {
    let Items;
    jquery.ajax({
      url: apiUrl,
      type: "GET",
      async: false,
      headers: { 'Accept': 'application/json; odata=verbose;' },
      success: (resultData) => {
        Items = resultData.d.results;
      },
      error: (jqXHR, textStatus, errorThrown) => { }
    });
    return Items;
  }

  // Delete data from the anniversary list
  public deleteItemsFromWorkAnni() {
    let apiUrl = this.props.siteUrl + "/_api/web/lists/getByTitle('" + this.props.workAnniversaryList + "')/items";
    let itemsForDeletions = this.getDataAjaxRequest(apiUrl);
    itemsForDeletions.map((item) => {
      this.deleteItem(item.ID);
    });

  }

  // Delete the item from list
  public deleteItem(itemId) {
    if (itemId) {
      const web: Web = new Web(this.props.siteUrl);
      let list = web.lists.getByTitle(this.props.workAnniversaryList);
      list.items.getById(itemId).delete().then(_ => {
        //on Delete success
      });
    }
  }

  // Get the data from the list
  public getUserInfo(apiUrl): any {
    let that = this;
    return new Promise((resolve, reject) => {
      that.props.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1)
        .then(response => {
          response
            .json()
            .then(responseJSON => {
              resolve(responseJSON);
            })
            .catch(error => {
              console.log(error);
              reject(error);
            });
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  }

  // Get the UserID using email id, this is used for add/update people pikcer in a list
  public getUserIdFromEmail(emailId): any {
    let that = this;
    let apiUrl = this.props.siteUrl + "/_api/Web/SiteUsers?$filter=Email eq '" + emailId + "'";
    return new Promise((resolve, reject) => {
      that.props.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1)
        .then(response => {
          response
            .json()
            .then(responseJSON => {
              resolve(responseJSON);
            })
            .catch(error => {
              console.log(error);
              reject(error);
            });
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
    });
  }

  // Check when data updated in work anniversary list
  public _checkLastExecution() {
    let apiUrl = this.props.siteUrl + "/_api/web/lists/getbytitle('" + this.props.lastExecutionList + "')/items?&$top=1";
    let Items = this.getDataAjaxRequest(apiUrl);
    if (Items.length > 0) {
      let today = moment.utc(new Date()).format('YYYY-MM-DD');
      let lastExecutionDate = moment.utc(Items[0].LastExecutionTime).format('YYYY-MM-DD');
      let itemID = Items[0].ID;
      this.setState({
        lastExecItemID: itemID
      });
      //Check last executing date
      if (today === lastExecutionDate) {
        this._getEmployeeData();
      }
      else {
        //delete existing items 
        this.deleteItemsFromWorkAnni();
        //get new users which has anniversary today
        this.getUsersFromUserProfile();
      }
    } else {
      //delete existing items 
      this.deleteItemsFromWorkAnni();
      //get new users which has anniversary today
      this.getUsersFromUserProfile();
    }
  }

  // Get Users From User Profile
  public getUsersFromUserProfile() {
    let that = this;
    let getEmployeeDataUrl = that.props.siteUrl + `/_api/web/SiteUsers`;
    return new Promise((resolve, reject) => {
      that.props.spHttpClient.get(getEmployeeDataUrl, SPHttpClient.configurations.v1)
        .then((response) => {
          return response.json();
        })
        .then((responseJSON) => {
          if (responseJSON.value !== undefined) {
            let employeeCollection: IEmployee[] = new Array();
            responseJSON.value.map((employee) => {
              let employeeObject: IEmployee = {
                email: employee.Email,
              };
              employeeCollection.push(employeeObject);
            });
            this.setState({
              employeeCollection
            }, () => { this.getAllUserInformation(); });
          }
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  // Parse result from the user profile object
  public getValueFromResults(key, results) {
    var value = undefined;
    if (results && results.length > 0 && key) {
      for (var i = 0; i < results.length; i++) {
        var resultItem = results[i];
        if (resultItem.Key === key) {
          value = resultItem.Value;
          break;
        }
      }
    }
    return value;
  }

  // Get All User Information
  public getAllUserInformation() {
    let workAnniversary: IWorkAnniversary[] = new Array();
    if (this.state.employeeCollection !== null || this.state.employeeCollection !== undefined || this.state.employeeCollection.length > 0) {
      this.state.employeeCollection.map((element) => {
        let apiUrl = this.props.siteUrl + "/_api/SP.UserProfiles.PeopleManager/GetPropertiesFor(accountName='i:0%23.f|membership|" + element.email + "')";
        this.getUserInfo(apiUrl).then(item => {
          if (item != null || item != undefined) {
            let emailID = this.getValueFromResults('WorkEmail', item.UserProfileProperties);
            let hireDate = this.getValueFromResults('SPS-HireDate', item.UserProfileProperties);
            if (hireDate) {
              let todayDayMonth = moment.utc(new Date()).format('MM-DD');
              let hireDateDayMonth = moment.utc(hireDate).format('MM-DD');
              let years = moment.utc().diff(hireDate, 'years', false);
              if (todayDayMonth === hireDateDayMonth) {
                if (emailID) {
                  let employeeObject: IWorkAnniversary = {
                    email: emailID,
                    noOfYears: years,
                    date: hireDate
                  };
                  workAnniversary.push(employeeObject);
                  this.AddItem(employeeObject);
                }
              }
            }
          }
        });
      });
      console.log(workAnniversary);
      this.UpdateLastExecutionTime();
    }
  }

  // Add the user details to SharePoint Work Anniversary List
  public AddItem(item): any {
    const web: Web = new Web(this.props.siteUrl);
    this.getUserIdFromEmail(item.email).then((user) => {
      console.log(user);
      if (user.value) {
        if (user.value.length > 0) {
          let userID = user.value[0].Id;
          web.lists.getByTitle(this.props.workAnniversaryList).items.add({
            'NoOfYears': item.noOfYears,
            'EmailId': userID
          }).then((iar: ItemAddResult) => {
            console.log('Added User in a list');
          });
        }
      }
    });
  }
  // Upadte Last Excution Time in a list
  public UpdateLastExecutionTime(): any {
    const web: Web = new Web(this.props.siteUrl);
    let today = moment.utc(new Date());
    let list = web.lists.getByTitle(this.props.lastExecutionList);
    let itemId = this.state.lastExecItemID;
    if (itemId) {
      list.items.getById(itemId).update({
        'LastExecutionTime': today
      }).then(i => {
        console.log('Updated Last Execution Time');
      });
    } else {
      web.lists.getByTitle(this.props.lastExecutionList).items.add({
        'LastExecutionTime': today
      }).then((iar: ItemAddResult) => {
        console.log('Added Last Execution Time');
      });
    }
    this._getEmployeeData();
  }
  // Compoenent Did Mount Event
  public componentDidMount() {
    if (this.props.lastExecutionList && this.props.workAnniversaryList) {
      this._checkLastExecution();
    }
  }

  public render(): React.ReactElement<IWorkAnniversaryProps> {
    return (
      <div className="workAnnivSection">
        <div className="wpHeader"><i className="fa fa-gift wpHeaderIcon" aria-hidden="true"></i> {this.props.title}</div>
        <div className="workAnnivEmployees">
          {this.state.personaJSX}
        </div>
      </div>
    );
  }
}
