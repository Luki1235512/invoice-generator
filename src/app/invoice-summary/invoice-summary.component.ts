import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { catchError, Observable, of, Subject, takeUntil } from 'rxjs';
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
  paginatedInvoices: InvoiceItem[][] = [];
  currentPage: number = 1;
  pageSize: number = 3;
  loading = true;

  private destroy$ = new Subject<void>();

  private _totalItemsCount: number | null = null;
  private _totalPrice: number | null = null;

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    this.loadInvoices();
    this.loadCompanyData();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  private loadInvoices(): void {
    this.loading = true;
    this.invoiceService.allInvoices
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          console.error('Failed to load invoices', err);
          return of([]);
        }),
      )
      .subscribe((invoices) => {
        this.invoices = invoices;
        this.loading = false;
        this._totalItemsCount = null;
        this._totalPrice = null;

        if (this.invoices.length > 0) {
          this.paginatedInvoices = this.invoices.slice(
            0,
            Math.min(this.pageSize, this.invoices.length),
          );
        } else {
          this.paginatedInvoices = [];
        }
      });
  }

  private loadCompanyData(): void {
    this.company$ = this.invoiceService.companyData.pipe(
      catchError((err) => {
        console.error('Failed to load company data', err);
        return of(null);
      }),
    );
  }

  calculateInvoiceTotal(items: InvoiceItem[]): number {
    return this.invoiceService.calculateTotal(items);
  }

  get totalItemsCount(): number {
    if (this._totalItemsCount === null) {
      this._totalItemsCount = this.invoices.reduce((sum, invoice) => {
        return (
          sum + invoice.reduce((invoiceSum, item) => invoiceSum + item.count, 0)
        );
      }, 0);
    }
    return this._totalItemsCount;
  }

  get totalPrice(): number {
    if (this._totalPrice === null) {
      this._totalPrice = this.invoices.reduce((sum, invoice) => {
        return sum + this.calculateInvoiceTotal(invoice);
      }, 0);
    }
    return this._totalPrice;
  }

  onPageChange(page: number): void {
    this.currentPage = page;
  }

  onPaginatedItemsChange(items: InvoiceItem[][]): void {
    this.paginatedInvoices = items;
  }
}
