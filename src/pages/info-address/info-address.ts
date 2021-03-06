import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { CommonProvider } from "../../providers/common/common";
import { Validators, FormBuilder, FormGroup } from '@angular/forms';

@IonicPage(
  {
    name: 'info-address',
    priority: 'off'
  }
)
@Component({
  selector: 'page-info-address',
  templateUrl: 'info-address.html',
})
export class InfoAddressPage {
  form: FormGroup;
  rules: any = {
    consignee: ['', [Validators.required]],
    mobile: ['', [Validators.required, Validators.pattern('^[1][3,4,5,7,8][0-9]{9}$')]],
    province: ['', [Validators.required]],
    city: ['', [Validators.required]],
    district: ['', [Validators.required]],
    address_type: ['', [Validators.required]],
    address: ['', [Validators.required]],
    zipcode: ['', [Validators.pattern('^\\d{6}$')]],
  };
  provinces = [];
  cities = [];
  areas = [];
  user_id = '';  //用户id
  pageForm: FormGroup = this.formBuilder.group(this.rules);

  constructor(public navCtrl: NavController, public alertCtrl: AlertController,
     public navParams: NavParams, public cp: CommonProvider, public formBuilder: FormBuilder) {
  }

  ionViewDidLoad() {
    let item = this.navParams.data.item;
    if (item) {
      let { consignee, mobile, address, province, city, district } = item;
      this.pageForm.patchValue({
        consignee,
        mobile,
        address,
        province,
        city,
        district
      });
    }
    this.initLocation();
  }

  initLocation() {
    this.cp.getData("?m=area&a=areaList&type=1&parent=1").then((t: any) => this.provinces = t);

    let { province, city } = this.pageForm.value;
    if (province) {
      this.getCities(province);
      this.getDistrict(city);
    }

  }

  getCities(province_id, bol = false) {
    //拼接url，访问接口
    this.cp.getData("?m=area&a=areaList&type=2&parent=" + province_id).then((t: any) => {
      //把接受的城市列表赋值到cities
      this.cities = t;
      if (bol) {
        this.pageForm.patchValue({ city: t[0].region_id });
        this.getDistrict(t[0].region_id, true);
      }
    })
  }
  getDistrict(city_id, bol = false) {
    this.cp.getData("?m=area&a=areaList&type=3&parent=" + city_id).then((t: any) => {
      this.areas = t;
      bol &&
        this.pageForm.patchValue({ district: t[0].region_id });
    })

  }

  onSubmit(t) {
    t = {
      ...t,
      email: '',
      tel: '',
      user_id: 84276,
      country: 1
    }
    if (this.navParams.data.item) {
      t = {
        ...t,
        address_id: this.navParams.data.item.address_id
      }
      // console.log(t);
      // return;
      this.cp.getData('?m=area&a=actEditConsignee', t
      ).then((data: any) => {
        console.log(data);
        if (data.status == 1) {
          // history.go(-2);
          this.cp.pop();
        }
      })
    } else {
      // console.log(t);
      // return;
      this.cp.getData('?m=area&a=actEditConsignee', t
      ).then((data: any) => {
        console.log(data);
        if (data.status == 1) {
          this.cp.pop();
        }

      })
    }
  }


  del() {
    let confirm = this.alertCtrl.create({
      title: '是否确认删除',
      buttons: [
        {
          text: '否'
        },
        {
          text: '是',
          handler: () => {
            let address_id = this.navParams.data.item;
            let user_id = 84276;
            let t = {
              address_id,
              user_id
            }
            this.cp.getData("?m=area&a=dropConsignee", t).then((t: any) => {
              if (t.status == 1) {
                this.cp.pop();
              }

            })
          }
        }
      ]
    });
    confirm.present();
  }



}
