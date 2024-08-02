import { Component, HostListener } from '@angular/core';
import { library } from '@fortawesome/fontawesome-svg-core';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isSticky = false;
  menuVisible = false; // Controls the visibility of the menu

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    const scrollTop = event.target.documentElement.scrollTop;
    this.isSticky = scrollTop > 100;
  }

  toggleMenu(shouldOpen?: boolean) {
    if (shouldOpen === undefined) {
      this.menuVisible = !this.menuVisible; // Toggle the menu visibility
    } else {
      this.menuVisible = shouldOpen; // Set the menu visibility explicitly
    }
  }
}