declare interface IMyProjectsWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  TitleFieldLabel:string;
  TitleIconFieldLabel:string;
  NumberOfItemsLabel:string;
  SiteURLFieldLabel:string;
  ListNameFieldLabel:string;
}

declare module 'MyProjectsWebPartStrings' {
  const strings: IMyProjectsWebPartStrings;
  export = strings;
}
