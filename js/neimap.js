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
    self.openInfowindow;

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
            // title appears as a tooltip on map
            title: self.pointsOfInterest[i].name,
            // Set first character of name as marker icon
            label: self.pointsOfInterest[i].name.charAt(0),
        });

        self.markers.push(
            {
                marker: marker,
                id: i,
            }
        );

        // google.maps.event.addListener(self.markers[i],'click', function(){
        self.markers[i].marker.addListener('click', function(){
            bouncingMarker = this

            var label = bouncingMarker.getLabel();
            // labels do not bounce with marker so remove it temporarely
            bouncingMarker.setLabel(' ');
            // Now let the marker bounce
            bouncingMarker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){ bouncingMarker.setAnimation(null); }, 750);
            // Now restore the original label
            setTimeout(function(){ bouncingMarker.setLabel(label); }, 800);

            var contentString = '<div id="content">'+
                '<div id="siteNotice">'+
                '</div>'+
                '<h1 id="firstHeading" class="firstHeading">Uluru</h1>'+
                '<div id="bodyContent">'+
                '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large ' +
                'sandstone rock formation in the southern part of the '+
                'Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi) '+
                'south west of the nearest large town, Alice Springs; 450&#160;km '+
                '(280&#160;mi) by road. Kata Tjuta and Uluru are the two major '+
                'features of the Uluru - Kata Tjuta National Park. Uluru is '+
                'sacred to the Pitjantjatjara and Yankunytjatjara, the '+
                'Aboriginal people of the area. It has many springs, waterholes, '+
                'rock caves and ancient paintings. Uluru is listed as a World '+
                'Heritage Site.</p>'+
                '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
                'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
                '(last visited June 22, 2009).</p>'+
                '</div>'+
                '</div>';
            var infowindow = new google.maps.InfoWindow({
                content: contentString
            });

            self.openInfowindow = infowindow.open(map, this);
        });


        self.pointOfInterestLinks.push(
            new PointOfInterest(i, self.pointsOfInterest[i], self.markers[i].marker)
        );

        // Add marker to map
        self.markers[i].marker.setMap(map);
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
