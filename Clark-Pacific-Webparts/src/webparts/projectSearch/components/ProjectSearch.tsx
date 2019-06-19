import * as React from 'react';
import './ProjectSearch.module.scss';
import { IProjectSearchProps } from './IProjectSearchProps';
import { IProjectSearchStates, IProject, IDropDown } from './IProjectSearchStates';
import { escape } from '@microsoft/sp-lodash-subset';
import { SPHttpClient } from '@microsoft/sp-http';
import Constants from "../../../constants/constant";
import { MessageBar } from 'office-ui-fabric-react/lib/MessageBar';
import { SearchBox } from 'office-ui-fabric-react/lib/SearchBox';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Dropdown, DropdownMenuItemType, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { default as pnp, ItemAddResult, Web, List, Item } from "sp-pnp-js";

export default class ProjectSearch extends React.Component<IProjectSearchProps, IProjectSearchStates> {
  constructor(props) {
    super(props);
    this.state = {
      projects: [],
      allProjects: [],
      projectsHTML: null,
      projectsHtmlModal: null,
      showPanel: false,
      projectType: [],
      productType: [],
      buildingType: [],
      contractValue: [],
      selectedProductType: null,
      selectedBuildingType: null,
      selectedContractValue: null,
      selectedProjectType: null,
    };
    this._onDrpDownProductChange = this._onDrpDownProductChange.bind(this);
    this._onDrpDownBuildingChange = this._onDrpDownBuildingChange.bind(this);
    this._onDrpDownContractValueChange = this._onDrpDownContractValueChange.bind(this);
    this._onChoiceProjectTypeChange = this._onChoiceProjectTypeChange.bind(this);

  }

