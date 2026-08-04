import { Component, OnDestroy, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { faArrowUpRightFromSquare, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

type EventScope = 'today' | 'tomorrow' | 'weekend' | 'future' | 'past' | 'all' | 'customDate';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit, OnDestroy {
  arrowUpRightFromBox = faArrowUpRightFromSquare;
  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;

  isLoading = true;
  searchText = '';
  searchTextDate = '';
  newPageNumber: number = 1;
  events: any;
  filteredEvents: any[] = [];
  totalPages = 1;
  totalCount = 0;
  pages: number[] = [];
  includePastWithFuture = false;
  sortAscending = true;
  activeScope: EventScope = 'today';
  scopeOptions: { key: EventScope; label: string }[] = [
    { key: 'today', label: 'Tänään' },
    { key: 'tomorrow', label: 'Huomenna' },
    { key: 'weekend', label: 'Viikonloppu' },
    { key: 'future', label: 'Tulevat' },
    { key: 'past', label: 'Menneet' },
    { key: 'all', label: 'Kaikki' }
  ];
  keywordSearchTerm = '';
  keywordOptions: any[] = [];
  selectedKeywordId = '';
  selectedKeywordLabel = '';
  keywordCurrentPage = 1;
  keywordHasMore = false;
  keywordSearchDebounce: any = null;
  isKeywordDropdownOpen = false;
  highlightedKeywordIndex = -1;
  showOnlyFreeEvents = false;
  isKeywordLoading = false;
  expandedCards = new Set<string>();
  expandedOccurrences = new Set<string>();

  constructor(private http: EventService) {}

  ngOnInit(): void {
    this.searchTextDate = this.toISODate(new Date());
    this.loadKeywordOptions(true);
    this.applyScope('today');
  }

  ngOnDestroy(): void {
    if (this.keywordSearchDebounce) {
      clearTimeout(this.keywordSearchDebounce);
      this.keywordSearchDebounce = null;
    }
  }

  loadingDataWindow() {
    // Kept for compatibility with old search helper calls.
    this.isLoading = true;
  }

  getAllEvents(searchText: string, pageNumber: number): void {
    this.searchText = searchText || '';
    this.newPageNumber = pageNumber;
    this.loadEvents();
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
    result.sort((a: any, b: any) =>
      new Date(this.getNextOccurrence(a)?.start_time || 0).getTime() -
      new Date(this.getNextOccurrence(b)?.start_time || 0).getTime()
    );
    return result;
  }

  getNextOccurrence(event: any): any {
    const occs: any[] = event?.occurrences;
    if (!occs || occs.length <= 1) return event;
    const now = new Date();
    return occs.find(o => new Date(o.start_time) >= now) || occs[occs.length - 1];
  }

  getAllEventsDate(searchDate: string, pageNumber: number): void {
    this.searchTextDate = searchDate;
    this.newPageNumber = pageNumber;
    this.activeScope = 'customDate';
    this.loadEvents();
  }

  onPageChangePlus(): void {
    if (this.newPageNumber < this.totalPages) {
      this.newPageNumber++;
      this.loadEvents();
    }
  }

  onPageChangeMinus(): void {
    if (this.newPageNumber > 1) {
      this.newPageNumber--;
      this.loadEvents();
    }
  }

  goToPage(page: number): void {
    this.newPageNumber = page;
    this.loadEvents();
  }

  applyScope(scope: EventScope): void {
    this.activeScope = scope;
    this.newPageNumber = 1;
    this.loadEvents();
  }

  onSearchSubmit(): void {
    this.newPageNumber = 1;
    this.loadEvents();
  }

  SearchDate() {
    this.newPageNumber = 1;
    this.activeScope = 'customDate';
    this.loadEvents();
  }

  clearSearch(): void {
    this.searchText = '';
    this.newPageNumber = 1;
    this.loadEvents();
  }

  toggleOnlyFreeEvents(): void {
    this.showOnlyFreeEvents = !this.showOnlyFreeEvents;
    this.newPageNumber = 1;
    this.loadEvents();
  }

  selectKeyword(keyword: any): void {
    const keywordId = keyword?.id || '';
    this.selectedKeywordId = this.selectedKeywordId === keywordId ? '' : keywordId;
    this.selectedKeywordLabel = this.selectedKeywordId ? this.getKeywordLabel(keyword) : '';
    if (this.selectedKeywordId) {
      this.keywordSearchTerm = this.selectedKeywordLabel;
    }
    this.isKeywordDropdownOpen = false;
    this.highlightedKeywordIndex = -1;
    this.newPageNumber = 1;
    this.loadEvents();
  }

  clearKeyword(): void {
    if (!this.selectedKeywordId) {
      return;
    }

    this.selectedKeywordId = '';
    this.selectedKeywordLabel = '';
    this.keywordSearchTerm = '';
    this.highlightedKeywordIndex = -1;
    this.newPageNumber = 1;
    this.loadEvents();
  }

  onKeywordSearchInput(value: string): void {
    this.keywordSearchTerm = value;
    this.isKeywordDropdownOpen = true;
    this.highlightedKeywordIndex = -1;

    if (this.selectedKeywordId) {
      this.selectedKeywordId = '';
      this.selectedKeywordLabel = '';
    }

    if (this.keywordSearchDebounce) {
      clearTimeout(this.keywordSearchDebounce);
    }

    this.keywordSearchDebounce = setTimeout(() => {
      this.keywordCurrentPage = 1;
      this.loadKeywordOptions(true);
    }, 280);
  }

  onKeywordFocus(): void {
    this.isKeywordDropdownOpen = true;
    if (this.keywordOptions.length > 0) {
      this.highlightedKeywordIndex = 0;
    }
    if (this.keywordOptions.length === 0) {
      this.keywordCurrentPage = 1;
      this.loadKeywordOptions(true);
    }
  }

  onKeywordBlur(): void {
    setTimeout(() => {
      this.isKeywordDropdownOpen = false;
      this.highlightedKeywordIndex = -1;
    }, 140);
  }

  onKeywordKeydown(event: KeyboardEvent): void {
    const hasOptions = this.keywordOptions.length > 0;

    if (event.key === 'Escape') {
      this.isKeywordDropdownOpen = false;
      this.highlightedKeywordIndex = -1;
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.isKeywordDropdownOpen = true;
      if (!hasOptions) {
        return;
      }

      this.highlightedKeywordIndex = Math.min(this.highlightedKeywordIndex + 1, this.keywordOptions.length - 1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.isKeywordDropdownOpen = true;
      if (!hasOptions) {
        return;
      }

      if (this.highlightedKeywordIndex <= 0) {
        this.highlightedKeywordIndex = 0;
      } else {
        this.highlightedKeywordIndex -= 1;
      }
      return;
    }

    if (event.key === 'Enter' && this.isKeywordDropdownOpen && this.highlightedKeywordIndex >= 0 && hasOptions) {
      event.preventDefault();
      this.selectKeyword(this.keywordOptions[this.highlightedKeywordIndex]);
    }
  }

  onKeywordHover(index: number): void {
    this.highlightedKeywordIndex = index;
  }

  getActiveKeywordOptionId(): string | null {
    if (this.highlightedKeywordIndex < 0 || this.highlightedKeywordIndex >= this.keywordOptions.length) {
      return null;
    }

    return this.getKeywordOptionId(this.highlightedKeywordIndex);
  }

  getKeywordOptionId(index: number): string {
    return `keyword-option-${index}`;
  }

  loadMoreKeywords(): void {
    if (!this.keywordHasMore || this.isKeywordLoading) {
      return;
    }

    this.keywordCurrentPage += 1;
    this.loadKeywordOptions(false);
  }

  toggleIncludePastWithFuture(): void {
    this.includePastWithFuture = !this.includePastWithFuture;
    if (this.activeScope === 'future') {
      this.newPageNumber = 1;
      this.loadEvents();
    }
  }

  getPaginationPages(): number[] {
    const totalPages = this.totalPages;
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

  sortDate(isAsc: boolean) {
    this.sortAscending = isAsc;
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
  return (
    (event?.location?.street_address?.fi && event?.location?.postal_code && event?.location?.address_locality?.fi) ||
    this.hasValidCoordinates(event)
  );
}

  DoSearch() {
    this.onSearchSubmit();
  }

  hasAdditionalInfo(event: any): boolean {
    return (event?.offers?.[0]?.is_free !== undefined) ||
           (event?.offers?.[0]?.price?.fi?.length > 0) ||
           (event?.audience_min_age != null) ||
           (event?.audience_max_age != null) ||
           !!event?.provider?.fi;
  }

  isEventPast(event: any): boolean {
    const rep = this.getNextOccurrence(event);
    if (!rep?.start_time) return false;
    return new Date(rep.start_time) < new Date();
  }

  isEventToday(event: any): boolean {
    const rep = this.getNextOccurrence(event);
    if (!rep?.start_time) return false;
    return new Date(rep.start_time).toDateString() === new Date().toDateString();
  }

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

  getAudienceInfo(event: any): string {
    if (event?.audience_min_age != null && event?.audience_max_age != null) {
      return `${event.audience_min_age}-${event.audience_max_age} vuotta`;
    } else if (event?.audience_min_age != null) {
      return `${event.audience_min_age}+ vuotta`;
    } else if (event?.audience_max_age != null) {
      return `alle ${event.audience_max_age} vuotta`;
    }
    return '';
  }

  hasCapacityInfo(event: any): boolean {
    return event?.maximum_attendee_capacity != null || event?.minimum_attendee_capacity != null;
  }

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

  getCardId(event: any): string {
    if (event?.id) {
      return String(event.id);
    }

    if (event?.['@id']) {
      return String(event['@id']);
    }

    const fallbackName = event?.name?.fi || event?.name?.en || 'event';
    const fallbackTime = this.getNextOccurrence(event)?.start_time || '';
    return `${fallbackName}-${fallbackTime}`;
  }

  getScopeLabel(): string {
    switch (this.activeScope) {
      case 'today':
        return 'Tänään';
      case 'tomorrow':
        return 'Huomenna';
      case 'weekend':
        return 'Seuraava viikonloppu';
      case 'future':
        return this.includePastWithFuture ? 'Tulevat + menneet' : 'Tulevat';
      case 'past':
        return 'Menneet';
      case 'all':
        return 'Kaikki';
      case 'customDate':
        return `Päivä ${this.searchTextDate}`;
      default:
        return '';
    }
  }

  getKeywordLabel(keyword: any): string {
    return keyword?.name?.fi || keyword?.name?.en || keyword?.name?.sv || keyword?.id || 'Aihe';
  }

  isFreeEvent(event: any): boolean {
    return event?.offers?.some((offer: any) => offer?.is_free === true) || false;
  }

  isPaidEvent(event: any): boolean {
    const hasPriceText = !!event?.offers?.some((offer: any) => {
      const fi = offer?.price?.fi;
      const en = offer?.price?.en;
      const sv = offer?.price?.sv;
      return !!(fi || en || sv);
    });

    return event?.offers?.some((offer: any) => offer?.is_free === false) || hasPriceText;
  }

  getPriceLabel(event: any): string {
    const offer = event?.offers?.find((item: any) => item?.price?.fi || item?.price?.en || item?.price?.sv);
    if (!offer) {
      return '';
    }

    return offer.price.fi || offer.price.en || offer.price.sv || '';
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

  private loadEvents(): void {
    this.isLoading = true;

    const query = this.getQueryFromScope();
    this.http.getEvents(query).subscribe({
      next: (data: any) => {
        this.events = data;
        this.totalCount = data?.meta?.count || 0;
        this.totalPages = Math.max(Math.ceil(this.totalCount / 20), 1);

        const grouped = this.groupEventsByOccurrence(data?.data || []);
        this.filteredEvents = this.filterByScope(grouped).filter((event) => {
          if (!this.showOnlyFreeEvents) {
            return true;
          }

          return this.isFreeEvent(event);
        });
        this.sortDate(this.sortAscending);
        this.pages = this.getPaginationPages();
        this.isLoading = false;
      },
      error: () => {
        this.filteredEvents = [];
        this.totalCount = 0;
        this.totalPages = 1;
        this.pages = [];
        this.isLoading = false;
      }
    });
  }

  private getQueryFromScope(): { text?: string; page: number; start?: string; end?: string } {
    const today = this.startOfDay(new Date());
    const tomorrow = this.startOfDay(this.addDays(today, 1));
    const yesterday = this.startOfDay(this.addDays(today, -1));
    const query: { text?: string; page: number; start?: string; end?: string; keyword?: string } = {
      text: this.searchText,
      page: this.newPageNumber
    };

    if (this.selectedKeywordId) {
      query.keyword = this.selectedKeywordId;
    }

    switch (this.activeScope) {
      case 'today':
        query.start = this.toISODate(today);
        query.end = this.toISODate(today);
        break;
      case 'tomorrow':
        query.start = this.toISODate(tomorrow);
        query.end = this.toISODate(tomorrow);
        break;
      case 'weekend': {
        const weekend = this.getNextWeekend();
        query.start = this.toISODate(weekend.saturday);
        query.end = this.toISODate(weekend.sunday);
        break;
      }
      case 'future':
        if (!this.includePastWithFuture) {
          query.start = this.toISODate(today);
        }
        break;
      case 'past':
        query.end = this.toISODate(yesterday);
        break;
      case 'customDate':
        query.start = this.searchTextDate;
        query.end = this.searchTextDate;
        break;
      case 'all':
      default:
        break;
    }

    return query;
  }

  private loadKeywordOptions(reset: boolean): void {
    this.isKeywordLoading = true;
    this.http.getKeywords({ text: this.keywordSearchTerm, page: this.keywordCurrentPage }).subscribe({
      next: (response: any) => {
        const incoming = Array.isArray(response?.data) ? response.data : [];
        this.keywordOptions = reset ? incoming : [...this.keywordOptions, ...incoming];
        this.keywordHasMore = !!response?.meta?.next;
        this.isKeywordDropdownOpen = true;
        this.highlightedKeywordIndex = this.keywordOptions.length > 0 ? 0 : -1;
        this.isKeywordLoading = false;
      },
      error: () => {
        if (reset) {
          this.keywordOptions = [];
        }
        this.keywordHasMore = false;
        this.isKeywordLoading = false;
      }
    });
  }

  private filterByScope(events: any[]): any[] {
    const today = this.startOfDay(new Date());
    const tomorrow = this.startOfDay(this.addDays(today, 1));
    const dayAfterTomorrow = this.startOfDay(this.addDays(today, 2));
    const weekend = this.getNextWeekend();

    return events.filter((event: any) => {
      const nextOccurrence = this.getNextOccurrence(event);
      const occurrenceDate = nextOccurrence?.start_time ? this.startOfDay(new Date(nextOccurrence.start_time)) : null;
      if (!occurrenceDate) return false;

      switch (this.activeScope) {
        case 'today':
          return occurrenceDate.getTime() === today.getTime();
        case 'tomorrow':
          return occurrenceDate.getTime() === tomorrow.getTime();
        case 'weekend':
          return occurrenceDate >= weekend.saturday && occurrenceDate <= weekend.sunday;
        case 'future':
          return this.includePastWithFuture ? true : occurrenceDate >= today;
        case 'past':
          return occurrenceDate < today;
        case 'customDate':
          return this.searchTextDate
            ? this.toISODate(occurrenceDate) === this.searchTextDate
            : occurrenceDate.getTime() === dayAfterTomorrow.getTime();
        case 'all':
        default:
          return true;
      }
    });
  }

  private getNextWeekend(): { saturday: Date; sunday: Date } {
    const today = this.startOfDay(new Date());
    const day = today.getDay();
    const daysUntilSaturday = (6 - day + 7) % 7 || 7;
    const saturday = this.startOfDay(this.addDays(today, daysUntilSaturday));
    const sunday = this.startOfDay(this.addDays(saturday, 1));
    return { saturday, sunday };
  }

  private addDays(date: Date, days: number): Date {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
  }

  private startOfDay(date: Date): Date {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;
  }

  private toISODate(date: Date): string {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}