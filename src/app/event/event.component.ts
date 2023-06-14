import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { Select, initTE } from "tw-elements";
import { faArrowUpRightFromSquare, faArrowRight } from '@fortawesome/free-solid-svg-icons';




@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  arrowUpRightFromBox = faArrowUpRightFromSquare;
  faArrowRight = faArrowRight;

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
  getCurrentDate(): string {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  getTomorrowDate(): string {
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const year = tomorrowDate.getFullYear();
    const month = (tomorrowDate.getMonth() + 1).toString().padStart(2, '0');
    const day = tomorrowDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  getDayAfterTomorrowDate(): string {
    const dayAfterTomorrowDate = new Date();
    dayAfterTomorrowDate.setDate(dayAfterTomorrowDate.getDate() + 2);
    const year = dayAfterTomorrowDate.getFullYear();
    const month = (dayAfterTomorrowDate.getMonth() + 1).toString().padStart(2, '0');
    const day = dayAfterTomorrowDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  


  searchText : string = "";
  pageNumber : number = 1;
  events : any;
  getAllEvents(searchText: string, pageNumber: number):void {
    this.http.getEvent(searchText, pageNumber).subscribe((data: any) => {
      this.events = data;
    })
  }

  // avaa google mapsiin kohde
  getGoogleMapsLink(latitude: number, longitude: number): string {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    return encodeURI(url);
  }
  
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
  // huomenna
changeToday1() {
  this.searchTextDate = this.getTomorrowDate();
  this.getAllEventsDate(this.searchTextDate);
}
/*
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
}*/

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

  // sorted by date
  sortDate(isAsc: boolean) {
    if (isAsc) {
      this.events.data.sort((a: { start_time: string; }, b: { start_time: string; }) => (a.start_time > b.start_time) ? 1 : ((b.start_time > a.start_time) ? -1 : 0)
    )} else {
      this.events.data.sort((a: { start_time: string; }, b: { start_time: string; }) => (a.start_time > b.start_time) ? -1 : ((b.start_time > a.start_time) ? 1 : 0)
    )}
  }
  
}


