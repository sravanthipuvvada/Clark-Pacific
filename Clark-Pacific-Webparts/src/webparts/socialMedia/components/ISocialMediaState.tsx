
import {InstagramItem} from './InstagramItem';
/**
 * Since we are fetching instagram data using API & accesstoken , we are using state variables to hold data .
 */
export default interface ISocialMediaState{
    instagramItems:InstagramItem[];
}

