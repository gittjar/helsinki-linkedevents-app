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
      new ImageItem({ src: '../assets/carousel-images/helsinki-city-image001.jpeg', thumb: '../assets/carousel-images/helsinki-city-image001.jpeg' }),
      new ImageItem({ src: '../assets/carousel-images/helsinki-city-image002.jpeg', thumb: '../assets/carousel-images/helsinki-city-image002.jpeg' }),
      new ImageItem({ src: '../assets/carousel-images/helsinki-city-image003.jpeg', thumb: '../assets/carousel-images/helsinki-city-image003.jpeg' }),
      new ImageItem({ src: '../assets/carousel-images/helsinki-city-image004.jpeg', thumb: '../assets/carousel-images/helsinki-city-image004.jpeg' }),

    
    ];
  }
}
