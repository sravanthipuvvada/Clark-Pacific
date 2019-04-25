declare interface IEmployeeSpotlightWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  TitleFieldLabel:string;
  TitleIconFieldLabel:string;
  SiteURLFieldLabel:string;
  ListNameLabel:string;
  NumerOfEmployee:string;  
  SlideShowTime:string;
}

declare module 'EmployeeSpotlightWebPartStrings' {
  const strings: IEmployeeSpotlightWebPartStrings;
  export = strings;
}
