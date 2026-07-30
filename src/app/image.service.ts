import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ImageResponse {
  meta: {
    count: number;
    next: string;
    previous: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ImageService {
  private IMGURL = 'https://api.hel.fi/linkedevents/v1/image/';

  constructor(private http: HttpClient) { }

  /**
   * Fetch images with optional search and sorting.
   * @param page Page number (default 1)
   * @param searchText Search text (optional)
   * @param sort Sort order: '-last_modified_time', 'last_modified_time', 'id', '-id', 'name', '-name'
   */
  getImages(
    page: number = 1,
    searchText: string = '',
    sort: string = '-last_modified_time' // Default: descending by last_modified_time
  ): Observable<any> {
    let url = `${this.IMGURL}?page=${page}`;

    if (searchText) {
      url += `&text=${encodeURIComponent(searchText)}`;
    }

    if (sort) {
      url += `&sort=${encodeURIComponent(sort)}`;
    }

    return this.http.get<any>(url);
  }
}