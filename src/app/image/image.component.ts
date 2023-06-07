import { Component, OnInit } from '@angular/core';
import { ImageService } from '../image.service';
import { Ripple, initTE } from "tw-elements";
import { Clipboard } from '@angular/cdk/clipboard';




@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {

  constructor(private http: ImageService, private clipboard: Clipboard) {}

  isLoading: boolean = true;

  ngOnInit(): void {
    this.getImageData(1);
    initTE({ Ripple });
    this.loadingDataWindow();
  }

  loadingDataWindow() {
      setTimeout(() => {
      // Data loading is complete
      this.isLoading = false;
      }, 2700);
  }

  images : any;
  getImageData(page: number): void {
    this.http.getImages(page).subscribe((data: any) => {
      this.images = data;
    })
  }

  newPageNumber = 1;
  onPageChangePlus(): any {
    this.increasePageNumber();
    this.http.getImages(this.newPageNumber).subscribe((data: any) => {
    this.images = data;
    })
    }

  increasePageNumber(): void {
    this.newPageNumber++;
    }

  onPageChangeMinus(): any {
    this.decreasePageNumber();
    this.http.getImages(this.newPageNumber).subscribe((data: any) => {
    this.images = data;
    })
    }

  decreasePageNumber(): void {
    if (this.newPageNumber > 1) {
    this.newPageNumber--;
    }
    } 

    copied: boolean = false;
    scrollOffset: number = 0;

  copyURLToClipboard(url: string): void {
      this.clipboard.copy(url);
      this.copied = true;
      setTimeout(() => {
        this.copied = false;
      }, 2000);
    }
 
}
