import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../event.service';

@Component({
  selector: 'app-eventdetail',
  templateUrl: './eventdetail.component.html',
  styleUrls: ['./eventdetail.component.css']
})
export class EventdetailComponent implements OnInit {
  eventId: any;
  event: any;

  constructor(private actRoute: ActivatedRoute, private eventService: EventService) { }

  ngOnInit() {
    const id = String(this.actRoute.snapshot.paramMap.get('id'));
    if(id){
     this.fetchEventDetails(id);
          }
  
  }

  fetchEventDetails(id: string): any {
    this.eventService.getEventId(id).subscribe(
      (response: any) => {
        this.event = response;
      }
    );
  }


}






