import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { PlaceComponent } from './place/place.component';

import { GoogleMapsModule } from '@angular/google-maps';
import { SamplemapComponent } from './samplemap/samplemap.component';
import { PlaceService } from './place.service';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar/navbar.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MainpageComponent } from './mainpage/mainpage.component'

import { GalleryModule } from  'ng-gallery';
import { GALLERY_CONFIG } from 'ng-gallery';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ImageComponent } from './image/image.component';





@NgModule({
  declarations: [
    AppComponent,
    PlaceComponent,
    SamplemapComponent,
    NavbarComponent,
    MainpageComponent,
    ImageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    GoogleMapsModule,
    FormsModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    GalleryModule
  ],
  providers: [    {
    provide: GALLERY_CONFIG,
    useValue: {
      dots: true,
      imageSize: 'cover'
    }
    
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
