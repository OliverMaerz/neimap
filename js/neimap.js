// Point of Interest data - TODO: load POI's from server via JSON
var pointsOfInterest = [
    {
        name: 'Zuccardi',
        lat: -32.9700846,
        lng: -68.5675192,
        foursquare: '543412cb498e3f8059825cec',
        altDescription: 'Zuccardi winery in Maipu. Great Malbec and Bonarda',
    },
    {
        name: 'Lopez',
        lat: -32.962649,
        lng: -68.786521,
        foursquare: '4c7dae7701589521ccaf0363',
        altDescription: 'Lopez winery in Maipu. Good Malbecs. ',
    },
    {
        name: 'Salentein',
        lat: -33.2863936,
        lng: -69.1479992,
        foursquare: '4c6951eb35d3be9af2f21e06',
        altDescription: 'Salentein winery in Tunuyán. Great reds.',
    },
    {
        name: 'SinFin',
        lat: -32.9755586,
        lng: -68.7014326,
        foursquare: '52053f7704931e0e1ac82125',
        altDescription: 'SinFin winery. Good Malbecs and a great Grappa.',
    },
    {
        name: 'Vistandes',
        lat: -33.0246466,
        lng: -68.7715359,
        foursquare: '4d8f4c741716a143e2ce46f7',
        altDescription: 'Vistandes winery in Maipu. Popular location for bike tours.',
    }
];


// Foursquare creds
var foursquare = {
    uid: 'L5FM2XQTT5NNJO44NA1M1P1PCP4YYICJZQBMNDAV2GNOPNIZ',
    sec: '1ZIPF4L3JHYAWYUGLDXLCX25RKSMXEJYMZEBZQKQ32ZX4KTO',
}

// Global variable for map (so model and viewmodel have access)
var map;

// Venue data for JSON API call
function Venue(data) {
    this.name = data.name;
    // formattedAddress is array - join elements with a dash into a string
    this.address = data.location.formattedAddress.join(' - ');
    this.photos = data.photos.groups[0].items;
}


// One row in the sidebar menu
function PointOfInterest(id, pointOfInterest, marker) {
    var self = this;
    self.id = id;
    self.pointOfInterest = ko.observable(pointOfInterest);
    self.marker = marker;
}


// Called after maps api is asynchronously loaded
function initMap() {
    ko.applyBindings(new NeimapViewModel());
}


function GoogleError() {
    // Could not load Google Maps library show user a message
    alert('Could not connect to Google Maps. No Internet???');
}


//  Viewmodel for the Neimap app
var NeimapViewModel = function() {
    var self = this;

    self.mapCenter = {lat: -33.10, lng: -68.85};
    //self.pointsOfInterest = pointsOfInterest;

    // Array for venue (JSON response data)
    //self.venue = ko.observableArray();

    // Array to hold links for sidebar menu
    self.pointOfInterests = ko.observableArray();

    // Object to hold content for info window
    var Content = function (html) {
        this.html = html;
    };

    // Center map
    map = new google.maps.Map(document.getElementById('map'), {
        center: self.mapCenter,
        zoom: 10
    });

    // Array to push markers
    //self.markers = [];
    //self.bouncingMarker = [];

    // Loop over array and set markers
    for (var i = 0, len = pointsOfInterest.length; i < len ; i ++) {
        // Add id with current value of i
        pointsOfInterest[i].id = i;
        var poi = new NeimapModel(pointsOfInterest[i]);
        self.pointOfInterests.push(poi);

    }

    // Click on link
    selectPointOfInterest = function(link) {
        google.maps.event.trigger(link.marker, 'click');
    };
}


// Model for points of interest with marker, json call and all
var NeimapModel = function(poiData) {
    var self = this;

    // data needed in poiData: foursquare venue id,

    self.name = poiData.name;
    self.id = poiData.id;
    //self.pointOfInterest = poiData;

    self.contentFoursquare = ko.observable();

    var infowindow = {};


    // Retreive data about venue from foursquare API in JSON format
    $.getJSON('https://api.foursquare.com/v2/venues/' + poiData.foursquare + '?v=20170101&client_id=L5FM2XQTT5NNJO44NA1M1P1PCP4YYICJZQBMNDAV2GNOPNIZ&client_secret=1ZIPF4L3JHYAWYUGLDXLCX25RKSMXEJYMZEBZQKQ32ZX4KTO', function(allData) {
        var mappedVenue = $.map(allData.response, function(item) { return new Venue(item) });

        var contentString = '<div id="content">'+
            '<div id="siteNotice">'+
            '</div>'+
            '<h1 id="firstHeading" class="firstHeading">' + mappedVenue[0].name + '</h1>' +
            '<div id="bodyContent">'+
            '<p>' + mappedVenue[0].address + '</p>'+
            '<p>Attribution: Information about venue by <a href="https://www.foursquare.com/'+
            '">Foursquare</a>. Map data from <a href="https://maps.google.com">Google Maps</a>.'+
            '</p>'+
            '<div class="image-list">';


        // Add images from photos array
        for (var j = 0, len = mappedVenue[0].photos.length; (j < len) && (j < 2); j++) {
            contentString += '<img src="'+ mappedVenue[0].photos[j].prefix +'100x100'+ mappedVenue[0].photos[j].suffix +'"/> ';
        }

        contentString +=
            '</div>'+
            '</div>'+
            '</div>';
            self.contentFoursquare(contentString);

    }).fail(function() {
        self.contentFoursquare('Could not load info from Foursquare. Internet down?');
    });


    // Create a new marker
    self.marker = new google.maps.Marker({
        map: map,
        position: {lat: poiData.lat, lng: poiData.lng},
        // title appears as a tooltip on map
        title: poiData.name,
        // Set first character of name as marker icon
        label: poiData.name.charAt(0),
        content: poiData.altDescription,
        tripAdvisorId: 888,
    });

    // Add listener to marker
    self.marker.addListener('click', function(){
        var bouncingMarker = this
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

        if(infowindow.open) {
            infowindow.close();
        }

        infowindow = new google.maps.InfoWindow({
            content: self.contentFoursquare(),
        });

        // Recenter the map
        map.setCenter(new google.maps.LatLng(bouncingMarker.position.lat(), bouncingMarker.position.lng()));
        // Open the info window
        infowindow.open(map, bouncingMarker);
    });


    // Store in array of markers
    //self.markers.push(
    //    {
    //        marker: marker,
    //        id: i,
    //    }
    //);



    // Add marker to map
    self.marker.setMap(map);

    //self.pointOfInterestLinks.push(
    //    new PointOfInterest(i, poiData, self.marker)
    //);


}



