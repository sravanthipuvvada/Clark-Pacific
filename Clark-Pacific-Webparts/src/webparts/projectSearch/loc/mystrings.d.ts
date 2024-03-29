declare interface IProjectSearchWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  TitleFieldLabel:string;
  TitleIconFieldLabel:string;
  SiteURLFieldLabel:string;
  ListNameLabel:string;
  NumberOfRecordsLabel:string; 
}

declare module 'ProjectSearchWebPartStrings' {
  const strings: IProjectSearchWebPartStrings;
  export = strings;
}
