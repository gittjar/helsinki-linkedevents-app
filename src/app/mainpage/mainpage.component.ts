import { Component, OnInit } from '@angular/core';
import { GalleryItem, ImageItem } from 'ng-gallery';
import { CalendarDays, Camera, MapPin, MapPinned, Sparkles } from 'lucide-angular';
import { ImageService } from '../image.service';

@Component({
  selector: 'app-mainpage',
  templateUrl: './mainpage.component.html',
  styleUrls: ['./mainpage.component.css']
})
export class MainpageComponent implements OnInit {

  images: GalleryItem[] | any;
  readonly fallbackAreaBackground = '#e6dfd5';
  readonly calendarIcon = CalendarDays;
  readonly pinIcon = MapPin;
  readonly imageIcon = Camera;
  readonly locationIcon = MapPinned;
  readonly sparkIcon = Sparkles;

  quickLinks = [
    { title: 'Tapahtumat', description: 'Katso mitä Helsingissä tapahtuu tänään.', icon: '🎉', link: '/event' },
    { title: 'Paikat', description: 'Löydä suosittuja kohteita kaupungista.', icon: '📍', link: '/place' },
    { title: 'Kuvat', description: 'Sivusta löytyy kuva-aiheisia inspiraatiokokonaisuuksia.', icon: '📷', link: '/image' }
  ];

  areaTiles = [
    {
      name: 'Kallio',
      tag: 'Kahvilat & yöelämä',
      icon: this.pinIcon,
      cover: this.fallbackAreaBackground,
      stats: [
        { label: 'Tänään', value: 12 },
        { label: 'Huomenna', value: 8 },
        { label: 'Paikat', value: 31 },
        { label: 'Kuvat', value: 18 }
      ]
    },
    {
      name: 'Kamppi',
      tag: 'Keskusta & kaupunkikuva',
      icon: this.locationIcon,
      cover: this.fallbackAreaBackground,
      stats: [
        { label: 'Tänään', value: 9 },
        { label: 'Huomenna', value: 11 },
        { label: 'Paikat', value: 24 },
        { label: 'Kuvat', value: 14 }
      ]
    },
    {
      name: 'Malmi',
      tag: 'Luonto & perheille',
      icon: this.sparkIcon,
      cover: this.fallbackAreaBackground,
      stats: [
        { label: 'Tänään', value: 5 },
        { label: 'Huomenna', value: 7 },
        { label: 'Paikat', value: 19 },
        { label: 'Kuvat', value: 12 }
      ]
    },
    {
      name: 'Pasila',
      tag: 'Kaupunkimaisema',
      icon: this.calendarIcon,
      cover: this.fallbackAreaBackground,
      stats: [
        { label: 'Tänään', value: 6 },
        { label: 'Huomenna', value: 10 },
        { label: 'Paikat', value: 17 },
        { label: 'Kuvat', value: 9 }
      ]
    },
    {
      name: 'Töölö',
      tag: 'Kulttuuri & puistot',
      icon: this.sparkIcon,
      cover: this.fallbackAreaBackground,
      stats: [
        { label: 'Tänään', value: 10 },
        { label: 'Huomenna', value: 12 },
        { label: 'Paikat', value: 28 },
        { label: 'Kuvat', value: 16 }
      ]
    },
    {
      name: 'Haaga',
      tag: 'Asuminen & palvelut',
      icon: this.pinIcon,
      cover: this.fallbackAreaBackground,
      stats: [
        { label: 'Tänään', value: 4 },
        { label: 'Huomenna', value: 6 },
        { label: 'Paikat', value: 16 },
        { label: 'Kuvat', value: 8 }
      ]
    }
  ];

  constructor(private imageService: ImageService) {}

  ngOnInit() {
    this.images = [
      new ImageItem({ src: 'https://digital.pictures.fi/kuvat/Github/helsinki-linked-events/carousel-images/helsinki-city-image001.jpg?img=img2048', thumb: 'https://digital.pictures.fi/kuvat/Github/helsinki-linked-events/carousel-images/helsinki-city-image001.jpg?img=img2048' }),
      new ImageItem({ src: 'https://digital.pictures.fi/kuvat/Github/helsinki-linked-events/carousel-images/helsinki-city-image002.jpg?img=img2048', thumb: 'https://digital.pictures.fi/kuvat/Github/helsinki-linked-events/carousel-images/helsinki-city-image002.jpg?img=img2048' }),
      new ImageItem({ src: 'https://digital.pictures.fi/kuvat/Github/helsinki-linked-events/carousel-images/helsinki-city-image003.jpg?img=img2048', thumb: 'https://digital.pictures.fi/kuvat/Github/helsinki-linked-events/carousel-images/helsinki-city-image003.jpg?img=img2048' }),
      new ImageItem({ src: 'https://digital.pictures.fi/kuvat/Github/helsinki-linked-events/carousel-images/helsinki-city-image004.jpg?img=img2048', thumb: 'https://digital.pictures.fi/kuvat/Github/helsinki-linked-events/carousel-images/helsinki-city-image004.jpg?img=img2048' }),
    ];

    this.areaTiles.forEach(tile => this.loadAreaImage(tile.name));
    console.log('Carousel images loaded:', this.images);
  }

  getAreaStyles(area: any): any {
    if (typeof area.cover === 'string' && area.cover.startsWith('#')) {
      return { background: area.cover };
    }

    return {
      backgroundImage: `url(${area.cover})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    };
  }

  private loadAreaImage(areaName: string): void {
    const areaIndex = this.areaTiles.findIndex(tile => tile.name === areaName);
    if (areaIndex === -1) {
      return;
    }

    this.imageService.getImages(1, areaName, '-last_modified_time').subscribe({
      next: (response: any) => {
        const images = response?.data || [];
        const validUrls = images
          .map((image: any) => image?.url)
          .filter((url: string | undefined) => !!url);

        if (validUrls.length > 0) {
          const randomUrl = validUrls[Math.floor(Math.random() * validUrls.length)];
          this.areaTiles[areaIndex].cover = randomUrl;
          return;
        }

        this.areaTiles[areaIndex].cover = this.fallbackAreaBackground;
      },
      error: () => {
        this.areaTiles[areaIndex].cover = this.fallbackAreaBackground;
      }
    });
  }
}
