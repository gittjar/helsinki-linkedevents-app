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
  todayForecast: any[] = [];
  tomorrowForecast: any[] = [];
  currentTime: Date = new Date();

  Clock = faClockFour;
  Temperature = faTemperature0;
  Calendar = faCalendar;

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    this.getForecast();
  }

  getForecast() {
    this.weatherService.getHelsinkiForecastData().subscribe(data => {
      this.currentTime = new Date();
      const currentHour = this.currentTime.getHours();
      const next24Hours = new Date(this.currentTime.getTime() + 24 * 60 * 60 * 1000);
      
      this.forecastData = [];
      this.todayForecast = [];
      this.tomorrowForecast = [];

      // Process forecast data for next 24 hours
      data.forecast.forecastday.forEach((day: { date: string; hour: any[]; }) => {
        const dayDate = new Date(day.date);
        
        day.hour.forEach((hour: any) => {
          const forecastTime = new Date(hour.time);
          
          // Only include hours from now to next 24 hours
          if (forecastTime >= this.currentTime && forecastTime <= next24Hours) {
            const enrichedHour = {
              ...hour,
              dayDate: dayDate,
              isToday: this.isSameDay(forecastTime, this.currentTime),
              isTomorrow: this.isTomorrow(forecastTime, this.currentTime),
              isNewDay: this.isNewDay(forecastTime),
              hourNumber: forecastTime.getHours()
            };
            
            this.forecastData.push(enrichedHour);
            
            // Separate today and tomorrow for styling
            if (enrichedHour.isToday) {
              this.todayForecast.push(enrichedHour);
            } else if (enrichedHour.isTomorrow) {
              this.tomorrowForecast.push(enrichedHour);
            }
          }
        });
      });

      // Sort by time to ensure proper order
      this.forecastData.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
      
      console.log('24-hour forecast data:', this.forecastData);
      console.log('Today forecast:', this.todayForecast.length, 'hours');
      console.log('Tomorrow forecast:', this.tomorrowForecast.length, 'hours');
    });
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  }

  private isTomorrow(date: Date, today: Date): boolean {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return this.isSameDay(date, tomorrow);
  }

  private isNewDay(forecastTime: Date): boolean {
    const forecastHour = forecastTime.getHours();
    return forecastHour === 0; // Midnight indicates new day
  }

  getTemperatureColor(temp: number): string {
    if (temp >= 25) return '#d32f2f'; // Hot - Deep Red
    if (temp >= 20) return '#f57c00'; // Warm - Deep Orange
    if (temp >= 15) return '#388e3c'; // Mild - Deep Green
    if (temp >= 10) return '#1976d2'; // Cool - Deep Blue
    if (temp >= 5) return '#512da8'; // Cold - Deep Purple
    return '#37474f'; // Very Cold - Dark Blue Gray
  }

  getCardGradient(hour: any): string {
    const temp = hour.temp_c;
    const isNight = hour.hourNumber >= 20 || hour.hourNumber <= 6;
    
    if (isNight) {
      // Night/evening - lighter backgrounds for better text contrast
      return 'linear-gradient(135deg,rgb(242, 242, 242) 0%,rgb(227, 172, 246) 100%)';
    } else {
      // Day time - light, high contrast backgrounds
      if (temp >= 20) return 'linear-gradient(135deg, #fef9e7 0%, #f6e6cc 100%)'; // Warm - light cream
      if (temp >= 15) return 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'; // Mild - light gray
      if (temp >= 10) return 'linear-gradient(135deg, #f1f8e9 0%, #e8f5e8 100%)'; // Cool - light green
      return 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)'; // Cold - light blue
    }
  }

  getTextColor(hour: any): string {
    const isNight = hour.hourNumber >= 20 || hour.hourNumber <= 6;
    return isNight ? '#2c3e50' : '#2c3e50'; // Dark text for all times now
  }

  getSecondaryTextColor(hour: any): string {
    const isNight = hour.hourNumber >= 20 || hour.hourNumber <= 6;
    return isNight ? '#34495e' : '#34495e'; // Consistent dark secondary text
  }
}