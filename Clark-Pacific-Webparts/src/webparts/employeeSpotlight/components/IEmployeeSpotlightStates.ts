export interface IEmployeeSpotlightStates {
  employees:IEmployees[];
  employeeHTML: any;
  employeeDotHTML: any;
}

export interface IEmployees{
    Id:number;
    Title:string;
    Name:string;
    EMail:string;
    EmployeePicture:string;
    Description:string;
    JobTitle:string;
    Department:string;
}
