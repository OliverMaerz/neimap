// Point of Interest data - TODO: load POI's from server via JSON
var pointsOfInterest = [
    {
        name: 'Zuccardi',
        lat: -32.9700846,
        lng: -68.5675192,
        foursquare: '543412cb498e3f8059825cec',
        altDescription: 'Zuccardi main winery. Great Malbec and Bonarda',
    },
    {
        name: 'Zuccardi Valle de Uco',
        lat: -32.9465165,
        lng: -68.8623348,
        altDescription: 'Zuccardi Valle de Uco winery',
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


var foursquare = {
    uid: 'L5FM2XQTT5NNJO44NA1M1P1PCP4YYICJZQBMNDAV2GNOPNIZ',
    sec: '1ZIPF4L3JHYAWYUGLDXLCX25RKSMXEJYMZEBZQKQ32ZX4KTO',
}
// https://api.foursquare.com/v2/venues/543412cb498e3f8059825cec?v=20170101&client_id=L5FM2XQTT5NNJO44NA1M1P1PCP4YYICJZQBMNDAV2GNOPNIZ&client_secret=1ZIPF4L3JHYAWYUGLDXLCX25RKSMXEJYMZEBZQKQ32ZX4KTO


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
    self.map;
    self.infowindow = {};

    self.mapCenter = {lat: -33.10, lng: -68.85};



    self.map = new google.maps.Map(document.getElementById('map'), {
        center: self.mapCenter,
        zoom: 10
    });

    // Editable data
    self.pointOfInterestLinks = ko.observableArray();

    // Array to push markers
    self.markers = [];

    // Loop over array and set markers
    for (var i = 0, len = pointsOfInterest.length; i < len; i ++) {
        var location = {lat: pointsOfInterest[i].lat, lng: pointsOfInterest[i].lng};
        var marker = new google.maps.Marker({
            map: self.map,
            position: location,
            // title appears as a tooltip on map
            title: pointsOfInterest[i].name,
            // Set first character of name as marker icon
            label: pointsOfInterest[i].name.charAt(0),
            content: pointsOfInterest[i].altDescription,
            tripAdvisorId: 888,
        });

        self.markers.push(
            {
                marker: marker,
                id: i,
            }
        );

        // google.maps.event.addListener(self.markers[i],'click', function(){
        self.markers[i].marker.addListener('click', function(){
            var bouncingMarker = this

            //self.map.setCenter(bouncingMarker.position);

            var label = bouncingMarker.title.charAt(0);
            // labels do not bounce with marker so remove it temporarely
            bouncingMarker.setLabel(null);
            // Now let the marker bounce
            bouncingMarker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){
                    bouncingMarker.setAnimation(null);
                    // Now restore the original label
                    bouncingMarker.setLabel(label);
                }, 650);


            if(self.infowindow.open) {
                self.infowindow.close();
            }

            var contentString = '<div id="content">'+
                '<div id="siteNotice">'+
                '</div>'+
                '<h1 id="firstHeading" class="firstHeading">' + bouncingMarker.title + '</h1>' +
                '<div id="bodyContent"><p>' + bouncingMarker.content + '</p>'+
                //'<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
                //'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
                //'</p>'+
                '</div>'+
                '</div>';

            self.infowindow = new google.maps.InfoWindow({
                content: contentString,
            });

            // Recenter the map
            self.map.setCenter(new google.maps.LatLng(bouncingMarker.position.lat(), bouncingMarker.position.lng()));
            // Open the info window
            self.infowindow.open(self.map, bouncingMarker);
        });


        self.pointOfInterestLinks.push(
            new PointOfInterest(i, pointsOfInterest[i], self.markers[i].marker)
        );


        $.getJSON("https://api.foursquare.com/v2/venues/543412cb498e3f8059825cec?v=20170101&client_id=L5FM2XQTT5NNJO44NA1M1P1PCP4YYICJZQBMNDAV2GNOPNIZ&client_secret=1ZIPF4L3JHYAWYUGLDXLCX25RKSMXEJYMZEBZQKQ32ZX4KTO", function(allData) {
            var fsq = $.map(allData, function(item) { return new Task(item) });
            self.tasks(mappedTasks);
        });


        // Add marker to map
        self.markers[i].marker.setMap(self.map);
    }

    // Click on link
    selectPointOfInterest = function(link) {
        google.maps.event.trigger(link.marker, 'click');
    };
}


function TaskListViewModel() {
    // ... leave the existing code unchanged ...

    // Load initial state from server, convert it to Task instances, then populate self.tasks
    $.getJSON("https://api.foursquare.com/v2/venues/543412cb498e3f8059825cec?v=20170101&client_id=L5FM2XQTT5NNJO44NA1M1P1PCP4YYICJZQBMNDAV2GNOPNIZ&client_secret=1ZIPF4L3JHYAWYUGLDXLCX25RKSMXEJYMZEBZQKQ32ZX4KTO", function(allData) {
        var fsq = $.map(allData, function(item) { return new Task(item) });
        self.tasks(mappedTasks);
    });
}


// Called after maps api is asynchronously loaded
function initMap() {
    ko.applyBindings(new PointOfInterestViewModel());
}



