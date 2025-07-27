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
  newPageNumber = 1;
  isLoading: boolean = true;
  copied: boolean = false;
  copiedImageId: string | null = null; // Track which specific image was copied
  sortOrder: string = '-last_modified_time'; // Default sort by last modified descending
  searchTerm: string = '';
  lastSearchTerm: string = '';
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
    this.clipboard.copy(image.url);
    this.copiedImageId = image.id;
    setTimeout(() => {
      this.copiedImageId = null;
    }, 2000);
  }

  // Helper method to check if a specific image was copied
  isImageCopied(imageId: string): boolean {
    return this.copiedImageId === imageId;
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