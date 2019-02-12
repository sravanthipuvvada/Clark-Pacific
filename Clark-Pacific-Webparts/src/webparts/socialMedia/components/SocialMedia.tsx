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
        <div className="socialMediaIcons">          
        </div>  
        <Pivot>       
          <PivotItem >
            <Facebook {...this.props} />
          </PivotItem>
          <PivotItem >
            <Twitter {...this.props} />
          </PivotItem> 
          <PivotItem >
            <Instagram {...this.props} />
          </PivotItem>
        </Pivot>
      </div>
    );
  }
} 
