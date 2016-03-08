import {Page, Alert, NavController} from 'ionic-angular';
import {Http} from "angular2/http";
import {OnInit} from "angular2/core";
import 'rxjs/add/operator/map';

declare var google;

@Page({
    templateUrl: 'build/pages/page3/page3.html'
})
export class Page3 implements OnInit {

    public startPosition: string;
    directionsService: any;
    public directions: string[];
    
    ngOnInit() {
        this._setCurrent();
    }

    constructor(public http: Http, public nav: NavController) {
        this.http = http;
        this.directionsService = new google.maps.DirectionsService();
        this.nav = nav;
    }

   private _setCurrent() {
        navigator.geolocation.getCurrentPosition((position) => {
            this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyCRLbd9d9sOTljJc3R_M7dMg23WXqhMw8M`)
                .map(res => res.json())
                .subscribe(data => {
                    this.startPosition = data.results[0].formatted_address;
                })

            let map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: position.coords.latitude, lng: position.coords.longitude },
                zoom: 8
            });
        });
    }

    go(start: string, end: string) {

        let map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: -34.397, lng: 150.644 },
            zoom: 8
        });

        var directionsRequest = {
            origin: start,
            destination: end,
            travelMode: google.maps.DirectionsTravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC
        };

        this.directionsService.route(
            directionsRequest,
            (response, status) => {
                console.log(response);

                this.directions = response.routes[0].legs[0].steps;

                if (status == google.maps.DirectionsStatus.OK) {
                    new google.maps.DirectionsRenderer({
                        map: map,
                        directions: response
                    });
                }
                else {
                    let alert = Alert.create({
                        title: 'Error',
                        subTitle: 'Error retrieving directions, please try again',
                        buttons: ['Ok']
                    });
                    this.nav.present(alert);
                }

                
            }
        );
    }
}
