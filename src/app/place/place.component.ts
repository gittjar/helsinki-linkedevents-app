import { Component, OnDestroy, OnInit } from '@angular/core';
import { PlaceService } from '../place.service';
import { faArrowUpRightFromSquare, faChevronRight, faMagnifyingGlassLocation, faRectangleXmark, faChevronDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.css']
})
export class PlaceComponent implements OnInit, OnDestroy {
  ArrowUpRightIcon = faArrowUpRightFromSquare;
  ChevronRight = faChevronRight;
  MagnifyingGlassLocation = faMagnifyingGlassLocation;
  RectangXmark = faRectangleXmark;
  ChevronDown = faChevronDown;

  toggleStates = new Map<string, boolean>();

  linkedEventsApiRoot: string = 'https://api.hel.fi/linkedevents/v1/';
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
  division: string = "";
  showWindow = false;
  ImageDetail: any = {};
  public loadedPlaces: any[] = [];
  hoveredImageId: number | null = null;
  isSearching = false;
  noticeText = '';
  noticeType: 'warning' | 'error' = 'warning';
  noticeCountdown = 0;
  private noticeTimer: ReturnType<typeof setInterval> | null = null;
  private resetInputsOnNoticeDismiss = false;

  constructor(private placeservice: PlaceService) {}

  ngOnInit() {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.clearNoticeTimer();
  }

  initMap(): void {
    this.map = new google.maps.Map(document.getElementById("map")!, this.options);
    this.infoWindow = new google.maps.InfoWindow();
    this.showContent(this.textid, this.currentPage);
  }

  async showContent(textid: string, pageNumber: number, division?: string): Promise<void> {
    console.log(`showContent called with textid="${textid}", division="${division}", pageNumber=${pageNumber}`);
    
    this.isSearching = true;
    this.clearNotice();
    
    try {
      let response;
      
      if (division && division.trim()) {
        // Search by division (with optional text)
        response = await this.placeservice.searchPlacesAdvanced(textid, division, pageNumber).toPromise();
      } else if (textid && textid.trim()) {
        // Search by text only
        response = await this.placeservice.searchPlaces(textid, pageNumber).toPromise();
      } else {
        // Default search (all places)
        response = await this.placeservice.searchPlaces('', pageNumber).toPromise();
      }
      
      console.log(`API response for page ${pageNumber}:`, response);
      
      // Clear existing markers
      this.markers.forEach((marker: { setMap: (arg0: null) => any; }) => marker.setMap(null));
      this.markers = [];
      
      // Update places data
      this.loadedPlaces = response.data || [];
      
      // Update pagination info
      this.nextPageUrl = response.meta?.next || null;
      this.previousPageUrl = response.meta?.previous || null;
      this.totalCount = response.meta?.count || 0;
      this.pageSize = response.meta?.limit || 20;
      this.totalPages = Math.ceil(this.totalCount / this.pageSize);
      this.currentPage = pageNumber;
      
      console.log(`Updated currentPage: ${this.currentPage}, totalPages: ${this.totalPages}`);
      
      // Only process places with valid position data
      const validPlaces = this.loadedPlaces.filter(place => 
        place.position && 
        place.position.coordinates && 
        place.position.coordinates.length >= 2 &&
        place.name && 
        (place.name.fi || place.name.sv || place.name.en)
      );
      
      console.log(`Processing ${validPlaces.length} valid places out of ${this.loadedPlaces.length} total places`);

      const searchContext = this.getSearchContext(textid, division);
      if (this.loadedPlaces.length === 0) {
        this.setNotice(
          'warning',
          `Haulla ${searchContext} ei löytynyt tuloksia. Kokeile toista hakusanaa tai aluetta.`,
          true
        );
      } else if (validPlaces.length === 0) {
        this.setNotice(
          'warning',
          `Tuloksia löytyi haulla ${searchContext}, mutta niissä ei ollut riittäviä karttatietoja näytettäväksi.`,
          true
        );
      }

      // Add markers for valid places
      validPlaces.forEach((place: any) => {
        const marker = new google.maps.Marker({
          position: { lat: place.position.coordinates[1], lng: place.position.coordinates[0] },
          label: { 
            text: place.name.fi || place.name.sv || place.name.en || 'Unknown', 
            color: 'black', 
            fontWeight: '700', 
            fontFamily: 'Verdana', 
            fontSize: '13px' 
          },
          title: this.getPlaceTitle(place),
          animation: google.maps.Animation.DROP,
          icon: { url: '/assets/locationpin.png' },
          map: this.map
        });

        this.markers.push(marker);

        const infoUrl = place.info_url && place.info_url.fi 
          ? `<a href="${place.info_url.fi}" target="_blank" rel="noopener noreferrer">Lue lisää ></a>` 
          : "Ei lisätietoja saatavilla";
          
        const markerContent = `<div class="map-infowindow">
          <div class="map-infowindow-title">${place.name.fi || place.name.sv || place.name.en || 'Unknown'}</div>
          <div class="map-infowindow-content">${this.getPlaceAddress(place)}</div>
          <div class="map-infowindow-content">${place.postal_code || ''} ${place.address_locality?.fi || place.address_locality?.sv || place.address_locality?.en || ''}</div>
          <div class="map-infowindow-content">${infoUrl}</div>
        </div>`;

        marker.addListener("click", () => {
          this.infoWindow.setContent(markerContent);
          this.infoWindow.open(this.map, marker);
        });
      });
      
      // Center map on first valid place if available
      if (validPlaces.length > 0) {
        const firstPlace = validPlaces[0];
        this.map.setCenter({ 
          lat: firstPlace.position.coordinates[1], 
          lng: firstPlace.position.coordinates[0] 
        });
        this.map.setZoom(13);
      }
      
    } catch (error) {
      console.error('Error in showContent:', error);
      this.loadedPlaces = [];
      this.totalPages = 1;
      this.totalCount = 0;
      this.setNotice(
        'error',
        'Tietojen hakeminen epäonnistui. Tarkista verkkoyhteys ja yritä uudelleen.',
        false
      );
    } finally {
      this.isSearching = false;
    }
  }

