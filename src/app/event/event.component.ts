import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { Select, initTE } from "tw-elements";
import { faArrowUpRightFromSquare, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  arrowUpRightFromBox = faArrowUpRightFromSquare;
  faArrowRight = faArrowRight;
  faArrowLeft = faArrowLeft;

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

  // Aikojen säätöjä muotoon YYYY-MM-DD
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
  searchTextDate : string = "";
  // today
  changeToday(){
    this.searchTextDate = this.getCurrentDate();
    this.getAllEventsDate(this.searchTextDate, this.newPageNumber = 1);
  }
  // huomenna
  changeToday1() {
    this.searchTextDate = this.getTomorrowDate();
    this.getAllEventsDate(this.searchTextDate, this.newPageNumber = 1);
  }
  // ylihuomenna
  changeToday2() {
    this.searchTextDate = this.getDayAfterTomorrowDate();
    this.getAllEventsDate(this.searchTextDate, this.newPageNumber = 1);
  }
  // päiväämärät localize FI muotoon
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

  // avaa google mapsiin kohde
  getGoogleMapsLink(latitude: number, longitude: number): string {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    return encodeURI(url);
  }
  
  getAllEventsDate(searchDate: string, pageNumber: number): void {
    this.http.getEventDate(searchDate, pageNumber).subscribe((data: any) => {
      this.events = data;
      //this.EventsDateNextButtons();
    })
  }
// search buttons methods
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


// Sivujen vaihdot by event
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
  // Sivujen vaihdot by eventdate
  onPageChangePlusDate(): any {
    this.increasePageNumberDate();
    this.getAllEventsDate(this.searchTextDate, this.newPageNumber); 
    }
  increasePageNumberDate(): void {
    this.newPageNumber++;
    }

  onPageChangeMinusDate(): any {
    this.decreasePageNumberDate();
    this.getAllEventsDate(this.searchTextDate, this.newPageNumber);
    }
  decreasePageNumberDate(): void {
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
// DISABLING BUTTONS Functions see test buttons in HTML
  button1Clicked = false;
  button2Clicked = false;
  button3Clicked = false;

  onButton1Click() {
    this.button1Clicked = false;
    this.button2Clicked = true;
    this.button3Clicked = false;
  }

  onButton2Click() {
    this.button1Clicked = false;
    this.button2Clicked = false;
    this.button3Clicked = true;
  }

  onButton3Click() {
    this.button1Clicked = false;
    this.button2Clicked = false;
    this.button3Clicked = true;
  }
  
}


