import * as React from 'react';
import './SocialMedia.module.scss';
import { ISocialMediaProps } from './ISocialMediaProps';
import { PivotItem, IPivotItemProps, Pivot, PivotLinkFormat } from 'office-ui-fabric-react/lib/Pivot';
import { MessageBar, MessageBarType } from 'office-ui-fabric-react/lib/MessageBar';

//Import Child components   
import Instagram from './Instagram';
import Twitter from './Twitter';
import Facebook from './Facebook';
import Linkedin from './LinkedIn';

//This imports are used to display custom icons on Pivot Headers.
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram, faLinkedin, faLinkedinIn } from '@fortawesome/free-brands-svg-icons';


export default class SocialMedia extends React.Component<ISocialMediaProps, {}> {

  // This method is used to apply custom icons  of Facebook , Linkedin , Instagram , Twitter from FontAwsome 
  // in office ui fabric component Pivot.
  // Custom icons will be displayed on header section of Pivot.
  private _customRendererFacebook(link: IPivotItemProps, defaultRenderer: (link: IPivotItemProps) => JSX.Element): JSX.Element {
    return (
      <span>
        {defaultRenderer(link)}
        <FontAwesomeIcon icon={faFacebook} size="2x" className="facebookIcon" color="white" />
      </span>
    );
  }
  private _customRendererInstagram(link: IPivotItemProps, defaultRenderer: (link: IPivotItemProps) => JSX.Element): JSX.Element {
    return (
      <span>
        {defaultRenderer(link)}
        <FontAwesomeIcon icon={faInstagram} size="2x" className="instagramIcon" color="white" />
      </span>
    );
  }
  private _customRendererTwitter(link: IPivotItemProps, defaultRenderer: (link: IPivotItemProps) => JSX.Element): JSX.Element {
    return (
      <span>
        {defaultRenderer(link)}
        <FontAwesomeIcon icon={faTwitter} size="2x" className="twitterIcon" color="white" />
      </span>
    );
  }
  private _customRendererLinkedIn(link: IPivotItemProps, defaultRenderer: (link: IPivotItemProps) => JSX.Element): JSX.Element {
    return (
      <span>
        {defaultRenderer(link)}
        <FontAwesomeIcon icon={faLinkedinIn} size="2x" className="linkedInIcon" color="white" />
      </span>
    );
  }
  /**
   * This method is used to check how many social media feeds we need to display 
   * It also helps to determine the widht & custom color of the pivot header button .
   * If user dont give any color to the social media button , it will take the default colors .
   */
  public _checkSocialMediaEnableNumber() {
    let counter = 0;
    let widthValue = 0;
    if (this.props.enableFacebook === undefined || this.props.enableFacebook == true) {
      counter++;
    }
    if (this.props.enableInstagram === undefined || this.props.enableInstagram == true) {
      counter++;
    }
    if (this.props.enableTwitter === undefined || this.props.enableTwitter == true) {
      counter++;
    }
    if (this.props.enableLinkedIn === undefined || this.props.enableLinkedIn == true) {
      counter++;
    }
    let buttonElements: any = document.querySelectorAll(".socialMediaWebpart .ms-Pivot Button");
    if (buttonElements.length > 0) {
      for (let i = 1; i <= buttonElements.length; i++) {
        if (document.querySelectorAll(`.socialMediaWebpart .ms-Pivot Button:nth-child(${i}) svg`)[0].classList.contains("facebookIcon")) {
          let buttonElement: any = document.querySelectorAll(`.socialMediaWebpart .ms-Pivot Button:nth-child(${i})`);
          this.props.facebookBackgroundColor == "" || this.props.facebookBackgroundColor === undefined ? buttonElement[0].style.backgroundColor = "#3f51b5" : buttonElement[0].style.backgroundColor = `#${this.props.facebookBackgroundColor}`;
          buttonElement[0].style.width = `${100 / counter}%`;
        }
        if (document.querySelectorAll(`.socialMediaWebpart .ms-Pivot Button:nth-child(${i}) svg`)[0].classList.contains("instagramIcon")) {
          let buttonElement: any = document.querySelectorAll(`.socialMediaWebpart .ms-Pivot Button:nth-child(${i})`);
          this.props.instagramBackgroundColor == "" || this.props.instagramBackgroundColor === undefined ? buttonElement[0].style.backgroundColor = "#c2185b" : buttonElement[0].style.backgroundColor = `#${this.props.instagramBackgroundColor}`;
          buttonElement[0].style.width = `${100 / counter}%`;
        }
        if (document.querySelectorAll(`.socialMediaWebpart .ms-Pivot Button:nth-child(${i}) svg`)[0].classList.contains("twitterIcon")) {
          let buttonElement: any = document.querySelectorAll(`.socialMediaWebpart .ms-Pivot Button:nth-child(${i})`);
          this.props.twitterBackgroundColor == "" || this.props.twitterBackgroundColor === undefined ? buttonElement[0].style.backgroundColor = "#03a9f4" : buttonElement[0].style.backgroundColor = `#${this.props.twitterBackgroundColor}`;
          buttonElement[0].style.width = `${100 / counter}%`;
        }
        if (document.querySelectorAll(`.socialMediaWebpart .ms-Pivot Button:nth-child(${i}) svg`)[0].classList.contains("linkedInIcon")) {
          let buttonElement: any = document.querySelectorAll(`.socialMediaWebpart .ms-Pivot Button:nth-child(${i})`);
          this.props.linkedInBackgroundColor == "" || this.props.linkedInBackgroundColor === undefined ? buttonElement[0].style.backgroundColor = "#0288D1" : buttonElement[0].style.backgroundColor = `#${this.props.linkedInBackgroundColor}`;
          buttonElement[0].style.width = `${100 / counter}%`;
        }
      }
    }
  }

