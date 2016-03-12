import {Page} from 'ionic-angular';
import {Http} from "angular2/http";
import {OnInit} from "angular2/core";
import 'rxjs/add/operator/map';


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

    constructor(public http: Http) {
        this.http = http;
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

}
