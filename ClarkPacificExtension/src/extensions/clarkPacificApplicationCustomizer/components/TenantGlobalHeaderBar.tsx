import * as React from 'react';
import styles from '../AppCustomizer.module.scss';
import './AppExtension.module.scss';
import { ITenantGlobalHeaderBarProps } from './ITenantGlobalHeaderBarProps';
import { ITenantGlobalHeaderBarState } from './ITenantGlobalHeaderBarState';
import { IApps, IAlert } from './ITenantGlobalHeaderBarState';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { CommandBarButton, IButtonProps } from 'office-ui-fabric-react/lib/Button';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { SPHttpClient } from '@microsoft/sp-http';
import { Dialog, DialogType, DialogFooter } from 'office-ui-fabric-react/lib/Dialog';
import { MessageBar} from 'office-ui-fabric-react/lib/MessageBar';

export default class TenantGlobalHeaderBar extends React.Component<ITenantGlobalHeaderBarProps, ITenantGlobalHeaderBarState> {
    //Main constructor for the component 
    constructor(props: ITenantGlobalHeaderBarProps) {
        super(props);
        this.state = {
            showPanel: false,
            showPanelAlert: false,
            apps: [],
            appsHTML: null,
            alerts: [],
            alertsHTML: null,
            hideDialog: true,
            alertHtmlModal: null
        };
    }
    //Events - Apps Panel
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
    //Get all apps Data from list
    private _getAllApps() {
        let that = this;
        let getAppsDataUrl = that.props.rootSiteUrl + `/_api/web/lists/GetByTitle('${that.props.listName}')/Items?$select=Id,Title,Link,ImageUrl,Active&$orderby=Modified desc`;
        return new Promise((resolve, reject) => {
            that.props.spHttpClient.get(getAppsDataUrl, SPHttpClient.configurations.v1)
                .then((response) => {
                    return response.json();
                })
                .then((responseJSON) => {
                    if (responseJSON.value !== undefined) {
                        let apps: IApps[] = new Array();
                        responseJSON.value.map((app, index) => {
                            let appObject: IApps = {
                                Id: app.Id,
                                Title: app.Title,
                                Link: app.Link.Url,
                                ImageUrl: app.ImageUrl.Url,
                                Active: app.Active
                            };
                            apps.push(appObject);
                        });                 
                        this.setState({
                            apps
                        }, () => {
                            that._createJSXForApps();
                        });                       
                    }
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                });
        });
    }
//Create JSX of apps to display in panel
    public _createJSXForApps(): any {
        if (this.state.apps === null || this.state.apps === undefined || this.state.apps.length === 0) {
            let appData= <MessageBar>No data found.</MessageBar>;
            this.setState({
                appsHTML: appData,
            });
        } else {
            let appsData: JSX.Element[] = this.state.apps.map((appItem, index) => {
                return (
                    <div className="appImage">
                        <a href={appItem.Link} className="appAnchor">
                            <img alt={appItem.Title} src={appItem.ImageUrl} data-image={appItem.ImageUrl} />
                            <span className="appTitle">{appItem.Title}</span>
                        </a>
                    </div>
                );
            });
            if (appsData.length > 0) {
                this.setState({
                    appsHTML: appsData,
                });
            }
        }
    }
    //Events - Alert Panel
    private _onShowPanelAlert = (): void => {
        this.setState({ showPanelAlert: true });
        this._getAllAlerts();
    }

    private _onClosePanelAlert = (): void => {
        this.setState({ showPanelAlert: false });
    }

