import { Component } from "@angular/core";
import {  LoadingController,  AlertController,  IonicPage,  NavController,  ModalController,  ToastController} from "ionic-angular";
import { ServicesProvider } from "../../providers/services/services";
import { Network } from "@ionic-native/network";
import { Keyboard } from "@ionic-native/keyboard";
  
import { Events } from 'ionic-angular';

@IonicPage()
@Component({
  selector: "page-calculator",
  templateUrl: "calculator.html",
  providers: [Keyboard]
})
export class CalculatorPage {
  cryptoSymbolArray: any[];
  id: number;
  alertopen: boolean;
  online: boolean;
  paidVersion: boolean;
  version: string;
  CurrencyPrice: any = {};
  golbalusdprice: any;
  currencySymbol: string[];
  cryptoSymbol: any[];
  cryptoValue: any = {};
  currency: any = {};
  user: any = {};
  constructor(
    private toastCtrl: ToastController, public events: Events,
    public navCtrl: NavController,
    public keyboard: Keyboard,
    public modalCtrl: ModalController,
    public _services: ServicesProvider,
    private network: Network,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController
  ) {

 
    //////////////////////////////////////////
    //       watch network for a connection //
    //                                      //
    //////////////////////////////////////////
    this.network.onDisconnect().subscribe(() => {
      ////////console.log('network was disconnected :-(');
      this.online = false;
      this.networkCheck();
    });
    this.network.onConnect().subscribe(response => {
      this.online = true;
      this.reFresh();
      this.ionViewDidLoad();
    });
    if (this.network.type == "none") {
      this.online = false;
    }
  }
  ////////////////////////////////////
  //                                //
  //      check internet Connection //
  ////////////////////////////////////
  networkCheck() {
    if (this.alertopen != true && this.online != true) {
      this.alertopen = true;
      let toast = this.toastCtrl.create({
        message: "No internet connection please check your internet setting",
        position: "top",
        showCloseButton: true
      });
      toast.onDidDismiss(() => {
        //////console.log('Dismissed toast');
        this.alertopen = false;
      });
      toast.present();
    }
  }
  ngOnInit() {
    ////////////////////////////////////////////////////////////
    //       Hide the wizard buttons when the keyboard is open//
    //                                                        //
    ////////////////////////////////////////////////////////////
    this.keyboard.onKeyboardShow().subscribe(() => {
      ////////console.log('keyboard is shown');
      let position = "padding-bottom:0px;";
      let content = document.querySelectorAll(".scroll-content");
      if (content !== null) {
        Object.keys(content).map(key => {
          content[key].style = position;
        });
      } // end if
    });
    this.keyboard.onKeyboardHide().subscribe(() => {
      ////////console.log('keyboard is hide');
      let position = "margin-top:56px;";
      let content = document.querySelectorAll(".scroll-content");
      if (content !== null) {
        Object.keys(content).map(key => {
          content[key].style = position;
        });
      }
    });
    ////////////////////////////////////////
    // check app paid or free version//
    ////////////////////////////////////////
    this.version = localStorage.getItem("version");
    ////////console.log('version',this.version)
    if (this.version == "paid") {
      this.paidVersion = true;
    } else {
      this.paidVersion = false;
    }
  }
  ionViewDidLoad() {
    this.reFresh();
  }
  changedone(val) {
    //////////////////////////
    // set last change value//
    //////////////////////////
    var chnageSymbol,    valueadded,    obj1,    val1,    obj2,    val2,    firstprice,    secondprice,    val;
    chnageSymbol = "symbol" + [val];
    valueadded = "value" + val;
    localStorage.setItem("changeDone", val);
    localStorage.setItem("userValue", this.user[valueadded]);
    localStorage.setItem("cryptoValue", JSON.stringify(this.cryptoValue));
    localStorage.setItem("currency", JSON.stringify(this.currency));
    //////////////////////////////
    //     get Global Usd Price //
    //                          //
    //////////////////////////////
    this._services.getGlobalUsdPrice(this.cryptoValue[chnageSymbol]).subscribe(
      Response => {
        this.golbalusdprice = Response[0].price_usd;
        this.calculate(this.golbalusdprice, val);
      },
      Error => {}
    );
    obj1 = {
      currency: this.currency.value1,
      limit: 1,
      id: this.cryptoValue[chnageSymbol]
    };
    ////////console.log(obj1)
    this._services.getResult(obj1).subscribe(
      Response => {
        val1 = "price_" + this.currency.value1.toLowerCase();
        firstprice = Response[0][val1];
        this.user.value6= this.roundNumber(
          firstprice * this.user[valueadded],
          8
        );
      },
      Error => {}
    );
      obj2 = {
        currency: this.currency.value2,
        limit: 1,
        id: this.cryptoValue[chnageSymbol]
      };
      this._services.getResult(obj2).subscribe(
        Response => {
          val2 = "price_" + this.currency.value2.toLowerCase();
          secondprice = Response[0][val2];
          this.user.value7 = this.roundNumber(
            secondprice * this.user[valueadded],
            8
          );
        },
        Error => {}
      );
    
  }
  ////////////////////
  //   crypto Change//
  //                //
  ////////////////////
  cryptoChange(val) {
    var chnageSymbol, valueadded;
    chnageSymbol = "symbol" + [val];
    valueadded = "value" + val;
    localStorage.setItem("changeDone", val);
    localStorage.setItem("userValue", this.user[valueadded]);
    localStorage.setItem("cryptoValue", JSON.stringify(this.cryptoValue));
    localStorage.setItem("currency", JSON.stringify(this.currency));
  }
  ////////////////////////////////////////
  // calculating round off upto 8 digit //
  //                                    //
  ////////////////////////////////////////
  roundNumber(num, scale) {
    if (Math.round(num) != num) {
      if (Math.pow(0.1, scale) > num) {
        return 0;
      }
      var sign = Math.sign(num);
      var arr = ("" + Math.abs(num)).split(".");
      if (arr.length > 1) {
        if (arr[1].length > scale) {
          var integ = +arr[0] * Math.pow(10, scale);
          var dec = integ + (+arr[1].slice(0, scale) + Math.pow(10, scale));
          var proc = +arr[1].slice(scale, scale + 1);
          if (proc >= 5) {
            dec = dec + 1;
          }
          dec = sign * (dec - Math.pow(10, scale)) / Math.pow(10, scale);
          return dec;
        }
      }
    }
    return num;
  } 
  ////////////////////////////////
  // currency convert vice Versa//
  //                            //
  ////////////////////////////////
  currencyConvert(val) {
    //console.log('currencyConvert',val)
    var valueadded, currency, userval, price1, price2, obj, obj2;
    currency = val == 6 ? 2 : 1;
    valueadded = "value" + currency;
    userval = "value" + val;
    price1 = "price_" + this.currency.value1.toLowerCase();
    price2 = "price_" + this.currency.value2.toLowerCase();
    obj = {
      currency: this.currency.value1,
      limit: 1
    };
    this._services.getCurrencyConvertValue(obj).subscribe(Response => {
      this.CurrencyPrice.first = Response[0][price1];
      obj2 = {
        currency: this.currency.value2,
        limit: 1
      };
      this._services.getCurrencyConvertValue(obj2).subscribe(
        result => {
          this.CurrencyPrice.second = result[0][price2];
          this.calculateRate(val);
        },
        Error => {}
      );
    },
    Error => {}
  );
}
//////////////////////////////////////////////////////
//     calculate rate based on currency value change//
//                                                  //
//////////////////////////////////////////////////////
calculateRate(val) {
  var result;
  if (val == 6) {
    result = this.CurrencyPrice.second / this.CurrencyPrice.first;
    this.user.value7 = this.roundNumber(result * this.user.value6, 8);
  }
  if ( val == 7) {
    result = this.CurrencyPrice.first / this.CurrencyPrice.second;
    this.user.value6 = this.roundNumber(result * this.user.value7, 8);
  }
}
////////////////////////////////////
// refresh the value of last data //
////////////////////////////////////
reFresh() {
  const msg={
    title:'Please wait...',
    duration:1000
  }
  this.presentToast(msg);
  if (localStorage.getItem("changeDone") != null) {
    var currency = JSON.parse(localStorage.getItem("currency"));
    var cryptoValue = JSON.parse(localStorage.getItem("cryptoValue"));
    var changeDone = localStorage.getItem("changeDone");
    var userValue = localStorage.getItem("userValue");
    const setCurrency = {
      value1: currency.value1,
      value2: currency.value2
    };
    const setCryptoValue = {
      symbol1: cryptoValue.symbol1,
      symbol2: cryptoValue.symbol2,
      symbol3: cryptoValue.symbol3,
      symbol4: cryptoValue.symbol4,
      symbol5: cryptoValue.symbol5,
      sign1: cryptoValue.sign1,
      sign2: cryptoValue.sign2,
      sign3: cryptoValue.sign3,
      sign4: cryptoValue.sign4,
      sign5: cryptoValue.sign5
    };
    this.currency = setCurrency;
    this.cryptoValue = setCryptoValue;
    var value = "value" + changeDone;
    this.user[value] = userValue;
    parseInt(changeDone) > 5
    ? this.currencyChanged(changeDone)
    : this.changedone(changeDone);
  } else {
    this.user.value1 = 1;
    const setCurrency = {
      value1: "USD",
      value2: "AUD"
    };
    const setCryptoValue = {
      symbol1: "bitcoin",
      symbol2: "ethereum",
      symbol3: "ripple",
      symbol4: "litecoin",
      symbol5: "dash",
      sign1: "BTC",
      sign2: "ETH",
      sign3: "XRP",
      sign4: "LTC",
      sign5: "DASH"
    };
    this.currency = setCurrency;
    this.cryptoValue = setCryptoValue;
    this.changedone("1");
  }
}

//////////////////////////
// redirect to help page//
//////////////////////////
goHelp(page) {
  var params;
  params = {
    type: "donate"
  };
  if (page != "HelpPage") {
    params = { type: "" };
  }
  let helpModal = this.modalCtrl.create(page, params);
  helpModal.present();
}
////////////////////////////////////////////
//                                        //
// clear the value of input to zero      //
////////////////////////////////////////////
clear() {
  this.user.value1 = 0;
  this.changedone("1");
}
//////////////////////
//  show loader     //
//////////////////////
presentToast(msg) {
  let toast = this.toastCtrl.create({
    message:msg.title,
    position: "bottom",
    duration:msg.duration
  });
  toast.onDidDismiss(() => {
    //////console.log('Dismissed toast');
  });
  toast.present();
}
//////////////////////////
//                      //
//     open crypto model//
//////////////////////////
openCryptoListingPage(str) {
  //this.navCtrl.push('HelpPage')
  console.log('typeof',typeof(str))
  console.log('typeof',str)
  let cryptoModal = this.modalCtrl.create("CryptoModalPage");
  cryptoModal.present();
  cryptoModal.onDidDismiss(data => {
    if (data.value == undefined) {
      return false;
    }
    switch (str) {
      case 1:
      this.cryptoValue.symbol1 = data.value.id;
      this.cryptoValue.sign1 = data.value.symbol;
      break;
      case 2:
      this.cryptoValue.symbol2 = data.value.id;
      this.cryptoValue.sign2 = data.value.symbol;
      break;
      case 3:
      this.cryptoValue.symbol3 = data.value.id;
      this.cryptoValue.sign3 = data.value.symbol;
      break;
      case 4:
      this.cryptoValue.symbol4 = data.value.id;
      this.cryptoValue.sign4 = data.value.symbol;
      break;
      case 5:
      this.cryptoValue.symbol5 = data.value.id;
      this.cryptoValue.sign5 = data.value.symbol;
      break;
    }
    this.cryptoChange(str);
  });
}
////////////////////////////////
// open Currency Listing Page //
////////////////////////////////
openCurrencyListingPage(params) {
  let CurrencyModal = this.modalCtrl.create("CurrencyModalPage");
  CurrencyModal.present();
  CurrencyModal.onDidDismiss(data => {
    console.log(data);
    if (data.value == undefined) {
      return false;
    }
    switch (params) {
      case 6:
      this.currency.value1 = data.value;
      break;
      case 7:
      this.currency.value2 = data.value;
      break;
    }
    if(this.version=='paid' || params==6){
      this.currencyChanged(params);

    } 
  });
}
currencyChanged(val) {
 console.log('currencyChanged',val)
  this.currencyConvert(val);
  var valueadded, currency, userval;
  currency = val == 6 ? 1 : 2;
  valueadded = "value" + currency;
  userval = "value" + val;
  localStorage.setItem("changeDone", val);
  localStorage.setItem("userValue", this.user[userval]);
  localStorage.setItem("cryptoValue", JSON.stringify(this.cryptoValue));
  localStorage.setItem("currency", JSON.stringify(this.currency));
  var obj1 = {callFor:1,val:val, currency:this.currency[valueadded],id:this.cryptoValue.symbol1, limit: 1 };
  this.CurrencyValueCalculation(obj1);
  if (this.version == "paid") {     
    var obj2 = {callFor:2, val:val, currency:this.currency[valueadded],id:this.cryptoValue.symbol2, limit: 1 };
    var obj3 = {callFor:3,val:val,currency:this.currency[valueadded],id:this.cryptoValue.symbol3, limit: 1 };
    var obj4 = {callFor:4,val:val, currency:this.currency[valueadded],id:this.cryptoValue.symbol4, limit: 1 };
    var obj5 = {callFor:5,val:val, currency:this.currency[valueadded],id:this.cryptoValue.symbol5, limit: 1 };
    ////console.log(obj1,obj2,obj3,obj4)
    this.CurrencyValueCalculation(obj2);
    this.CurrencyValueCalculation(obj3);
    this.CurrencyValueCalculation(obj4);
    this.CurrencyValueCalculation(obj5);
  }
}
calculate(golbalusdprice, val) {   
  var obj1 = {callFor:1,val:val,golbalusdprice:golbalusdprice, currency: this.currency.value1,id:this.cryptoValue.symbol1, limit: 1 };
  this.getCalculateCryptoValue(obj1);
    var obj2 = {callFor:2, val:val,golbalusdprice:golbalusdprice, currency: this.currency.value1,id:this.cryptoValue.symbol2, limit: 1 };
    var obj3 = {callFor:3,val:val,golbalusdprice:golbalusdprice,  currency: this.currency.value1,id:this.cryptoValue.symbol3, limit: 1 };
    var obj4 = {callFor:4,val:val, golbalusdprice:golbalusdprice, currency: this.currency.value1,id:this.cryptoValue.symbol4, limit: 1 };
    var obj5 = {callFor:5,val:val, golbalusdprice:golbalusdprice, currency: this.currency.value1,id:this.cryptoValue.symbol5, limit: 1 };
    this.getCalculateCryptoValue(obj2);
    this.getCalculateCryptoValue(obj3);
    this.getCalculateCryptoValue(obj4);
    this.getCalculateCryptoValue(obj5);
  
}
getCalculateCryptoValue(obj){
  ////console.log(obj)
  const valueadded = "value" + obj.val;
  const callFor = "value" + obj.callFor;
  var  res;
  if(obj.callFor==obj.val){
    return false
  }
  this._services.getResult(obj).subscribe(Response => {
    res = (parseFloat(obj.golbalusdprice) / parseFloat(Response[0].price_usd)).toFixed(8);
    var   result = res * this.user[valueadded];
    this.user[callFor] = this.roundNumber(result, 8);     
  },(err)=>{
    ////console.log(err)
  })
}
CurrencyValueCalculation(obj){
  console.log(obj)
  var callFor = "value" + obj.callFor;
  var  res,result,priceval,userval;
  priceval = "price_" + obj.currency.toLowerCase();
  userval = "value" + obj.val;
  this._services.getResult(obj).subscribe(Response => {
    ////console.log(Response)
    res = (1 / parseFloat(Response[0][priceval])).toFixed(8);
    result = this.user[userval] * res;
    this.user[callFor]= result.toFixed(8);  
  },(err)=>{
    ////console.log(err)
  })
} 

//////////////////////////////////////
// close keyborad when enter press //
//                                  //
//////////////////////////////////////
eventHandler(e){
//  console.log(e)
  if(e==13){
    this.keyboard.close();
    this.ngOnInit();
    this.reFresh();
    }

}
}
