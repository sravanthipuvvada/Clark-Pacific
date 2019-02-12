export interface ISocialMediaProps {
  twitterAccount: string;
  twitterLimit: number;
  twitterHeader: boolean;
  twitterFooter: boolean;
  twitterBorders: boolean;
  twitterScrollbars: boolean;

  instagramUserName:string;
  insagramAccessKey:string;
  //instagramFeedLimit:number; 

  facebookUserName:string;
  facebookPageHeight: number;
  facebookPageSmallHeader?: boolean;
  facebookPageHideCover?: boolean;
  facebookPageShowFacepile?: boolean;
}
