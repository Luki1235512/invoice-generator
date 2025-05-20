import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ActivatedRoute,
  convertToParamMap,
  RouterModule,
} from '@angular/router';
import { of } from 'rxjs';
import { InvoiceService } from '../invoice.service';
import { Company } from '../models/company';
import { InvoiceItem } from '../models/invoice-item';
import { InvoiceSummaryComponent } from './invoice-summary.component';

describe('InvoiceSummaryComponent', () => {
  let component: InvoiceSummaryComponent;
  let fixture: ComponentFixture<InvoiceSummaryComponent>;
  let invoiceServiceSpy: jasmine.SpyObj<InvoiceService>;

  const mockInvoices: InvoiceItem[][] = [
    [
      { name: 'Test Item 1', count: 2, price: 10 },
      { name: 'Test Item 2', count: 1, price: 20 },
    ],
  ];

  const mockCompany: Company = {
    name: 'Test Company',
    address: '123 Test St',
    phones: ['1234567890'],
  };

  beforeEach(async () => {
    invoiceServiceSpy = jasmine.createSpyObj(
      'InvoiceService',
      ['calculateTotal'],
      {
        allInvoices: of(mockInvoices),
        companyData: of(mockCompany),
      },
    );

    invoiceServiceSpy.calculateTotal.and.callFake((items: InvoiceItem[]) => {
      return items.reduce((sum, item) => sum + item.count * item.price, 0);
    });

    await TestBed.configureTestingModule({
      imports: [RouterModule, InvoiceSummaryComponent],
      providers: [
        { provide: InvoiceService, useValue: invoiceServiceSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(convertToParamMap({})),
            snapshot: {
              paramMap: convertToParamMap({}),
            },
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoiceSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load invoices on init', () => {
    expect(component.invoices).toEqual(mockInvoices);
    expect(component.loading).toBeFalse();
  });

  it('should calculate total price correctly', () => {
    expect(component.totalPrice).toBe(40);
  });

  it('should calculate total items count correctly', () => {
    expect(component.totalItemsCount).toBe(3);
  });

  it('should update page on pagination change', () => {
    component.onPageChange(2);
    expect(component.currentPage).toBe(2);
  });
});
