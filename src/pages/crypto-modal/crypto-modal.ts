import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController ,ToastController} from 'ionic-angular';
import { ServicesProvider } from '../../providers/services/services';

@IonicPage()
@Component({
  selector: 'page-crypto-modal',
  templateUrl: 'crypto-modal.html',
})
export class CryptoModalPage {
  cryptoSymbolArray: any[];
  cryptoSymbol: any[];
  searchQuery: string = '';
  cryptoList:any={};
  cryptoValue:any;
  constructor(public navCtrl: NavController, 
    public navParams: NavParams,private toastCtrl: ToastController , 
    public _services:ServicesProvider,
    public viewCtrl: ViewController) {
    }
    ionViewDidEnter(){   
      
      this._services.getTicker().subscribe(
        Response => {
          var crypto = [];
          for (let index = 0; index < Response.length; index++) {
            var symbol = {};
            symbol["id"] = Response[index].id;
            symbol["symbol"] = Response[index].symbol;
            crypto.push(symbol);
          }
          //////////////////////////////
          //         sort crypto symbol//
          //                          //
          //////////////////////////////
          crypto.sort(
            (a, b) => (a.symbol !== b.symbol ? (a.symbol < b.symbol ? -1 : 1) : 0)
          );
          ////console.log('crypto',crypto)
          this.cryptoSymbol = crypto;
          this.cryptoSymbolArray= crypto;
          //console.log(crypto)
        },
        Error => {}
      );
      
      
      
      
      
      
      ////////////////////////////////////
      //listing  all crypto symbol name //
      //                                //
      ////////////////////////////////////
      
      
    }
    
    
    getItems(ev: any) {
      // Reset items back to all of the items
      // set val to the value of the searchbar
      let val = ev.target.value;
      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
        this.cryptoSymbol = this.cryptoSymbolArray.filter((item) => {
          return (item.symbol.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }else{
        return this.cryptoSymbol =  this.cryptoSymbolArray
      }
    }
    ///CLOSE MODAL
    dismiss(){
      var obj={value:this.cryptoValue}
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
  