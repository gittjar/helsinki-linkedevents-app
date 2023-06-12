import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventService } from '../event.service';
import { HttpClient } from '@angular/common/http';
import { Select, initTE } from "tw-elements";



@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  constructor(private http: EventService, private hpservice: HttpClient){}

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
      zoom: 12,
    };

  ngOnInit(): void {

    this.map = new google.maps.Map(
      document.getElementById("map")!,
      this.options
    );
    this.infoWindow = new google.maps.InfoWindow();
    this.showContent('MyText'); 
    // searchstring empty and pagenumber = 1
    this.getAllEvents('',1);
    initTE({ Select });
    this.loadingDataWindow();
  }
  isLoading: boolean = true;
  loadingDataWindow() {
    setTimeout(() => {
    // Data loading is complete
    this.isLoading = false;
    }, 2700);}

  // Aikojen säätöjä
currentDate = new Date(); // tänään
today = new Date();
tomorrowDate = new Date(this.today.setDate(this.today.getDate() + 1)); // huomenna
tomorrow2Date = new Date(this.today.setDate(this.today.getDate() + 1)); // ylihuominen


  searchText : string = "";
  pageNumber : number = 1;
  events : any;
  getAllEvents(searchText: string, pageNumber: number):void {
    this.http.getEvent(searchText, pageNumber).subscribe((data: any) => {
      this.events = data;
    })
  }

  // get specific location data from different JSON 
 /*
  showWindow = false;
  locationInfo : any = {};
  getLocationData(link: string): void {
    this.hpservice.get(link).subscribe((locationData: any) => {
      // Process the location data and assign it to a variable in your component
      this.locationInfo = locationData;
    });
    this.showWindow = true;
  }
  closeWindow() {
    this.showWindow = false; 
  }*/

  
  getAllEventsDate(searchDate: string): void {
    this.http.getEventDate(searchDate).subscribe((data: any) => {
      this.events = data;
    })
  }

  DoSearch() {
    this.getAllEvents(this.searchText, this.newPageNumber = 1);
    this.showContent('MyText');
    }

  SearchStadion() {
    this.getAllEvents(this.searchText = 'Stadion', this.newPageNumber = 1)
    this.showContent('MyText');
  }
  SearchLapset() {
    this.getAllEvents(this.searchText = 'Lapset', this.newPageNumber = 1)
    this.showContent('MyText');
  }
  SearchHipHop() {
    this.getAllEvents(this.searchText = 'Hiphop', this.newPageNumber = 1);
    this.showContent('MyText');
  }


  searchTextDate : string = "";
  // Ylihuomenna
changeToday2() {
  const date = new Date(this.tomorrow2Date);
  this.searchTextDate = date.toLocaleDateString();
  this.getAllEventsDate(this.searchTextDate);
}

// Huomenna
changeToday1() {
  const date = new Date(this.tomorrowDate);
  this.searchTextDate = date.toLocaleDateString();
  this.getAllEventsDate(this.searchTextDate);
}

// Tänään
changeToday(){
  const date = new Date(this.currentDate);
  this.searchTextDate = date.toLocaleDateString();
  this.getAllEventsDate(this.searchTextDate);
}

// Sivujen vaihdot

newPageNumber = 1;
onPageChangePlus(): any {
  this.increasePageNumber();
  this.getAllEvents(this.searchText, this.newPageNumber);
  }
increasePageNumber(): void {
  this.newPageNumber++;
  }

onPageChangeMinus(): any {
  this.decreasePageNumber();
  this.getAllEvents(this.searchText, this.newPageNumber);
  }
decreasePageNumber(): void {
  if (this.newPageNumber > 1) {
  this.newPageNumber--;
  }
  }

   // CONTENT FOR MAP AND MAP LOADING DATA
   markers = [] as any;
   eventpoint: any;


showContent(contentType: string) {

  this.markers = []

  let content: any = null

  if(contentType === "MyText") {
    content = this.http.getEvent(this.searchText, this.pageNumber);
  }
  else {
    console.error("unknown content type");
    return
  }

  console.log("click")

  content.subscribe((response: any) => {
    
      let arr = response.data as Array<any>

      arr.forEach((eventplace: any) => {
        this.eventpoint = response;
        
        let marker = new google.maps.Marker({
          position: {
            lat: eventplace?.location?.position?.coordinates[1],
            lng: eventplace?.location?.position?.coordinates[0],
          },
          label : {text: eventplace?.name?.fi, color: 'black', fontWeight: '700', fontFamily: 'Verdana', fontSize: '13px' },
          title : eventplace?.street_address?.fi + ', ' + eventplace?.address_locality?.fi,
          animation : google.maps.Animation.DROP,
          icon: {url: '/assets/locationpin.png'},
        });
        
        let markerContent = '<div class="map-infowindow">' +
                           `<div class="map-infowindow-title">${eventplace?.name?.fi}</div>` + 
                           `<div class="map-infowindow-content">${eventplace?.location?.street_address?.fi}</div>` + 
                           `<div class="map-infowindow-content">${eventplace?.location?.postal_code}, ${eventplace?.location?.address_locality?.fi}</div>` + 
                           `<div class="map-infowindow-content"><a href="${eventplace?.info_url?.fi}">Lue lisää ></a></div>
                           ` + 

                           `<hr>` + `<br>`+ 
                           `<div class="map-infowindow-content">${eventplace?.description?.fi.lenght!}</div>` + 

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
