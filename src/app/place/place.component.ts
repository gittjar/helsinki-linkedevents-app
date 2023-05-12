import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { PlaceService } from '../place.service';
import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { faMagnifyingGlassLocation } from '@fortawesome/free-solid-svg-icons';
import { faRectangleXmark } from '@fortawesome/free-regular-svg-icons';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { Collapse } from 'tw-elements';
import { Modal, initTE } from "tw-elements";
import { Ripple, Toast } from "tw-elements";
import { SlicePipe } from '@angular/common';





@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.css']
})
export class PlaceComponent implements OnInit{

  // fontawesome
  ArrowUpRightIcon = faArrowUpRightFromSquare;
  ChevronRight = faChevronRight;
  MagnifyingGlassLocation = faMagnifyingGlassLocation;
  RectangXmark = faRectangleXmark;

  // googlemaps
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
      lng: 24.951496394,
    },
    zoom: 13,
  };

  
ngOnInit() {
  this.map = new google.maps.Map(
    document.getElementById("map")!,
    this.options
  );
  this.infoWindow = new google.maps.InfoWindow();
  this.showContent('MyText'); 
 // this.getImageById(this.placeservice.);

 initTE({ Modal, Ripple, Collapse, Toast });


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
   this.textid = '';
   this.ngOnInit();
  }

  SearchPasila() {
    this.textid = 'Pasila';
    this.showContent('MyText');
  }

  SearchHaaga() {
    this.textid = 'Haaga';
    this.showContent('MyText');
  }
  SearchRavintola() {
    this.textid = 'Ravintola';
    this.showContent('MyText');
  }

  SearchKauppakeskus(){
    this.textid = 'Kauppakeskus';
    this.showContent('MyText');
  }
  SearchTeatteri(){
    this.textid = 'Teatteri';
    this.showContent('MyText');
  }
  SearchUrheilu(){
    this.textid = 'Urheilu';
    this.showContent('MyText');
  }


   // ReadMore:boolean = true
   // visible:boolean = false
    ImageDetail : any = {};
    showWindow = false;
    getImageById(imageid: number) :void {
   
      this.placeservice.getPlaceImageById(imageid).subscribe((data: any) =>{
        this.ImageDetail = data;
      })

     // this.ReadMore = !this.ReadMore; //not equal to condition
     // this.visible = !this.visible

     /* INFOBOX WITH BUTTON
      let win = window.open('', 'Kohteen kuva', 'width=300,height=200');
      win?.document.write(`<figure class="picture"><img  style="width:100%" src=${this.ImageDetail.url}></figure>`);
      win?.document.write(`<p>${this.ImageDetail.last_modified_time}</p>`)
      win?.document.write(`<button class="btn" onclick="window.close()">Close Window</button>`);

      setTimeout(() => {
        win?.close();
      }, 10000);
      */
      this.showWindow = true;

    }

    closeWindow() {
      this.showWindow = false;
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
        


        let markerContent = '<div class="map-infowindow">' +
                           `<div class="map-infowindow-title">${place.name.fi}</div>` + 
                           `<div class="map-infowindow-content">${place?.street_address?.fi}</div>` + 
                           `<div class="map-infowindow-content">${place?.postal_code}, ${place?.address_locality?.fi}</div>` + 
                           `<div class="map-infowindow-content"><a href="${place?.info_url?.fi}">Lue lisää ></a></div>
                           ` + 

                           `<hr>` + `<br>`+ 
                           `<div class="map-infowindow-content">${place?.description?.fi}</div>` + 

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