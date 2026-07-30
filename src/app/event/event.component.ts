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
  filteredEvents: any[] = [];
  currentDate: Date | undefined;
  tomorrowDate: Date | undefined;
  tomorrow2Date: Date | undefined;
  totalPages: number | undefined;
  pages: number[] = [];
  button1Clicked: boolean = false;
  button2Clicked: boolean = false;
  expandedCards = new Set<string>();
  expandedOccurrences = new Set<string>();

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
    this.http.getEvent(searchText, pageNumber).subscribe((data: any) => {
      this.events = data;
      this.filteredEvents = this.groupEventsByOccurrence(data.data);
      this.totalPages = Math.ceil(data.meta.count / 20);
      this.pages = this.getPaginationPages();
    });
  }

  groupEventsByOccurrence(events: any[]): any[] {
    if (!events) return [];
    const groups = new Map<string, any>();
    for (const event of events) {
      const name = event?.name?.fi?.trim();
      if (!name) {
        groups.set(event.id, { ...event, occurrences: [event] });
        continue;
      }
      const locationId = event?.location?.id || '';
      const key = `${name}__${locationId}`;
      if (groups.has(key)) {
        groups.get(key).occurrences.push(event);
      } else {
        groups.set(key, { ...event, occurrences: [event] });
      }
    }
    const result: any[] = [];
    for (const group of groups.values()) {
      group.occurrences.sort((a: any, b: any) =>
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      );
      result.push(group);
    }
    return result;
  }

  getNextOccurrence(event: any): any {
    const occs: any[] = event?.occurrences;
    if (!occs || occs.length <= 1) return event;
    const now = new Date();
    return occs.find(o => new Date(o.start_time) >= now) || occs[occs.length - 1];
  }

  getAllEventsDate(searchDate: string, pageNumber: number): void {
    this.http.getEventDate(searchDate, pageNumber).subscribe((data: any) => {
      this.events = data;
      this.filteredEvents = this.groupEventsByOccurrence(data.data);
      this.totalPages = Math.ceil(data.meta.count / 20);
      this.pages = this.getPaginationPages();
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

  sortDate(isAsc: boolean) {
    const getTime = (event: any) => new Date(this.getNextOccurrence(event).start_time).getTime();
    if (isAsc) {
      this.filteredEvents.sort((a: any, b: any) => getTime(a) - getTime(b));
    } else {
      this.filteredEvents.sort((a: any, b: any) => getTime(b) - getTime(a));
    }
  }

  getGoogleMapsLink(latitude: number, longitude: number): string {
    return `https://www.google.com/maps?q=${latitude},${longitude}`;
  }

  hasValidCoordinates(event: any): boolean {
  const coords = event?.location?.position?.coordinates;
  return Array.isArray(coords) &&
    coords.length === 2 &&
    coords[0] != null &&
    coords[1] != null &&
    this.getGoogleMapsLink(coords[1], coords[0]) !== 'https://www.google.com/maps?q=null,null';
}

hasLocation(event: any): boolean {
  // Returns true if there is an address or valid coordinates
  return (
    (event?.location?.street_address?.fi && event?.location?.postal_code && event?.location?.address_locality?.fi) ||
    this.hasValidCoordinates(event)
  );
}

  // Use the imported search functions
  DoSearch() {
    DoSearch(this);
  }

  SearchStadion() {
    SearchStadion(this);
  }

  SearchLapset() {
    SearchLapset(this);
  }

  SearchHipHop() {
    SearchHipHop(this);
  }

  SearchHIFK() {
    SearchHIFK(this);
  }

  SearchJokerit() {
    SearchJokerit(this);
  }

  SearchKonsertti() {
    SearchKonsertti(this);
  }

  SearchDate() {
    this.isLoading = true;
    this.loadingDataWindow();
    this.getAllEventsDate(this.searchTextDate, this.newPageNumber = 1);
  }

  // Helper method to check if event has additional information
  hasAdditionalInfo(event: any): boolean {
    return (event?.offers?.[0]?.is_free !== undefined) ||
           (event?.offers?.[0]?.price?.fi?.length > 0) ||
           (event?.audience_min_age?.length > 0) ||
           (event?.audience_max_age?.length > 0);
  }

  // Helper method to check if event is past (all occurrences past)
  isEventPast(event: any): boolean {
    const rep = this.getNextOccurrence(event);
    if (!rep?.start_time) return false;
    return new Date(rep.start_time) < new Date();
  }

  // Helper method to check if event is happening today (next occurrence)
  isEventToday(event: any): boolean {
    const rep = this.getNextOccurrence(event);
    if (!rep?.start_time) return false;
    return new Date(rep.start_time).toDateString() === new Date().toDateString();
  }

  // Helper method to check if event is happening tomorrow (next occurrence)
  isEventTomorrow(event: any): boolean {
    const rep = this.getNextOccurrence(event);
    if (!rep?.start_time) return false;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return new Date(rep.start_time).toDateString() === tomorrow.toDateString();
  }

  isOccurrencePast(occ: any): boolean {
    return new Date(occ.start_time) < new Date();
  }

  isOccurrenceToday(occ: any): boolean {
    return new Date(occ.start_time).toDateString() === new Date().toDateString();
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

  // Helper method to check if event has capacity info
  hasCapacityInfo(event: any): boolean {
    return event.maximum_attendee_capacity !== null || event.minimum_attendee_capacity !== null;
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

  toggleCard(id: string): void {
    if (this.expandedCards.has(id)) {
      this.expandedCards.delete(id);
    } else {
      this.expandedCards.add(id);
    }
  }

  isCardExpanded(id: string): boolean {
    return this.expandedCards.has(id);
  }

  toggleOccurrences(id: string): void {
    if (this.expandedOccurrences.has(id)) {
      this.expandedOccurrences.delete(id);
    } else {
      this.expandedOccurrences.add(id);
    }
  }

  isOccurrencesExpanded(id: string): boolean {
    return this.expandedOccurrences.has(id);
  }
}