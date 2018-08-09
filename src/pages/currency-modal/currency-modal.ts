import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController ,ToastController} from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';
/**
* Generated class for the CurrencyModalPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/
@IonicPage()
@Component({
  selector: 'page-currency-modal',
  templateUrl: 'currency-modal.html',
})
export class CurrencyModalPage {
  currencySymbolArray: any[];
  currencySymbol: any[];
  searchQuery: string = '';
  currencyList:any={};
  currencyValue:any;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,private toastCtrl: ToastController , 
    public _services:ServicesProvider,
    public viewCtrl: ViewController) {
    }
    ionViewDidEnter() {
      ////////////////////////////////////
      //listing  all currency symbol name //
      //                                //
      ////////////////////////////////////
      ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //   price listed from https:api.coinmarketcap.com/v1/ticker/ only this currency symbol conversion  available  //
    //                                                                                                            //
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    var currencyname = [
      "USD",
      "AUD",
      "BRL",
      "CAD",
      "CHF",
      "CLP",
      "CNY",
      "CZK",
      "DKK",
      "EUR",
      "GBP",
      "HKD",
      "HUF",
      "IDR",
      "ILS",
      "INR",
      "JPY",
      "KRW",
      "MXN",
      "MYR",
      "NOK",
      "NZD",
      "PHP",
      "PKR",
      "PLN",
      "RUB",
      "SEK",
      "SGD",
      "THB",
      "TRY",
      "TWD",
      "ZAR"
    ];
    currencyname.sort((a, b) => (a !== b ? (a < b ? -1 : 1) : 0));
    this.currencySymbol = currencyname;

       this.currencySymbolArray=currencyname
      //console.log( this.currencySymbol)
    }
    
    getItems(ev: any) {
      // Reset items back to all of the items
      // set val to the value of the searchbar
      let val = ev.target.value;
      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
        this.currencySymbol = this.currencySymbolArray.filter((item) => {
          return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }else{
        return this.currencySymbol =  this.currencySymbolArray
      }
    }
    ///CLOSE MODAL
    dismiss(){
      var obj={value:this.currencyValue}
      this.viewCtrl.dismiss(obj);
      ////console.log("value,",value);
    }
    presentToast() {
      let toast = this.toastCtrl.create({
        message: 'Please wait...',
        position: 'bottom',
        duration:1000
      });
      toast.onDidDismiss(() => {
        //console.log('Dismissed toast');
      });
      toast.present();
    }
  }
