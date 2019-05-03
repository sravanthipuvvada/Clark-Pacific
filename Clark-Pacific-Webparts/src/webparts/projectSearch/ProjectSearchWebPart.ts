import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import * as strings from 'ProjectSearchWebPartStrings';
import ProjectSearch from './components/ProjectSearch';
import { IProjectSearchProps } from './components/IProjectSearchProps';
import { PropertyFieldNumber } from '@pnp/spfx-property-controls/lib/PropertyFieldNumber';

export interface IProjectSearchWebPartProps {
  listName: string;
  siteUrl: string;
  spHttpClient: any;
  numberOfRecords:number;
  title: string;
  titleIcon:string;
}

export default class ProjectSearchWebPart extends BaseClientSideWebPart<IProjectSearchWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IProjectSearchProps > = React.createElement(
      ProjectSearch,
      {     
        listName: this.properties.listName,
        siteUrl: this.properties.siteUrl,
        spHttpClient: this.context.spHttpClient,
        numberOfRecords:this.properties.numberOfRecords,
        title: this.properties.title,
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
                  label: strings.ListNameLabel
                }),
                PropertyFieldNumber("numberOfRecords", {
                  key: "numberOfRecords",
                  label: strings.NumberOfRecords,
                  value: this.properties.numberOfRecords,
                  minValue: 1,
                  maxValue: 20,
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
