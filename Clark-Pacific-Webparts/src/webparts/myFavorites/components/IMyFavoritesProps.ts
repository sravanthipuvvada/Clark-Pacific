import { DisplayMode } from '@microsoft/sp-core-library';
export interface IMyFavoritesProps {
  siteUrl?:string;
  title: string;
  displayMode: DisplayMode;
  updateProperty: (value: string) => void;
  hideDialog: boolean;
  listName:string;
  userEmail:string;
  hideDialogNew: boolean;
  numerOfLinks:number;
  linksType:string;
  titleIcon:string;
}
