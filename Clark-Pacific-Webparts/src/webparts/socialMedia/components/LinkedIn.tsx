import * as React from 'react';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';
import './SocialMedia.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fab, faLinkedin, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { LinkedIn } from 'react-linkedin-login-oauth2';
import LinkedinSDK from 'react-linkedin-sdk';

export default class Linkedin extends React.Component<any, any>{


    public componentDidMount() {
        this._getInstagramFeeds();
    }
    
    public _getInstagramFeeds() {
        return new Promise((resolve, reject) => {
          fetch(`https://www.linkedin.com/oauth/v2/accessToken?grant_type=client_credentials&client_id=81a7tcww23isbl&client_secret=o62R28yXssrcbTho`, {
            method: 'POST'
          }).then((response) => {
            return response.json();
          })
            .catch((error) => {
              console.log(error);
            });
        });
      }

    public render() {
        return ( 
            <div>
                <div className="ms-MessageBar-content">
                    <div className="ms-MessageBar-text">
                        <MessageBar>LinkedIn data not found.</MessageBar>
                    </div>
                </div>
            </div>
        );
    }
}
