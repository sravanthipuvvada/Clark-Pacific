export interface ITechAdvocatesStates {
  employees:IEmployees[];
  employeeHTML: any;
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
