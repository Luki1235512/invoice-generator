import { Routes } from '@angular/router';
import { InvoiceFormComponent } from './invoice-form/invoice-form.component';
import { InvoiceSummaryComponent } from './invoice-summary/invoice-summary.component';

export const routes: Routes = [
  { path: '', component: InvoiceFormComponent },
  { path: 'summary', component: InvoiceSummaryComponent },
  { path: '**', redirectTo: '' },
];
