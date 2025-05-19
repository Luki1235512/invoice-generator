import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { catchError, Observable, of } from 'rxjs';
import { InvoiceService } from '../invoice.service';
import { Company } from '../models/company';
import { InvoiceItem } from '../models/invoice-item';
import { PaginationComponent } from '../shared/pagination/pagination.component';

@Component({
  selector: 'app-invoice-summary',
  imports: [CommonModule, RouterModule, PaginationComponent],
  templateUrl: './invoice-summary.component.html',
  styleUrl: './invoice-summary.component.css',
  standalone: true,
})
export class InvoiceSummaryComponent implements OnInit {
  company$: Observable<Company | null> = of(null);
  invoices: InvoiceItem[][] = [];
  currentPage: number = 1;
  pageSize: number = 2;

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    this.invoiceService.getAllInvoices().subscribe((invoices) => {
      this.invoices = invoices;
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

  get totalItemsCount(): number {
    return this.invoices.reduce((sum, invoice) => {
      return (
        sum + invoice.reduce((invoiceSum, item) => invoiceSum + item.count, 0)
      );
    }, 0);
  }

  get totalPrice(): number {
    return this.invoices.reduce((sum, invoice) => {
      return sum + this.calculateInvoiceTotal(invoice);
    }, 0);
  }

  get paginatedInvoices(): InvoiceItem[][] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    return this.invoices.slice(startIndex, startIndex + this.pageSize);
  }

  get totalPages(): number {
    return Math.ceil(this.invoices.length / this.pageSize);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }
}
