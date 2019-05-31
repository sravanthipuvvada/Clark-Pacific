import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneChoiceGroup
} from '@microsoft/sp-webpart-base';

import * as strings from 'MyFavoritesWebPartStrings';
import MyFavorites from './components/MyFavorites';
import { IMyFavoritesProps } from './components/IMyFavoritesProps';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { PropertyFieldNumber } from '@pnp/spfx-property-controls/lib/PropertyFieldNumber';
export interface IMyFavoritesWebPartProps {
  title?:string;
  listName?:string;
  limit?:string;
  numerOfLinks:number;
  linksType:string;
  siteUrl:string;
  titleIcon:string;
}

export default class MyFavoritesWebPart extends BaseClientSideWebPart<IMyFavoritesWebPartProps> {
  public onInit(): Promise<void> {
    SPComponentLoader.loadCss('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css');
    return Promise.resolve();    
}
  public render(): void {
    const element: React.ReactElement<IMyFavoritesProps > = React.createElement(
      MyFavorites,
      {
        title: this.properties.title,
        siteUrl: this.properties.siteUrl,
        titleIcon: this.properties.titleIcon,  
        displayMode: this.displayMode,
        hideDialog:false,
        hideDialogNew:false,
        updateProperty: (value: string) => {
          this.properties.title = value;
        },
        listName:this.properties.listName,      
        userEmail:this.context.pageContext.user.email,
        numerOfLinks:this.properties.numerOfLinks,        
        linksType:this.properties.linksType,
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
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [ 
                PropertyPaneTextField('title', {
                  label: strings.TitleFieldLabel
                }),
                PropertyPaneTextField('titleIcon', {
                  label: strings.TitleIconFieldLabel
                }),
                PropertyPaneTextField('siteUrl', {
                  label: strings.SiteURLFieldLabel
                }),                
                PropertyPaneTextField('listName', {
                  label: 'List Name'
                }),             
                PropertyPaneChoiceGroup('linksType', {  
                  label: 'Link Type',  
                  options: [  
                  { key: 'Personal', text: 'Personal' },  
                  { key: 'General', text: 'General' } 
                  ]  
                }),
                PropertyFieldNumber("numerOfLinks", {
                  key: "numerOfNews",
                  label: strings.NumerOfLinks,
                  value: this.properties.numerOfLinks,
                  minValue: 1,
                  maxValue: 10,
                  disabled: false,
                  description: "Enter a value in between 1-10"
                })          
              ]
            }
          ]
        }
      ]
    };
  }
}