  public componentDidMount() {
    this._checkSocialMediaEnableNumber();
  }

  /**
   * When user changes the property pane value , render method is called & it will load all the DOM element , 
   * based on the values of property pane , we will change the pivot header button.
   */
  public componentDidUpdate(prevProps, prevState) {
    this._checkSocialMediaEnableNumber();
  }


  public render(): React.ReactElement<ISocialMediaProps> {
    return (
      <div className="socialMediaWebpart">
        <Pivot linkFormat={PivotLinkFormat.tabs}>
          {this.props.enableFacebook != false
            ?
            <PivotItem className="facebookItem" id="facebookItem" onRenderItemLink={this._customRendererFacebook}>
              <Facebook {...this.props} />
            </PivotItem>
            :
            <div></div>
          }
          {
            this.props.enableInstagram != false
              ?
              <PivotItem className="twitterItem" id="twitterItem" onRenderItemLink={this._customRendererTwitter}>
                <Twitter {...this.props} />
              </PivotItem>
              :
              <div></div>
          }
          {
            this.props.enableTwitter != false
              ?
              <PivotItem className="instagramItem" id="instagramItem" onRenderItemLink={this._customRendererInstagram}>
                <Instagram {...this.props} />
              </PivotItem>
              :
              <div></div>
          }
          {
            this.props.enableLinkedIn != false
              ?
              <PivotItem className="linkedInItem" id="linkedInItem" onRenderItemLink={this._customRendererLinkedIn}>
                <Linkedin {...this.props} />
              </PivotItem>
              :
              <div></div>
          }
        </Pivot>
        {
          this.props.enableLinkedIn == false && this.props.enableTwitter == false &&
            this.props.enableInstagram == false && this.props.enableFacebook == false
            ?
            <div className="ms-socialMedia-MessageBar">
              <div className="ms-MessageBar-content">
                <div className="ms-MessageBar-text">
                  <MessageBar>Please enable a social media.</MessageBar>
                </div>
              </div>
            </div>
            :
            null
        }
      </div>
    );
  }
} 
