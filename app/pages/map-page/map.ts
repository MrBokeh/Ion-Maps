import {Page} from "ionic-angular";
import {OnInit} from "angular2/core";

declare var google: any;

@Page({
    templateUrl: 'build/pages/map-page/map.html',
})
export class MapPage implements OnInit {

    ngOnInit() {
        
        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position);
            let map = new google.maps.Map(document.getElementById('mapPage'), {
                center: { lat: position.coords.latitude, lng: position.coords.longitude },
                zoom: 8
            });
        });
        
    }

    constructor() {

    }

}