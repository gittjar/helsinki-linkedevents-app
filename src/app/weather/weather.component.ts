import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';
import { faClockFour } from '@fortawesome/free-solid-svg-icons';
import { faTemperature0 } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.css']
})
export class WeatherComponent implements OnInit {
  forecastData: any[] = [];

  Clock = faClockFour;
  Temperature = faTemperature0;

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    this.getForecast();
  }

  getForecast() {
    this.weatherService.getHelsinkiForecastData().subscribe(data => {
      const currentTime = new Date();
      const currentHour = currentTime.getHours();
      const forecastHours = [6, 10, 14, 18, 22]; // Forecast times
  
      // Filter to include all forecast hours greater than the current hour
      const relevantForecastHours = forecastHours.filter(hour => hour > currentHour);
  
      this.forecastData = data.forecast.forecastday[0].hour.filter((hour: any) => {
        const forecastHour = new Date(hour.time).getHours();
        return relevantForecastHours.includes(forecastHour);
      });
    });
  }
}