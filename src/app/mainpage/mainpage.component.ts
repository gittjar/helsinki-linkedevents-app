import { Component, OnInit } from '@angular/core';
import { GalleryItem, ImageItem } from 'ng-gallery';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {

  images: GalleryItem[] | any;

  quickLinks = [
    { title: 'Tapahtumat', description: 'Katso mitä Helsingissä tapahtuu tänään.', icon: '🎉', link: '/event' },
    { title: 'Paikat', description: 'Löydä suosittuja kohteita kaupungista.', icon: '📍', link: '/place' },
    { title: 'Kuvat', description: 'Sivusta löytyy kuva-aiheisia inspiraatiokokonaisuuksia.', icon: '📷', link: '/image' }
  ];

  areaTiles = [
    { name: 'Kallio', tag: 'Kahvilat & yöelämä' },
    { name: 'Kamppi', tag: 'Keskusta & kaupunkikuva' },
    { name: 'Malmi', tag: 'Luonto & perheille' },
    { name: 'Pasila', tag: 'Kaupunkimaisema' },
    { name: 'Töölö', tag: 'Kulttuuri & puistot' },
    { name: 'Haaga', tag: 'Asuminen & palvelut' },
    { name: 'Itäkeskus', tag: 'Liikenne & ostosalue' },
    { name: 'Kontula', tag: 'Kaupungin sydän' }
  ];

  constructor () {}

  ngOnInit() {
    // Set items array
    this.images = [
      new ImageItem({ src: 'https://digital.pictures.fi/kuvat/Github/helsinki-linked-events/carousel-images/helsinki-city-image001.jpg?img=img2048', thumb: 'https://digital.pictures.fi/kuvat/Github/helsinki-linked-events/carousel-images/helsinki-city-image001.jpg?img=img2048' }),
      new ImageItem({ src: 'https://digital.pictures.fi/kuvat/Github/helsinki-linked-events/carousel-images/helsinki-city-image002.jpg?img=img2048', thumb: 'https://digital.pictures.fi/kuvat/Github/helsinki-linked-events/carousel-images/helsinki-city-image002.jpg?img=img2048' }),
      new ImageItem({ src: 'https://digital.pictures.fi/kuvat/Github/helsinki-linked-events/carousel-images/helsinki-city-image003.jpg?img=img2048', thumb: 'https://digital.pictures.fi/kuvat/Github/helsinki-linked-events/carousel-images/helsinki-city-image003.jpg?img=img2048' }),
      new ImageItem({ src: 'https://digital.pictures.fi/kuvat/Github/helsinki-linked-events/carousel-images/helsinki-city-image004.jpg?img=img2048', thumb: 'https://digital.pictures.fi/kuvat/Github/helsinki-linked-events/carousel-images/helsinki-city-image004.jpg?img=img2048' }),
    ];
    
    console.log('Carousel images loaded:', this.images);
  }
}
