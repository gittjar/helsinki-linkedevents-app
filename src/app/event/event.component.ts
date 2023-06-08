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
    this.getAllEvents();
  }

  events : any;
  getAllEvents():void {
    this.http.getEvent().subscribe((data: any) => {
      this.events = data;
    })
  }

}
