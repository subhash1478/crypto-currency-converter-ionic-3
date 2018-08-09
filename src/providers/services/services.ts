import {Network} from '@ionic-native/network';
import {ToastController } from 'ionic-angular';

import { Injectable } from '@angular/core';
import { CONFIG } from '../../config';

import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';


@Injectable()
export class ServicesProvider {
  alertopen: boolean=false;
  online: boolean;
  
  constructor(public _http: Http, public toastCtrl: ToastController, private network: Network ) {
    //console.log('Hello ServicesProvider Provider');
  this.network.onDisconnect().subscribe(() => {
      ////console.log('network was disconnected :-(');
      this.online=false;
      
      
    });
    
 this.network.onConnect().subscribe((response) => {
      this.online=true;
    });
    
    if(this.network.type=="none"){
      this.online=false;
      
    }
    //console.log('online',this.online,'this.network.type',this.network.type)
  }
  private _errorHandler(error: Response) {
    return Observable.throw(error.json() || "Server Error");
  }
  
  
  networkCheck() {
    
    //console.log('this.alertopen,this.online')
    //console.log(this.alertopen,this.online)
    if(this.alertopen!=true && this.online==false){
      this.alertopen=true;
      let toast = this.toastCtrl.create({
        message: 'No internet connection please check your internet setting',
        position: 'top',
        showCloseButton:true
      });
      
      toast.onDidDismiss(() => {
        //console.log('Dismissed toast');
        this.alertopen=false;
      });
      
      toast.present();
      
    }
  }
  ////////////////////////
  //                    //
  //   get crypto symbol//
  ////////////////////////
  getTicker() {
    this.networkCheck();
    
    return this._http.get('assets/json/cryptoSymbol.json')
    .map((response: Response) => response.json())
    .catch(this._errorHandler);
    
  }
  
  //////////////
  // getResult//
  //////////////
  getResult(obj){
    this.networkCheck();
    
    //console.log('getResult',obj)
    
    return this._http.get(CONFIG.API_ENDPOINT+obj.id+'/?convert='+obj.currency)
    .map((response: Response) => response.json())
    .catch(this._errorHandler);
  }
   
  //////////////////////////
  //   get Global Usd Price//
  //                      //
  //////////////////////////
  getGlobalUsdPrice(id){
    this.networkCheck();
    
    
    return this._http.get(CONFIG.API_ENDPOINT+id+'/')
    .map((response: Response) => response.json())
    .catch(this._errorHandler);
  }
  ////////////////////////////////
  //                            //
  // get Currency Convert Value //
  ////////////////////////////////
  
  getCurrencyConvertValue(obj){
    this.networkCheck();
    
    
    return this._http.get(CONFIG.API_ENDPOINT+'?convert='+obj.currency+'&limit=1')
    .map((response: Response) => response.json())
    .catch(this._errorHandler);
  }
}