    private _onRenderFooterContentAlert = (): JSX.Element => {
        return (
            <div>
                <DefaultButton onClick={this._onClosePanelAlert}>Close</DefaultButton>
            </div>
        );
    }
      //Get all Alerts Data from list
    private _getAllAlerts() {
        let that = this;
        let getAlertsDataUrl = that.props.rootSiteUrl + `/_api/web/lists/GetByTitle('${that.props.listNameAlert}')/Items?$select=Id,Title,Description,Status&$orderby=Modified desc&$Filter=Status eq 'Active'`;
        return new Promise((resolve, reject) => {
            that.props.spHttpClient.get(getAlertsDataUrl, SPHttpClient.configurations.v1)
                .then((response) => {
                    return response.json();
                })
                .then((responseJSON) => {
                    if (responseJSON.value !== undefined) {
                        let alerts: IAlert[] = new Array();
                        responseJSON.value.map((app, index) => {
                            let alertObject: IAlert = {
                                Id: app.Id,
                                Title: app.Title,
                                Description: app.Description,
                                Status: app.Status
                            };
                            alerts.push(alertObject);
                        });
                        this.setState({
                            alerts
                        }, () => {
                            that._createJSXForAlerts();
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                });
        });
    }
    //Create JSX of alerts to display in panel
    public _createJSXForAlerts(): any {
        if (this.state.alerts === null || this.state.alerts === undefined || this.state.alerts.length === 0) {
            let alertData= <MessageBar>No data found.</MessageBar>;
            this.setState({
                alertsHTML: alertData,
            });
        } else {
            let alertsData: JSX.Element[] = this.state.alerts.map((alertItem, index) => {
                const onPopupClick = (): any => {
                    this._showDialogModal(alertItem);
                };
                return (
                    <div className="alertItem" onClick={onPopupClick}>
                        <span className="alertTitle"><i className="fa fa-bell-o alertIcon" aria-hidden="true"></i> {alertItem.Title}</span>
                    </div>
                );
            });
            if (alertsData.length > 0) {
                this.setState({
                    alertsHTML: alertsData,
                });
            }
        }
    }
    //Modal Dialog Events
    public _showDialog = (): void => {
        this.setState({ hideDialog: false });
    }
    public _closeDialog = (): void => {
        this.setState({ hideDialog: true });
    }
    public _showDialogModal = (item): any => {
        this.setState({
            hideDialog: false
        }, () => { this.createModalContent(item); }); 
    }
    //Create JSX popup data of alert to display in panel
    public createModalContent(item): any {
        if (item === null || item === undefined) {
            let alertData= <MessageBar>No data found.</MessageBar>;
            this.setState({
                alertHtmlModal: alertData,
            });
        } else {
            let alertData: JSX.Element = <div className="alertPopUpData">
                <div className="alertPDTitle"><span className="popbold">Title: </span>{item.Title}</div>
                <div className="alertPDDescription"><span className="popbold">Description :  </span>{item.Description}</div>
            </div>;
            if (alertData) {
                this.setState({
                    alertHtmlModal: alertData,
                });
            }
        }
    }

    public render(): React.ReactElement<ITenantGlobalHeaderBarProps> {
        const resourceClicked = (): void => {
            window.open("https://clarkpacific.sharepoint.com/Resources/Forms/AllItems.aspx");
        };
        const searchClicked = (): void => {
            window.open("https://clarkpacific.sharepoint.com/_layouts/15/search.aspx");
        };
        return (
            <div className="quickMenu" style={{ right: '20px', position: 'absolute' }}>
                <div style={{ display: 'flex', alignItems: 'stretch', height: '35px' }}>
                    <CommandBarButton data-automation-id="test2" iconProps={{ iconName: 'NugetLogo' }} text="Apps" onClick={this._onShowPanel} style={{ backgroundColor: 'white' }} />
                    <CommandBarButton data-automation-id="test2" iconProps={{ iconName: 'Lifesaver' }} text="Resources" onClick={resourceClicked} style={{ backgroundColor: 'white' }} />
                    <CommandBarButton data-automation-id="test2" iconProps={{ iconName: 'Warning' }} text="Alerts" onClick={this._onShowPanelAlert} style={{ backgroundColor: 'white' }} />
                    <CommandBarButton data-automation-id="test2" iconProps={{ iconName: 'Search' }} text="Search" onClick={searchClicked} style={{ backgroundColor: 'white' }} />
                </div>
                <Panel
                    isOpen={this.state.showPanel}
                    type={PanelType.smallFixedFar}
                    onDismiss={this._onClosePanel}
                    headerText="All Apps"
                    closeButtonAriaLabel="Close"
                    onRenderFooterContent={this._onRenderFooterContent}>
                    <div className="appSection">
                        {this.state.appsHTML}
                    </div>
                </Panel>
                <Panel
                    isOpen={this.state.showPanelAlert}
                    type={PanelType.smallFixedFar}
                    onDismiss={this._onClosePanelAlert}
                    headerText="All Alerts"
                    closeButtonAriaLabel="Close"
                    onRenderFooterContent={this._onRenderFooterContentAlert}>
                    <div className="alertSection">
                        {this.state.alertsHTML}
                    </div>
                </Panel>
                <Dialog
                    hidden={this.state.hideDialog}
                    onDismiss={this._closeDialog}
                    dialogContentProps={{
                        type: DialogType.normal
                    }}
                    modalProps={{
                        titleAriaId: 'myLabelId',
                        subtitleAriaId: 'mySubTextId',
                        isBlocking: false,
                        containerClassName: 'ms-dialogMainOverrideEvents'
                    }}
                >
                    {this.state.alertHtmlModal}
                </Dialog>
            </div>
        );
    }
}
