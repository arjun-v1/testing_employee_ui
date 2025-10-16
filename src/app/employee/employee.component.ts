import { Component, OnInit } from "@angular/core";
import { Employee, EmployeeService, Company } from "./employee.service";   
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
  companies: Company[] = [];
  selectedEmployee: Employee | null = null;
  paginatedEmployees: Employee[] = [];
  currentPage = 1;
  itemsPerPage = 9;
  totalPages = 0;
  showGrid = false;
  selectedEmployeeId: number | null = null;
  showDeleteConfirm = false;

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
    this.loadEmployees();
    this.loadCompanies();
  }

  selectEmployee(emp: Employee, event?: Event) {
    if (event) {
      event.preventDefault();
    }
    this.showGrid = true;
    this.selectedEmployee = emp;
    this.selectedEmployeeId = null; 
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.employees.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedEmployees = this.employees.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }

  selectEmployeeForAction(empId: number) {
    this.selectedEmployeeId = empId;
  }

  editSelectedEmployee() {
    if (this.selectedEmployeeId) {
      const emp = this.employees.find(e => e.id === this.selectedEmployeeId);
      if (emp) {
        this.editEmployee(emp);
      }
    }
  }

  deleteSelectedEmployee() {
    if (this.selectedEmployeeId) {
      this.showDeleteConfirm = true;
    }
  }

  confirmDelete() {
    if (this.selectedEmployeeId) {
      this.deleteEmployee(this.selectedEmployeeId);
      this.showDeleteConfirm = false;
      this.selectedEmployeeId = null;
      this.showGrid = false; 
    }
  }

  cancelDelete() {
    this.showDeleteConfirm = false;
  }

  
  openModal() {
    this.isEditMode = false;
    this.form = { id: 0, name: '', salary: 0, department: '', companyId: 1 };
    this.showModal = true;
  }

  editEmployee(emp: Employee) {
    this.isEditMode = true;
    this.form = { 
      id: emp.id,
      name: emp.name,
      salary: emp.salary,
      department: emp.department,
      companyId: emp.companyId || 1
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  submitEmployee() {
    const newEmployee = {
      name: this.form.name,
      salary: this.form.salary,
      department: this.form.department,
      companyId: this.form.companyId
    };
    this.employeeService.createEmployee(newEmployee).subscribe({
      next: () => {
        this.loadEmployees();
        this.closeModal();
      },
      error: (error) => console.error('Error creating employee:', error)
    });
  }

  updateEmployee() {
    this.employeeService.updateEmployee(this.form.id, this.form).subscribe({
      next: () => {
        this.loadEmployees();
        this.closeModal();
        this.showGrid = false; 
      },
      error: (error) => console.error('Error updating employee:', error)
    });
  }

  deleteEmployee(id: number) {
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.loadEmployees();
      },
      error: (error) => console.error('Error deleting employee:', error)
    });
  }

  private loadEmployees() {
    this.employeeService.getEmployees().subscribe({
      next: (data) => {
        this.employees = data;
        this.updatePagination();
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        // Use mock data when API is not available
        this.employees = [
          { id: 1, name: 'John Doe', salary: 50000, department: 'IT', companyId: 1 },
          { id: 2, name: 'Jane Smith', salary: 60000, department: 'HR', companyId: 1 },
          { id: 3, name: 'Mike Johnson', salary: 55000, department: 'Finance', companyId: 1 },
          { id: 4, name: 'Sarah Wilson', salary: 65000, department: 'Marketing', companyId: 1 },
          { id: 5, name: 'Tom Brown', salary: 52000, department: 'IT', companyId: 1 }
        ];
        this.updatePagination();
      }
    });
  }

  onSubmit() {
    if (this.companyForm.valid) {
     
    }
  }

  private loadCompanies() {
    this.employeeService.getCompanies().subscribe({
      next: (data) => this.companies = data,
      error: () => this.companies = [
        { id: 1, name: 'Tech Corp' },
        { id: 2, name: 'Business Inc' }
      ]
    });
  }
}
