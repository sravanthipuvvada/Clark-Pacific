declare interface ISocialMediaWebPartStrings {
  PropertyPaneDescription: string;
  TwitterGroupSettings: string;
  TwitterAccount: string;
  ErrorSelectTwitterAccount:string;
  TwitterLimit: string;
  TwitterHeader: string;
  TwitterFooter: string;
  TwitterBorders: string;
  TwitterScrollbars: string;

  InstragramGroupSettings:string;
  InstagramUserName:string;
  InsagramAccessKey:string;
  InstagramFeedLimit:string;
  InstragramOverlay:string;

  FaceBookGroupSettings:string;
  FacebookUserName:string;
  FacebookHeightFieldLabel:string;
  FacebookSmallHeaderFieldLabel:string;
  FacebookHideCoverFieldLabel:string;
  FacebookShowFacepileFieldLabel:string;
}

declare module 'SocialMediaWebPartStrings' {
  const strings: ISocialMediaWebPartStrings;
  export = strings;
}
