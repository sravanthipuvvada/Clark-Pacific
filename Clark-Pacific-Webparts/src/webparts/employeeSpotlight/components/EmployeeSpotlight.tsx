import * as React from 'react';
import './EmployeeSpotlight.module.scss';
import { IEmployeeSpotlightProps } from './IEmployeeSpotlightProps';
import { IEmployeeSpotlightStates } from './IEmployeeSpotlightStates';
import { IEmployees } from './IEmployeeSpotlightStates';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPHttpClient } from '@microsoft/sp-http';
import Constants from "../../../constants/constant";
import { DefaultButton, PrimaryButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

export default class EmployeeSpotlight extends React.Component<IEmployeeSpotlightProps, IEmployeeSpotlightStates> {
    private slideIndex: number = 0;
    private timerId: any;
    constructor(props) {
        super(props);
        this.state = {
            employees: [],
            employeeHTML: null,
            employeeDotHTML: null
        };
        this._showSlides = this._showSlides.bind(this);
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
                                EmployeePicture: `${this.props.siteUrl}/_layouts/15/userphoto.aspx?size=L&username=${employee.Email.EMail}`
                            };
                            employees.push(employeeObject);
                        });
                        if (employees.length > 0) {
                            this.setState({
                                employees
                            }, () => {
                                that._createJSXForEmployeesSlide();
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

    public _createJSXForEmployeesSlide(): any {
        let dotHTML: JSX.Element[] = new Array();
        let allEmployeeData: JSX.Element[] = this.state.employees.map((employeeItem, index) => {
            let dotElement: JSX.Element = <div className="cs-es-dot" onClick={() => this._currentSlide(index)}></div>;
            dotHTML.push(dotElement);
            return (
                <div className="cs-es-employeeItem fade">
                    <div className="cs-es-Image"><img alt={employeeItem.Title} src={employeeItem.EmployeePicture} data-image={employeeItem.EmployeePicture} data-description={employeeItem.Description} /></div>
                    <div className="cs-es-descriptionSection">
                        <div className="cs-es-description">{employeeItem.Description}</div>
                    </div>
                </div>
            );
        });
        if (allEmployeeData.length > 0) {
            this.setState({
                employeeHTML: allEmployeeData,
                employeeDotHTML: dotHTML
            }, () => {
                this._showSlides();
            });
        }
    }


    //This method is used when user clicks on any of the dot link below slides.

    public _currentSlide(currentItemIndex) {
        this.slideIndex = currentItemIndex;
        this._showSlides();
    }

    // This method is used to implement simple slide show which will change the employees slide based upon the
    // property value entered by user .   
    public _showSlides() {
        var i;
        var slides = document.getElementsByClassName("cs-es-employeeItem");
        var dots = document.getElementsByClassName("cs-es-dot");
        for (i = 0; i < slides.length; i++) {
            let slide: any = slides[i];
            slide.style.display = "none";
        }
        this.slideIndex++;
        if (this.slideIndex > slides.length) { this.slideIndex = 1; }

        if (dots.length > 1) {
            for (i = 0; i < dots.length; i++) {
                dots[i].className = dots[i].className.replace(" active", "");
            }
            dots[this.slideIndex - 1].className += " active";
        }
        let slideIndexVar: any = slides[this.slideIndex - 1];
        slideIndexVar.style.display = "block";
        // Need to clear the time interval before setting new time interval since it will add some memory lick in code .
        // Also it will not work as per expected if previous itteration time out is not  cleared
        if (slides.length > 1) {
            clearInterval(this.timerId);
            this.timerId = setInterval(this._showSlides.bind(this), this.props.slideShowTime !== undefined && this.props.slideShowTime !== null ?
                this.props.slideShowTime * 1000 : 3000);
        }
    }

    //Compoenent Did Mount Event
    public componentDidMount() {
        if (this.props.listName !== undefined && this.props.listName !== null && this.props.listName !== "") {
            this._getEmployeeData(this.props.numerOfEmployee);
        }
    }

    // Render Event
    public render(): React.ReactElement<IEmployeeSpotlightProps> {
        let esHeaderTitle = this.props.title;
        let esHeaderIcon = this.props.titleIcon;
        if (this.state.employees === null || this.state.employees === undefined || this.state.employees.length === 0) {
            return (
                <div className="employeeSpotlightSection">
                    <div className="esHeader"> <i className="ms-Icon ms-Icon--Snowflake  esHeaderIcon" aria-hidden="true"></i> {esHeaderTitle}</div>
                    <MessageBar>No data found.</MessageBar>
                </div>
            );
        }
        else {
            return (
                <div className="employeeSpotlightSection">
                    <div className="esHeader"> <i className="ms-Icon ms-Icon--Snowflake esHeaderIcon" aria-hidden="true"></i> {esHeaderTitle}</div>
                    <div id="cs-es-slider" className="cs-es-slider">
                        <div className="cs-es-contentSection">
                            {this.state.employeeHTML}
                        </div>
                        <div className="cs-es-dotSection">
                            {this.state.employeeDotHTML !== undefined && this.state.employeeDotHTML !== null && this.state.employeeDotHTML.length > 1 ? this.state.employeeDotHTML : null}
                        </div>
                    </div>
                </div>
            );
        }

    }
}
