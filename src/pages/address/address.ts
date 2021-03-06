import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {CommonProvider} from "../../providers/common/common";

@IonicPage({
  name: 'address'
})
@Component({
  selector: 'page-address',
  templateUrl: 'address.html',
})
export class AddressPage {
  infoList: any = [];
  nickname:any = "";
  constructor(public navCtrl: NavController, public navParams: NavParams, public cp: CommonProvider) {
    this.nickname = this.cp.u.nickname;
  }

  ionViewDidLoad() {
    this.cp.getData('?m=address&a=get_address&user_id=84276')
      .then((data:any) => {
        data.forEach((ele,index) => {
          if(index==0){
            ele.is=true;
          }
        });
        this.infoList = data;
        // console.log(this.infoList);
      })

  }

  addressChange(item) {
    if (this.navParams.data.region) {
      this.navParams.data.regionSelected && this.navParams.data.regionSelected(item);
      // console.log( this.navParams.data.regionSelected);
      // console.log(this.navParams.data.regionSelected(item));
      this.cp.pop();
    }
      this.infoList.forEach((ele, index) => {
        ele.is = false;
      });
      item.is = true;
  }
}
