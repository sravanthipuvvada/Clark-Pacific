import { WebPartContext } from '@microsoft/sp-webpart-base';
export interface IProjectSiteRequestProps {
  listName: string;
  siteUrl: string;
  spHttpClient: any;
  title: string;
  titleIcon:string;  
  context: WebPartContext;
}
