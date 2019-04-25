import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { PropertyFieldNumber } from '@pnp/spfx-property-controls/lib/PropertyFieldNumber';
import * as strings from 'EmployeeSpotlightWebPartStrings';
import EmployeeSpotlight from './components/EmployeeSpotlight';
import { IEmployeeSpotlightProps } from './components/IEmployeeSpotlightProps';

export interface IEmployeeSpotlightWebPartProps {
  listName: string;
  numerOfEmployee:number;
  selectSite:string;
  title: string;
  titleIcon:string;
  siteUrl:string;
  slideShowTime:number;
}

export default class EmployeeSpotlightWebPart extends BaseClientSideWebPart<IEmployeeSpotlightWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IEmployeeSpotlightProps > = React.createElement(
      EmployeeSpotlight,
      {
        listName: this.properties.listName,
        siteUrl: this.properties.siteUrl,
        spHttpClient: this.context.spHttpClient,
        numerOfEmployee:this.properties.numerOfEmployee,
        title: this.properties.title,
        titleIcon: this.properties.titleIcon,
        slideShowTime: this.properties.slideShowTime,
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
                PropertyFieldNumber("slideShowTime", {
                  key: "slideShowTime",
                  label: strings.SlideShowTime,
                  value: this.properties.slideShowTime,
                  minValue: 1,
                  maxValue: 10,
                  disabled: false,
                  description: "Enter a value in between 1-10"
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
