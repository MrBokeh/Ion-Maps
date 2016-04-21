import {Page, NavController, NavParams, ViewController, Modal} from "ionic-angular";
import {NgZone} from "angular2/core";


@Page({
    templateUrl: "build/pages/page3/search.html",
    styles: [`
        .toolbar {
            box-shadow: 0 0 4px rgba(0,0,0,0.78);
        }
    `]
})
export class SearchPage {

    locations: Object;
    position: any;

    constructor(private _navParams: NavParams, private _zone: NgZone, private _navCtrl: NavController, public viewCtrl: ViewController) {
        this._navParams = _navParams;
        this._navCtrl = _navCtrl;
        this.viewCtrl = viewCtrl;

        this._zone.run(() => {
            this.locations = this._navParams.get("results");
        })

        this.position = this._navParams.get("position");

        console.log(this.locations);

    }

    choose(address: string) {
        console.log(this.position);
        this.position.firstElementChild.value = address;

        this._navCtrl.pop();
    }

    getPhotos(photos: any) {
        let photoUrl = photos[0].getUrl({ 'maxWidth': photos[0].width, 'maxHeight': photos[0].height });
        let modal = Modal.create(MyModal, {picture: photoUrl});
        this._navCtrl.present(modal)

    }
}

@Page({
    template: `
    <ion-navbar primary *navbar>
    <ion-title>Pictures</ion-title>
    <ion-buttons start>
        <button (click)="close()">
            <ion-icon name='close'></ion-icon>
        </button>
    </ion-buttons>
</ion-navbar>
  <ion-content padding>
  <img [src]="photoSrc">
  </ion-content>`
})
class MyModal {
    
    photoSrc: any;
    
    onPageDidEnter() {
        this.photoSrc = this.params.get("picture");
    }
    
    constructor(public viewCtrl: ViewController, public params: NavParams) {
        this.viewCtrl = viewCtrl;
        
    }

    close() {
        this.viewCtrl.dismiss();
    }
    
}