export interface ISocialMediaProps {
  enableTwitter:boolean;
  enableInstagram:boolean;
  enableFacebook:boolean;
  enableLinkedIn:boolean;

  twitterAccount: string;
  twitterLimit: number;
  twitterHeader: boolean;
  twitterFooter: boolean;
  twitterBorders: boolean;
  twitterScrollbars: boolean;
  twitterBackgroundColor:string;

  instagramUserName:string;
  insagramAccessKey:string;
  instagramBackgroundColor:string;

  facebookUserName:string;
  facebookPageHeight: number;
  facebookPageSmallHeader?: boolean;
  facebookPageHideCover?: boolean;
  facebookPageShowFacepile?: boolean;
  facebookBackgroundColor:string;

  linkedInBackgroundColor:string;
}
