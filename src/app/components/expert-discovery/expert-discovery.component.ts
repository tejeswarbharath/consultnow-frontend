import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpertService, Expert, Category } from '../../services/expert.service';

@Component({
  selector: 'app-expert-discovery',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expert-discovery.component.html',
  styles: ``
})
export class ExpertDiscoveryComponent implements OnInit {
  experts: Expert[] = [];
  categories: Category[] = [];
  
  selectedCategoryId: string = '';
  searchQuery: string = '';
  loading: boolean = false;

  constructor(private expertService: ExpertService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadExperts();
  }

  loadCategories(): void {
    this.expertService.getCategories().subscribe({
      next: (data) => this.categories = data,
      error: (err) => console.error('Failed to load categories', err)
    });
  }

  loadExperts(): void {
    this.loading = true;
    this.expertService.getExperts(this.selectedCategoryId, this.searchQuery).subscribe({
      next: (data) => {
        this.experts = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load experts', err);
        this.loading = false;
      }
    });
  }

  onSearch(): void {
    this.loadExperts();
  }

  onCategorySelect(categoryId: string): void {
    this.selectedCategoryId = categoryId;
    this.loadExperts();
  }
}
