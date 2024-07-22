import { Component, OnInit } from '@angular/core';
import { PlaceService } from '../place.service';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlassLocation } from '@fortawesome/free-solid-svg-icons';
import { faRectangleXmark } from '@fortawesome/free-regular-svg-icons';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.css']
})
export class PlaceComponent implements OnInit {

    // fontawesome
    ArrowUpRightIcon = faArrowUpRightFromSquare;
    ChevronRight = faChevronRight;
    MagnifyingGlassLocation = faMagnifyingGlassLocation;
    RectangXmark = faRectangleXmark;
    ArrowUpFromBracket = faArrowUpFromBracket;
   
    // toggle button

    toggleStates = new Map<string, boolean>(); // To track toggle states by place id

    toggleInfo(placeId: string): void {
      const currentState = this.toggleStates.get(placeId) || false;
      this.toggleStates.set(placeId, !currentState);
    }

    // Google Maps API

  linkedEventsApiRoot: string = 'https://api.codetabs.com/v1/proxy/?quest=https://api.hel.fi/linkedevents/v1/';
  mapLoaded!: boolean;
  map!: google.maps.Map;
  geocoder = new google.maps.Geocoder();
  infoWindow!: google.maps.InfoWindow;
  options: google.maps.MapOptions = {
    scrollwheel: true,
    center: { lat: 60.16833266, lng: 24.951496394 },
    zoom: 12,
  };
  currentPage = 1;
  nextPageUrl: string | null = null;
  previousPageUrl: string | null = null;
  markers = [] as any;
  textid: string = "";
  showWindow = false;
  ImageDetail: any = {};
  public loadedPlaces: any[] = [];



  constructor(private placeservice: PlaceService) {}

  ngOnInit() {
    this.initMap();
  }

  initMap(): void {
    this.map = new google.maps.Map(document.getElementById("map")!, this.options);
    this.infoWindow = new google.maps.InfoWindow();
    this.showContent(this.textid, this.currentPage);
  }

  async showContent(textid: string, pageNumber: number): Promise<void> {
    let url = `${this.linkedEventsApiRoot}place/?text=${textid}&page=${pageNumber}`;
    this.placeservice.getPlacesByUrl(url).subscribe(async response => {
      this.markers.forEach((marker: { setMap: (arg0: null) => any; }) => marker.setMap(null));
      this.markers = [];
      this.loadedPlaces = [];

      const placesWithImages = await Promise.all(response.data.map(async (place: any) => {
        if (place.images && place.images.length > 0) {
          const imageData = await this.placeservice.getPlaceImageById(place.images[0].id).toPromise();
          if (imageData) {
            place.imageUrl = imageData.url; // Assign the image URL to the place
          }
        }
        return place;
      }));

      this.loadedPlaces = placesWithImages; // Update the loaded places with images

      this.loadedPlaces.forEach((place: any) => {
        const marker = new google.maps.Marker({
          position: { lat: place.position.coordinates[1], lng: place.position.coordinates[0] },
          label: { text: place.name.fi, color: 'black', fontWeight: '700', fontFamily: 'Verdana', fontSize: '13px' },
          title: place.street_address.fi + ', ' + place.address_locality.fi,
          animation: google.maps.Animation.DROP,
          icon: { url: '/assets/locationpin.png' },
          map: this.map
        });

        this.markers.push(marker);

        const infoUrl = place.info_url && place.info_url.fi ? `<a href="${place.info_url.fi}">Lue lisää ></a>` : "No additional information available";
        const markerContent = `<div class="map-infowindow">
          <div class="map-infowindow-title">${place.name.fi}</div>
          <div class="map-infowindow-content">${place.street_address.fi}</div>
          <div class="map-infowindow-content">${place.postal_code}, ${place.address_locality.fi}</div>
          <div class="map-infowindow-content">${infoUrl}</div>
        </div>`;

        marker.addListener("click", () => {
          this.infoWindow.setContent(markerContent);
          this.infoWindow.open(this.map, marker);
        });
      });

      this.nextPageUrl = response.meta.next || null;
      this.previousPageUrl = response.meta.previous || null;
    });
  }

  // Methods for search, reset, and navigation
  doSearch(): void {
    this.showContent(this.textid, this.currentPage);
  }

  resetMap(): void {
    this.textid = '';
    this.initMap();
  }

// In the parent component from search-select.component.ts, add the following method:
handleSearch(searchTerm: string): void {
  this.textid = searchTerm;
  this.showContent(this.textid, this.currentPage);
}

  // Add similar methods for Haaga, Ravintola, Kauppakeskus, Teatteri, Urheilu

  hoveredImageId: number | null = null;

  getImageById(imageId: number): void {
    this.hoveredImageId = imageId; // Track the hovered image ID
    this.placeservice.getPlaceImageById(imageId).subscribe((data: any) => {
      this.ImageDetail = data;
    });
  }
  
  closeWindow(): void {
    this.hoveredImageId = null; // Reset the hover state
  }

  // Pagination methods
  nextPage(): void {
    if (this.nextPageUrl) {
      this.currentPage++; // Increment current page
      this.showContent(this.textid, this.currentPage);
    }
  }
  
  previousPage(): void {
    if (this.previousPageUrl && this.currentPage > 1) {
      this.currentPage--; // Decrement current page
      this.showContent(this.textid, this.currentPage);
    }
  }

  goToPage(pageNumber: number): void {
    this.showContent(this.textid, pageNumber);
  }
}