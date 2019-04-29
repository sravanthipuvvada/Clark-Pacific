import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'TechAdvocatesWebPartStrings';
import TechAdvocates from './components/TechAdvocates';
import { ITechAdvocatesProps } from './components/ITechAdvocatesProps';
import { PropertyFieldNumber } from '@pnp/spfx-property-controls/lib/PropertyFieldNumber';
import { SPComponentLoader } from '@microsoft/sp-loader';
export interface ITechAdvocatesWebPartProps {
    listName: string;
    numerOfEmployee:number;
    selectSite:string;
    title: string;
    titleIcon:string;
    siteUrl:string;
}

export default class TechAdvocatesWebPart extends BaseClientSideWebPart<ITechAdvocatesWebPartProps> {
  public onInit(): Promise<void> {
    SPComponentLoader.loadCss('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css');
    return Promise.resolve();    
}
  public render(): void {
    const element: React.ReactElement<ITechAdvocatesProps > = React.createElement(
      TechAdvocates,
      {
        listName: this.properties.listName,
        siteUrl: this.properties.siteUrl,
        spHttpClient: this.context.spHttpClient,
        numerOfEmployee:this.properties.numerOfEmployee,
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
                PropertyFieldNumber("numerOfEmployee", {
                  key: "numerOfEmployee",
                  label: strings.NumerOfEmployee,
                  value: this.properties.numerOfEmployee,
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
