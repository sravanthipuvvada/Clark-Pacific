import * as React from 'react';
import styles from '../AppCustomizer.module.scss';
import { ITenantGlobalHeaderBarProps } from './ITenantGlobalHeaderBarProps';
import { ITenantGlobalHeaderBarState } from './ITenantGlobalHeaderBarState';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { CommandBarButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';

export default class TenantGlobalHeaderBar extends React.Component<ITenantGlobalHeaderBarProps, ITenantGlobalHeaderBarState> {
    //Main constructor for the component 
    constructor(props:ITenantGlobalHeaderBarProps) {     
      super(props);
      this.state = {  
        showPanel:false, 
      };
    }
    private _onShowPanel = (): void => {
        this.setState({ showPanel: true });
        this._getAllApps();
    }

    private _onClosePanel = (): void => {
        this.setState({ showPanel: false });
    }

    private _onRenderFooterContent = (): JSX.Element => {
    return (
        <div>
            <DefaultButton onClick={this._onClosePanel}>Close</DefaultButton>
        </div>
        );
    }
    private _getAllApps(){


    }
    public render(): React.ReactElement<ITenantGlobalHeaderBarProps> {     
        const resourceClicked = (): void => {
           window.open("https://clarkpacific.sharepoint.com/Resources/Forms/AllItems.aspx");
        };
        const searchClicked = (): void => {
            window.open("https://clarkpacific.sharepoint.com/_layouts/15/search.aspx");
        };
        return (
            <div className="quickMenu"  style={{ right: '20px', position: 'absolute' }}>
                <div style={{ display: 'flex', alignItems: 'stretch', height: '35px' }}>            
                    <CommandBarButton data-automation-id="test2" iconProps={{ iconName: 'NugetLogo' }}  text="Apps" onClick={this._onShowPanel} style={{backgroundColor: 'white'}}  />
                    <CommandBarButton data-automation-id="test2" iconProps={{ iconName: 'Lifesaver' }}  text="Resources" onClick={resourceClicked} style={{backgroundColor: 'white'}}  />
                    <CommandBarButton data-automation-id="test2" iconProps={{ iconName: 'Warning' }}  text="Alerts" onClick={this._onShowPanel}  style={{backgroundColor: 'white'}} />
                    <CommandBarButton data-automation-id="test2" iconProps={{ iconName: 'Search' }}  text="Search" onClick={searchClicked} style={{backgroundColor: 'white'}}  />
                </div>
                <Panel
                    isOpen={this.state.showPanel}
                    type={PanelType.smallFixedFar}
                    onDismiss={this._onClosePanel}
                    headerText="All Apps"
                    closeButtonAriaLabel="Close"
                    onRenderFooterContent={this._onRenderFooterContent}>                     
               </Panel>
          </div>
        );        
    } 
}