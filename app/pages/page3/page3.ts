import {Page, Alert, NavController} from 'ionic-angular';
import {Http} from "angular2/http";
import {OnInit} from "angular2/core";
import 'rxjs/add/operator/map';
import {Toast} from "ionic-native";

import {SearchPage} from "../page3/search-page";

declare var google;

@Page({
    templateUrl: 'build/pages/page3/page3.html'
})
export class Page3 implements OnInit {

    public startPosition: string;
    public endPosition: string;
    public timeToTravel: string;
    public weather: string;
    public navigating: boolean;
    directionsService: any;
    public directions: string[];
    private results: Object[];
    private watch: any;
    public noDestination: boolean;

    ngOnInit() {
        this._setCurrent();
        this.navigating = false;
        this.noDestination = true;
    }

    constructor(public http: Http, public nav: NavController) {
        this.http = http;
        this.directionsService = new google.maps.DirectionsService();
        this.nav = nav;
    }

    private _setCurrent() {
        navigator.geolocation.getCurrentPosition((position) => {
            this.http.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${position.coords.latitude},${position.coords.longitude}&key=AIzaSyBAbBrkBVD3QrQ7hmfair6o1BCoJDfREuA`)
                .map(res => res.json())
                .subscribe(data => {
                    this.startPosition = data.results[0].formatted_address;
                })

            const map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: position.coords.latitude, lng: position.coords.longitude },
                zoom: 8
            });

            const trafficLayer = new google.maps.TrafficLayer();
            trafficLayer.setMap(map);
        });
    }

    go(start: string) {
        let end = document.querySelector("#endPositionInput").firstElementChild.value;

        if (end !== undefined) {

            const map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: -34.397, lng: 150.644 },
                zoom: 11
            });
            const trafficLayer = new google.maps.TrafficLayer();
            trafficLayer.setMap(map);

            let directionsRequest = {
                origin: start,
                destination: end,
                travelMode: google.maps.DirectionsTravelMode.DRIVING,
                unitSystem: google.maps.UnitSystem.METRIC
            };

            this.directionsService.route(
                directionsRequest,
                (response, status) => {
                    console.log(response);
                    console.log(status);

                    if (status === "NOT_FOUND") {
                        let alert = Alert.create({
                            title: 'Error',
                            message: 'Error retrieving directions, please try again',
                            buttons: ['Ok']
                        });
                        this.nav.present(alert);
                        this._setCurrent();
                    }
                    else {
                        this.directions = response.routes[0].legs[0].steps;

                        if (status == google.maps.DirectionsStatus.OK) {
                            new google.maps.DirectionsRenderer({
                                map: map,
                                directions: response
                            });

                            let trafficLayer = new google.maps.TrafficLayer();
                            trafficLayer.setMap(map);

                            this.navigating = true;
                            this.timeToTravel = response.routes[0].legs[0].duration.text;

                            TTS.speak(`You will arrive at your destination in ${this.timeToTravel}`);

                            this.http.get(`http://api.openweathermap.org/data/2.5/weather?lat=${response.routes[0].legs[0].end_location.lat()}&lon=${response.routes[0].legs[0].end_location.lng()}&APPID=4c67ab875dc69f9b7b056986b80992c3`)
                                .map(res => res.json())
                                .subscribe(data => {
                                    console.log(data);
                                    this.weather = data.weather[0].description;
                                })

                            //work in progress
                            this.watch = navigator.geolocation.watchPosition((position) => {
                                const marker = new google.maps.Marker({
                                    position: { lat: position.coords.latitude, lng: position.coords.longitude },
                                    icon: {
                                        path: google.maps.SymbolPath.CIRCLE,
                                        scale: 5
                                    },
                                    map: map
                                })

                                console.log(position);
                            })
                        }
                        else {
                            let alert = Alert.create({
                                title: 'Error',
                                message: 'Error retrieving directions, please try again',
                                buttons: ['Ok']
                            });
                            this.nav.present(alert);
                        }
                    }

                }
            );
        }
        else {
            let alert = Alert.create({
                title: "Error",
                subTitle: "You must choose a destination first!",
                buttons: ["Ok"]
            })
            this.nav.present(alert);
        }
    }

    done() {
        this._setCurrent();
        this.navigating = false;
        this.directions = null;
        this.endPosition = null;
        this.noDestination = true;
        navigator.geolocation.clearWatch(this.watch);
    }

    share(desti: string) {
        console.log(desti);
        let confirm = Alert.create({
            title: 'Share your destination?',
            message: 'Are you sure you would like to share your destination?',
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

                        if (desti !== undefined) {
                            window.plugins.socialsharing.share(desti, 'Come meet me!')
                        }
                        else {

                            Toast.show("Choose destination first", "short", "bottom").subscribe(
                                toast => {
                                    console.log(toast);
                                }
                            )

                        }

                    }
                }
            ]
        });

        this.nav.present(confirm);
    }

    startSearch() {
        let prompt = Alert.create({
            title: 'Search',
            message: "Search for places nearby",
            inputs: [
                {
                    name: 'Search',
                    placeholder: 'Search Term'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Search',
                    handler: data => {
                        console.log(data);
                        navigator.geolocation.getCurrentPosition((position) => {
                            const map = new google.maps.Map(document.getElementById('map'), {
                                center: { lat: position.coords.latitude, lng: position.coords.longitude },
                                zoom: 8
                            });
                            const trafficLayer = new google.maps.TrafficLayer();
                            trafficLayer.setMap(map);

                            let request = {
                                location: { lat: position.coords.latitude, lng: position.coords.longitude },
                                radius: "400",
                                query: data.Search
                            }

                            let service = new google.maps.places.PlacesService(map);

                            let searchResults = new Promise((resolve, reject) => {
                                service.textSearch(request, (results, status) => {
                                    if (status == google.maps.places.PlacesServiceStatus.OK) {
                                        console.log(results);
                                        resolve(results);
                                    }
                                });
                            })

                            searchResults.then((val: any) => {
                                this.results = val;

                                console.log(this.results);

                                let endInput = <HTMLInputElement>document.querySelector("#endPositionInput");

                                this.nav.push(SearchPage, { results: this.results, position: endInput });
                                
                                this.noDestination = false;

                            })
                                .catch((reason) => {
                                    console.log(reason);
                                })

                        });



                    }
                }
            ]
        });
        this.nav.present(prompt);
    }
}
