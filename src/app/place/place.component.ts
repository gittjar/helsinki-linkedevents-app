import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { PlaceService } from '../place.service';

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.css']
})
export class PlaceComponent implements OnInit{
/*
  @ViewChild('GoogleMap', { static: true }) 

  map!: google.maps.Map;

  infoWindow!: google.maps.InfoWindow;
  mapOptions: google.maps.MapOptions = {
    center: { lat: 60.170345, lng: 24.952229 },
    zoom: 14,
    
  };
  
  textid: string = '';

 
*/
  constructor (private placehttp: PlaceService){}

  ngOnInit(): void {
  // this.getPlaceMarker();
   // this.infoWindow = new google.maps.InfoWindow();
  }





/*

  
  pleissi?: any;
  markers: any[] = [];
getPlaceMarker(): void {
  this.placehttp.getPlace().subscribe((data: any) => {
    this.pleissi = data;
    this.pleissi.data.forEach((place: any) => {

      const marker = new google.maps.Marker({
        position: { lat: place?.position?.coordinates[1], lng: place?.position?.coordinates[0] },
        // map : 'GoogleMap' // replace "this.map" with a reference to your Google Map instance
        opacity : 1.3,
        label : {text: place?.name?.fi, color: 'black', fontWeight: '700', fontFamily: 'Verdana', fontSize: '13px' },
        title : place?.street_address?.fi + ', ' + place?.address_locality?.fi,
        animation : google.maps.Animation.DROP,
        icon: {url: '/assets/locationpin.png'},
      });

      const infoWindow = new google.maps.InfoWindow({
        content: '' + place?.name?.fi + '' + place?.street_address?.fi + ', ' + place?.address_locality?.fi + '',
        });


      this.markers.push(marker);
      //infowindow;
      marker.addListener('click', () => {
        infoWindow.open(this.map, marker);
        });
   
      })
 
    });
    
  };
*/

}

  

