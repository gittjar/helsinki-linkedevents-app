import { Component, HostListener } from '@angular/core';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faMapPin } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  isSticky = false;
  menuVisible = false;
  isDarkMode = true;

  @HostListener('window:scroll', ['$event'])
  onScroll(event: any) {
    const scrollTop = event.target.documentElement.scrollTop;
    this.isSticky = scrollTop > 100;
  }

  ngOnInit(): void {
    this.applyTheme(this.isDarkMode);
  }

  toggleMenu(shouldOpen?: boolean) {
    if (shouldOpen === undefined) {
      this.menuVisible = !this.menuVisible;
    } else {
      this.menuVisible = shouldOpen;
    }
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    this.applyTheme(this.isDarkMode);
  }

  private applyTheme(isDark: boolean): void {
    document.body.classList.toggle('light-theme', !isDark);
    document.body.classList.toggle('dark-theme', isDark);
  }
}