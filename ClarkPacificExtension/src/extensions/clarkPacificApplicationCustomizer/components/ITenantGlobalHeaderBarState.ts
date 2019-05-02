export interface ITenantGlobalHeaderBarState {
    // So far, it is empty
    showPanel: boolean; 
    apps:IApps[];
    appsHTML: any;    
    showPanelAlert:boolean;
    alerts:IAlert[];
    alertsHTML: any;
    hideDialog: boolean;
    alertHtmlModal:any;
}
export interface IApps{
  Id:number;
  Title:string;
  Link:string;
  ImageUrl:string;
  Active:string;
}
export interface IAlert{
    Id:number;
    Title:string;
    Description:string;
    Status:string;
  }
