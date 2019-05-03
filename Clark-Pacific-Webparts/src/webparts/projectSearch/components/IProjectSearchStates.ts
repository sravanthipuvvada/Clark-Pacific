export interface IProjectSearchStates {
  projects:IProject[];
  projectsHTML: any;  
  hideDialog: boolean;
  projectsHtmlModal:any;
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
}