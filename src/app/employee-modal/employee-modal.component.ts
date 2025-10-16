import { Component,Input, Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Company } from '../employee/employee.service';

@Component({
  selector: 'app-employee-modal',
  imports: [CommonModule, FormsModule],
  templateUrl: './employee-modal.component.html',
  styleUrl: './employee-modal.component.css'
})
export class EmployeeModalComponent {
 @Input() showModal = false;
  @Input() isEditMode = false;
  @Input() form = { id: 0, name: '', salary: 0, department: '', companyId: 0 };
  @Input() companies: Company[] = [];

  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();
  @Output() update = new EventEmitter<void>();

  closeModal() {
    this.close.emit();
  }
   submitEmployee() {
    this.submit.emit();
  }

  updateEmployee() {
    this.update.emit();
  }
}
