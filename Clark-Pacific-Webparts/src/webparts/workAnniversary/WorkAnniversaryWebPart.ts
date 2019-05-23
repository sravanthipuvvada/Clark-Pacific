import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'WorkAnniversaryWebPartStrings';
import WorkAnniversary from './components/WorkAnniversary';
import { IWorkAnniversaryProps } from './components/IWorkAnniversaryProps';

export interface IWorkAnniversaryWebPartProps {
  numberOfEmployee:string;
  title:string;
  titleIcon:string;
  siteUrl:string;
  workAnniversaryList:string;
  lastExecutionList:string;
}

export default class WorkAnniversaryWebPart extends BaseClientSideWebPart<IWorkAnniversaryWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IWorkAnniversaryProps > = React.createElement(
      WorkAnniversary,
      {
        numberOfEmployee:this.properties.numberOfEmployee,
        title: this.properties.title,
        titleIcon: this.properties.titleIcon,
        siteUrl:this.properties.siteUrl,        
        spHttpClient: this.context.spHttpClient,
        workAnniversaryList:this.properties.workAnniversaryList,  
        lastExecutionList:this.properties.lastExecutionList,  
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
                  label:'Webpart Title'
                }),
                PropertyPaneTextField('titleIcon', {
                  label:'Webpart Title Icon'
                }),
                PropertyPaneTextField('numberOfEmployee', {
                  label: 'No. Of Employees'
                }),
                PropertyPaneTextField('siteUrl', {
                  label: 'Site Url'
                }),
                PropertyPaneTextField('workAnniversaryList', {
                  label: 'Work Anniversary List Name'
                }),
                PropertyPaneTextField('lastExecutionList', {
                  label: 'Last Execution List Name'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
