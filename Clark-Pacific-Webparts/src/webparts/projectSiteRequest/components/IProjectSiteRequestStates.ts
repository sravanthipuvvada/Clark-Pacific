export interface IProjectSiteRequestStates {
 data:string;
 siteTypeErrorMessage:string;
 siteTitleErrorMessage:string;
 sitURLErrorMessage:string;
 productTypeErrorMessage:string;
 buildingTypesErrorMessage:string;
 contractValueErrorMessage:string;
 jurisdictionErrorMessage:string;
 deliveryModeErrorMessage:string;
 clientErrorMessage:string;
 spmErrorMessage:string;
 pmErrorMessage:string;
 apmErrorMessage:string;
 peErrorMessage:string;
 membersErrorMessage:string;
 jurisdictionUserEmail:string;
 spmUserEmail:string;
 pmUserEmail:string;
 apmUserEmail:string;
 peUserEmail:string;
 memberUsersEmailArray:{}[];
 jobIdErrorMessage:string;

 jurisdictionUserId: Number;
 spmUserId:Number;
 pmUserId:Number;
 apmUserId:Number;
 peUserId:Number;
 jobId:Number;
 memberUsersIdArray:{}[];

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