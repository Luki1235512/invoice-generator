import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { InvoiceService } from '../invoice.service';
import { InvoiceFormComponent } from './invoice-form.component';

describe('InvoiceFormComponent', () => {
  let component: InvoiceFormComponent;
  let fixture: ComponentFixture<InvoiceFormComponent>;
  let invoiceService: jasmine.SpyObj<InvoiceService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    invoiceService = jasmine.createSpyObj('InvoiceService', [
      'setInvoiceItems',
    ]);
    router = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [InvoiceFormComponent, ReactiveFormsModule],
      providers: [
        { provide: InvoiceService, useValue: invoiceService },
        { provide: Router, useValue: router },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoiceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add an item by default', () => {
    expect(component.items.length).toBe(1);
  });

  it('should add another item when addItem is called', () => {
    const initialLength = component.items.length;
    component.addItem();
    expect(component.items.length).toBe(initialLength + 1);
  });

  it('should remove an item when removeItem is called', () => {
    component.addItem();
    const initialLength = component.items.length;
    component.removeItem(0);
    expect(component.items.length).toBe(initialLength - 1);
  });

  it('should not submit if form is invalid', () => {
    component.onSubmit();
    expect(invoiceService.setInvoiceItems).not.toHaveBeenCalled();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should submit valid form and navigate to summary', () => {
    const formValues = {
      name: 'Test Item',
      count: 2,
      price: 10,
    };

    component.items.at(0).setValue(formValues);

    component.onSubmit();

    expect(invoiceService.setInvoiceItems).toHaveBeenCalledWith([formValues]);
    expect(router.navigate).toHaveBeenCalledWith(['/summary']);
  });

  it('should validate item name length', () => {
    const nameControl = component.items.at(0).get('name');

    nameControl?.setValue('ab');
    expect(nameControl?.valid).toBeFalsy();
    expect(nameControl?.errors?.['minlength']).toBeTruthy();

    nameControl?.setValue('valid name');
    expect(nameControl?.valid).toBeTruthy();

    const longName = 'a'.repeat(31);
    nameControl?.setValue(longName);
    expect(nameControl?.valid).toBeFalsy();
    expect(nameControl?.errors?.['maxlength']).toBeTruthy();
  });
});
