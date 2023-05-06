import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { PlaceService } from '../place.service';

interface MarkerProperties {
  position: {
    lat: number;
    lng: number;
    title: string;
  }
};

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.css']
})
export class PlaceComponent implements OnInit{

  @ViewChild('GoogleMap', { static: true }) map!: GoogleMap;

  mapOptions: google.maps.MapOptions = {
    center: { lat: 60.170345, lng: 24.952229 },
    zoom: 14,
  };
  /*
  markers: MarkerProperties[] = [
    { position: { lat: 60.169266, lng: 24.938164, title: 'Kauppakeskus Forum' }}, // Kauppakeskus Forum
  ];
  */

  constructor (private placehttp: PlaceService){}

  ngOnInit(): void {
    this.getPlaceMarker();
  }
/*
  pleissi : any;
  getPlaceMarker():void {
    this.placehttp.getPlace().subscribe((data: any) => {
      this.pleissi = data;
    })
  } */



  
  pleissi: any;
  markers: any[] = [];
getPlaceMarker(): void {
  this.placehttp.getPlace().subscribe((data: any) => {
    this.pleissi = data;
    this.pleissi.data.forEach((place: any) => {

      const contentString = '<div><p>This is the info window content</p></div>';
      const infowindow = new google.maps.InfoWindow({
        content: contentString,
        position: { lat: place.position?.coordinates[1], lng: place.position?.coordinates[0] },
        maxWidth: 200
      });

      const marker = new google.maps.Marker({
        position: { lat: place.position?.coordinates[1], lng: place.position?.coordinates[0] },
        // map : 'GoogleMap' // replace "this.map" with a reference to your Google Map instance
        opacity : 0.3,
        label : {text: place.name.fi, color: 'black', fontWeight: '700', fontFamily: 'Verdana' },
        title : place.street_address.fi,
        animation : google.maps.Animation.DROP,

      icon: {url: '/assets/close.png'}
        
      });

   

      this.markers.push(marker);
    });


  });
  

}


}
