// Purpose: Contains functions for searching events.
export function DoSearch(component: any) {
    component.isLoading = true;
    component.loadingDataWindow();
    component.getAllEvents(component.searchText, component.newPageNumber = 1);
  }
  
  export function SearchStadion(component: any) {
    component.isLoading = true;
    component.loadingDataWindow();
    component.getAllEvents(component.searchText = 'Stadion', component.newPageNumber = 1);
  }
  
  export function SearchLapset(component: any) {
    component.isLoading = true;
    component.loadingDataWindow();
    component.getAllEvents(component.searchText = 'Lapset', component.newPageNumber = 1);
  }
  
  export function SearchHipHop(component: any) {
    component.isLoading = true;
    component.loadingDataWindow();
    component.getAllEvents(component.searchText = 'Hiphop', component.newPageNumber = 1);
  }
  
  export function SearchHIFK(component: any) {
    component.isLoading = true;
    component.loadingDataWindow();
    component.getAllEvents(component.searchText = 'HIFK', component.newPageNumber = 1);
  }
  
  export function SearchJokerit(component: any) {
    component.isLoading = true;
    component.loadingDataWindow();
    component.getAllEvents(component.searchText = 'Jokerit', component.newPageNumber = 1);
  }
  
  export function SearchKonsertti(component: any) {
    component.isLoading = true;
    component.loadingDataWindow();
    component.getAllEvents(component.searchText = 'Konsertti', component.newPageNumber = 1);
  }