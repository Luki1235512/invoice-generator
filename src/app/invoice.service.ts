import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Company } from './models/company';
import { InvoiceItem } from './models/invoice-item';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {
  private invoiceItems = new BehaviorSubject<InvoiceItem[]>([]);

  constructor(private http: HttpClient) {}

  getInvoiceItems(): Observable<InvoiceItem[]> {
    return this.invoiceItems.asObservable();
  }

  setInvoiceItems(items: InvoiceItem[]): void {
    this.invoiceItems.next(items);
  }

  getCompanyData(): Observable<Company> {
    return this.http.get<Company>('/api/company');
  }

  calculateTotal(items: InvoiceItem[]): number {
    return items.reduce((total, item) => total + item.price * item.count, 0);
  }
}
