import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { PropertyFieldNumber } from '@pnp/spfx-property-controls/lib/PropertyFieldNumber';
import * as strings from 'MyProjectsWebPartStrings';
import MyProjects from './components/MyProjects';
import { IMyProjectsProps } from './components/IMyProjectsProps';

export interface IMyProjectsWebPartProps {
  title: string;
  listName:string;
  siteUrl:string;
  titleIcon:string;
  numberOfItems:number;
}

export default class MyProjectsWebPart extends BaseClientSideWebPart<IMyProjectsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IMyProjectsProps > = React.createElement(
      MyProjects,
      {
        title: this.properties.title,
        listName:this.properties.listName,
        siteUrl: this.properties.siteUrl,
        spHttpClient: this.context.spHttpClient,
        numberOfItems: this.properties.numberOfItems,
        titleIcon: this.properties.titleIcon,
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
                })                
              ]
            }
          ]
        }
      ]
    };
  }
}
