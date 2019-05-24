declare interface IMyShortcutsWebPartStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
  TitleFieldLabel:string;
  TitleIconFieldLabel:string;
  NumberOfItemsLabel:string;
  SiteURLFieldLabel:string;
  ListNameFieldLabel:string;
}

declare module 'MyShortcutsWebPartStrings' {
  const strings: IMyShortcutsWebPartStrings;
  export = strings;
}
