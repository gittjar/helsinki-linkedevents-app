import { Component, OnInit } from '@angular/core';
import { GalleryItem, ImageItem } from 'ng-gallery';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {

  images: GalleryItem[] | any;

  constructor () {}

  ngOnInit() {
    // Set items array
    this.images = [
      new ImageItem({ src: 'https://digital.pictures.fi/kuvat/Github/helsinki-linked-events/carousel-images/helsinki-city-image001.jpg?img=img2048', thumb: 'https://digital.pictures.fi/kuvat/Github/helsinki-linked-events/carousel-images/helsinki-city-image001.jpg?img=img2048' }),
      new ImageItem({ src: 'https://digital.pictures.fi/kuvat/Github/helsinki-linked-events/carousel-images/helsinki-city-image002.jpg?img=img2048', thumb: 'https://digital.pictures.fi/kuvat/Github/helsinki-linked-events/carousel-images/helsinki-city-image002.jpg?img=img2048' }),
      new ImageItem({ src: 'https://digital.pictures.fi/kuvat/Github/helsinki-linked-events/carousel-images/helsinki-city-image003.jpg?img=img2048', thumb: 'https://digital.pictures.fi/kuvat/Github/helsinki-linked-events/carousel-images/helsinki-city-image003.jpg?img=img2048' }),
      new ImageItem({ src: 'https://digital.pictures.fi/kuvat/Github/helsinki-linked-events/carousel-images/helsinki-city-image004.jpg?img=img2048', thumb: 'https://digital.pictures.fi/kuvat/Github/helsinki-linked-events/carousel-images/helsinki-city-image004.jpg?img=img2048' }),

    
    ];
    
    // Debug: Log the images array
    console.log('Carousel images loaded:', this.images);
  }
}
