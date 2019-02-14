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

  enableTwitter: boolean;
  enableInstagram: boolean;
  enableFacebook: boolean;
  enableLinkedIn: boolean;

  twitterAccount: string;
  twitterLimit: number;
  twitterHeader: boolean;
  twitterFooter: boolean;
  twitterBorders: boolean;
  twitterScrollbars: boolean;
  twitterBackgroundColor:string;

  instagramUserName: string;
  insagramAccessKey: string;
  instagramBackgroundColor:string;

  facebookUserName: string;
  facebookPageHeight: string;
  facebookPageSmallHeader?: boolean;
  facebookPageHideCover?: boolean;
  facebookPageShowFacepile?: boolean;
  facebookBackgroundColor:string;

  linkedInBackgroundColor:string;
}

export default class SocialMediaWebPart extends BaseClientSideWebPart<ISocialMediaWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ISocialMediaProps> = React.createElement(
      SocialMedia,
      {
        enableTwitter: this.properties.enableTwitter,
        enableInstagram: this.properties.enableInstagram,
        enableFacebook: this.properties.enableFacebook,
        enableLinkedIn: this.properties.enableLinkedIn,
        twitterAccount: this.properties.twitterAccount,
        twitterLimit: this.properties.twitterLimit,
        twitterHeader: this.properties.twitterHeader,
        twitterFooter: this.properties.twitterFooter,
        twitterBorders: this.properties.twitterBorders,
        twitterScrollbars: this.properties.twitterScrollbars,
        twitterBackgroundColor:this.properties.twitterBackgroundColor,
        instagramUserName: this.properties.instagramUserName,
        insagramAccessKey: this.properties.insagramAccessKey,
        instagramBackgroundColor:this.properties.instagramBackgroundColor,
        facebookUserName: this.properties.facebookUserName,
        facebookPageHeight: Number(this.properties.facebookPageHeight),
        facebookPageSmallHeader: this.properties.facebookPageSmallHeader,
        facebookPageHideCover: this.properties.facebookPageHideCover,
        facebookPageShowFacepile: this.properties.facebookPageShowFacepile,
        facebookBackgroundColor:this.properties.facebookBackgroundColor,
        linkedInBackgroundColor:this.properties.linkedInBackgroundColor
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
              groupName: strings.WebpartSettings,
              groupFields: [
                PropertyPaneToggle('enableFacebook', {
                  label: strings.EnableFacebook,
                  checked: true
                }),
                PropertyPaneToggle('enableTwitter', {
                  label: strings.EnableTwitter,
                  checked: true
                }),
                PropertyPaneToggle('enableInstagram', {
                  label: strings.EnableInstagram,
                  checked: true
                }),
                PropertyPaneToggle('enableLinkedIn', {
                  label: strings.EnableLinkedIn,
                  checked: true
                })
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
                }),
                PropertyPaneTextField('facebookBackgroundColor', {
                  label: strings.FacebookBackgroundColorLabel
                })
              ]
            },
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
                }),
                PropertyPaneTextField('twitterBackgroundColor', {
                  label: strings.TwitterBackgroundColorLabel
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
                }),
                PropertyPaneTextField('instagramBackgroundColor', {
                  label: strings.InstagramBackgroundColorLabel
                })
              ]
            },
            {
              groupName: strings.LinkedInGroupSettings,
              groupFields: [
                PropertyPaneTextField('linkedInBackgroundColor', {
                  label: strings.LinkedInBackgroundColorLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
