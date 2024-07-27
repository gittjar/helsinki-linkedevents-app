import { Component, OnInit } from '@angular/core';
import { ImageService } from '../image.service';
import { Ripple, initTE } from "tw-elements";
import { Clipboard } from '@angular/cdk/clipboard';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {
i: any;


    searchImages(): void {
      // Assuming you want to search starting from the first page
      this.newPageNumber = 1;
      this.getImageData(this.newPageNumber, this.searchTerm);
    }


  images: any;
  newPageNumber = 1;
  isLoading: boolean = true;
  copied: boolean = false;
  sortOrder: string = '';
  searchTerm: string = '';
  totalCount: number = 0; 
  totalPages: number = 0; 
  itemsPerPage: number = 10; 


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
      this.totalCount = data.meta.count; // And this too
      this.totalPages = Math.ceil(this.totalCount / this.itemsPerPage);
      this.isLoading = false;
    });
  }

  selectPage(page: number): void {
    this.newPageNumber = page;
    this.getImageData(this.newPageNumber);
  }

  onPageChangePlus(): void {
    this.newPageNumber++;
    this.getImageData(this.newPageNumber);
    this.searchTerm = '';


  }

  onPageChangeMinus(): void {
    if (this.newPageNumber > 1) {
      this.newPageNumber--;
      this.getImageData(this.newPageNumber);
      this.searchTerm = '';

    }
  }

  copyURLToClipboard(url: string): void {
    this.clipboard.copy(url);
    this.copied = true;
    setTimeout(() => {
      this.copied = false;
    }, 2000);
  }
}