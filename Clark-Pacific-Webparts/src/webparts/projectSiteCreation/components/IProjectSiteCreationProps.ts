import { WebPartContext } from '@microsoft/sp-webpart-base';
export interface IProjectSiteCreationProps {
  listName: string;
  siteUrl: string;
  spHttpClient: any;
  title: string;
  titleIcon:string;  
  context: WebPartContext;
}
