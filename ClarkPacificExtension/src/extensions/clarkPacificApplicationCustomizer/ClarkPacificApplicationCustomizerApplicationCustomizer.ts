import * as React from 'react';
import * as ReactDom from 'react-dom';
import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  PlaceholderContent,
  PlaceholderName,
  BaseApplicationCustomizer
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';
import { SPComponentLoader } from '@microsoft/sp-loader';
import * as strings from 'ClarkPacificApplicationCustomizerApplicationCustomizerStrings';

import TenantGlobalHeaderBar from './components/TenantGlobalHeaderBar';
import { ITenantGlobalHeaderBarProps } from './components/ITenantGlobalHeaderBarProps';

import * as $ from 'jquery';

const LOG_SOURCE: string = 'ClarkPacificApplicationCustomizerApplicationCustomizer';

const rootsitecollectionUrl = "https://clarkPacific.sharepoint.com";
const listName="Apps";
const listNameAlert="Alerts";

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface IClarkPacificApplicationCustomizerApplicationCustomizerProperties {
  // This is an example; replace with your own property
  themeName: string;
}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class ClarkPacificApplicationCustomizerApplicationCustomizer
  extends BaseApplicationCustomizer<IClarkPacificApplicationCustomizerApplicationCustomizerProperties> {  

  private _bottomPlaceholder: PlaceholderContent | undefined; 
  private _topPlaceholder: PlaceholderContent | undefined; 

  @override
  public onInit(): Promise<void> {
   
    // Added to handle possible changes on the existence of placeholders
    SPComponentLoader.loadCss(rootsitecollectionUrl + '/Style Library/ClarkPacificBranding/css/main.css');
    if (this.properties.themeName == "hub"){
       SPComponentLoader.loadCss(rootsitecollectionUrl + '/Style Library/ClarkPacificBranding/themes/hub.css'); 
    }
    else {
        SPComponentLoader.loadCss(rootsitecollectionUrl + '/Style Library/ClarkPacificBranding/themes/default.css'); 
    } 

    try
    {
      SPComponentLoader.loadScript(rootsitecollectionUrl + '/_layouts/15/init.js', {
          globalExportsName: '$_global_init',
      })
      .then((): Promise<{}> => {
        return SPComponentLoader.loadScript(rootsitecollectionUrl + '/Style Library/ClarkPacificBranding/scripts/jquery.min.js', {
            globalExportsName: 'jQuery'
        });
      })       
      .then((): Promise<{}> => {
        return SPComponentLoader.loadScript(rootsitecollectionUrl + '/Style Library/ClarkPacificBranding/scripts/bootstrap.min.js', {
            globalExportsName: 'jQuery'
        });
      })         
      .then((): Promise<{}> => {
        return SPComponentLoader.loadScript(rootsitecollectionUrl + '/Style Library/ClarkPacificBranding/scripts/global.js', {
            globalExportsName: 'jQuery'
        });
      });    
    }
    catch(error)
    {
      console.log("loading script error");
    }     
   
    const head: any = document.getElementsByTagName("head")[0] || document.documentElement;
    let scriptTag: HTMLScriptElement = document.createElement("script");
    scriptTag.src = rootsitecollectionUrl + "/Style Library/ClarkPacificBranding/scripts/global.js";
    scriptTag.type = "text/javascript";
    head.insertAdjacentElement("beforeEnd", scriptTag);  
    
    // Call render method for generating the needed html elements
    this._renderPlaceHolders();    
    return Promise.resolve<void>();    
  }


  private _renderPlaceHolders(): void {
     // Handling the bottom placeholder
     if (!this._topPlaceholder) {
      this._topPlaceholder =
        this.context.placeholderProvider.tryCreateContent(
          PlaceholderName.Top,
          { onDispose: this._onDispose });

      // The extension should not assume that the expected placeholder is available.
      if (!this._topPlaceholder) {
        console.error('The expected placeholder (Bottom) was not found.');
        return;
      }      
      const element: React.ReactElement<ITenantGlobalHeaderBarProps> = React.createElement(
        TenantGlobalHeaderBar,
        {      
          rootSiteUrl:rootsitecollectionUrl,  
          siteUrl: this.context.pageContext.web.absoluteUrl,          
          spHttpClient: this.context.spHttpClient,
          listName:listName,
          listNameAlert:listNameAlert   
        }
      );         
      ReactDom.render(element,this._topPlaceholder.domElement);            
     }
    
     // Handling the bottom placeholder
     if (!this._bottomPlaceholder) {
        this._bottomPlaceholder =
          this.context.placeholderProvider.tryCreateContent(
            PlaceholderName.Bottom,
            { onDispose: this._onDispose });
  
        // The extension should not assume that the expected placeholder is available.
        if (!this._bottomPlaceholder) {
          console.error('The expected placeholder (Bottom) was not found.');
          return;
        }             
        this._bottomPlaceholder.domElement.innerHTML="<div></div>";
      }
    }

    private _onDispose(): void {
      //console.log('[TenantGlobalNavBarApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
    }  
}
