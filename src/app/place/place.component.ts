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

  markers: MarkerProperties[] = [
    { position: { lat: 60.169266, lng: 24.938164, title: 'Kauppakeskus Forum' }}, // Kauppakeskus Forum
  ];

  constructor (private placehttp: PlaceService){}

  ngOnInit(): void {
    
  }


}
