import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { HttpClient } from '@angular/common/http';
import { Select, initTE } from "tw-elements";
import MarkerClusterer from '@googlemaps/markerclustererplus';




@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  constructor(private http: EventService){}

  ngOnInit(): void {
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
    this.isLoading = true;
    this.loadingDataWindow();
    this.getAllEvents(this.searchText, this.newPageNumber = 1);
    }

  SearchStadion() {
    this.isLoading = true;
    this.loadingDataWindow();
    this.getAllEvents(this.searchText = 'Stadion', this.newPageNumber = 1)
  }
  SearchLapset() {
    this.isLoading = true;
    this.loadingDataWindow();
    this.getAllEvents(this.searchText = 'Lapset', this.newPageNumber = 1)
  }
  SearchHipHop() {
    this.isLoading = true;
    this.loadingDataWindow();
    this.getAllEvents(this.searchText = 'Hiphop', this.newPageNumber = 1);
    
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
  
}


