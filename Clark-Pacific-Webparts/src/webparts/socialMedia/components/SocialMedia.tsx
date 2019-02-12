import * as React from 'react';
import './SocialMedia.module.scss';
import { ISocialMediaProps } from './ISocialMediaProps';
import { Pivot, PivotItem } from 'office-ui-fabric-react/lib/Pivot';
 
//Import Child components 
import Instagram from './Instagram';
import Twitter from './Twitter';  
import Facebook from './Facebook'; 

export default class SocialMedia extends React.Component<ISocialMediaProps, {}> {
  public render(): React.ReactElement<ISocialMediaProps> {
    return (   
      <div className="socialMediaWebpart"> 
        <Pivot>        
          
          <PivotItem className="facebookItem" id="facebookItem">  
            <Facebook {...this.props} />
          </PivotItem>
      
          <PivotItem className="twitterItem" id="twitterItem">
            <Twitter {...this.props} />
          </PivotItem>   
   
          <PivotItem className="instagramItem" id="instagramItem">
            <Instagram {...this.props} />
          </PivotItem>
 
        </Pivot>
      </div>
    );
  }
} 
