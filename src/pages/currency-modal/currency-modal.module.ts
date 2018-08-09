import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CurrencyModalPage } from './currency-modal';

@NgModule({
  declarations: [
    CurrencyModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CurrencyModalPage),
  ],
})
export class CurrencyModalPageModule {}
