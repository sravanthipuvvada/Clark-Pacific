import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneToggle
} from '@microsoft/sp-webpart-base';

import * as strings from 'SocialMediaWebPartStrings';
import SocialMedia from './components/SocialMedia';
import { ISocialMediaProps } from './components/ISocialMediaProps';

export interface ISocialMediaWebPartProps {
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
  facebookPageHeight: string;
  facebookPageSmallHeader?: boolean;
  facebookPageHideCover?: boolean;
  facebookPageShowFacepile?: boolean;
}

export default class SocialMediaWebPart extends BaseClientSideWebPart<ISocialMediaWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ISocialMediaProps> = React.createElement(
      SocialMedia,
      {
        twitterAccount:this.properties.twitterAccount,
        twitterLimit: this.properties.twitterLimit,
        twitterHeader: this.properties.twitterHeader,
        twitterFooter: this.properties.twitterFooter,
        twitterBorders: this.properties.twitterBorders,
        twitterScrollbars: this.properties.twitterScrollbars,
        instagramUserName:this.properties.instagramUserName,
        insagramAccessKey:this.properties.insagramAccessKey,
        //instagramFeedLimit:this.properties.instagramFeedLimit
        facebookUserName:this.properties.facebookUserName,
        facebookPageHeight: Number(this.properties.facebookPageHeight),
        facebookPageSmallHeader: this.properties.facebookPageSmallHeader,
        facebookPageHideCover: this.properties.facebookPageHideCover,
        facebookPageShowFacepile: this.properties.facebookPageShowFacepile
      }
    );
    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          displayGroupsAsAccordion: true,
          groups: [
            {
              groupName: strings.TwitterGroupSettings,
              groupFields: [
                PropertyPaneTextField('twitterAccount', {
                  label: strings.TwitterAccount
                }),
                PropertyPaneSlider('twitterLimit', {
                  label: strings.TwitterLimit,
                  min: 1,
                  max: 1000,
                  step: 1
                }),
                PropertyPaneToggle('twitterHeader', {
                  label: strings.TwitterHeader
                }),
                PropertyPaneToggle('twitterFooter', {
                  label: strings.TwitterFooter
                }),
                PropertyPaneToggle('twitterBorders', {
                  label: strings.TwitterBorders
                }),
                PropertyPaneToggle('twitterScrollbars', {
                  label: strings.TwitterScrollbars
                })
              ]
            },
            {
              groupName: strings.InstragramGroupSettings,
              groupFields: [
                PropertyPaneTextField('instagramUserName', {
                  label: strings.InstagramUserName
                }),
                PropertyPaneTextField('insagramAccessKey', {
                  label: strings.InsagramAccessKey
                })//,
                // PropertyPaneSlider('instagramFeedLimit', {
                //   label: strings.InstagramFeedLimit,
                //   min: 1,
                //   max: 33,
                //   step: 1,
                //   value:33
                // })
              ]
            },
            {
              groupName: strings.FaceBookGroupSettings,
              groupFields: [
                PropertyPaneTextField('facebookUserName', {
                  label: strings.FacebookUserName
                }),
                PropertyPaneTextField('height', {
                  label: strings.FacebookHeightFieldLabel
                }),
                PropertyPaneToggle('smallHeader', {
                  label: strings.FacebookSmallHeaderFieldLabel
                }),
                PropertyPaneToggle('hideCover', {
                  label: strings.FacebookHideCoverFieldLabel
                }),
                PropertyPaneToggle('showFacepile', {
                  label: strings.FacebookShowFacepileFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
