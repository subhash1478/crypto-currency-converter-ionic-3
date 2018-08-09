import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
  
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:string = 'CalculatorPage';
  pages: Array<{title: string, component: any}>;
  constructor( public platform: Platform, public statusBar: StatusBar,public splashScreen: SplashScreen) {
    this.initializeApp();
  }
  initializeApp() {
    this.platform.ready().then(() => {
      setTimeout(() => {
        this.splashScreen.hide();
      }, 100);
      this.statusBar.styleDefault();
      
     });
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
  
 
}
