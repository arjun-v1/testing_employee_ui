import { Component, OnInit } from "@angular/core";
import { Employee, EmployeeService } from "./employee.service";   
import { CommonModule } from "@angular/common";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EmployeeModalComponent } from '../employee-modal/employee-modal.component';

@Component({
     selector:'app-employee', 
     templateUrl:'./employee.component.html', 
     styleUrls: ['./employee.component.css'], 
     standalone: true, 
     imports:[CommonModule, ReactiveFormsModule, EmployeeModalComponent]
     })
    
export class EmployeeComponent implements OnInit {
  employees: Employee[] = [];
  selectedEmployee: Employee | null = null;

  companyForm: FormGroup;
  showModal = false;
  isEditMode = false;

  form = {
    id: 0,
    name: '',
    salary: 0,
    department: '',
    companyId: 1
  };

  constructor(
    private employeeService: EmployeeService,
    private fb: FormBuilder
  ) {
    this.companyForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(25)]]
    });
  }

  ngOnInit(): void {
    this.employeeService.getEmployees().subscribe(data => {
      this.employees = data;
    });
  }

  selectEmployee(emp: Employee) {
    this.employeeService.getEmployeeById(emp.id).subscribe(employee => {
      this.selectedEmployee = employee;
    });
  }

  
  openModal() {
    this.isEditMode = false;
    this.form = { id: 0, name: '', salary: 0, department: '', companyId: 1 };
    this.showModal = true;
  }

  editEmployee(emp: Employee) {
    this.isEditMode = true;
    this.form = { ...emp };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  submitEmployee() {
    const newId = Math.max(...this.employees.map(e => e.id)) + 1;
    this.employees.push({ ...this.form, id: newId });
    this.closeModal();
  }

  updateEmployee() {
    const index = this.employees.findIndex(e => e.id === this.form.id);
    if (index !== -1) {
      this.employees[index] = { ...this.form };
    }
    this.closeModal();
  }

  deleteEmployee(id: number) {
    this.employees = this.employees.filter(e => e.id !== id);
  }

  onSubmit() {
    if (this.companyForm.valid) {
      // Optional: handle company form submission
    }
  }
}
