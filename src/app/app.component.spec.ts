import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render navigation links', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const navLinks = fixture.debugElement.queryAll(By.css('.nav-link'));
    expect(navLinks.length).toBe(2);
    expect(navLinks[0].nativeElement.textContent.trim()).toBe('Invoice Form');
    expect(navLinks[1].nativeElement.textContent.trim()).toBe(
      'Invoice Summary',
    );
  });

  it('should have router outlet', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const routerOutlet = fixture.debugElement.query(By.css('router-outlet'));
    expect(routerOutlet).not.toBeNull();
  });
});
