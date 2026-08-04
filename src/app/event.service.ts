import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private eventHTTP: HttpClient) { }

  private readonly API_ROOT = 'https://api.hel.fi/linkedevents/v1/';

  getEvent(searchText: string, pageNumber: number): Observable<any> {
    return this.getEvents({ text: searchText, page: pageNumber });
  }

  getEventId(id: string): Observable<any> {
    const target = `${this.API_ROOT}event/?include=location,keywords&text=${encodeURIComponent(id)}`;
    return this.eventHTTP.get(target);
  }

  getEventDate(searchDate: string, pageNumber: number): Observable<any> {
    return this.getEvents({ start: searchDate, end: searchDate, page: pageNumber });
  }

  getEvents(options: {
    text?: string;
    page?: number;
    start?: string;
    end?: string;
    keyword?: string;
  }): Observable<any> {
    const params: string[] = ['include=location,keywords'];

    const text = (options.text || '').trim();
    if (text) {
      params.push(`text=${encodeURIComponent(text)}`);
    }

    if (options.start) {
      params.push(`start=${encodeURIComponent(options.start)}`);
    }

    if (options.end) {
      params.push(`end=${encodeURIComponent(options.end)}`);
    }

    if (options.keyword) {
      params.push(`keyword=${encodeURIComponent(options.keyword)}`);
    }

    params.push(`page=${options.page || 1}`);

    const target = `${this.API_ROOT}event/?${params.join('&')}`;
    return this.eventHTTP.get(target);
  }

  getTopKeywords(limit: number = 50): Observable<any[]> {
    const perPage = 20;
    const totalPages = Math.max(Math.ceil(limit / perPage), 1);
    const pageRequests: Observable<any>[] = [];

    for (let page = 1; page <= totalPages; page++) {
      const target = `${this.API_ROOT}keyword/?has_upcoming_events=true&sort=-n_events&page=${page}`;
      pageRequests.push(this.eventHTTP.get(target));
    }

    return new Observable<any[]>((subscriber) => {
      const keywords: any[] = [];
      let completed = 0;

      for (const request of pageRequests) {
        request.subscribe({
          next: (response: any) => {
            if (Array.isArray(response?.data)) {
              keywords.push(...response.data);
            }
          },
          error: (error) => {
            subscriber.error(error);
          },
          complete: () => {
            completed += 1;
            if (completed === pageRequests.length) {
              const unique = new Map<string, any>();
              for (const keyword of keywords) {
                if (keyword?.id && !unique.has(keyword.id)) {
                  unique.set(keyword.id, keyword);
                }
              }

              const sorted = Array.from(unique.values())
                .sort((a, b) => (b?.n_events || 0) - (a?.n_events || 0))
                .slice(0, limit);

              subscriber.next(sorted);
              subscriber.complete();
            }
          }
        });
      }
    }).pipe(map((items) => items));
  }

  getKeywords(options: { text?: string; page?: number } = {}): Observable<any> {
    const params: string[] = ['has_upcoming_events=true', 'sort=-n_events'];

    if (options.text && options.text.trim()) {
      params.push(`text=${encodeURIComponent(options.text.trim())}`);
    }

    params.push(`page=${options.page || 1}`);

    const target = `${this.API_ROOT}keyword/?${params.join('&')}`;
    return this.eventHTTP.get(target);
  }

}
