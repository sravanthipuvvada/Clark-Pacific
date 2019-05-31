
export interface IMyFavoritesStates{
  hideDialog: boolean;
  hideDialogNew: boolean;
  linksHTML:string;
  links:Ilink[];
  selectionDetails: {};
  items: {}[];
  hideEditDialog: boolean;
  editLinkTitle:string;
  editLinkUrl:string;
  titleErrorMessage:string;
  URLErrorMessage:string;
  editTitleErrorMessage:string;
  editURLErrorMessage:string;
}
export interface Ilink{
  ID:string;
  Title:string;
  Url:IUrl;
}
export interface IUrl{
  Url:string;
}



