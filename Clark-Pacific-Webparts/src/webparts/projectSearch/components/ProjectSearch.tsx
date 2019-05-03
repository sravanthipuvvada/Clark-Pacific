import * as React from 'react';
import './ProjectSearch.module.scss';
import { IProjectSearchProps } from './IProjectSearchProps';
import { IProjectSearchStates, IProject } from './IProjectSearchStates';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPHttpClient } from '@microsoft/sp-http';
import Constants from "../../../constants/constant";
import { MessageBar } from 'office-ui-fabric-react/lib/MessageBar';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';

export default class ProjectSearch extends React.Component<IProjectSearchProps, IProjectSearchStates> {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      projectsHTML: null,
      hideDialog: true,
      projectsHtmlModal: null
    };
  }

  //Get Projects details from list 
  public _getProjectsData() {
    let that = this;
    let getProjectDataUrl = that.props.siteUrl + `/_api/web/lists/GetByTitle('${that.props.listName}')/Items?$select=Id,Title,${Constants.projectType},${Constants.spm},${Constants.pm},${Constants.productType},${Constants.buildingType},${Constants.contractValue},${Constants.jobID}&$orderby=${Constants.modified} desc&$top=20`;
    return new Promise((resolve, reject) => {
      that.props.spHttpClient.get(getProjectDataUrl, SPHttpClient.configurations.v1)
        .then((response) => {
          return response.json();
        })
        .then((responseJSON) => {
          if (responseJSON.value !== undefined) {
            let projects: IProject[] = new Array();
            responseJSON.value.map((project, index) => {
              let projectObject: IProject = {
                Id: project.Id,
                Title: project.Title,
                JobID: project[`${Constants.jobID}`],
                ProductType: project[`${Constants.productType}`],
                ProjectType: project[`${Constants.projectType}`],
                BuildingType: project[`${Constants.buildingType}`],
                ContractValue: project[`${Constants.contractValue}`],
                SPM: project[`${Constants.spm}`],
                PM: project[`${Constants.pm}`],
              };
              projects.push(projectObject);
            });
            this.setState({
              projects
            }, () => { this._createJSXForProjects(); });

          }
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  //Create JSX of projects to display in panel
  public _createJSXForProjects(): any {
    if (this.state.projects === null || this.state.projects === undefined || this.state.projects.length === 0) {
      let projectData = <MessageBar>No data found.</MessageBar>;
      this.setState({
        projectsHTML: projectData,
      });
    } else {
      let projectData: JSX.Element[] = this.state.projects.map((projectItem, index) => {
        const onPopupClick = (): any => {
          this._showDialogModal(projectItem);
        };
        return (
          <div className="projectTile" onClick={onPopupClick}>
            <span className="projectTitle">{projectItem.Title}</span>
            <div className="projectDetails">
            <span className="projectItemInfo">JobID : {projectItem.JobID}</span>
              <span className="projectItemInfo">SPM : {projectItem.SPM}</span>
              <span className="projectItemInfo">PM : {projectItem.PM}</span>
            </div>
          </div>
        );
      });
      if (projectData.length > 0) {
        this.setState({
          projectsHTML: projectData,
        });
      }
    }
  }

  //Modal Dialog Events
  public _showDialog = (): void => {
    this.setState({ hideDialog: false });
  }
  public _closeDialog = (): void => {
    this.setState({ hideDialog: true });
  }
  public _showDialogModal = (item): any => {
    this.setState({
      hideDialog: false
    }, () => { this.createModalContent(item); });
  }

  //Create JSX popup data of alert to display in panel
  public createModalContent(item): any {
    if (item === null || item === undefined) {
      let projectData = <MessageBar>No data found.</MessageBar>;
      this.setState({
        projectsHtmlModal: projectData,
      });
    } else {
      let projectData: JSX.Element = <div className="PopUpData">
        <div className="projectTitle"><span className="popbold">Title : </span>{item.Title}</div>
        <div className="projectJobID"><span className="popbold">JOB ID :  </span>{item.JobID}</div>
        <div className="projectProductType"><span className="popbold">Product Type : </span>{item.ProductType}</div>
        <div className="projectBuildingType"><span className="popbold">Building Type :  </span>{item.BuildingType}</div>
        <div className="projectContractValue"><span className="popbold">Contract Value : </span>{item.ContractValue}</div>
        <div className="projectProjectType"><span className="popbold">Project Type :  </span>{item.ProjectType}</div>
      </div>;
      if (projectData) {
        this.setState({
          projectsHtmlModal: projectData,
        });
      }
    }
  }
  public _getSearchResult(searchItem):any{
    let that = this;
    let getProjectDataUrl;
    if(searchItem){
      getProjectDataUrl = that.props.siteUrl + `/_api/web/lists/GetByTitle('${that.props.listName}')/Items?$select=Id,Title,${Constants.projectType},${Constants.spm},${Constants.pm},${Constants.productType},${Constants.buildingType},${Constants.contractValue},${Constants.jobID}&$orderby=${Constants.modified} desc&$Filter=JOBID eq '${searchItem}'`;
    }else{
      getProjectDataUrl = that.props.siteUrl + `/_api/web/lists/GetByTitle('${that.props.listName}')/Items?$select=Id,Title,${Constants.projectType},${Constants.spm},${Constants.pm},${Constants.productType},${Constants.buildingType},${Constants.contractValue},${Constants.jobID}&$orderby=${Constants.modified} desc&$Top=20`;
    }
   return new Promise((resolve, reject) => {
      that.props.spHttpClient.get(getProjectDataUrl, SPHttpClient.configurations.v1)
        .then((response) => {
          return response.json();
        })
        .then((responseJSON) => {
          if (responseJSON.value !== undefined) {
            let projects: IProject[] = new Array();
            responseJSON.value.map((project, index) => {
              let projectObject: IProject = {
                Id: project.Id,
                Title: project.Title,
                JobID: project[`${Constants.jobID}`],
                ProductType: project[`${Constants.productType}`],
                ProjectType: project[`${Constants.projectType}`],
                BuildingType: project[`${Constants.buildingType}`],
                ContractValue: project[`${Constants.contractValue}`],
                SPM: project[`${Constants.spm}`],
                PM: project[`${Constants.pm}`],
              };
              projects.push(projectObject);
            });
            this.setState({
              projects
            }, () => { this._createJSXForProjects(); });

          }
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  public componentDidMount() {
    if (this.props.listName !== undefined && this.props.listName !== null && this.props.listName !== "") {
      this._getProjectsData();
    }
  }

  public render(): React.ReactElement<IProjectSearchProps> {
    return (
      <div className="projectSearchSection">
        <div className="projectSearchHeader">
          <span className="wpHeader">{this.props.title}</span>
        </div>
        <div className="searchElements">
          <SearchBox
            placeholder="JOB ID"
            onEscape={ev => {
              console.log('Custom onEscape Called');
            }}
            onClear={ev => {
              console.log('Custom onClear Called');
            }} 
            onChange={newValue => this._getSearchResult(newValue)}                     
          />
        </div>
        <div className="projectSearchResult">
          {this.state.projectsHTML}
        </div>
        <Dialog
          hidden={this.state.hideDialog}
          onDismiss={this._closeDialog}
          dialogContentProps={{
            type: DialogType.normal
          }}
          modalProps={{
            titleAriaId: 'myLabelId',
            subtitleAriaId: 'mySubTextId',
            isBlocking: false,
            containerClassName: 'ms-dialogMainOverrideProjects'
          }}
        >
          {this.state.projectsHtmlModal}
        </Dialog>
      </div>
    );
  }
}
