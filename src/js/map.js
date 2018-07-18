var Vue = require('../../node_modules/vue/dist/vue');
//for HTTP requests
var axios = require('../../node_modules/axios/dist/axios');
new Vue({
   el: '#map',
    data: function() {
       return {
           //array to store the retrieved locations
           locations: [],
           //to store references to the markers
           markers: [],
           map: null,
           //Custom styling for the map
           styles: [
               {
                   "featureType": "administrative",
                   "elementType": "all",
                   "stylers": [
                       {
                           "color": "#d8d5d5"
                       }
                   ]
               },
               {
                   "featureType": "administrative",
                   "elementType": "labels.text.fill",
                   "stylers": [
                       {
                           "color": "#444444"
                       }
                   ]
               },
               {
                   "featureType": "administrative.country",
                   "elementType": "all",
                   "stylers": [
                       {
                           "saturation": "0"
                       },
                       {
                           "visibility": "on"
                       }
                   ]
               },
               {
                   "featureType": "landscape",
                   "elementType": "all",
                   "stylers": [
                       {
                           "color": "#e8e8e8"
                       }
                   ]
               },
               {
                   "featureType": "landscape",
                   "elementType": "geometry",
                   "stylers": [
                       {
                           "saturation": "0"
                       }
                   ]
               },
               {
                   "featureType": "poi",
                   "elementType": "all",
                   "stylers": [
                       {
                           "visibility": "off"
                       }
                   ]
               },
               {
                   "featureType": "road",
                   "elementType": "all",
                   "stylers": [
                       {
                           "saturation": -100
                       },
                       {
                           "lightness": 45
                       }
                   ]
               },
               {
                   "featureType": "road.highway",
                   "elementType": "all",
                   "stylers": [
                       {
                           "visibility": "simplified"
                       }
                   ]
               },
               {
                   "featureType": "road.arterial",
                   "elementType": "labels.icon",
                   "stylers": [
                       {
                           "visibility": "off"
                       }
                   ]
               },
               {
                   "featureType": "transit",
                   "elementType": "all",
                   "stylers": [
                       {
                           "visibility": "off"
                       }
                   ]
               },
               {
                   "featureType": "water",
                   "elementType": "all",
                   "stylers": [
                       {
                           "color": "#d2d2d2"
                       },
                       {
                           "visibility": "on"
                       }
                   ]
               }
           ]
       }
    },
    created: function() {
       var self = this;
       //initial call
       this.getLocations();
       //periodically check for new locations, 20 seconds in this example
        setInterval(function () {
            self.getLocations();
        }, 20000);
    },
    methods: {
       getLocations: function() {
           axios.get('http://coffeedrop.staging2.image-plus.co.uk/api/locations',
               {
                   headers: {
                       'Access-Control-Allow-Origin' : '*'
                   }
               })
               .then(result => {
                   //store locations in the data object
                   this.locations = result.data.data;
                   this.populateMap();
               })
               .catch(error => console.log(error))
       },
        populateMap() {
               var infowindow = new google.maps.InfoWindow();
               // Default location for the map to center
               var defaultLocation = {lat: 53.14, lng: -3.85};
                this.setMapOnAll();
               //if a map does not exist yet
               if(!this.map){
                   //create a new instance of a Map
                   this.map = new google.maps.Map(
                       document.getElementById('map'), {
                           zoom: 5,
                           center: defaultLocation,
                           styles : this.styles
                       });
               }
               // loop through all locations
               for(var i = 0; i < this.locations.length; i++) {
                   this.placeMarker(this.locations[i], this.map, infowindow)
               }
        },
        placeMarker(location, map, infowindow) {
            //get the root directory
            var dir = window.location.protocol + window.location.pathname.split('/').slice(0, -1).join('/');
            //build marker svg path
            var markerPath = dir + '/src/assets/map-pin.svg';
            //lat and lng are used in the Google maps API instead of latitude and longitude
            var coordinates = {
                lat: location.coordinates.latitude,
                lng: location.coordinates.longitude
            };
            //to show some additional information
            var contentString = location.address.line1 + ', ' + location.address.line2 + ', ' + location.address.city + ", " + location.address.postcode;
            //add a marker for the location
            var marker = new google.maps.Marker(
                {
                    position: coordinates,
                    map: this.map,
                    icon: markerPath
                });
            this.markers.push(marker);
            //listen for click event to show the information window
            google.maps.event.addListener(marker, 'click', function(){
                infowindow.close(); // Close previously opened infowindow
                infowindow.setContent(contentString);
                infowindow.open(this.map, marker);
            });
        },
        setMapOnAll() {
            for (var i = 0; i < this.markers.length; i++) {
                this.markers[i].setMap(null);
            }
        }
    }
});
