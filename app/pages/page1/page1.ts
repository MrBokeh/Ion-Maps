import {Page, Alert, NavController} from 'ionic-angular';
import {Http} from "angular2/http";
import {OnInit} from "angular2/core";
import 'rxjs/add/operator/map';

declare var google: any;

@Page({
    templateUrl: 'build/pages/page1/page1.html',
})
export class Page1 implements OnInit {

    ngOnInit() {
        this._snapshot();
    }

    public picSource: string;
    public loading: boolean;
    public address: string;

    constructor(public http: Http, public nav: NavController) {
        this.http = http;
        this.nav = nav;
        this.picSource = "";
        this.loading = false;
    }

    private _snapshot() {
        this.loading = true;
        navigator.geolocation.getCurrentPosition((position) => {
            this.loading = false;
            const panorama = new google.maps.StreetViewPanorama(
                document.getElementById('mountPoint'),
                {
                    position: { lat: position.coords.latitude, lng: position.coords.longitude },
                    pov: { heading: 165, pitch: 0 },
                    zoom: 1
                });
        });

    }

    public share() {

        let confirm = Alert.create({
            title: 'Share your current location?',
            message: 'Are you sure you would like to share your current location?',
            buttons: [
                {
                    text: 'Disagree',
                    handler: () => {
                        console.log('Disagree clicked');
                    }
                },
                {
                    text: 'Agree',
                    handler: () => {
                        console.log('Agree clicked');

                        navigator.geolocation.getCurrentPosition((position) => {
                            this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyBAbBrkBVD3QrQ7hmfair6o1BCoJDfREuA`)
                                .map(res => res.json())
                                .subscribe(data => {
                                    console.log(data.results[0].formatted_address);
                                    window.plugins.socialsharing.share(data.results[0].formatted_address, 'Come meet me!')
                                })
                        });

                    }
                }
            ]
        });

        this.nav.present(confirm);
    }

}
