import { provideHttpClient } from '@angular/common/http';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { InvoiceService } from './invoice.service';
import { InvoiceItem } from './models/invoice-item';

describe('InvoiceService', () => {
  let service: InvoiceService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        InvoiceService,
      ],
    });
    service = TestBed.inject(InvoiceService);
    httpMock = TestBed.inject(HttpTestingController);

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save and retrieve invoice items', () => {
    const mockItems: InvoiceItem[] = [
      { name: 'Test Item 1', count: 2, price: 10 },
      { name: 'Test Item 2', count: 1, price: 20 },
    ];

    service.setInvoiceItems(mockItems);

    service.allInvoices.subscribe((invoices) => {
      expect(invoices.length).toBe(1);
      expect(invoices[0]).toEqual(mockItems);
    });

    const storedInvoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    expect(storedInvoices.length).toBe(1);
    expect(storedInvoices[0]).toEqual(mockItems);
  });

  it('should calculate total correctly', () => {
    const items: InvoiceItem[] = [
      { name: 'Item 1', count: 2, price: 10 },
      { name: 'Item 2', count: 3, price: 5 },
    ];

    const total = service.calculateTotal(items);
    expect(total).toBe(35);
  });

  it('should fetch company data from API', () => {
    const mockCompany = {
      name: 'Test Company',
      address: '123 Test St',
      phones: ['1234567890'],
    };

    service.companyData.subscribe((data) => {
      expect(data).toEqual(mockCompany);
    });

    const req = httpMock.expectOne('/api/company');
    expect(req.request.method).toBe('GET');
    req.flush(mockCompany);
  });
});
