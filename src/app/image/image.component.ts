import { Component, OnInit } from '@angular/core';
import { ImageService } from '../image.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {
  i: any;
  images: any;
  displayImages: any[] = [];
  newPageNumber = 1;
  isLoading: boolean = true;
  copiedImages: Set<any> = new Set(); // Track which images have been copied
  sortOrder: string = '-last_modified_time'; // Default sort by last modified descending
  searchTerm: string = '';
  lastSearchTerm: string = '';
  showDuplicateTitles: boolean = false;
  hiddenDuplicateCount: number = 0;
  totalCount: number = 0;
  totalPages: number = 0;
  itemsPerPage: number = 0; // Will be set dynamically
  showJumbotron: boolean = false;
  selectedImage: any = null;

  constructor(private imageService: ImageService, private clipboard: Clipboard) { }

  ChevronRight = faChevronRight;
  ChevronLeft = faChevronLeft;

  ngOnInit(): void {
    this.getImageData(this.newPageNumber);
  }

  getImageData(page: number, searchText: string = ''): void {
    this.isLoading = true;
    this.imageService.getImages(page, searchText, this.sortOrder).subscribe((data: any) => {
      this.images = data;
      this.totalCount = data.meta.count;
      this.displayImages = this.filterDuplicateTitles(data?.data || []);
      // Set itemsPerPage based on API response, fallback to 1 to avoid division by zero
      this.itemsPerPage = (data.data && data.data.length) ? data.data.length : 1;
      this.totalPages = Math.ceil(this.totalCount / this.itemsPerPage);

      // If the current page is out of range (e.g., after a search with fewer results), go to last valid page
      if (this.newPageNumber > this.totalPages && this.totalPages > 0) {
        this.newPageNumber = this.totalPages;
        this.getImageData(this.newPageNumber, this.searchTerm);
        return;
      }

      this.isLoading = false;
    });
  }

  toggleDuplicateTitles(): void {
    this.showDuplicateTitles = !this.showDuplicateTitles;
    this.displayImages = this.filterDuplicateTitles(this.images?.data || []);
  }

  private filterDuplicateTitles(images: any[]): any[] {
    if (this.showDuplicateTitles) {
      this.hiddenDuplicateCount = 0;
      return images;
    }

    const seenTitles = new Set<string>();
    const filteredImages: any[] = [];

    for (const image of images) {
      const rawTitle = this.getImageTitle(image);
      const titleKey = rawTitle.trim().toLowerCase();

      if (!titleKey) {
        filteredImages.push(image);
        continue;
      }

      if (seenTitles.has(titleKey)) {
        continue;
      }

      seenTitles.add(titleKey);
      filteredImages.push(image);
    }

    this.hiddenDuplicateCount = Math.max(images.length - filteredImages.length, 0);
    return filteredImages;
  }

  private getImageTitle(image: any): string {
    const title = image?.name || image?.title || image?.alt_text || '';
    return typeof title === 'string' ? title : '';
  }

  selectPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.newPageNumber = page;
    this.getImageData(this.newPageNumber, this.searchTerm);
  }

  onPageChangePlus(): void {
    if (this.newPageNumber < this.totalPages) {
      this.newPageNumber++;
      this.getImageData(this.newPageNumber, this.searchTerm);
    }
  }

  onPageChangeMinus(): void {
    if (this.newPageNumber > 1) {
      this.newPageNumber--;
      this.getImageData(this.newPageNumber, this.searchTerm);
    }
  }

  searchImages(): void {
    this.newPageNumber = 1;
    this.lastSearchTerm = this.searchTerm;
    this.getImageData(this.newPageNumber, this.searchTerm);
  }

  copyURLToClipboard(image: any): void {
    if (image && image.url) {
      this.clipboard.copy(image.url);
      this.copiedImages.add(image);
      setTimeout(() => {
        this.copiedImages.delete(image);
      }, 3000);
    }
  }

  isImageCopied(image: any): boolean {
    return this.copiedImages.has(image);
  }

  shouldShowPage(pageNumber: number): boolean {
    if (this.totalPages <= 12) {
      return pageNumber !== 1 && pageNumber !== this.totalPages;
    }
    return pageNumber >= this.newPageNumber - 5 && 
           pageNumber <= this.newPageNumber + 5 && 
           pageNumber !== 1 && 
           pageNumber !== this.totalPages;
  }

  onImageError(event: any): void {
    // Handle image loading errors
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMyIgeT0iMyIgd2lkdGg9IjE4IiBoZWlnaHQ9IjE4IiByeD0iMiIgcnk9IjIiIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2tlLXdpZHRoPSIyIiBmaWxsPSIjZjVmNWY1Ii8+CjxjaXJjbGUgY3g9IjguNSIgY3k9IjguNSIgcj0iMS41IiBzdHJva2U9IiM5OTk5OTkiIHN0cm9rZS13aWR0aD0iMiIvPgo8cG9seWxpbmUgcG9pbnRzPSIyMSwxNSAxNiwxMCA1LDIxIiBzdHJva2U9IiM5OTk5OTkiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4K';
  }

  openJumbotron(image: any): void {
    this.selectedImage = image;
    this.showJumbotron = true;
  }

  closeJumbotron(): void {
    this.showJumbotron = false;
    this.selectedImage = null;
  }
}