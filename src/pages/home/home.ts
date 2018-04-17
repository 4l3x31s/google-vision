import { Component } from '@angular/core';
import {AlertController, NavController} from 'ionic-angular';
import {GoogleCloudVisionServiceProvider} from "../../providers/google-cloud-vision-service/google-cloud-vision-service";

import {Camera, CameraOptions} from "@ionic-native/camera";
import {AngularFireDatabase, FirebaseListObservable} from "angularfire2/database-deprecated";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  items: FirebaseListObservable<any[]>;

  constructor(public navCtrl: NavController,private camera: Camera,
              private vision: GoogleCloudVisionServiceProvider,
              private db: AngularFireDatabase,
              private alert: AlertController) {
    this.items = this.db.list('items');
  }
  takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      targetHeight: 500,
      targetWidth: 500,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.PNG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((imageData) => {

      this.vision.getLabels(imageData).subscribe((result:any) => {
        console.log(result);
        console.log(JSON.stringify(result));
        this.saveResults(imageData, result.responses);
      }, err => {
        console.log(err);
        this.showAlert(JSON.stringify(err));
      });
    }, err => {
      console.log(err);
      this.showAlert(JSON.stringify(err));
    });
  }

  saveResults(imageData, results) {
    this.items.push({ imageData: imageData, results: results})
      .then(data => {
        console.log(JSON.stringify(data));
      })
      //.catch(err => { this.showAlert(err) });
  }

  showAlert(message) {
    let alert = this.alert.create({
      title: 'Error',
      subTitle: message,
      buttons: ['OK']
    });
    alert.present();
  }
}
