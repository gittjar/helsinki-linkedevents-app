import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { PlaceService } from '../place.service';

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.css']
})
export class PlaceComponent implements OnInit{

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
  this.showContent('MyText');
}

markers = [] as any;

constructor(private placeservice: PlaceService) {} 

pleissi?: any;
textid : string = "";

DoSearch() {
  console.log(this.textid);
  this.showContent('MyText');
  }

  resetMap() {
  
    
  }


showContent(contentType: string) {

  this.markers = []

  let content: any = null

  // getPlace in placeservice is configured to show text and it changes here what user gives.
  if(contentType === "MyText") {
    content = this.placeservice.getPlace(this.textid);
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