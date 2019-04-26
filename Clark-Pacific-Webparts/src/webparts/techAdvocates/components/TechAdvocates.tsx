import * as React from 'react';
import './TechAdvocates.module.scss';
import { ITechAdvocatesProps } from './ITechAdvocatesProps';
import { ITechAdvocatesStates } from './ITechAdvocatesStates';
import { IEmployees } from './ITechAdvocatesStates';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPHttpClient } from '@microsoft/sp-http';
import Constants from "../../../constants/constant";
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

export default class TechAdvocates extends React.Component<ITechAdvocatesProps, ITechAdvocatesStates> {
  constructor(props) {
    super(props);
    this.state = {
      employees: [],
      employeeHTML: null
    };
  }
  //Get Employee details from list
  public _getEmployeeData(numberofEmployee) {
    let that = this;
    let getEmployeeDataUrl = that.props.siteUrl + `/_api/web/lists/GetByTitle('${that.props.listName}')/Items?$select=Id,${Constants.employeeTitle},${Constants.employeeName},${Constants.employeeDescription},${Constants.employeeEmailLookUp}/EMail&$expand=${Constants.employeeEmailExpand}&$orderby=${Constants.modified} desc&$top=${numberofEmployee !== undefined && numberofEmployee !== null ? numberofEmployee : 4}`;
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

public _createJSXForEmployees(): any {
  let allEmployeeData: JSX.Element[] = this.state.employees.map((employeeItem, index) => {     
      return (
          <div className="cs-ta-employeeItem">
              <div className="cs-ta-Image">
                <img alt={employeeItem.Title} src={employeeItem.EmployeePicture} data-image={employeeItem.EmployeePicture} data-description={employeeItem.Description} />
                <span className="employeeName">{employeeItem.Name}</span>
                <span className="employeeTitle">{employeeItem.Title}</span>
              </div>
              <div className="cs-ta-descriptionSection">
              <div className="decsTitle">
                <span className="spnHello"><i></i>Hello</span>
                <span className="spnBitAbtMe"><i></i>Bit About Me</span>
              </div>
              <div className="cs-ta-description">{employeeItem.Description}</div>
                  <div className="socialBtns">
                    <span className="spnBtn"><i className="ms-Icon ms-Icon--SkypeLogo"></i><a className="btnSocial" href={employeeItem.Skype}> Skype</a></span>
                    <span className="spnBtn"><i className="ms-Icon ms-Icon--LinkedInLogo"></i><a className="btnSocial" href={employeeItem.LinkedIn}> LinkedIn</a></span>
                    <span className="spnBtn"><i className="ms-Icon ms-Icon--TwitterLogo"></i><a className="btnSocial" href={employeeItem.Twitter}> Twitter</a></span>
                    <span className="spnBtn"><i className="ms-Icon ms-Icon--InstagramLogo"></i><a className="btnSocial" href={employeeItem.Instagram}> Instagram</a></span>                 
                  </div>
              </div>
          </div>
      );
  });
  if (allEmployeeData.length > 0) {
      this.setState({
          employeeHTML: allEmployeeData,
      });
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
                            {this.state.employeeHTML}
                        </div>
                    </div>
                </div>
            );
        }
  }
}
