import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Company } from './models/company';
import { InvoiceItem } from './models/invoice-item';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private invoicesSubject = new BehaviorSubject<InvoiceItem[][]>([]);
  private readonly STORAGE_KEY = 'invoices';
  private isBrowser: boolean;

  constructor(private http: HttpClient) {
    this.isBrowser = typeof window !== 'undefined';
    this.loadInvoicesFromStorage();
  }

  private loadInvoicesFromStorage(): void {
    if (this.isBrowser) {
      const savedInvoices = localStorage.getItem(this.STORAGE_KEY);
      if (savedInvoices) {
        const invoices = JSON.parse(savedInvoices) as InvoiceItem[][];
        this.invoicesSubject.next(invoices);
      }
    }
  }

  setInvoiceItems(items: InvoiceItem[]): void {
    const currentInvoices = this.invoicesSubject.value;
    const updatedInvoices = [...currentInvoices, items];
    this.invoicesSubject.next(updatedInvoices);

    if (this.isBrowser) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updatedInvoices));
    }
  }

  get allInvoices(): Observable<InvoiceItem[][]> {
    return this.invoicesSubject.asObservable();
  }

  get companyData(): Observable<Company> {
    return this.http.get<Company>('/api/company');
  }

  calculateTotal(items: InvoiceItem[]): number {
    return items.reduce((sum, item) => sum + item.count * item.price, 0);
  }
}
