import { Component, OnInit } from '@angular/core';
import { PlaceService } from '../place.service';

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.css']
})
export class PlaceComponent implements OnInit {
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
  public loadedPlaces: any[] = []; // Add this line in your component class

  constructor(private placeservice: PlaceService) {}

  ngOnInit() {
    this.initMap();
   
  }

  initMap(): void {
    this.map = new google.maps.Map(document.getElementById("map")!, this.options);
    this.infoWindow = new google.maps.InfoWindow();
    this.showContent(this.textid, this.currentPage);
  }



  showContent(textid: string, pageNumber: number): void {
    // Construct the URL based on current page number and textid
    let url = `${this.linkedEventsApiRoot}place/?text=${textid}&page=${pageNumber}`;
    this.placeservice.getPlacesByUrl(url).subscribe(response => {
      // Clear existing markers from the map
      this.markers.forEach((marker: { setMap: (arg0: null) => any; }) => marker.setMap(null));
      this.markers = []; // Reset the markers array
  
      response.data.forEach((place: any) => {
        const marker = new google.maps.Marker({
          position: { lat: place.position.coordinates[1], lng: place.position.coordinates[0] },
          label: { text: place.name.fi, color: 'black', fontWeight: '700', fontFamily: 'Verdana', fontSize: '13px' },
          title: place.street_address.fi + ', ' + place.address_locality.fi,
          animation: google.maps.Animation.DROP,
          icon: { url: '/assets/locationpin.png' },
          map: this.map
        });
  
        // Add marker to the markers array
        this.markers.push(marker);
        this.loadedPlaces = []; // Reset the loaded places array
        this.loadedPlaces = response.data; // Update the loaded places array  
  
        this.nextPageUrl = response.meta.next || null;
        this.previousPageUrl = response.meta.previous || null;
  
        // Check if info_url is not null before using it
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

  // Methods for specific searches
  searchPasila(): void {
    this.textid = 'Pasila';
    this.showContent(this.textid, this.currentPage);
  }

  // Add similar methods for Haaga, Ravintola, Kauppakeskus, Teatteri, Urheilu

  getImageById(imageid: number): void {
    this.placeservice.getPlaceImageById(imageid).subscribe((data: any) => {
      this.ImageDetail = data;
      this.showWindow = true;
    });
  }

  closeWindow(): void {
    this.showWindow = false;
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