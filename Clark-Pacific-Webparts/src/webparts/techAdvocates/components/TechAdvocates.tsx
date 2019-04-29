import * as React from 'react';
import './TechAdvocates.module.scss';
import { ITechAdvocatesProps } from './ITechAdvocatesProps';
import { ITechAdvocatesStates } from './ITechAdvocatesStates';
import { IEmployees } from './ITechAdvocatesStates';
import { escape, constant } from '@microsoft/sp-lodash-subset';
import { SPHttpClient } from '@microsoft/sp-http';
import Constants from "../../../constants/constant";
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
 
export default class TechAdvocates extends React.Component<ITechAdvocatesProps, ITechAdvocatesStates> {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      specificEmployee: [],
      employeeHTML: null,
      employeeHTMLRightPanel: null,
    };
  }
  //Get Employee details from list 
  public _getEmployeeData(numberofEmployee) {
    let that = this;
    let getEmployeeDataUrl = that.props.siteUrl + `/_api/web/lists/GetByTitle('${that.props.listName}')/Items?$select=Id,${Constants.employeeTitle},${Constants.employeeName},${Constants.employeeDescription},${Constants.twitter},${Constants.instagram},${Constants.skype},${Constants.linkedIn},${Constants.employeeEmailLookUp}/EMail&$expand=${Constants.employeeEmailExpand}&$orderby=${Constants.modified} desc&$top=${numberofEmployee !== undefined && numberofEmployee !== null ? numberofEmployee : 4}`;
    return new Promise((resolve, reject) => {
      that.props.spHttpClient.get(getEmployeeDataUrl, SPHttpClient.configurations.v1)
        .then((response) => {
          return response.json();
        })
        .then((responseJSON) => {
          if (responseJSON.value !== undefined) {
            let employees: IEmployees[] = new Array();
            responseJSON.value.map((employee) => {
              let employeeObject: IEmployees = {
                Id: employee.Id,
                Title: employee[`${Constants.employeeTitle}`],
                Name: employee[`${Constants.employeeName}`],
                EMail: employee[`${Constants.employeeEmailLookUp}`].EMail,
                Description: employee[`${Constants.employeeDescription}`],
                LinkedIn: employee[`${Constants.linkedIn}`],
                Twitter: employee[`${Constants.twitter}`],
                Instagram: employee[`${Constants.instagram}`],
                Skype: employee[`${Constants.skype}`],
                EmployeePicture: `${this.props.siteUrl}/_layouts/15/userphoto.aspx?size=L&username=${employee.Email.EMail}`
              };
              employees.push(employeeObject);
            });
            if (employees.length > 0) {
              this.setState({
                employees
              }, () => {
                that._createJSXForEmployees();
              });
            }
          }
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }
  //Get Specific Employe information
  public _getSpecificEmployee(itemID): any {
    let that = this;
    let getEmployeeDataUrl = that.props.siteUrl + `/_api/web/lists/GetByTitle('${that.props.listName}')/Items?$select=Id,${Constants.employeeTitle},${Constants.employeeName},${Constants.employeeDescription},${Constants.twitter},${Constants.instagram},${Constants.skype},${Constants.linkedIn},${Constants.employeeEmailLookUp}/EMail&$expand=${Constants.employeeEmailExpand}&$orderby=${Constants.modified} desc&$Filter=ID eq ${itemID}`;
    return new Promise((resolve, reject) => {
      that.props.spHttpClient.get(getEmployeeDataUrl, SPHttpClient.configurations.v1)
        .then((response) => {
          return response.json();
        })
        .then((responseJSON) => {
          if (responseJSON.value !== undefined) {
            let employees: IEmployees[] = new Array();
            responseJSON.value.map((employee) => {
              let employeeObject: IEmployees = {
                Id: employee.Id,
                Title: employee[`${Constants.employeeTitle}`],
                Name: employee[`${Constants.employeeName}`],
                EMail: employee[`${Constants.employeeEmailLookUp}`].EMail,
                Description: employee[`${Constants.employeeDescription}`],
                LinkedIn: employee[`${Constants.linkedIn}`],
                Twitter: employee[`${Constants.twitter}`],
                Instagram: employee[`${Constants.instagram}`],
                Skype: employee[`${Constants.skype}`],
                EmployeePicture: `${this.props.siteUrl}/_layouts/15/userphoto.aspx?size=L&username=${employee.Email.EMail}`
              };
              employees.push(employeeObject);
            });
            if (employees.length > 0) {
              this.setState({
                employees
              }, () => {
                that._createJSXSpecificEmployee();
              });
            }
          }
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  public _createJSXSpecificEmployee(): any {
    if (this.state.employees === null || this.state.employees === undefined || this.state.employees.length === 0) {
      //Do nothing
    } else {
      let employeeData: JSX.Element[] = this.state.employees.map((employeeItem, index) => {
        if (index < 1) {
          return (
            <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12">
              <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg6">
                <div className="cs-ta-Image">
                  <img alt={employeeItem.Title} src={employeeItem.EmployeePicture} data-image={employeeItem.EmployeePicture} data-description={employeeItem.Description} />
                  <span className="employeeName">{employeeItem.Name}</span>
                  <span className="employeeTitle">{employeeItem.Title}</span>
                </div>
              </div>
              <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg6 cs-ta-descriptionSection">
                <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12 decsTitle">
                  <div className="spnHello"><i className="fa fa-hand-spock-o spnHelloIcon" aria-hidden="true"></i>Hello</div>
                  <div className="spnBitAbtMe">A bit about me:</div>
                </div>
                <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12 cs-ta-description">
                  {employeeItem.Description}
                </div>
                <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12 socialBtns">
                  <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12">
                    <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg6">
                      <span className="spnBtn"><i className="fa fa-skype spnBtnIcon" aria-hidden="true"></i><a className="btnSocial" href={employeeItem.Skype}> Skype</a></span>
                    </div>
                    <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg6">
                      <span className="spnBtn"><i className="fa fa-linkedin spnBtnIcon" aria-hidden="true"></i><a className="btnSocial" href={employeeItem.LinkedIn}> LinkedIn</a></span>
                    </div>
                  </div>
                  <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12">
                    <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg6">
                      <span className="spnBtn"><i className="fa fa-twitter spnBtnIcon" aria-hidden="true"></i><a className="btnSocial" href={employeeItem.Twitter}> Twitter</a></span>
                    </div>
                    <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg6">
                      <span className="spnBtn"><i className="fa fa-instagram spnBtnIcon" aria-hidden="true"></i><a className="btnSocial" href={employeeItem.Instagram}> Instagram</a></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }
      });
      if (employeeData.length > 0) {
        this.setState({
          employeeHTML: employeeData,
        });
      }
    } 
  }

  public _createJSXForEmployees(): any {
    //Left Panel data
    this._createJSXSpecificEmployee();

    //Right Panel data 
    if (this.state.employees === null || this.state.employees === undefined || this.state.employees.length === 0) {
      //Do nothing
    } else {
      let employeeDataRight: JSX.Element[] = this.state.employees.map((employeeItem, index) => {
        const onEmployeeClick = (): any => {
          this._getSpecificEmployee(employeeItem.Id);
        };
        let emailLink="mailto:"+employeeItem.EMail;
        var mailName;
        if(employeeItem.EMail){
          mailName= employeeItem.EMail.substring(0, employeeItem.EMail.lastIndexOf("@"));
        }  
        return (
          <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12 rpEmployeeItem" onClick={onEmployeeClick}>
            <div className="cs-ta-RightImage">
              <img alt={employeeItem.Title} src={employeeItem.EmployeePicture} data-image={employeeItem.EmployeePicture} data-description={employeeItem.Description} />
              <span className="employeeName">{employeeItem.Name}</span>
              <span className="employeeTitle">{employeeItem.Title}</span>
              <div className="mailToSection">
                <i className="fa fa-envelope-o mailIcon"></i>
                <span className="mailTo"><a href={emailLink}>@{mailName}</a></span>
              </div>              
            </div>
          </div>
        );
      });
      if (employeeDataRight.length > 0) {
        this.setState({
          employeeHTMLRightPanel: employeeDataRight,
        });
      }
    }
  }

  //Compoenent Did Mount Event
  public componentDidMount() {
    if (this.props.listName !== undefined && this.props.listName !== null && this.props.listName !== "") {
      this._getEmployeeData(this.props.numerOfEmployee);
    }
  }

  public render(): React.ReactElement<ITechAdvocatesProps> {
    let taHeaderTitle = this.props.title;
    let taHeaderIcon = this.props.titleIcon;
    if (this.state.employees === null || this.state.employees === undefined || this.state.employees.length === 0) {
      return (
        <div className="techAdvocatesSection">
          <div className="taHeader"> {taHeaderTitle}</div>
          <MessageBar>No data found.</MessageBar>
        </div>
      );
    }
    else {
      return (
        <div className="techAdvocatesSection">
          <div className="taHeader"> {taHeaderTitle}</div>
          <div id="cs-ta-slider" className="cs-ta-slider">
            <div className="cs-ta-contentSection">
              <div className="ms-Grid" dir="ltr">
                <div className="ms-Grid-row">
                  <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg10 lefttPanelSection">
                    {this.state.employeeHTML}
                  </div>
                  <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg2 rightPanelSection">
                    {this.state.employeeHTMLRightPanel}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}
