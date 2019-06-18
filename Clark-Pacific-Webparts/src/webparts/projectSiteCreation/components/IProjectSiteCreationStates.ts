export interface IProjectSiteCreationStates {
  uniqueValue:boolean;
  hideDialog: boolean;
  data:string;
  siteTypeErrorMessage:string;
  siteTitleErrorMessage:string;
  sitURLErrorMessage:string;
  productTypeErrorMessage:string;
  buildingTypesErrorMessage:string;
  contractValueErrorMessage:string;
  deliveryModeErrorMessage:string;
  clientErrorMessage:string;
  
  jurisdictionUserEmail:string;
  spmUserEmail:string;
  pmUserEmail:string;
  apmUserEmail:string;
  peUserEmail:string;

  jobIdErrorMessage:string;
  siteType:string;
  siteTitle:string;
  siteURL:string;
  client:string;
 

  jurisdictionUserId: Number;
  spmUserId:Number;
  pmUserId:Number;
  apmUserId:Number;
  peUserId:Number;
  jobId:string;
  memberUsersIdArray:{}[];
  memberUsersEmailArray:string[];

 
  selectedSiteType:string;
  selectedProductType:string;
  selectedBuildingType: string;
  selectedContractValue:string;
  selectedDeliveryMethodValue:string;
  productType:IDropDown[];
  projectType:IDropDown[];
  buildingType:IDropDown[];
  contractValue:IDropDown[];
  deliveryMode:IDropDown[];
 }
 
 export interface ISPListColumn {
     ID: string;
     ProductType: string;
     ProjectType: string;
     BuildingType:string;
     ContractValue:string;
     DeliveryMode:string;
   }
 
 export interface IDropDown{
     key:string;
     text:string;
}

export interface IUserEmails{
    userId:number;
    email:string;
}

