export interface IProjectSearchStates {
  projects:IProject[];
  allProjects:IProject[];
  projectsHTML: any;  
  projectsHtmlModal:any;
  showPanel: boolean;
  productType:IDropDown[];
  buildingType:IDropDown[];
  contractValue:IDropDown[];
  projectType:IDropDown[];
  selectedProductType:string;
  selectedBuildingType:string;
  selectedContractValue:string;
  selectedProjectType:string;
}

export interface IProject{
    Id:number;
    Title:string;
    JobID:string;
    ProjectType:string;
    ProductType:string;
    BuildingType:string;
    ContractValue:number;
    SPM:string;
    PM:string;
    ProjectSiteLink:string;
}
export interface IDropDown{
  key:string;
  text:string;
}