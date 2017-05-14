// Load the map
var map;
var selectPointOfInterest;


// One row in the sidebar menu
function PointOfInterest(id, pointOfInterest, marker) {
    var self = this;
    self.id = id;
    self.pointOfInterest = ko.observable(pointOfInterest);
    self.marker = marker;
}


function GoogleError() {
    // Could not load Google Maps library show user a message
}


//  Viewmodel
function PointOfInterestViewModel() {
    var self = this;
    var map;
    self.mapCenter = {lat: -33.10, lng: -68.85};

    // Point of Interest data - TODO: load POI's from server via JSON
    self.pointsOfInterest = [
        {
            name: 'Zuccardi',
            lat: -32.9700846,
            lng: -68.5675192,
            altDescription: 'Zuccardi main winery. Great Malbec and Bonarda',
        },
        {
            name: 'Zuccardi Valle de Uco',
            lat: -32.9465165,
            lng: -68.8623348,
            altDescription: 'Zuccardi\'s new Valle de Uco winery',
        },
        {
            name: 'Salentein',
            lat: -33.2863936,
            lng: -69.1479992,
            altDescription: 'Salentein winery. Great reds.',
        },
        {
            name: 'SinFin',
            lat: -32.9755586,
            lng: -68.7014326,
            altDescription: 'SinFin winery. Good Malbecs and a great Grappa.',
        },
        {
            name: 'Vistandes',
            lat: -33.0246466,
            lng: -68.7715359,
            altDescription: 'Vistandes winery. Good wines',
        }
    ];

    map = new google.maps.Map(document.getElementById('map'), {
        center: self.mapCenter,
        zoom: 10
    });

    // Editable data
    self.pointOfInterestLinks = ko.observableArray();

    // Array to push markers
    self.markers = [];

    // Loop over array and set markers
    for (var i = 0, len = self.pointsOfInterest.length; i < len; i ++) {
        var location = {lat: self.pointsOfInterest[i].lat, lng: self.pointsOfInterest[i].lng};
        var marker = new google.maps.Marker({
            map: map,
            position: location,
            animation: google.maps.Animation.DROP,
            // title appears as tooltip on map
            title: self.pointsOfInterest[i].name
        });

        self.markers.push(marker);

        // google.maps.event.addListener(self.markers[i],'click', function(){
        self.markers[i].addListener('click', function(){
            if (this.getAnimation() !== null) {
                this.setAnimation(null);
            } else {
                this.setAnimation(google.maps.Animation.DROP);
            }
        });


        self.pointOfInterestLinks.push(
            new PointOfInterest(i, self.pointsOfInterest[i], self.markers[i])
        );

        // Add marker to map
        self.markers[i].setMap(map);
    }

    // Click on link
    selectPointOfInterest = function(link) {
        google.maps.event.trigger(link.marker, 'click');
    };

}



// Called after maps api is asynchronously loaded
function initMap() {
    ko.applyBindings(new PointOfInterestViewModel());
}
