import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
} from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
  standalone: true,
})
export class PaginationComponent<T> implements OnChanges {
  @Input() items: T[] = [];
  @Input() pageSize: number = 10;
  @Input() currentPage: number = 1;

  @Output() pageChange = new EventEmitter<number>();
  @Output() paginatedItemsChange = new EventEmitter<T[]>();

  totalPages: number = 1;

  ngOnChanges(): void {
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.max(1, Math.ceil(this.items.length / this.pageSize));
    this.currentPage = Math.min(Math.max(1, this.currentPage), this.totalPages);

    const startIndex = (this.currentPage - 1) * this.pageSize;
    const paginatedItems = this.items.slice(
      startIndex,
      startIndex + this.pageSize,
    );

    this.paginatedItemsChange.emit(paginatedItems);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.pageChange.emit(this.currentPage);
      this.updatePagination();
    }
  }

  previousPage(): void {
    this.changePage(this.currentPage - 1);
  }

  nextPage(): void {
    this.changePage(this.currentPage + 1);
  }
}
