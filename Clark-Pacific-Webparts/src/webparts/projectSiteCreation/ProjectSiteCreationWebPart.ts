import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

import * as strings from 'ProjectSiteCreationWebPartStrings';
import ProjectSiteCreation from './components/ProjectSiteCreation';
import { IProjectSiteCreationProps } from './components/IProjectSiteCreationProps';

export interface IProjectSiteCreationWebPartProps {
  listName: string;
  siteUrl: string;
  spHttpClient: any; 
  title: string;
  titleIcon:string;
}

export default class ProjectSiteCreationWebPart extends BaseClientSideWebPart<IProjectSiteCreationWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IProjectSiteCreationProps > = React.createElement(
      ProjectSiteCreation,
      {
        listName: this.properties.listName,
        siteUrl: this.properties.siteUrl,
        spHttpClient: this.context.spHttpClient,
        title: this.properties.title,
        titleIcon: this.properties.titleIcon,        
        context: this.context
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
              ]
            }
          ]
        }
      ]
    };
  }
}
