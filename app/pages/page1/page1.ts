import {Page} from 'ionic-angular';
import {Http} from "angular2/http";
import 'rxjs/add/operator/map';


@Page({
    templateUrl: 'build/pages/page1/page1.html',
})
export class Page1 {
    
    public picSource: string;
    public loading: boolean;
    public address: string;

    constructor(public http: Http) {
        this.http = http;
        this.picSource = "";
        this.loading = false;
    }

    snapshot() {
        this.loading = true;
        navigator.geolocation.getCurrentPosition((position) => {
            this.picSource = `https://maps.googleapis.com/maps/api/streetview?size=1000x1000&location=${position.coords.latitude},${position.coords.longitude}&fov=90&heading=235&pitch=10&key=AIzaSyCRLbd9d9sOTljJc3R_M7dMg23WXqhMw8M`;
            this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyCRLbd9d9sOTljJc3R_M7dMg23WXqhMw8M`)
            .map(res => res.json())
            .subscribe(data => {
                this.address = data.results[0].formatted_address;
            })
            this.loading = false;
        });
        
    }

}
