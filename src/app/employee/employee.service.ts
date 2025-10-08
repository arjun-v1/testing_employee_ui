import { Injectable } from "@angular/core";
import  {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

export interface Company{
    id:number;
    name:string;
}

export interface Employee{
    id:number;
    name:string;
    department:string;
    salary:number;
    companyId:number;
    company?:Company;
}

@Injectable({
    providedIn: 'root'
  })

  export class EmployeeService{
    private apiUrl="https://localhost:7231/api/Employee"; 

    constructor(private http: HttpClient){}
    getEmployees():Observable<Employee[]>{
        return this.http.get<Employee[]>(this.apiUrl);
    }
    getEmployeeById(id:number):Observable<Employee>{
        return this.http.get<Employee>(`${this.apiUrl}/${id}`);
    }
  }