  //Get Projects details from list 
  public _getProjectsData() {
    let that = this;
    let getProjectDataUrl = that.props.siteUrl + `/_api/web/lists/GetByTitle('${that.props.listName}')/Items?$select=Id,Title,${Constants.projectType},${Constants.productType},${Constants.buildingType},${Constants.contractValue},${Constants.jobID},${Constants.projectSiteLink},${Constants.spm}/Id,${Constants.spm}/Title,${Constants.spm}/EMail,${Constants.pm}/Id,${Constants.pm}/Title,${Constants.pm}/EMail,${Constants.members}/Id,${Constants.members}/Title,${Constants.members}/EMail&$expand=${Constants.spm},${Constants.pm},${Constants.members}&$orderby=${Constants.modified} desc&$top=20`;
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
                SPM: project.SPM.Title,
                PM: project.PM.Title,
                ProjectSiteLink: project.ProjectSiteLink.Url,
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

  //Create JSX of projects to display in result tiles
  public _createJSXForProjects(): any {
    if (this.state.projects === null || this.state.projects === undefined || this.state.projects.length === 0) {
      let projectData = <MessageBar>No data found.</MessageBar>;
      this.setState({
        projectsHTML: projectData,
      });
    } else {
      let projectData: JSX.Element[] = this.state.projects.map((projectItem, index) => {
        const onPopupClick = (): any => {
          window.open(projectItem.ProjectSiteLink);
        };
        return (
          <div className="projectTile" onClick={onPopupClick}>
            <span className="projectTitle">{projectItem.Title}</span>
            <div className="projectDetails">
              <span className="projectItemInfo">JobID : {projectItem.JobID}</span>
              <span className="projectItemInfo">SPM : {projectItem.SPM}</span>
              <span className="projectItemInfo">PM : {projectItem.PM}</span>
              <span className="projectItemInfo">ProjectType : {projectItem.ProjectType}</span>
              <span className="projectItemInfo">ProductType : {projectItem.ProductType}</span>
              <span className="projectItemInfo">BuildingType : {projectItem.BuildingType}</span>
              <span className="projectItemInfo">ContractValue : {projectItem.ContractValue}</span>
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
  public _showDialogModal = (item): any => {
    this.setState({
      showPanel: true
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
        <div className="projectTitle"><span className="popbold">Title : </span><a href={item.ProjectSiteLink}>{item.Title}</a></div>
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
  public _getSearchResult(searchItem): any {
    let that = this;
    let getProjectDataUrl;
    if (searchItem) {
      getProjectDataUrl = that.props.siteUrl + `/_api/web/lists/GetByTitle('${that.props.listName}')/Items?$select=Id,Title,${Constants.projectType},${Constants.productType},${Constants.buildingType},${Constants.contractValue},${Constants.jobID},${Constants.projectSiteLink},${Constants.spm}/Id,${Constants.spm}/Title,${Constants.spm}/EMail,${Constants.pm}/Id,${Constants.pm}/Title,${Constants.pm}/EMail,${Constants.members}/Id,${Constants.members}/Title,${Constants.members}/EMail&$expand=${Constants.spm},${Constants.pm},${Constants.members}&$orderby=${Constants.modified} desc&$Filter=JOBID eq '${searchItem}'`;
    } else {
      getProjectDataUrl = that.props.siteUrl + `/_api/web/lists/GetByTitle('${that.props.listName}')/Items?$select=Id,Title,${Constants.projectType},${Constants.productType},${Constants.buildingType},${Constants.contractValue},${Constants.jobID},${Constants.projectSiteLink},${Constants.spm}/Id,${Constants.spm}/Title,${Constants.spm}/EMail,${Constants.pm}/Id,${Constants.pm}/Title,${Constants.pm}/EMail,${Constants.members}/Id,${Constants.members}/Title,${Constants.members}/EMail&$expand=${Constants.spm},${Constants.pm},${Constants.members}&$orderby=${Constants.modified} desc&$Top=20`;
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
                SPM: project.SPM.Title,
                PM: project.PM.Title,
                ProjectSiteLink: project.ProjectSiteLink.Url,
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

  //Get Projects details from list 
  public _getAllProjectsData() {
    let that = this;
    let getProjectDataUrl = that.props.siteUrl + `/_api/web/lists/GetByTitle('${that.props.listName}')/Items?$select=Id,Title,${Constants.projectType},${Constants.productType},${Constants.buildingType},${Constants.contractValue},${Constants.jobID},${Constants.projectSiteLink},${Constants.spm}/Id,${Constants.spm}/Title,${Constants.spm}/EMail,${Constants.pm}/Id,${Constants.pm}/Title,${Constants.pm}/EMail,${Constants.members}/Id,${Constants.members}/Title,${Constants.members}/EMail&$expand=${Constants.spm},${Constants.pm},${Constants.members}&$orderby=${Constants.modified} desc&$top=4999`;
    return new Promise((resolve, reject) => {
      that.props.spHttpClient.get(getProjectDataUrl, SPHttpClient.configurations.v1)
        .then((response) => {
          return response.json();
        })
        .then((responseJSON) => {
          if (responseJSON.value !== undefined) {
            let allProjects: IProject[] = new Array();
            responseJSON.value.map((project, index) => {
              let projectObject: IProject = {
                Id: project.Id,
                Title: project.Title,
                JobID: project[`${Constants.jobID}`],
                ProductType: project[`${Constants.productType}`],
                ProjectType: project[`${Constants.projectType}`],
                BuildingType: project[`${Constants.buildingType}`],
                ContractValue: project[`${Constants.contractValue}`],
                SPM: project.SPM.Title,
                PM: project.PM.Title,
                ProjectSiteLink: project.ProjectSiteLink.Url,
              };
              allProjects.push(projectObject);
            });
            this.setState({
              allProjects
            });

          }
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }


//Get Control Values
private _getControlValuesPnp(columnName): Promise<IProject[]> {
  return pnp.sp.web.lists
    .getByTitle(`${this.props.listName}`)
    .fields
    .getByInternalNameOrTitle(columnName)
    .get()
    .then((response: any[]) => {
      return response;
    });
} 

public createFilters = () => {
  let projectTypeArray: Array<IDropDown> = new Array<IDropDown>();
  let productTypeArray: Array<IDropDown> = new Array<IDropDown>();
  let buildingTypeArray: Array<IDropDown> = new Array<IDropDown>();
  let contractValueArray: Array<IDropDown> = new Array<IDropDown>();
  
  this._getControlValuesPnp('ProjectType').then((data: any) => {
    data.Choices.map(element => {
    if (element) {
      projectTypeArray.push({
      key: element,
      text: element
      });
    }
    });
  });

  this._getControlValuesPnp('ProductType').then((data: any) => {
    data.Choices.map(element => {
    if (element) {
      productTypeArray.push({
      key: element,
      text: element
      });
    }
    });
  });

  this._getControlValuesPnp('BuildingType').then((data: any) => {
    data.Choices.map(element => {
    if (element) {
      buildingTypeArray.push({
      key: element,
      text: element
      });
    }
    });
  });

  this._getControlValuesPnp('ContractValue').then((data: any) => {
    data.Choices.map(element => {
    if (element) {
      contractValueArray.push({
      key: element,
      text: element
      });
    }
    });
  });

  this.setState({
    projectType: projectTypeArray,
    productType: productTypeArray,
    buildingType: buildingTypeArray,
    contractValue: contractValueArray
  });

}
  //Create Filter parameters
  public getFilterParam(filteredProjectType,filteredProductType, filteredBuildingType, filteredContractValue): any {
    let refinerParam = ' ';
    if (filteredProductType) {
      refinerParam += filteredProductType;
    }
    if (filteredBuildingType) {
      if (filteredProductType) {
        refinerParam += ' and ' + filteredBuildingType;
      } else {
        refinerParam += filteredBuildingType;
      }
    }    
    if (filteredContractValue) {
      if (refinerParam && refinerParam != ' ') {
        refinerParam += ' and ' + filteredContractValue;
      } else {
        refinerParam = filteredContractValue;
      }
    }

    if (filteredProjectType) {
      if (refinerParam && refinerParam != ' ') {
        refinerParam += ' and ' + filteredProjectType;
      } else {
        refinerParam = filteredProjectType;
      }
    }

    return refinerParam;
  }

  //Filter Value for REST api
  public createFilterParam(refinerType, refinersValue) {
    let refinerParam = '';
    if (refinersValue && refinersValue != '') {
      if (refinerType === 'ContractValue') {
        refinerParam = refinerType + " eq '" + refinersValue + "'";
      } else {
        refinerParam = refinerType + " eq '" + refinersValue + "'";
      }
    }
    return refinerParam;
  }

  //Get project based on filter selection
  public getFilterBasedResults = () => {
    let filteredProjectType = this.createFilterParam(Constants.projectType, this.state.selectedProjectType);
    let filteredProductType = this.createFilterParam(Constants.productType, this.state.selectedProductType);
    let filteredBuildingType = this.createFilterParam(Constants.buildingType, this.state.selectedBuildingType);
    let filteredContractValue = this.createFilterParam(Constants.contractValue, this.state.selectedContractValue);

    let refinerParam = this.getFilterParam(filteredProjectType,filteredProductType, filteredBuildingType, filteredContractValue);
    let that = this;
    let getProjectDataUrl = that.props.siteUrl + `/_api/web/lists/GetByTitle('${that.props.listName}')/Items?$select=Id,Title,${Constants.projectType},${Constants.productType},${Constants.buildingType},${Constants.contractValue},${Constants.jobID},${Constants.projectSiteLink},${Constants.spm}/Id,${Constants.spm}/Title,${Constants.spm}/EMail,${Constants.pm}/Id,${Constants.pm}/Title,${Constants.pm}/EMail,${Constants.members}/Id,${Constants.members}/Title,${Constants.members}/EMail&$expand=${Constants.spm},${Constants.pm},${Constants.members}&$orderby=${Constants.modified} desc&$Filter=${refinerParam}`;

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
                SPM: project.SPM.Title,
                PM: project.PM.Title,
                ProjectSiteLink: project.ProjectSiteLink.Url,
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
  //DropDown Product Type
  private _onDrpDownProductChange(item) {
    // console.log(`Selection change: ${item.text}`);
    this.setState({
      selectedProductType: item.text
    }, () => { this.getFilterBasedResults(); });
  }
  //DropDown Building Type
  private _onDrpDownBuildingChange(item) {
    // console.log(`Selection change: ${item.text}`);
    this.setState({
      selectedBuildingType: item.text
    }, () => { this.getFilterBasedResults(); });
  }
  //DropDown Contract Value
  private _onDrpDownContractValueChange(item) {
    // console.log(`Selection change: ${item.text}`);   
    this.setState({
      selectedContractValue: item.text
    }, () => { this.getFilterBasedResults(); });
  }
  //DropDown Contract Value
  private _onChoiceProjectTypeChange(item) {
    // console.log(`Selection change: ${item.text}`);   
    this.setState({
      selectedProjectType: item.text
    }, () => { this.getFilterBasedResults(); });
  }
  
  public componentDidMount() {
    if (this.props.listName !== undefined && this.props.listName !== null && this.props.listName !== "") {
      //Get all project details and create filter based on the result
      this._getAllProjectsData();
      this.createFilters();
      //Get specific count of project as per configuration for initial load
      this._getProjectsData();
    }
  }

  public render(): React.ReactElement<IProjectSearchProps> {
    return (
      <div className="projectSearchSection">
       <div className="esHeader"> <i className="ms-Icon ms-Icon--ProjectLogoInverse esHeaderIcon" aria-hidden="true"></i>{this.props.title}</div>
        <div className="ms-Grid" dir="ltr">
          <div className="ms-Grid-row">
            <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg4 lefttPanelSection">
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
            </div>
            <div className="ms-Grid-col ms-sm12 ms-md6 ms-lg8 rightPanelSection">
              <div className="projectFilters">
                <Dropdown
                  label="Product Type"
                  options={this.state.productType}
                  onChanged={this._onDrpDownProductChange.bind(this)}
                />
                <Dropdown
                  label="Building Type"
                  options={this.state.buildingType}
                  onChanged={this._onDrpDownBuildingChange.bind(this)}
                />
                <Dropdown
                  label="Contract Value"
                  options={this.state.contractValue}
                  onChanged={this._onDrpDownContractValueChange.bind(this)}
                />
              </div>
            </div> 
            <div className="ms-Grid-col ms-sm12 ms-md12 ms-lg12 projectTypeOption">
              <ChoiceGroup
                className="defaultChoiceGroup"
                options={this.state.projectType}
                onChanged={this._onChoiceProjectTypeChange.bind(this)}
                required={false}
              />
            </div>
          </div>
        </div>
        <div className="projectSearchResult">
          {this.state.projectsHTML}
        </div>
      </div>
    );
  }
}
