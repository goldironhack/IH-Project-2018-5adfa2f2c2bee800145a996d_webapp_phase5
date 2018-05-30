
//global map
var map;

(function(){
//datasets urls
SHAPES_URL = "http://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson";
TABULATION_URL = "https://data.cityofnewyork.us/api/views/q2z5-ai38/rows.json?accessType=DOWNLOAD";
CRIMES_URL = "https://data.cityofnewyork.us/api/views/bi3n-znbr/rows.json?accessType=DOWNLOAD";
HOODNAMES_URL = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";
HOUSING_URL = "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD";
DISTRICTSNAMES_URL = "https://data.cityofnewyork.us/api/views/xi7c-iiu2/rows.json?accessType=DOWNLOAD"
MUSEUMS_URL = "https://data.cityofnewyork.us/api/views/fn6f-htvy/rows.json?accessType=DOWNLOAD";

//Objects
var distMgr;

//datasets to use
var DATASET_SHAPES = null;//.features[district].geometry.coordinates[0][setofcoordinates] or .features[0].properties
var DATASET_CRIMES = null;
var DATASET_HOODNAMES = null;
var DATASET_HOUSING = null;
var DATASET_TABULATION = null;
var DATASET_DISTRICTNAMES = null;
var DATASET_MUSEUMS = null;

var shapesDatasetRecieved;
var otherDataRecieved;

//************************************DATASETS*************************************************************
function getDataFromURL(URL){
	var data = $.get(URL, function(){
		//console.log(URL)
	})
		.done( function(){
			//Success
                        if(URL === SHAPES_URL){
			   DATASET_SHAPES = JSON.parse(data.responseText);
                          // console.log(DATASET_SHAPES.features[0].geometry.coordinates[0][0]);
                       }else if(URL === CRIMES_URL){
                           DATASET_CRIMES = JSON.parse(data.responseText);
                          // console.log(DATASET_CRIMES);
                       }else if(URL === HOODNAMES_URL){
                           DATASET_HOODNAMES = JSON.parse(data.responseText);
                          // console.log(DATASET_HOODNAMES);
                       }else if(URL === HOUSING_URL){
                           DATASET_HOUSING = JSON.parse(data.responseText);
                           //console.log(DATASET_HOUSING);
                       }else if(URL === TABULATION_URL){
                           DATASET_TABULATION = JSON.parse(data.responseText);
                       }else if(URL === DISTRICTSNAMES_URL){
                           DATASET_DISTRICTNAMES = JSON.parse(data.responseText);
                       }else if(URL === MUSEUMS_URL){
                           DATASET_MUSEUMS = JSON.parse(data.responseText);
                       }
			
		})
		.fail( function(error){
			console.error(error);
                        confirm("Some needed datasets could not be loaded, try later.");
		});
}

//load all datasets needed 
getDataFromURL(SHAPES_URL);
getDataFromURL(CRIMES_URL);
getDataFromURL(HOODNAMES_URL);
getDataFromURL(HOUSING_URL);
getDataFromURL(TABULATION_URL);
getDataFromURL(DISTRICTSNAMES_URL);
getDataFromURL(MUSEUMS_URL);

shapesDatasetRecieved = setInterval(checkShapesDatasetStatus, 500);


function checkShapesDatasetStatus(){
    if(DATASET_SHAPES === null || 
       DATASET_HOUSING === null || 
       DATASET_TABULATION === null ||
       DATASET_DISTRICTNAMES === null){
        //wait for datasets before drawing
    }else{
        //draw districts and try to load Other data
        clearInterval(shapesDatasetRecieved);
        distMgr = new DistMgr(DATASET_SHAPES, DATASET_HOUSING, DATASET_TABULATION, DATASET_DISTRICTNAMES);
        distMgr.drawNYDistrictsBorders();
        otherDataRecieved = setInterval(checkOtherDataStatus, 800);
       /* console.log("SHAPES-->",DATASET_SHAPES);
        console.log("HOUSING-->",DATASET_HOUSING);
        console.log("TABULATION-->",DATASET_TABULATION);
        console.log("DISTRICTNAMES-->",DATASET_DISTRICTNAMES);*/
    }
}

function checkOtherDataStatus(){
    if(DATASET_CRIMES === null ||
       DATASET_MUSEUMS === null ||
       DATASET_HOODNAMES == null){
        //wait for dataset 
    }else{
       // stop interval
        clearInterval(otherDataRecieved);
       // console.log("CRIMES-->",DATASET_CRIMES);
        console.log("MUSEUMS -->",DATASET_MUSEUMS);
        console.log("HOODNAMES-->",DATASET_HOODNAMES);
        distMgr.setOtherData(DATASET_CRIMES, DATASET_MUSEUMS, DATASET_HOODNAMES);
        
    }
}

})();

/************************************GOOGLE MAPS*********************************************************/
//
function onGoogleMapResponse(){
    
        ///style map
   var styledMapType = new google.maps.StyledMapType( [
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
],{name: 'Styled Map'});
	
        map = new google.maps.Map(document.getElementById('mapcontainer'), {
                center: {lat:40.7291, lng: -73.9965},
		zoom: 11
	});
        
        map.mapTypes.set('styled_map', styledMapType);
        map.setMapTypeId('styled_map');
        
      /*  var icon = {
             url: "https://logo.clearbit.com/www.stern.nyu.edu/", // url
             scaledSize: new google.maps.Size(30, 30)
        }*/
        //add starting marker
        var marker = new google.maps.Marker({
            position:{lat:40.7291, lng: -73.9965},
            //icon: icon,
            
            animation: google.maps.Animation.DROP,
            map:map
        });

       /* var country = "United States";
	var geocoder = new google.maps.Geocoder();
        var latLng = new google.maps.LatLng(40.644754824,  -74.08721385);
	geocoder.geocode( { 'latLng' : latLng}, function(results, status){
		if(status == google.maps.GeocoderStatus.OK){
			console.log("GEOCODER", results);
		};
	});*/
        
        
        
      /*google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
                  Mypopup.stopLoadingScreen();
                  Mypopup.slideDown();
                  
     });*/
}


