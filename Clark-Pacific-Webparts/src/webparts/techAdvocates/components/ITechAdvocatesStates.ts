export interface ITechAdvocatesStates {
  employees:IEmployees[];
  specificEmployee:IEmployees[];
  employeeHTML: any;
  employeeHTMLRightPanel: any;
}

export interface IEmployees{
    Id:number;
    Title:string;
    Name:string;
    EMail:string;
    EmployeePicture:string;
    Description:string;
    LinkedIn:string;
    Instagram:string;
    Twitter:string;
    Skype:string;
}
