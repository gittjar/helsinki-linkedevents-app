import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  // Method for searching places (used by samplemap component)
  getPlace(textid: string): Observable<any> {
    return this.searchPlaces(textid, 1);
  }
  private linkedEventsApiRoot = 'https://api.codetabs.com/v1/proxy/?quest=https://api.hel.fi/linkedevents/v1/';

  constructor(private http: HttpClient) { }

  public getPlacesByUrl(url: string): Observable<any> {
    return this.http.get<any>(url).pipe(
      switchMap((response: { data: any[]; meta: any }) => {
        if (response.data && response.data.length > 0) {
          // Filter out places without essential information
          const validPlaces = response.data.filter(place => {
            // Check if place has basic required information
            const hasName = place.name && (place.name.fi || place.name.sv || place.name.en);
            const hasAddress = place.street_address && (place.street_address.fi || place.street_address.sv || place.street_address.en);
            const hasPosition = place.position && place.position.coordinates && place.position.coordinates.length >= 2;
            const hasLocality = place.address_locality && (place.address_locality.fi || place.address_locality.sv || place.address_locality.en);
            
            return hasName && hasAddress && hasPosition && hasLocality;
          });

          console.log(`Filtered ${response.data.length} places down to ${validPlaces.length} valid places`);
          
          if (validPlaces.length > 0) {
            const imageRequests = validPlaces.map(place =>
              place.image
                ? this.getPlaceImageById(place.image).pipe(
                    catchError(() => of({ url: 'https://placehold.co/600x400/navy/white/?text=Ei+Kuvaa' })) // Fallback image
                  )
                : of({ url: 'https://placehold.co/600x400/navy/white/?text=Ei+Kuvaa' }) // Fallback image
            );
            
            return forkJoin(imageRequests).pipe(
              map(images => {
                validPlaces.forEach((place, index) => {
                  place.imageUrl = images[index].url; // Assign fetched or fallback URL
                });
                
                // Update response with filtered data
                response.data = validPlaces;
                return response;
              })
            );
          }
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

  // Method for searching places by text
  public searchPlaces(searchTerm: string, page: number = 1): Observable<any> {
    const encodedSearchTerm = encodeURIComponent(searchTerm.trim());
    let url = `${this.linkedEventsApiRoot}place/`;
    
    const params = [];
    if (encodedSearchTerm) {
      params.push(`text=${encodedSearchTerm}`);
    }
    params.push(`page=${page}`);
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    console.log('PlaceService - searching with URL:', url);
    return this.getPlacesByUrl(url);
  }

  // Method for searching places by division
  public searchPlacesByDivision(division: string, page: number = 1): Observable<any> {
    const encodedDivision = encodeURIComponent(division.trim());
    let url = `${this.linkedEventsApiRoot}place/`;
    
    const params = [];
    if (encodedDivision) {
      params.push(`division=${encodedDivision}`);
    }
    params.push(`page=${page}`);
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    console.log('PlaceService - searching by division with URL:', url);
    return this.getPlacesByUrl(url);
  }

  // Method for searching places by text and division combined
  public searchPlacesAdvanced(searchTerm?: string, division?: string, page: number = 1): Observable<any> {
    let url = `${this.linkedEventsApiRoot}place/`;
    
    const params = [];
    if (searchTerm && searchTerm.trim()) {
      params.push(`text=${encodeURIComponent(searchTerm.trim())}`);
    }
    if (division && division.trim()) {
      params.push(`division=${encodeURIComponent(division.trim())}`);
    }
    params.push(`page=${page}`);
    
    if (params.length > 0) {
      url += '?' + params.join('&');
    }
    
    console.log('PlaceService - advanced search with URL:', url);
    return this.getPlacesByUrl(url);
  }
}