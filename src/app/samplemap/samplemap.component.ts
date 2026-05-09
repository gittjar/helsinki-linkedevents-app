// google-maps-demo.component.ts
import {Component, ViewChild, OnInit} from '@angular/core';
import {MapInfoWindow, MapMarker} from '@angular/google-maps';
import { PlaceService } from '../place.service';
import { WeatherService } from '../weather.service';


@Component({
  selector: 'app-samplemap',
  templateUrl: './samplemap.component.html',
  styleUrls: ['./samplemap.component.css']
})
export class SamplemapComponent implements OnInit{

  mapLoaded!: boolean;
  map!: google.maps.Map;
  geocoder = new google.maps.Geocoder();
  infoWindow!: google.maps.InfoWindow;
  options: google.maps.MapOptions = {
   // mapTypeId: google.maps.MapTypeId.ROADMAP,
    scrollwheel: true,
  //  disableDefaultUI: true,
  //  disableDoubleClickZoom: true,
    center: {
      lat: 60.16833266,
      lng: 24.951496194,
    },
    zoom: 16,
  };

  // Weather properties
  forecastData: any[] = [];
  showExtendedWeather: boolean = false;
  weatherHoursToShow: number = 4;

ngOnInit() {
  this.map = new google.maps.Map(
    document.getElementById("map")!,
    this.options
  );
  this.infoWindow = new google.maps.InfoWindow();
  this.showContent('MyText');
  this.getWeatherForecast();
}

markers = [] as any;

constructor(private placeservice: PlaceService, private weatherService: WeatherService) {} 

pleissi?: any;
textid : string = "";

DoSearch() {
  console.log(this.textid);
  this.showContent('MyText');
  }

  resetMap() {
    // Clear all markers
    this.markers.forEach((marker: google.maps.Marker) => {
      marker.setMap(null);
    });
    this.markers = [];
    
    // Reset search
    this.pleissi = null;
    this.textid = "";
    
    // Reset map to center
    this.map.setCenter(this.options.center!);
    this.map.setZoom(this.options.zoom!);
  }

// Weather methods
getWeatherForecast() {
  this.weatherService.getHelsinkiForecastData().subscribe(data => {
    const currentTime = new Date();
    this.forecastData = [];

    // Get forecast data for the next 12-24 hours
    data.forecast.forecastday.forEach((day: { hour: any[]; }) => {
      this.forecastData = this.forecastData.concat(day.hour.filter((hour: { time: string | number | Date; }) => {
        const forecastTime = new Date(hour.time);
        return forecastTime >= currentTime;
      }));
    });

    // Limit to reasonable amount of data (next 24 hours)
    this.forecastData = this.forecastData.slice(0, 24);
  });
}

getCurrentWeatherData() {
  if (!this.forecastData || this.forecastData.length === 0) {
    return [];
  }
  
  if (this.showExtendedWeather) {
    return this.forecastData.slice(0, this.weatherHoursToShow * 2); // Show 8 hours when extended
  } else {
    return this.forecastData.slice(0, this.weatherHoursToShow); // Show 4 hours by default
  }
}

loadMoreWeather() {
  this.showExtendedWeather = !this.showExtendedWeather;
}


showContent(contentType: string) {

  this.markers = []

  let content: any = null

  // getPlace in placeservice is configured to show text and it changes here what user gives.
  if(contentType === "MyText") {
    content = this.placeservice.getPlace(this.textid);
  }
  else {
    console.error("unknown content type");
    return
  }

  console.log("click")

  content.subscribe((response: any) => {
    
      let arr = response.data as Array<any>

      arr.forEach((place: any) => {
        this.pleissi = response;
        let marker = new google.maps.Marker({
          position: {
            lat: place?.position?.coordinates[1],
            lng: place?.position?.coordinates[0],
          },
          label : {text: place?.name?.fi, color: 'black', fontWeight: '700', fontFamily: 'Verdana', fontSize: '13px' },
          title : place?.street_address?.fi + ', ' + place?.address_locality?.fi,
          animation : google.maps.Animation.DROP,
          icon: {url: 'https://digital.pictures.fi/kuvat/Github/helsinki-linked-events/locationpin.png?img=full', scaledSize: new google.maps.Size(30, 30), anchor: new google.maps.Point(15, 15)},
        });
        


        let markerContent = '<div class="infoscreen">' +
                            place.name.fi + 
                            `<p class="place_text">${place?.address_locality?.fi}</p>` + 
                            '</div>'
                           

        

        // To add the marker to the map, call setMap();
        marker.setMap(this.map);
        this.markers.push(marker); // Store marker for later removal
        
        google.maps.event.addListener(marker, "click", () => {
          let infowindow = new google.maps.InfoWindow();
          infowindow.setContent(markerContent)
          infowindow.open(this.map, marker);
        });
      });
      
    });
  
}



}