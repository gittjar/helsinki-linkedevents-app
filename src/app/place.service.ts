import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  getPlace(textid: string): any {
    throw new Error('Method not implemented.');
  }
  private linkedEventsApiRoot = 'https://api.codetabs.com/v1/proxy/?quest=https://api.hel.fi/linkedevents/v1/';

  constructor(private http: HttpClient) { }

  public getPlacesByUrl(url: string): Observable<any> {
    return this.http.get<any>(url).pipe(
      switchMap((response: { data: any[] }) => {
        if (response.data && response.data.length > 0) {
          const imageRequests = response.data.map(place =>
            place.image
              ? this.getPlaceImageById(place.image).pipe(
                  catchError(() => of({ url: 'https://placehold.co/600x400/navy/white/?text=Ei+Kuvaa' })) // Fallback image
                )
              : of({ url: 'https://placehold.co/600x400/navy/white/?text=Ei+Kuvaa' }) // Fallback image
          );
          return forkJoin(imageRequests).pipe(
            map(images => {
              response.data.forEach((place, index) => {
                place.imageUrl = images[index].url; // Assign fetched or fallback URL
              });
              return response;
            })
          );
        }
        return of(response);
      }),
      catchError(error => {
        console.error('Error fetching places:', error);
        return throwError(error);
      })
    );
  }

  public getPlaceImageById(imageId: number): Observable<{ url: string }> {
    return this.http.get<{ url: string }>(`${this.linkedEventsApiRoot}image/${imageId}`).pipe(
      map(response => ({ url: response.url })), // Extract and return the URL
      catchError(error => {
        console.error('Error fetching image:', error);
        return of({ url: 'https://placehold.co/600x400' }); // Return fallback URL on error
      })
    );
  }
}