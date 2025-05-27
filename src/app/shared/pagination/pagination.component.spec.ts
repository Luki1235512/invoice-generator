import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaginationComponent } from './pagination.component';

describe('PaginationComponent', () => {
  let component: PaginationComponent<unknown>;
  let fixture: ComponentFixture<PaginationComponent<unknown>>;

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
    component.items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    component.pageSize = 3;
    component.currentPage = 3;
    component.updatePagination();

    component.previousPage();
    expect(component.pageChange.emit).toHaveBeenCalledWith(2);
  });

  it('should not emit pageChange when calling previousPage on first page', () => {
    spyOn(component.pageChange, 'emit');
    component.items = [1, 2, 3];
    component.pageSize = 3;
    component.currentPage = 1;
    component.updatePagination();

    component.previousPage();
    expect(component.pageChange.emit).toHaveBeenCalledTimes(1);
  });

  it('should emit pageChange when calling nextPage and not on last page', () => {
    spyOn(component.pageChange, 'emit');
    component.items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    component.pageSize = 3;
    component.currentPage = 3;
    component.updatePagination();

    component.nextPage();
    expect(component.pageChange.emit).toHaveBeenCalledWith(4);
  });

  it('should not emit pageChange when calling nextPage on last page', () => {
    spyOn(component.pageChange, 'emit');
    component.items = [1, 2, 3, 4, 5];
    component.pageSize = 3;
    component.currentPage = 2;
    component.totalPages = 2;
    component.updatePagination();

    component.nextPage();
    expect(component.pageChange.emit).toHaveBeenCalledTimes(1);
  });
});
