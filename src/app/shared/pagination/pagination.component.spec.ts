import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent;
  let fixture: ComponentFixture<PaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaginationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit pageChange when calling previousPage and not on first page', () => {
    spyOn(component.pageChange, 'emit');
    component.currentPage = 3;
    component.previousPage();
    expect(component.pageChange.emit).toHaveBeenCalledWith(2);
  });

  it('should not emit pageChange when calling previousPage on first page', () => {
    spyOn(component.pageChange, 'emit');
    component.currentPage = 1;
    component.previousPage();
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });

  it('should emit pageChange when calling nextPage and not on last page', () => {
    spyOn(component.pageChange, 'emit');
    component.currentPage = 3;
    component.totalPages = 5;
    component.nextPage();
    expect(component.pageChange.emit).toHaveBeenCalledWith(4);
  });

  it('should not emit pageChange when calling nextPage on last page', () => {
    spyOn(component.pageChange, 'emit');
    component.currentPage = 5;
    component.totalPages = 5;
    component.nextPage();
    expect(component.pageChange.emit).not.toHaveBeenCalled();
  });
});
