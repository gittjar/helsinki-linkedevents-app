import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../weather.service';


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
  isMenuOpen = true;
  expandedHourIndex: number | null = 0;

  constructor(private weatherService: WeatherService) {}

  ngOnInit() {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      this.isMenuOpen = false;
      this.expandedHourIndex = null;
    }
    this.getForecast();
  }

  getForecast() {
    this.weatherService.getHelsinkiForecastData().subscribe(data => {
      this.currentTime = new Date();
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

      if (this.forecastData.length > 0 && this.expandedHourIndex === null) {
        this.expandedHourIndex = 0;
      }
      
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

  getTemperatureColor(temp: number): string {
    if (temp >= 25) return '#d32f2f'; // Hot - Deep Red
    if (temp >= 20) return '#f57c00'; // Warm - Deep Orange
    if (temp >= 15) return '#388e3c'; // Mild - Deep Green
    if (temp >= 10) return '#1976d2'; // Cool - Deep Blue
    if (temp >= 5) return '#512da8'; // Cold - Deep Purple
    return '#37474f'; // Very Cold - Dark Blue Gray
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleHour(index: number): void {
    this.expandedHourIndex = this.expandedHourIndex === index ? null : index;
  }

  getDayLabel(forecast: any): string {
    if (forecast.isToday) {
      return 'Tänään';
    }
    if (forecast.isTomorrow) {
      return 'Huomenna';
    }
    return new Date(forecast.time).toLocaleDateString('fi-FI', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit'
    });
  }

  getHourHeader(forecast: any): string {
    const day = this.getDayLabel(forecast);
    const hour = new Date(forecast.time).toLocaleTimeString('fi-FI', {
      hour: '2-digit',
      minute: '2-digit'
    });
    const temp = `${Math.round(forecast.temp_c)}°`;
    return `${day} ${hour} • ${temp}`;
  }
}