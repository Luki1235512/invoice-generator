import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { InvoiceService } from '../invoice.service';
import { Company } from '../models/company';
import { InvoiceItem } from '../models/invoice-item';

@Component({
  selector: 'app-invoice-summary',
  imports: [CommonModule, RouterModule],
  templateUrl: './invoice-summary.component.html',
  styleUrl: './invoice-summary.component.css',
  standalone: true,
})
export class InvoiceSummaryComponent implements OnInit {
  items: InvoiceItem[] = [];
  company$: Observable<Company | null> = of(null);
  total = 0;

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    this.invoiceService.getInvoiceItems().subscribe((items) => {
      this.items = items;
      this.total = this.invoiceService.calculateTotal(items);
    });

    this.company$ = this.invoiceService.getCompanyData().pipe(
      catchError(() => {
        console.error('Failed to load company data');
        return of(null);
      }),
    );
  }
}
