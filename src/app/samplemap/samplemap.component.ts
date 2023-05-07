// google-maps-demo.component.ts
import {Component, ViewChild, OnInit} from '@angular/core';
import {MapInfoWindow, MapMarker} from '@angular/google-maps';
import { PlaceService } from '../place.service';


@Component({
  selector: 'app-samplemap',
  templateUrl: './samplemap.component.html',
  styleUrls: ['./samplemap.component.css']
})
export class SamplemapComponent implements OnInit{
/*
  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;

  center: google.maps.LatLngLiteral = {lat: 60, lng: 23};
  markerPositions: google.maps.LatLngLiteral[] = [];
  zoom = 9;

  addMarker(event: google.maps.MapMouseEvent) {
    this.markerPositions.push(event.latLng!.toJSON());
  }

  openInfoWindow(marker: MapMarker) {
    this.infoWindow.open(marker);
  }
  */

  mapLoaded!: boolean;
  map!: google.maps.Map;
  geocoder = new google.maps.Geocoder();
  infoWindow!: google.maps.InfoWindow;
  options: google.maps.MapOptions = {
   // mapTypeId: google.maps.MapTypeId.ROADMAP,
    scrollwheel: true,
  //  disableDefaultUI: true,
  //  disableDoubleClickZoom: true,
    center: {
      lat: 60.16833266,
      lng: 24.951496194,
    },
    zoom: 16,
  };

ngOnInit() {
  this.map = new google.maps.Map(
    document.getElementById("map")!,
    this.options
  );
  this.infoWindow = new google.maps.InfoWindow();
  this.showContent('places');
}

markers = [] as any;

constructor(private placeservice: PlaceService) {} 

pleissi?: any;

showContent(contentType: string) {

  this.markers = []

  let content: any = null


  if(contentType === "places") {
    content = this.placeservice.getPlace()
  }
  else {
    console.error("unknown content type");
    return
  }

  console.log("click")

  content.subscribe((response: any) => {
    
      let arr = response.data as Array<any>

      arr.forEach((place: any) => {
        this.pleissi = response;
        let marker = new google.maps.Marker({
          position: {
            lat: place?.position?.coordinates[1],
            lng: place?.position?.coordinates[0],
          },
          label : {text: place?.name?.fi, color: 'black', fontWeight: '700', fontFamily: 'Verdana', fontSize: '13px' },
          title : place?.street_address?.fi + ', ' + place?.address_locality?.fi,
          animation : google.maps.Animation.DROP,
          icon: {url: '/assets/locationpin.png'},
        });
        


        let markerContent = '<div class="infoscreen">' +
                            place.name.fi + 
                            `<p class="place_text">${place?.address_locality?.fi}</p>` + 
                            '</div>'
                           

        

        // To add the marker to the map, call setMap();
        marker.setMap(this.map);
        google.maps.event.addListener(marker, "click", () => {
          let infowindow = new google.maps.InfoWindow();
          infowindow.setContent(markerContent)
          infowindow.open(this.map, marker);
        });
      });
      
    });
  
}



}