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
  allInvoices: InvoiceItem[][] = [];
  company$: Observable<Company | null> = of(null);

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    this.invoiceService.getAllInvoices().subscribe((invoices) => {
      this.allInvoices = invoices;
    });

    this.company$ = this.invoiceService.getCompanyData().pipe(
      catchError(() => {
        console.error('Failed to load company data');
        return of(null);
      }),
    );
  }

  calculateInvoiceTotal(items: InvoiceItem[]): number {
    return this.invoiceService.calculateTotal(items);
  }

  getTotalItemsCount(): number {
    return this.allInvoices.reduce((sum, invoice) => {
      return (
        sum + invoice.reduce((invoiceSum, item) => invoiceSum + item.count, 0)
      );
    }, 0);
  }

  getTotalPrice(): number {
    return this.allInvoices.reduce((sum, invoice) => {
      return sum + this.calculateInvoiceTotal(invoice);
    }, 0);
  }
}
