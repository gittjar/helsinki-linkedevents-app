import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent implements OnInit {

  constructor(private http: EventService){}

  ngOnInit(): void {
    this.getAllEvents('');
  }

  // Aikojen säätöjä
currentDate = new Date(); // tänään
today = new Date();
tomorrowDate = new Date(this.today.setDate(this.today.getDate() + 1)); // huomenna
tomorrow2Date = new Date(this.today.setDate(this.today.getDate() + 1)); // ylihuominen


  searchText : string = "";
  events : any;
  getAllEvents(searchText: string):void {
    this.http.getEvent(searchText).subscribe((data: any) => {
      this.events = data;
    })
  }

  getAllEventsDate(searchDate: string): void {
    this.http.getEventDate(searchDate).subscribe((data: any) => {
      this.events = data;
    })
  }

  DoSearch() {
    this.getAllEvents(this.searchText);
    }
  SearchStadion() {
    this.getAllEvents(this.searchText = 'Stadion')
  }
  SearchLapset() {
    this.getAllEvents(this.searchText = 'Lapset')
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

 



}
