import {Page} from 'ionic-angular';
import {Http} from "angular2/http";
import 'rxjs/add/operator/map';

@Page({
    templateUrl: 'build/pages/page2/page2.html',
})
export class Page2 {

    public picSource: string;
    public loading: boolean;
    public address: string;

    constructor(public http: Http) {
        this.http = http;
        this.loading = false;
        this.picSource = "";
    }

    start() {
        this.loading = true;

        let watchID = navigator.geolocation.watchPosition((position) => {
            this.picSource = `https://maps.googleapis.com/maps/api/streetview?size=1000x1000&location=${position.coords.latitude},${position.coords.longitude}&fov=90&heading=235&pitch=10&key=AIzaSyCRLbd9d9sOTljJc3R_M7dMg23WXqhMw8M`;
            this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyCRLbd9d9sOTljJc3R_M7dMg23WXqhMw8M`)
                .map(res => res.json())
                .subscribe(data => {
                    this.address = data.results[0].formatted_address;
                })
            this.loading = false;
            setInterval(() => {
                console.log("called");
                this.loading = true;
                this.picSource = `https://maps.googleapis.com/maps/api/streetview?size=1000x1000&location=${position.coords.latitude},${position.coords.longitude}&fov=90&heading=235&pitch=10&key=AIzaSyCRLbd9d9sOTljJc3R_M7dMg23WXqhMw8M`;
                this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyCRLbd9d9sOTljJc3R_M7dMg23WXqhMw8M`)
                    .map(res => res.json())
                    .subscribe(data => {
                        console.log(data.results[0].formatted_address);
                        this.address = data.results[0].formatted_address;
                    })
                this.loading = false;
            }, 60000);
        });
    }

}
