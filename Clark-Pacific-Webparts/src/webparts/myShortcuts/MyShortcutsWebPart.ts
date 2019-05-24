import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneChoiceGroup
} from '@microsoft/sp-webpart-base';
import { PropertyFieldNumber } from '@pnp/spfx-property-controls/lib/PropertyFieldNumber';
import * as strings from 'MyShortcutsWebPartStrings';
import MyShortcuts from './components/MyShortcuts';
import { IMyShortcutsProps } from './components/IMyShortcutsProps';

export interface IMyShortcutsWebPartProps {
  title: string;
  listName:string;
  siteUrl:string;
  titleIcon:string;
  numberOfItems:number;  
  linksType?:string;
}

export default class MyShortcutsWebPart extends BaseClientSideWebPart<IMyShortcutsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IMyShortcutsProps > = React.createElement(
      MyShortcuts,
      {
        title: this.properties.title,
        listName:this.properties.listName,
        siteUrl: this.properties.siteUrl,
        spHttpClient: this.context.spHttpClient,
        numberOfItems: this.properties.numberOfItems,
        titleIcon: this.properties.titleIcon,  
        userEmail:this.context.pageContext.user.email,        
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
                  label: strings.ListNameFieldLabel
                }),          
                PropertyFieldNumber("numberOfItems", {
                  key: "numberOfItems",
                  label: strings.NumberOfItemsLabel,
                  value: this.properties.numberOfItems,
                  minValue: 1,
                  maxValue: 20,
                  disabled: false,
                  description: "Enter a value in between 1-20"
                }),
                PropertyPaneChoiceGroup('linksType', {  
                  label: 'LinksType',  
                  options: [  
                  { key: 'Personal', text: 'Personal' },  
                  { key: 'General', text: 'General' } 
                  ]  
                })                
              ]
            }
          ]
        }
      ]
    };
  }
}
