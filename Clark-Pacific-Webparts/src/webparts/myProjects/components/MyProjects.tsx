import * as React from 'react';
import './MyProjects.module.scss';
import { IMyProjectsProps } from './IMyProjectsProps';
import { IMyProjectsStates, IProjectItem } from './IMyProjectsStates';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPHttpClient } from '@microsoft/sp-http';
import Constants from "../../../constants/constant";
import { MessageBar } from 'office-ui-fabric-react/lib/MessageBar'; 

export default class MyProjects extends React.Component<IMyProjectsProps, IMyProjectsStates> {
  constructor(props) {
    super(props);
    this.state = {
      projectItems: [],
      projectJSX: null
    };
  }

  public _getProjectData(): any {
    return new Promise((resolve, reject) => {
      let that = this;
      if (this.props.listName !== undefined) {
        let apiUrl = that.props.siteUrl + `/_api/web/lists/GetByTitle('${this.props.listName}')/Items?$select=ID,Title,${Constants.buildingType},${Constants.contractValue},${Constants.productType},${Constants.projectType},${Constants.projectSiteLink},${Constants.jobID},${Constants.spm}/Id,${Constants.spm}/Title,${Constants.spm}/EMail,${Constants.pm}/Id,${Constants.pm}/Title,${Constants.pm}/EMail,${Constants.members}/Id,${Constants.members}/Title,${Constants.members}/EMail&$expand=${Constants.spm},${Constants.pm},${Constants.members}&$top=${that.props.numberOfItems == 0 || that.props.numberOfItems === undefined || that.props.numberOfItems === null ? 4 : that.props.numberOfItems}&$filter=${Constants.spm}/EMail eq '${this.props.userEmail}' or ${Constants.pm}/EMail eq '${this.props.userEmail}' or ${Constants.members}/EMail eq '${this.props.userEmail}'`;
        that.props.spHttpClient.get(apiUrl, SPHttpClient.configurations.v1)
          .then((response) => {
            return response.json();
          })
          .then((responseJSON) => {
            let items: any = responseJSON.value;
            if (items !== undefined) {
              let projectItemsArray: IProjectItem[] = new Array();
              items.map((item) => {
                let projectItemObject: IProjectItem = {
                  Id: item[`ID`],
                  Title: item[`Title`],
                  ProjectType: item[`${Constants.projectType}`],
                  BuildingType: item[`${Constants.buildingType}`],
                  ProductType: item[`${Constants.productType}`],
                  ProjectLinkUrl: item[`${Constants.projectSiteLink}`].Url,
                  ContractValue: item[`${Constants.contractValue}`],
                  JobID: item[`${Constants.jobID}`],
                };
                projectItemsArray.push(projectItemObject);
              });
              that.setState({
                projectItems: projectItemsArray
              }, () => { this._createProjectJSX(); });
            }
          });
      }
    });
  }
  public _createProjectJSX() {
    if (this.state.projectItems === null || this.state.projectItems === undefined || this.state.projectItems.length === 0) {
      let projectData = <MessageBar>No data found.</MessageBar>;
      this.setState({
        projectJSX: projectData,
      });
    } else {
      let projectData: JSX.Element[] = this.state.projectItems.map((projectItem, index) => {
        const onPopupClick = (): any => {
          window.open(projectItem.ProjectLinkUrl);
        };
        return (
          <div className="projectTile" onClick={onPopupClick}>
            <span className="projectTitle">{projectItem.JobID} {projectItem.Title}</span>
            <div className="projectDetails">
              <span className="projectItemInfo">ProjectType : {projectItem.ProjectType}</span>
              <span className="projectItemInfo">ProductType : {projectItem.ProductType}</span>
            </div>
          </div>
        );
      });
      if (projectData.length > 0) {
        this.setState({
          projectJSX: projectData,
        });
      }
    }

  }
  public componentDidMount(): any {
    this._getProjectData();
  }

  public render(): React.ReactElement<IMyProjectsProps> {

    let titleIcon = "";
    if (this.props.titleIcon != undefined && this.props.titleIcon != null && this.props.titleIcon != "") {
      titleIcon = "titleIcon ms-Icon ms-Icon--" + this.props.titleIcon; 
    }

    return (
      <div className="myProjectSection">
        <div className="webpartHeader"><div className="captionElement_ wpHeader"><i className={titleIcon}></i><span role="heading">{this.props.title}</span></div></div>
        <div className="myProjectContent">
          {this.state.projectJSX}
        </div>
      </div>
    );

  }
}

