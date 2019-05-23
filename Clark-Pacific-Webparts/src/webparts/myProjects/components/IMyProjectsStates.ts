export interface IMyProjectsStates {
    projectItems: IProjectItem[];
    projectJSX: any;
}

export interface IProjectItem {
    Id: number;
    Title: string;
    JobID:string;
    ProjectType:string;
    BuildingType:string;
    ProductType:string;
    ProjectLinkUrl:string;
    ContractValue:string;
}