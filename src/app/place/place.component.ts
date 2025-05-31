import { Component, OnInit } from '@angular/core';
import { PlaceService } from '../place.service';
import { faArrowUpRightFromSquare, faChevronRight, faMagnifyingGlassLocation, faRectangleXmark, faChevronDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.css']
})
export class PlaceComponent implements OnInit {
  ArrowUpRightIcon = faArrowUpRightFromSquare;
  ChevronRight = faChevronRight;
  MagnifyingGlassLocation = faMagnifyingGlassLocation;
  RectangXmark = faRectangleXmark;
  ChevronDown = faChevronDown;

  toggleStates = new Map<string, boolean>();

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
  totalPages = 1;
  totalCount = 0;
  pageSize = 20;
  nextPageUrl: string | null = null;
  previousPageUrl: string | null = null;
  markers = [] as any;
  textid: string = "";
  showWindow = false;
  ImageDetail: any = {};
  public loadedPlaces: any[] = [];
  hoveredImageId: number | null = null;

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
    console.log(`showContent called with textid="${textid}", pageNumber=${pageNumber}`);
  let url = `${this.linkedEventsApiRoot}place/?page=${pageNumber}&text=${textid}`;
    this.placeservice.getPlacesByUrl(url).subscribe(async response => {
      console.log(`API response for page ${pageNumber}:`, response);
      this.markers.forEach((marker: { setMap: (arg0: null) => any; }) => marker.setMap(null));
      this.markers = [];
      this.loadedPlaces = response.data || [];

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
      this.totalCount = response.meta.count;
      this.pageSize = response.meta.limit || 20;
      this.totalPages = Math.ceil(this.totalCount / this.pageSize);
      this.currentPage = pageNumber;
      console.log(`Updated currentPage: ${this.currentPage}, totalPages: ${this.totalPages}`);
    });
  }

  toggleInfo(placeId: string): void {
    const currentState = this.toggleStates.get(placeId) || false;
    this.toggleStates.set(placeId, !currentState);
  }

  doSearch(): void {
    this.currentPage = 1;
    this.showContent(this.textid, this.currentPage);
  }

  resetMap(): void {
    this.textid = '';
    this.currentPage = 1;
    this.initMap();
  }

  handleSearch(searchTerm: string): void {
    this.textid = searchTerm;
    this.currentPage = 1;
    this.showContent(this.textid, this.currentPage);
  }

  getImageById(imageId: number): void {
    this.hoveredImageId = imageId;
    this.placeservice.getPlaceImageById(imageId).subscribe((data: any) => {
      this.ImageDetail = data;
    });
  }

  closeWindow(): void {
    this.hoveredImageId = null;
  }

  // Pagination methods
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      console.log(`Next page clicked. Current: ${this.currentPage}, Going to: ${this.currentPage + 1}`);
      this.currentPage++;
      this.showContent(this.textid, this.currentPage);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      console.log(`Previous page clicked. Current: ${this.currentPage}, Going to: ${this.currentPage - 1}`);
      this.currentPage--;
      this.showContent(this.textid, this.currentPage);
    }
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      console.log(`goToPage clicked. Going to page: ${pageNumber}`);
      this.currentPage = pageNumber;
      this.showContent(this.textid, this.currentPage);
    }
  }

  get pages(): number[] {
    const pages: number[] = [];
    if (this.totalPages <= 7) {
      for (let i = 1; i <= this.totalPages; i++) pages.push(i);
    } else {
      if (this.currentPage <= 4) {
        pages.push(1,2,3,4,5,-1,this.totalPages);
      } else if (this.currentPage >= this.totalPages - 3) {
        pages.push(1,-1,this.totalPages-4,this.totalPages-3,this.totalPages-2,this.totalPages-1,this.totalPages);
      } else {
        pages.push(1,-1,this.currentPage-1,this.currentPage,this.currentPage+1,-1,this.totalPages);
      }
    }
    return pages;
  }
}