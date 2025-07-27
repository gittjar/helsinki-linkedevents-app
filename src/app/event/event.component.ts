import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { Select, initTE } from "tw-elements";
import { faArrowUpRightFromSquare, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { DoSearch, SearchStadion, SearchLapset, SearchHipHop, SearchHIFK, SearchJokerit, SearchKonsertti } from './search-functions';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {
  arrowUpRightFromBox = faArrowUpRightFromSquare;
  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;

  isLoading: boolean = true;
  searchText: string = "";
  searchTextDate: string = "";
  newPageNumber: number = 1;
  events: any;
  filteredEvents: any;
  currentDate: Date | undefined;
  tomorrowDate: Date | undefined;
  tomorrow2Date: Date | undefined;
  totalPages: number | undefined;
  pages: number[] = [];
  button1Clicked: boolean = false;
  button2Clicked: boolean = false;

  // Sorting properties
  currentSort: string = 'default';
  showOnlyFutureEvents: boolean = false;
  searchType: 'text' | 'date' = 'text'; // Track search type for loading message
  availableSorts = [
    { key: 'default', label: 'Oletusjärjestys' },
    { key: 'coming-soon', label: 'Tulevat ensin' },
    { key: 'date-desc', label: 'Uusimmat ensin' },
    { key: 'date-asc', label: 'Vanhimmat ensin' },
    { key: 'alphabetical', label: 'Aakkosjärjestys' },
    { key: 'free-first', label: 'Ilmaiset ensin' }
  ];

  // Image modal properties
  showImageModal: boolean = false;
  modalImageUrl: string = '';

  constructor(private http: EventService) {}

  ngOnInit(): void {
    this.currentDate = new Date();
    this.tomorrowDate = new Date(this.currentDate);
    this.tomorrowDate.setDate(this.tomorrowDate.getDate() + 1);
    this.tomorrow2Date = new Date(this.currentDate);
    this.tomorrow2Date.setDate(this.tomorrow2Date.getDate() + 2);

    this.getAllEvents('', 1);
    initTE({ Select });
    this.loadingDataWindow();
  }

  loadingDataWindow() {
    setTimeout(() => {
      this.isLoading = false;
    }, 2700);
  }

  getAllEvents(searchText: string, pageNumber: number): void {
    this.searchType = 'text';
    this.http.getEvent(searchText, pageNumber).subscribe((data: any) => {
      this.events = data;
      this.filteredEvents = data.data;
      this.totalPages = Math.ceil(data.meta.count / 20);
      this.pages = this.getPaginationPages();
      
      // Reset sort and filter to default when new search is performed
      this.currentSort = 'default';
      this.showOnlyFutureEvents = false;
    });
  }

  getAllEventsDate(searchDate: string, pageNumber: number): void {
    this.searchType = 'date';
    this.http.getEventDate(searchDate, pageNumber).subscribe((data: any) => {
      this.events = data;
      this.filterEventsByDate(searchDate);
      this.totalPages = Math.ceil(this.filteredEvents.length / 20);
      this.pages = this.getPaginationPages();
      
      // Reset sort and filter to default when new search is performed
      this.currentSort = 'default';
      this.showOnlyFutureEvents = false;
    });
  }

  filterEventsByDate(date: string): void {
    this.filteredEvents = this.events.data.filter((event: any) => {
      const eventDate = new Date(event.start_time).toISOString().split('T')[0];
      return eventDate === date;
    });
  }

  onPageChangePlus(): void {
    this.newPageNumber++;
    this.getAllEvents(this.searchText, this.newPageNumber);
  }

  onPageChangeMinus(): void {
    if (this.newPageNumber > 1) {
      this.newPageNumber--;
      this.getAllEvents(this.searchText, this.newPageNumber);
    }
  }

  onPageChangePlusDate(): void {
    this.newPageNumber++;
    this.getAllEventsDate(this.searchTextDate, this.newPageNumber);
  }

  onPageChangeMinusDate(): void {
    if (this.newPageNumber > 1) {
      this.newPageNumber--;
      this.getAllEventsDate(this.searchTextDate, this.newPageNumber);
    }
  }

  goToPage(page: number): void {
    this.newPageNumber = page;
    this.getAllEvents(this.searchText, this.newPageNumber);
  }

  changeToday() {
    this.searchTextDate = this.getCurrentDate();
    this.getAllEventsDate(this.searchTextDate, this.newPageNumber = 1);
  }

  changeToday1() {
    this.searchTextDate = this.getTomorrowDate();
    this.getAllEventsDate(this.searchTextDate, this.newPageNumber = 1);
  }

  changeToday2() {
    this.searchTextDate = this.getDayAfterTomorrowDate();
    this.getAllEventsDate(this.searchTextDate, this.newPageNumber = 1);
  }

  getCurrentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getTomorrowDate(): string {
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const year = tomorrowDate.getFullYear();
    const month = (tomorrowDate.getMonth() + 1).toString().padStart(2, '0');
    const day = tomorrowDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getDayAfterTomorrowDate(): string {
    const dayAfterTomorrowDate = new Date();
    dayAfterTomorrowDate.setDate(dayAfterTomorrowDate.getDate() + 2);
    const year = dayAfterTomorrowDate.getFullYear();
    const month = (dayAfterTomorrowDate.getMonth() + 1).toString().padStart(2, '0');
    const day = dayAfterTomorrowDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getPaginationPages(): number[] {
    const totalPages = this.totalPages || 0;
    const currentPage = this.newPageNumber;
    const pages: number[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, -1, totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, -1, totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, -1, currentPage - 1, currentPage, currentPage + 1, -1, totalPages);
      }
    }

    return pages;
  }

  onButton2Click() {
    this.button2Clicked = !this.button2Clicked;
  }

  // Enhanced sorting methods
  sortEvents(sortType: string) {
    this.currentSort = sortType;
    this.applySortAndFilter();
  }

  // Toggle future events filter
  toggleFutureEventsFilter() {
    this.showOnlyFutureEvents = !this.showOnlyFutureEvents;
    this.applySortAndFilter();
  }

  // Apply both sorting and filtering
  applySortAndFilter() {
    // Start with all events or filtered events (depending on whether we're searching)
    let eventsToWork = [...this.events?.data || this.filteredEvents];
    
    // Apply the future events filter if enabled
    if (this.showOnlyFutureEvents) {
      eventsToWork = this.filterFutureEvents(eventsToWork);
    }
    
    // Then apply sorting
    switch (this.currentSort) {
      case 'coming-soon':
        eventsToWork = this.sortByComingSoon(eventsToWork);
        break;
      case 'date-desc':
        eventsToWork = this.sortByDate(eventsToWork, false);
        break;
      case 'date-asc':
        eventsToWork = this.sortByDate(eventsToWork, true);
        break;
      case 'alphabetical':
        eventsToWork = this.sortAlphabetically(eventsToWork);
        break;
      case 'free-first':
        eventsToWork = this.sortByFreeFirst(eventsToWork);
        break;
      default:
        // Keep original order
        break;
    }
    
    this.filteredEvents = eventsToWork;
  }

  // Filter to show only future events
  filterFutureEvents(events: any[]): any[] {
    const now = new Date();
    return events.filter((event: any) => {
      const eventDate = new Date(event.start_time);
      return eventDate >= now;
    });
  }

  // Updated sorting methods that work with filtered arrays
  sortByComingSoon(events: any[] = this.filteredEvents): any[] {
    const now = new Date();
    return events.sort((a: any, b: any) => {
      const aDate = new Date(a.start_time);
      const bDate = new Date(b.start_time);
      
      // First, separate future and past events
      const aIsFuture = aDate >= now;
      const bIsFuture = bDate >= now;
      
      if (aIsFuture && !bIsFuture) return -1;
      if (!aIsFuture && bIsFuture) return 1;
      
      // If both are future or both are past, sort by date
      if (aIsFuture && bIsFuture) {
        return aDate.getTime() - bDate.getTime(); // Nearest future first
      } else {
        return bDate.getTime() - aDate.getTime(); // Most recent past first
      }
    });
  }

  sortByDate(events: any[] = this.filteredEvents, isAsc: boolean): any[] {
    return events.sort((a: any, b: any) => {
      const aDate = new Date(a.start_time);
      const bDate = new Date(b.start_time);
      return isAsc ? aDate.getTime() - bDate.getTime() : bDate.getTime() - aDate.getTime();
    });
  }

  sortAlphabetically(events: any[] = this.filteredEvents): any[] {
    return events.sort((a: any, b: any) => {
      const aName = (a.name?.fi || a.name?.en || '').toLowerCase();
      const bName = (b.name?.fi || b.name?.en || '').toLowerCase();
      return aName.localeCompare(bName);
    });
  }

  sortByFreeFirst(events: any[] = this.filteredEvents): any[] {
    return events.sort((a: any, b: any) => {
      const aIsFree = a.offers?.[0]?.is_free === true;
      const bIsFree = b.offers?.[0]?.is_free === true;
      
      if (aIsFree && !bIsFree) return -1;
      if (!aIsFree && bIsFree) return 1;
      
      // If both are free or both are paid, sort by date (coming soon)
      const aDate = new Date(a.start_time);
      const bDate = new Date(b.start_time);
      return aDate.getTime() - bDate.getTime();
    });
  }

  // Legacy method for backwards compatibility
  sortDate(isAsc: boolean) {
    this.filteredEvents = this.sortByDate(this.filteredEvents, isAsc);
  }

  // Image modal methods
  openImageModal(imageUrl: string): void {
    this.modalImageUrl = imageUrl;
    this.showImageModal = true;
    // Prevent body scrolling when modal is open
    document.body.style.overflow = 'hidden';
  }

  closeImageModal(): void {
    this.showImageModal = false;
    this.modalImageUrl = '';
    // Restore body scrolling
    document.body.style.overflow = 'auto';
  }

  // Check if event has ticket information to display
  hasTicketInfo(event: any): boolean {
    return event?.offers?.[0]?.is_free !== undefined ||
           event?.offers?.[0]?.price?.fi ||
           event?.audience_min_age ||
           event?.audience_max_age;
  }

  // Helper method to check if event is past
  isEventPast(event: any): boolean {
    if (!event.start_time) return false;
    const eventDate = new Date(event.start_time);
    const now = new Date();
    return eventDate < now;
  }

  // Helper method to check if event is happening today
  isEventToday(event: any): boolean {
    if (!event.start_time) return false;
    const eventDate = new Date(event.start_time);
    const today = new Date();
    return eventDate.toDateString() === today.toDateString();
  }

  // Helper method to check if event is happening tomorrow
  isEventTomorrow(event: any): boolean {
    if (!event.start_time) return false;
    const eventDate = new Date(event.start_time);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return eventDate.toDateString() === tomorrow.toDateString();
  }

  // Helper method to get event status
  getEventStatus(event: any): string {
    if (!event.event_status) return '';
    
    switch (event.event_status) {
      case 'EventScheduled':
        return 'Suunniteltu';
      case 'EventRescheduled':
        return 'Siirretty';
      case 'EventCancelled':
        return 'Peruttu';
      case 'EventPostponed':
        return 'Lykätty';
      default:
        return event.event_status;
    }
  }

  // Helper method to get event type
  getEventType(event: any): string {
    if (!event.super_event_type) return '';
    
    switch (event.super_event_type) {
      case 'recurring':
        return 'Toistuva tapahtuma';
      case 'umbrella':
        return 'Sateenvarjotapahtuma';
      default:
        return event.super_event_type;
    }
  }

  // Helper method to check if event has capacity info
  hasCapacityInfo(event: any): boolean {
    return event.maximum_attendee_capacity !== null || event.minimum_attendee_capacity !== null;
  }

  // Helper method to get audience info
  getAudienceInfo(event: any): string {
    if (event.audience_min_age && event.audience_max_age) {
      return `${event.audience_min_age}-${event.audience_max_age} vuotta`;
    } else if (event.audience_min_age) {
      return `${event.audience_min_age}+ vuotta`;
    } else if (event.audience_max_age) {
      return `alle ${event.audience_max_age} vuotta`;
    }
    return '';
  }

  // Helper method to format date for display
  getFormattedSearchDate(): string {
    if (this.searchTextDate) {
      const [year, month, day] = this.searchTextDate.split('-');
      return `${day}.${month}.${year}`;
    }
    return '';
  }

  // Handle image loading errors
  onImageError(event: any): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.getPlaceholderImageUrl();
    imgElement.onerror = null; // Prevent infinite loop
  }

  // Get placeholder image URL
  getPlaceholderImageUrl(): string {
    // Create a nice SVG placeholder
    const svg = `
      <svg width="640" height="360" viewBox="0 0 640 360" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#e2e8f0;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#cbd5e1;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="640" height="360" fill="url(#grad)"/>
        <g transform="translate(320, 180)">
          <circle cx="0" cy="-20" r="40" fill="#94a3b8" opacity="0.6"/>
          <rect x="-60" y="10" width="120" height="80" rx="8" fill="#94a3b8" opacity="0.4"/>
          <polygon points="-20,40 -10,25 10,35 20,20 30,30 30,70 -30,70" fill="#64748b" opacity="0.5"/>
          <text x="0" y="100" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#64748b" opacity="0.7">
            Ei kuvaa saatavilla
          </text>
        </g>
      </svg>
    `;
    return 'data:image/svg+xml;base64,' + btoa(svg);
  }

  // Handle modal image errors
  onModalImageError(event: any): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.src = this.getPlaceholderImageUrl();
    imgElement.onerror = null; // Prevent infinite loop
  }

  // Check if image URL is valid
  hasValidImage(event: any): boolean {
    return event?.images && event?.images?.length > 0 && event?.images[0]?.url;
  }

  // Get safe image URL with fallback
  getSafeImageUrl(event: any): string {
    if (this.hasValidImage(event)) {
      return event.images[0].url;
    }
    return this.getPlaceholderImageUrl();
  }

  // Get image title with fallback
  getImageTitle(event: any): string {
    if (this.hasValidImage(event)) {
      const image = event.images[0];
      const license = image.license ? `lisenssi: ${image.license}` : '';
      const photographer = image.photographer_name ? `kuvaaja: ${image.photographer_name}` : '';
      return [license, photographer].filter(Boolean).join(', ');
    }
    return 'Kuva ei saatavilla';
  }

  // Location helper methods
  hasLocation(event: any): boolean {
    return event?.location?.name?.fi || event?.location?.name?.en || event?.location?.street_address?.fi;
  }

  hasValidCoordinates(event: any): boolean {
    return event?.location?.position?.coordinates && 
           event.location.position.coordinates.length === 2 &&
           event.location.position.coordinates[0] !== null &&
           event.location.position.coordinates[1] !== null;
  }

  getGoogleMapsLink(latitude: number, longitude: number): string {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  }

  // Helper method to get language name from language object or code
  getLanguageName(language: any): string {
    if (typeof language === 'string') {
      // If it's just a language code
      const languageMap: { [key: string]: string } = {
        'fi': 'Suomi',
        'sv': 'Svenska',
        'en': 'English',
        'de': 'Deutsch',
        'fr': 'Français',
        'es': 'Español',
        'ru': 'Русский'
      };
      return languageMap[language] || language;
    } else if (language?.name) {
      // If it's a language object with name property
      return language.name?.fi || language.name?.en || language.name?.sv || language.id;
    } else if (language?.id) {
      // If it's a language object with id
      return this.getLanguageName(language.id);
    }
    return 'Tuntematon kieli';
  }

  // Check if sorting controls should be shown
  shouldShowSortControls(): boolean {
    return this.totalPages !== undefined && this.totalPages > 1;
  }

  // Search methods
  DoSearch(): void {
    this.isLoading = true;
    this.loadingDataWindow();
    this.getAllEvents(this.searchText, this.newPageNumber = 1);
  }

  SearchDate(): void {
    this.isLoading = true;
    this.loadingDataWindow();
    this.getAllEventsDate(this.searchTextDate, this.newPageNumber = 1);
  }

  SearchStadion(): void {
    this.isLoading = true;
    this.loadingDataWindow();
    this.getAllEvents(this.searchText = 'Stadion', this.newPageNumber = 1);
  }

  SearchLapset(): void {
    this.isLoading = true;
    this.loadingDataWindow();
    this.getAllEvents(this.searchText = 'Lapset', this.newPageNumber = 1);
  }

  SearchHipHop(): void {
    this.isLoading = true;
    this.loadingDataWindow();
    this.getAllEvents(this.searchText = 'Hiphop', this.newPageNumber = 1);
  }

  SearchHIFK(): void {
    this.isLoading = true;
    this.loadingDataWindow();
    this.getAllEvents(this.searchText = 'HIFK', this.newPageNumber = 1);
  }

  SearchJokerit(): void {
    this.isLoading = true;
    this.loadingDataWindow();
    this.getAllEvents(this.searchText = 'Jokerit', this.newPageNumber = 1);
  }

  SearchKonsertti(): void {
    this.isLoading = true;
    this.loadingDataWindow();
    this.getAllEvents(this.searchText = 'Konsertti', this.newPageNumber = 1);
  }
}