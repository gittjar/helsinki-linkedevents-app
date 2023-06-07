import { Component, OnInit } from '@angular/core';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.css']
})
export class ImageComponent implements OnInit {

  constructor(private http: ImageService ) {}

  ngOnInit(): void {
    this.getImageData(1);
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

}
