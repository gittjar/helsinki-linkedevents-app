import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  forecastData: any[] = [];

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    this.getForecast();
  }

  getForecast() {
    this.weatherService.getHelsinkiForecastData().subscribe(data => {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const forecastHours = [10, 14, 18, 22]; // Forecast times
      let nextForecastHour = forecastHours.find(hour => hour > currentHour);
      if (!nextForecastHour) {
        nextForecastHour = forecastHours[0]; // If it's past 22:00, show the 10:00 forecast for the next day
      }
      this.forecastData = data.forecast.forecastday[0].hour.filter((hour: any) => {
        const forecastHour = new Date(hour.time).getHours();
        return forecastHour === nextForecastHour;
      });
    });
  }
}