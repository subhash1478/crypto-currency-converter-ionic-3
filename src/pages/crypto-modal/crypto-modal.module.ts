import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CryptoModalPage } from './crypto-modal';

@NgModule({
  declarations: [
    CryptoModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CryptoModalPage),
  ],
})
export class CryptoModalPageModule {}
