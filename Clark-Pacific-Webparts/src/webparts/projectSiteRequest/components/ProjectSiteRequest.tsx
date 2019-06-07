import * as React from 'react';
import  {IProjectSiteRequestProps}  from './IProjectSiteRequestProps';
import { IProjectSiteRequestStates } from './IProjectSiteRequestStates';
import { escape } from '@microsoft/sp-lodash-subset';
import './ProjectSiteRequest.module.scss';
import { SPHttpClient } from '@microsoft/sp-http';

export default class ProjectSiteRequest extends React.Component<IProjectSiteRequestProps, IProjectSiteRequestStates> {
  constructor(props) {
    super(props);
    this.state = {
     data:null
    };
  }
  
  public render(): React.ReactElement<IProjectSiteRequestProps> {
    return (
        <div className="projectSiteRequestSection">
       
        </div>
    );
  }
}
