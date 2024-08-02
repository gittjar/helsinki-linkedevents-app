import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { faClockFour } from '@fortawesome/free-solid-svg-icons';
import { faTemperature0 } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  forecastData: any[] = [];

  Clock = faClockFour;
  Temperature = faTemperature0;
  Calendar = faCalendar;

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    this.getForecast();
  }

  getForecast() {
    this.weatherService.getHelsinkiForecastData().subscribe(data => {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      let forecastEndTime: Date; // Explicitly declare the type as Date
  
      if (currentHour >= 18) {
        // If it's 18:00 or later, set the end time to 06:00 the next day
        forecastEndTime = new Date(currentTime.getFullYear(), currentTime.getMonth(), currentTime.getDate() + 1, 6);
      } else {
        // Otherwise, set it to 12 hours from now
        forecastEndTime = new Date(currentTime.getTime() + 12 * 60 * 60 * 1000);
      }
  
      this.forecastData = [];
  
      // Assuming data.forecast.forecastday includes today and the next day
      data.forecast.forecastday.forEach((day: { hour: any[]; }) => {
        this.forecastData = this.forecastData.concat(day.hour.filter((hour: { time: string | number | Date; }) => {
          const forecastTime = new Date(hour.time);
          return forecastTime >= currentTime && forecastTime <= forecastEndTime;
        }));
      });
  
      // If the current time is before 18:00 and the forecast data exceeds 12 hours, limit it
      if (currentHour < 18 && this.forecastData.length > 12) {
        this.forecastData = this.forecastData.slice(0, 12);
      }
    });
  }
}