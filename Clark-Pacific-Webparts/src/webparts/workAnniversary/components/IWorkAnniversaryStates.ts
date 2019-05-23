

export interface IWorkAnniversaryStates {
 employees:IPersonInformation[];
 renderPersonaDetails: boolean;
 personaJSX:any;
 employeeCollection:IEmployee[];
 lastExecItemID:number;
}
export interface IPersonInformation {
  imageUrl: string;
  imageInitials: string;
  text: string;
  optionalText:string;
  showSecondaryText: boolean;
  secondaryText: string;
  tertiaryText: string;
  email:string;

}
export interface IEmployee{
  email:string;
}
export interface IWorkAnniversary{
  email:string;
  noOfYears:number;
  date:string;
}