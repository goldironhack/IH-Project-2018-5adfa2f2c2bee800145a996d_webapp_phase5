function DistMgr(DATASET_SHAPES, DATASET_HOUSING, DATASET_TABULATION, DATASET_DISTRICTNAMES){
    
    var districts = [];//71 each districts has shape or shapes and houses
    var boroNameCode = {};
    var districtCodeName = {};
    var hoodNameCode = {};
    var districtCrimeCounter = {};
    var districtELIUCounter = {};
    var districtKeys = {};
    var houseDistrict = {};
    
     var greenAreas = {26:true, 27:true, 28:true, 55:true, 56:true, 64:true, 81:true, 82:true, 84:true, 95:true};
     var otherAreas = {80:true, 83:true};
    
    //my object
    var chart;
    var mypopup;
   
    init();
    initListenersOnce();
    
 function init(){
     
  //init customer service
      mypopup = new Mypopup();
      mypopup.showIntro("Welcome to New York, we can help you find:");
     
  var data;
      //each district must have one or more shapes
  for(var dis = 1; dis <= 6; dis++){
    var shapes = [];
    for(var s = 1; s <= 96; s++){
        var dShape = [];//shape package
        shapes.push(dShape);
    }
    districts.push(shapes);
    //district keys
    var districtNumbers = [];
    districtKeys[dis] = districtNumbers;
} 

  //create boroname-borocode set and hoodname-hoodcode
  data = DATASET_TABULATION.data;
  for(var b = 0; b < data.length; b++){
      boroNameCode[data[b][10].toUpperCase()] = data[b][11];
      hoodNameCode[data[b][13].toUpperCase()] = data[b][12];
  }
  
  //get district names
  data = DATASET_DISTRICTNAMES.data;
  var key;
   for(var i = 0; i < data.length; i++){
      //8:boro name, 9:District number, 10:district name
     key =  boroNameCode[data[i][8].toUpperCase()] + data[i][9].toString();
     districtCodeName[key] = data[i][10]; 
  }
 
   
   google.maps.Polygon.prototype.getBoundingBox = function() {
                var bounds = new google.maps.LatLngBounds();
                this.getPath().forEach(function(element,index) {
                  bounds.extend(element)
                });
              return(bounds);
            };
   
   
 }
 
 function initListeners(){
      $("#button-safest").on("click", function(){
          chart.loadCrimeData();
      });
      $("#button-closest").on("click", function(){
          chart.loadClosest();
      });
      
      $("#button-mostAffordable").on("click", function(){
          chart.loadMostAffordable();
      });
      
      $("#button-bestOfAll").on("click", function(){
          chart.loadBestOfAll();
      });
      
      
 }
 
 function initListenersOnce(){
     $("#home-button, #back").on("click", function(event){ 
           mypopup = new Mypopup();
           Mypopup.clearMarkers();
           Mypopup.clearMuseumMarkers();
           Mypopup.clearHoodMarkers();
           mypopup.showIntro("Welcome to New York, we can help you find:");
           $("#back").attr({"hidden":true});
           initListeners();
           Mypopup.slideDown();
           chart.resetResults();
           map.setCenter({lat:40.7291, lng: -73.9965});
           map.setZoom(11);
           event.stopPropagation();
           
      });
      
       $("#zoomout").on("click", function(event){ 
           Mypopup.clearMuseumMarkers();
           Mypopup.clearHoodMarkers();
           map.setCenter({lat:40.7291, lng: -73.9965});
           map.setZoom(11);
           event.stopPropagation();
      });
 }
 
 //create housing
 function createHousing(){
     var data = DATASET_HOUSING.data;
     
     for(var h = 0; h < data.length; h++){
         var boroName = data[h][15].toUpperCase();
         var boroCode = boroNameCode[boroName];
         var districtNumber = parseInt(data[h][19].substring(3));
         
             //console.log(boroCode+districtNumber);
         var house = {//
             "boroName": data[h][15].toUpperCase(),
             "boroCode": boroNameCode[boroName],
             "districtNumber" :districtNumber,
             "hoodCode": data[h][22],
             "latitud" :data[h][23],
             "longitud" :data[h][24],
             "ELIU" :data[h][31],
             "VLIU" :data[h][32]
         };
         houseDistrict[boroCode+districtNumber] = boroName;
         //console.log("districtNumber* --->", districtNumber);
         var shapes = districts[boroCode][districtNumber];
         //use only the shape at 0 to store housing data
         if(typeof(shapes)!= "undefined" && typeof(shapes[0]) != "undefined"){
             shapes[0].houses.push(house);
             var key = boroCode.toLocaleString() + districtNumber.toString();
             districtELIUCounter[key] += parseInt(data[h][31]);
         }
        
         //**********************************
         
     }
     //console.log("housedistricts--->",houseDistrict);
    
 }
 
 //create museums
 function createMuseums(datasetMuseums){
     var data = datasetMuseums.data;
     for(var m = 0; m < data.length; m++){
         //name:9, tel:10,point-pos:8
         var latLng = data[m][8].substring(7).replace(")", "").split(" ");
         var museum = {
           "name":data[m][9],
           "tel":data[m][10],
           "latitud":latLng[1],
           "longitud":latLng[0]
         };
         
         Mypopup.createMuseumMarker(museum);
     } 
 }
 
 //create neiboorhoods
 function createHoods(datasetHoods){
     var data = datasetHoods.data;
     
     for(var h  = 0; h < data.length; h++){
         //name:10, boro:16, geo:9
         var latLng = data[h][9].substring(7).replace(")", "").split(" ");
         var hood = {
           "name":data[h][10],
           "boro":data[h][16],
           "latitud":latLng[1],
           "longitud":latLng[0]
         };
         
        Mypopup.createHoodsMarker(hood);
     }
     
 }


//add event to districts
function addEventToDistrict(shape){
    //add a listener to each district
            google.maps.event.addListener(shape, "click", function(){
                
              
                    alert(this.boroNumber + "-" + this.districtNumber );
                   // alert(this.ELIU);

            });
             google.maps.event.addListener(shape, "click", function(){
                
                    /*map.setZoom(14);
                    map.setCenter(shape.getBoundingBox().getCenter());*/
                
            });
            
             
}

// create shape
function createShape (geometryCoords, boroNumber, districtNumber, boroCD){
    //create district border
    //alert(boroNumber+ " " + districtNumber)
            var boroColors = ["", "#ddccff", "#e6ac00", "#ff9933", "#ffcccc", "#6699cc"];
            var color = "gray";
            var houses = [];
            var crimes = [];
            var markets = [];
            if(greenAreas[districtNumber] !== true && otherAreas[districtNumber] !== true){
                color = boroColors[boroNumber];
            }else if(greenAreas[districtNumber] === true){
                color = "darkgreen";
            }
            
            var shape = new google.maps.Polygon({
            paths: geometryCoords,
            strokeColor: 'black',
            strokeOpacity: 0.7,
            strokeWeight: 0.5,
            fillOpacity: 0.6,
            fillColor:color,
            originalColor:color,
            houses:houses,
            markets:markets,
            boroNumber: boroNumber,
            districtNumber: districtNumber,
            districtName:districtCodeName[boroCD],
            crimes:crimes
          });
           
            //console.log(shape);
            shape.setMap(map);
            //save shape to use later
             //alert(districtNumber + " ", typeof(districtNumber));
            districts[boroNumber][districtNumber].push(shape);
            //console.log(shape.getBoundingBox().getCenter().lat())
            var positionOfU = new google.maps.LatLng(40.7291,-73.9965);
            var positionOfD = new google.maps.LatLng(shape.getBoundingBox().getCenter().lat(),shape.getBoundingBox().getCenter().lng());
            shape.distanceFromU = google.maps.geometry.spherical.computeDistanceBetween(positionOfU, positionOfD);
             addEventToDistrict(shape);
             
    
};
//draw NY districts
this.drawNYDistrictsBorders = function(){
    //loop through districts
   // console.log(DATASET_SHAPES.features[0].properties.BoroCD);
    for(var d = 0; d < DATASET_SHAPES.features.length; d++){
            var geometryCoords = [];
            var coords = DATASET_SHAPES.features[d].geometry.coordinates[0];
            var mcoords = DATASET_SHAPES.features[d].geometry.coordinates;
            var geoType = DATASET_SHAPES.features[d].geometry.type;
            var boroCD = DATASET_SHAPES.features[d].properties.BoroCD;
            var aux = boroCD / 100;
            var boroNumber = Math.floor(aux);
            var districtNumber = Math.round((aux - boroNumber) * 100);
            boroCD = boroNumber.toString() + districtNumber.toString();
            
        if(greenAreas[districtNumber] !== true && otherAreas[districtNumber] !== true){
            var n1;
            var n2;
            //Polygon
            if(geoType === "Polygon"){
                for(var i = 0; i < coords.length; i++){
                //one polygon
                     n1 = coords[i][1];
                     n2 = coords[i][0];
                     geometryCoords.push( {lat:n1, lng:n2} );
                    
             }
             
             createShape(geometryCoords, boroNumber, districtNumber, boroCD);
            }else{
                //multipolygon
                    for(var j = 0; j < mcoords.length; j++){
                       for(var k = 0; k < mcoords[j][0].length; k++){
                           n1 = mcoords[j][0][k][1];
                           n2 = mcoords[j][0][k][0];
                           geometryCoords.push( {lat:n1, lng:n2} );
                       }
                       
                       createShape(geometryCoords, boroNumber, districtNumber, boroCD);
                       geometryCoords = [];
                    }
              
            }
    
            //init crime counter
          var key; 
          boroNumber =  parseInt(boroNumber);
          districtNumber = parseInt(districtNumber);
          if(districtNumber > 9){
              key = boroNumber * 100 + districtNumber;
          }else{
              key = boroNumber * 10 + districtNumber;
          }
          //initialize
          districtCrimeCounter[key] = 0;
          districtELIUCounter[key] = 0;
            
        }
           

    } 
   // console.log("------------------>", districts);
    //now work on boroughs
         Mypopup.stopLoadingScreen();
         Mypopup.slideDown();
        createHousing();
        
       
}; 

//OTHER DATA
 this.setOtherData = function(DATASET_CRIMES, DATASET_MUSEUMS, DATASET_HOODNAMES){
     
     chart = new Chart(DATASET_CRIMES, districts, boroNameCode, districtCrimeCounter, districtELIUCounter);
     initListeners();
     
     //MUSEUMS
      //add listener to museums
      function addListenerToMuseum(dataset_museums){
        $("#museums").on("click", function(){
            //check if loaded
            if(GOOGLEMUSEUMMARKERS.length > 0){
                
                Mypopup.clearMuseumMarkers();
            }else{
                $(this).css({"opacity":"1"});
                createMuseums(dataset_museums);
                
            }
            
        });
     }
      addListenerToMuseum(DATASET_MUSEUMS);
      
      //NEIGHBOORHOODS
      
      function addListenerToHoods(dataset_hoods){
        $("#hoods").on("click", function(){
            //check if loaded
            if(GOOGLEHOODSMARKER.length > 0){
                
                Mypopup.clearHoodMarkers()
            }else{
                $(this).css({"opacity":"1"});
                 createHoods(dataset_hoods);
                
            }
            
        });
     }
     addListenerToHoods(DATASET_HOODNAMES);
     
 };
    
}
    
    
 
    
