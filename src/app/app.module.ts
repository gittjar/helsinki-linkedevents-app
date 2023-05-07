import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { PlaceComponent } from './place/place.component';

import { GoogleMapsModule } from '@angular/google-maps';
import { SamplemapComponent } from './samplemap/samplemap.component';


@NgModule({
  declarations: [
    AppComponent,
    PlaceComponent,
    SamplemapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    GoogleMapsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
