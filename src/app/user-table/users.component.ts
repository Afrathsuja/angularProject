import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UserTableComponent implements OnInit {
  items: any[] = [];
  currentPage: number = 1;
  resultsPerPage: number | string = 10;
  searchTerm: string = '';
  sortBy: string | null = null;
  sortDesc: boolean = false;
  isLoading: boolean = true;

  ngOnInit() {
    this.fetchData();
  }

  get totalPages(): number {
    if (this.resultsPerPage === 'all') {
      return 1;
    }
    return Math.ceil(this.filteredItems.length / +this.resultsPerPage);
  }

  get paginatedItems(): any[] {
    if (this.resultsPerPage === 'all') {
      return this.filteredItems;
    }
    const start = (this.currentPage - 1) * +this.resultsPerPage;
    const end = start + +this.resultsPerPage;
    return this.filteredItems.slice(start, end);
  }

  get filteredItems(): any[] {
    return this.items
      .filter(item =>
        item.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(this.searchTerm.toLowerCase())
      )
      .sort((a, b) => {
        if (!this.sortBy) return 0;
        const aValue = a[this.sortBy];
        const bValue = b[this.sortBy];
        return this.sortDesc ? bValue.localeCompare(aValue) : aValue.localeCompare(bValue);
      });
  }

  async fetchData() {
    this.isLoading = true;
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/comments');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      this.items = data.map((item: any) => ({ ...item, isEditing: false }));
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  sortItems(column: string) {
    if (this.sortBy === column) {
      this.sortDesc = !this.sortDesc;
    } else {
      this.sortBy = column;
      this.sortDesc = false;
    }
  }

  sortDirection(column: string): string {
    if (this.sortBy === column) {
      return this.sortDesc ? '▼' : '▲';
    }
    return '';
  }

  editItem(item: any) {
    item.isEditing = true;
  }

  saveItem(item: any) {
    item.isEditing = false;
  }

  deleteItem(itemId: number) {
    this.items = this.items.filter(item => item.id !== itemId);
  }
}
