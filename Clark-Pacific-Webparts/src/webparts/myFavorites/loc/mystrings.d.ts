declare interface IMyFavoritesWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  NumerOfLinks:string;
  TitleFieldLabel:string;
  TitleIconFieldLabel:string;
  NumberOfItemsLabel:string;
  SiteURLFieldLabel:string;
  ListNameFieldLabel:string;
}

declare module 'MyFavoritesWebPartStrings' {
  const strings: IMyFavoritesWebPartStrings;
  export = strings;
}
