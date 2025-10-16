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
    createEmployee(employee: Omit<Employee, 'id'>): Observable<Employee> {
        return this.http.post<Employee>(this.apiUrl, employee);
    }
    updateEmployee(id: number, employee: Employee): Observable<Employee> {
        return this.http.put<Employee>(`${this.apiUrl}/${id}`, employee);
    }
    deleteEmployee(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
    getCompanies(): Observable<Company[]> {
        return this.http.get<Company[]>('https://localhost:7231/api/Company');
    }
  }