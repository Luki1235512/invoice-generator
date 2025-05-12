import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { InvoiceService } from '../invoice.service';
import { InvoiceItem } from '../models/invoice-item';

@Component({
  selector: 'app-invoice-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './invoice-form.component.html',
  styleUrl: './invoice-form.component.css',
  standalone: true,
})
export class InvoiceFormComponent {
  invoiceForm: FormGroup;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private invoiceService: InvoiceService,
    private router: Router,
  ) {
    this.invoiceForm = this.fb.group({
      items: this.fb.array([]),
    });

    this.addItem();
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  addItem(): void {
    const itemGroup = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(30),
        ],
      ],
      count: [
        null,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(100),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
      price: [
        null,
        [
          Validators.required,
          Validators.min(1),
          Validators.max(1000000),
          Validators.pattern('^[0-9]*$'),
        ],
      ],
    });

    this.items.push(itemGroup);
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.invoiceForm.invalid) {
      return;
    }

    if (this.items.length === 0) {
      alert('Please add items');
      return;
    }

    const invoiceItems: InvoiceItem[] = this.items.value;
    this.invoiceService.setInvoiceItems(invoiceItems);
    this.router.navigate(['/summary']);
  }
}
