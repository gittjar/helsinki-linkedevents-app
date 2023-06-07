import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlaceComponent } from './place/place.component';
import { MainpageComponent } from './mainpage/mainpage.component';
import { ImageComponent } from './image/image.component';

const routes: Routes = [
  {path: 'place', component : PlaceComponent},
  {path: 'mainpage', component : MainpageComponent},
  {path: '', redirectTo: '/mainpage', pathMatch: 'full'},
  {path: 'image', component : ImageComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