  clearNotice(): void {
    this.clearNoticeTimer();
    this.noticeText = '';
    this.noticeCountdown = 0;
    this.resetInputsOnNoticeDismiss = false;
  }

  private setNotice(type: 'warning' | 'error', text: string, resetInputsOnDismiss: boolean): void {
    this.noticeType = type;
    this.noticeText = text;
    this.resetInputsOnNoticeDismiss = resetInputsOnDismiss;
    this.startNoticeCountdown();
  }

  private startNoticeCountdown(): void {
    this.clearNoticeTimer();
    this.noticeCountdown = 6;

    this.noticeTimer = setInterval(() => {
      this.noticeCountdown -= 1;

      if (this.noticeCountdown <= 0) {
        this.clearNoticeTimer();
        this.noticeText = '';
        this.noticeCountdown = 0;

        if (this.resetInputsOnNoticeDismiss) {
          this.resetSearchInputs();
        }

        this.resetInputsOnNoticeDismiss = false;
      }
    }, 1000);
  }

  private clearNoticeTimer(): void {
    if (this.noticeTimer) {
      clearInterval(this.noticeTimer);
      this.noticeTimer = null;
    }
  }

  private resetSearchInputs(): void {
    this.textid = '';
    this.division = '';
  }

  private getSearchContext(textid: string, division?: string): string {
    const text = (textid || '').trim();
    const area = (division || '').trim();

    if (text && area) {
      return `"${text}" alueella "${area}"`;
    }

    if (text) {
      return `"${text}"`;
    }

    if (area) {
      return `alueella "${area}"`;
    }

    return 'valituilla ehdoilla';
  }

  private getPlaceTitle(place: any): string {
    const name = place.name?.fi || place.name?.sv || place.name?.en || 'Unknown';
    const address = this.getPlaceAddress(place);
    return `${name} - ${address}`;
  }

  private getPlaceAddress(place: any): string {
    const street = place.street_address?.fi || place.street_address?.sv || place.street_address?.en || '';
    const locality = place.address_locality?.fi || place.address_locality?.sv || place.address_locality?.en || '';
    return `${street}${street && locality ? ', ' : ''}${locality}`;
  }

  toggleInfo(placeId: string): void {
    const currentState = this.toggleStates.get(placeId) || false;
    this.toggleStates.set(placeId, !currentState);
  }

  doSearch(): void {
    console.log('doSearch called with textid:', this.textid, 'division:', this.division);
    this.currentPage = 1;
    this.showContent(this.textid, this.currentPage, this.division);
  }

  doSearchByDivision(): void {
    console.log('doSearchByDivision called with division:', this.division);
    this.currentPage = 1;
    this.showContent('', this.currentPage, this.division);
  }

  resetMap(): void {
    this.textid = '';
    this.division = '';
    this.currentPage = 1;
    this.initMap();
  }

  handleSearch(searchTerm: string): void {
    this.textid = searchTerm;
    this.currentPage = 1;
    this.showContent(this.textid, this.currentPage, this.division);
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
      this.showContent(this.textid, this.currentPage, this.division);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      console.log(`Previous page clicked. Current: ${this.currentPage}, Going to: ${this.currentPage - 1}`);
      this.currentPage--;
      this.showContent(this.textid, this.currentPage, this.division);
    }
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages) {
      console.log(`goToPage clicked. Going to page: ${pageNumber}`);
      this.currentPage = pageNumber;
      this.showContent(this.textid, this.currentPage, this.division);
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

  // Image loading handlers
  onImageError(event: any): void {
    console.log('Image loading failed:', event.target.src);
    
    // Hide the broken image
    event.target.style.display = 'none';
    
    // Show the broken image placeholder
    const imageContainer = event.target.closest('.image-container');
    if (imageContainer) {
      const placeholder = imageContainer.querySelector('.broken-image-placeholder');
      if (placeholder) {
        (placeholder as HTMLElement).style.display = 'block';
      }
    }
  }

  onImageLoad(event: any): void {
    console.log('Image loaded successfully:', event.target.src);
    
    // Hide the broken image placeholder if it's visible
    const imageContainer = event.target.closest('.image-container');
    if (imageContainer) {
      const placeholder = imageContainer.querySelector('.broken-image-placeholder');
      if (placeholder) {
        (placeholder as HTMLElement).style.display = 'none';
      }
    }
  }
}