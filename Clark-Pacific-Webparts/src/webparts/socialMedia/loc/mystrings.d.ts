declare interface ISocialMediaWebPartStrings {
  PropertyPaneDescription: string;
  
  WebpartSettings:string;
  EnableTwitter:string;
  EnableInstagram:string;
  EnableFacebook:string;
  EnableLinkedIn:string;

  TwitterGroupSettings: string;
  TwitterAccount: string;
  ErrorSelectTwitterAccount:string;
  TwitterLimit: string;
  TwitterHeader: string;
  TwitterFooter: string;
  TwitterBorders: string;
  TwitterScrollbars: string;
  TwitterBackgroundColorLabel:string;

  InstragramGroupSettings:string;
  InstagramUserName:string;
  InsagramAccessKey:string;
  InstagramFeedLimit:string;
  InstragramOverlay:string;
  InstagramBackgroundColorLabel:string;
  
  FaceBookGroupSettings:string;
  FacebookUserName:string;
  FacebookHeightFieldLabel:string;
  FacebookSmallHeaderFieldLabel:string;
  FacebookHideCoverFieldLabel:string;
  FacebookShowFacepileFieldLabel:string;
  FacebookBackgroundColorLabel:string;

  LinkedInGroupSettings:string;
  LinkedInBackgroundColorLabel:string;
}

declare module 'SocialMediaWebPartStrings' {
  const strings: ISocialMediaWebPartStrings;
  export = strings;
}
