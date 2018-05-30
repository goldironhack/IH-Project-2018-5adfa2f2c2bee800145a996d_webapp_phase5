function Chart(DATASET_CRIME, districts, boroNameCode, districtCrimeCounter, districtELIUCounter){
     var tempCrimeData = DATASET_CRIME.data;
     var isBoroDataLoaded = [];
     var crimesGroupedByBoro = {};
     var districtKeyDistanceToU = {};
     var crimesBorosDone = 0; 
    
    //top
    var topTenSafest = [];
    var topTenClosest = [];
    var topTenAffordable = [];
    var candidatesForTop3 = {};
    var finalist = [];
    
   
    
    var loadBestOfAllInterval;
    
    
    ///cart info
     
     init();
    
    //console.log(topTenKeys);
    function init(){
        
        for(var i = 1; i <= 5; i++){
          var arr = [];
          crimesGroupedByBoro[i] = arr;
          isBoroDataLoaded[i] = false;
        }
        //
        groupCrimesByBoro();
        
    }
    
     
    //identify crimes in districts and add them 
    function identifyCrimesInDistrictsByBoro(b){
   
               var COUNTER = 0;
               while(crimesGroupedByBoro[b].length > 0){
                   var crimesLength = crimesGroupedByBoro[b].length;
                   var crime = crimesGroupedByBoro[b][crimesLength - 1];
                   var boroShapes = districts[b]; 
                   var currentTotalData = crimesLength;
                   var breakOutterFor = false;
                   
                   for(var ss = 0; ss < boroShapes.length; ss++){
                          //console.log("boroChrome[c].lat", boroCrimes[c].lng);
                       var positionOfCrime = new google.maps.LatLng(crime.lat, crime.lng);
                       for(var s = 0; s < boroShapes[ss].length; s++){
                                COUNTER++;
                                if(google.maps.geometry.poly.containsLocation(positionOfCrime, boroShapes[ss][s])){
                                  boroShapes[ss][s].crimes.push(crime);
                                  var key = boroShapes[ss][s].boroNumber.toString() + boroShapes[ss][s].districtNumber.toString();
                                  districtCrimeCounter[key]++;
                                  breakOutterFor = true;
                                  break;
                          }
                       }
                       if(breakOutterFor){
                           break;
                       }
                   }
                   
                    crimesGroupedByBoro[b].pop();
                    
                                 if( COUNTER > 100){
                                     return (currentTotalData);
                                   }
               }
               //All data processed
               return 0;

    }
    //CRIME LOADER
    function loadCrimesInDistrictByBoro(b){
        var remaining = 0;
        
        if(isBoroDataLoaded[b] === false){
           remaining = identifyCrimesInDistrictsByBoro(b);
           //console.log("loadcrimes for boro " + b + "*" + remaining);
       }
           if(remaining == 0){     
            console.log("data previously processed");
          }
       
       
        if(remaining > 0 && isBoroDataLoaded[b] === false){
            setTimeout(loadCrimesInDistrictByBoro, 100, b);
            //process data without locking UI
        }else{
            isBoroDataLoaded[b] = true;
            console.log("CRIME DATA:DONE WITH BORO " + b );
            crimesBorosDone++;
            if(crimesBorosDone >= 5){
                Mypopup.stopLoadingScreen();
                Mypopup.clear();
                Mypopup.setTitle("There you go,the <b>top 10 safest</b> Districts in NY");
                Mypopup.slideDown();
                if(topTenSafest.length === 0){
                 findTheTopTen(topTenSafest, districtCrimeCounter, true);
                }
                highlightTopTen(topTenSafest, "blue", "#00cc00");
               
            }
        }
    }
    
    
    function groupCrimesByBoro(){
        while(tempCrimeData.length > 0){
           var field = tempCrimeData[tempCrimeData.length - 1];
           //Find each crime location and add it to shape
           //21:boroName 15:descCrime, 31:latLon, 9:crimeDate
           //var boroName = field[21];
               var crime = {
                      "boroName":field[21],
                      "descCrime":field[15],
                      "lat":parseFloat(field[31][1]),
                      "lng":parseFloat(field[31][2]),
                      "crimeDate":field[9]
                   };
               var boroCode = boroNameCode[field[21]];
               crimesGroupedByBoro[boroCode].push(crime);
           //
               tempCrimeData.pop();
        }
        //console.log("CRIMES BY BORO",crimesGroupedByBoro)
        tempCrimeData = DATASET_CRIME.data;
    }
    

    
     
function findTheTopTen(topTenKeys, keyValueObject, ascending){
         topTenKeys.length = 0;
         var tuples = [];
         for (var key in keyValueObject){ 
             tuples.push([key, keyValueObject[key]]);
          }

            tuples.sort(function(a, b) {
                    a = a[1];
                    b = b[1];
                
                if(ascending){
                    //get smaller numbers first
                     if(a < b){
                       return -1;
                     }else if(a > b){
                       return 1;
                     }else{
                        return 0;
                    }
                }else{
                    //get bigger numbers first
                    if(a > b){
                       return -1;
                     }else if(a < b){
                       return 1;
                     }else{
                        return 0;
                    }
                    
                }
   
            });
            
            for (var i = 0; i < 10; i++) {
                var key = tuples[i][0].toString();
                var value = tuples[i][1];
                var boroNumber = key.substring(0, 1);
                var districtNumber = key.substring(1);
                var myPrecious = {
                     "boroNumber":boroNumber,
                     "districtNumber":districtNumber,
                     "rank":0
                };
                
                topTenKeys.push(myPrecious);
                //highlightTopTen(districts[boroNumber][districtNumber], i + 1);
                //console.log( districts[boroNumber][districtNumber], "ELIUs: " + value + "districtn-" + key);
            }
          //console.log("topten", topTenClosest);
 }

//highlight safest place
function highlightTopTen(topTenKeys, strokeColor, fillColor){
      
       for(var k = 0; k < topTenKeys.length; k++){
          var districtShapes = districts[topTenKeys[k].boroNumber][topTenKeys[k].districtNumber];
          
          for(var i = 0; i < districtShapes.length; i++){
           districtShapes[i].setOptions({
               "strokeColor":strokeColor,
               "strokeWeight":3,
               "fillColor":fillColor,
               "fillOpacity":0
           });
         }
         
         //district name to customer service
        Mypopup.addDistrictResults(districtShapes[0].districtName, k + 1);
       }
       
       
        addListenerToBestOnes(topTenKeys);
        addMarkersOnClickListener(topTenKeys);
}


function addListenerToBestOnes(topTenKeys){
    for(var k = 0; k < topTenKeys.length; k++){
          var districtShapes = districts[topTenKeys[k].boroNumber][topTenKeys[k].districtNumber];
          
          for(var i = 0; i < districtShapes.length; i++){
               
                Mypopup.addListenerToBestOnes(districtShapes[i], k + 1);
         }  
         
           
       
       }
}

function addMarkersOnClickListener(topTenKeys){
    for(var k = 0; k < topTenKeys.length; k++){
          var districtShapes = districts[topTenKeys[k].boroNumber][topTenKeys[k].districtNumber];

                Mypopup.addMarkerListenerToBestOnes(districtShapes[0], k + 1);
                

       }
}
  
  
//CLOSEST DISTRICT *******************************************
function identifyClosestDistrictsByBoro(b){
     var COUNTER = 0;
     var currentTotalData;
     var boroShapes = districts[b];
              
              for(var ss = 0; ss < boroShapes.length; ss++){
                  for(var s = 0; s < boroShapes[ss].length; s++){
                      COUNTER++;
                      var key = boroShapes[ss][s].boroNumber.toString() + boroShapes[ss][s].districtNumber.toString();
                          //save the district shape that is closest to the U
                          districtKeyDistanceToU[key] = boroShapes[ss][s].distanceFromU;
                      
                      
                  }
              }
              
                                /* if( COUNTER > 100){
                                     return (currentTotalData);
                                   }*/
               if(b == 5){//privided the function is called passing each time the first to last
                        Mypopup.stopLoadingScreen();
                        Mypopup.clear();
                        Mypopup.setTitle("Here you have the <b>top 10 closest</b> Districts to NYU");
                        Mypopup.slideDown();
                        findTheTopTen(topTenClosest, districtKeyDistanceToU, true);
                        highlightTopTen(topTenClosest, "blue", "#1a75ff");
               }
               
               return 0;
}  
  
  
function findAverageTop3All(){
          
        if(topTenSafest.length > 0){
            loadClosest();
            loadMostAffordable();
            clearInterval(loadBestOfAllInterval);
            
            resetAllResults();
            Mypopup.stopLoadingScreen();
            Mypopup.clear();
            Mypopup.setTitle("Safest, closest & most affordable Districts");
            ///find top 3
            
            findAverageTop3();
           // console.log("candidates", candidatesForTop3);
            
            findTheTopTen(finalist, candidatesForTop3, false);
            finalist.splice(3);
            highlightTopTen(finalist, "blue", "green");
            
            console.log("done");
           
            console.log(candidatesForTop3);
        }
        // console.log("checking");
}
  
function findAverageTop3(){
    
        addToTop3Candidates(topTenSafest);
        addToTop3Candidates(topTenClosest);
        addToTop3Candidates(topTenAffordable);
       
}

function addToTop3Candidates(topTen){
    for(var i = 0; i < 10; i++){
        topTen[i].rank += (9 - i);//
        candidatesForTop3[topTen[i].boroNumber + topTen[i].districtNumber] = topTen[i].rank;
    }
}


function resetAllResults(){
    
        resetResult(topTenSafest);
        resetResult(topTenClosest);
        resetResult(topTenAffordable);
        //set borodata to false
        isBoroDataLoaded[1] = false;
        isBoroDataLoaded[2] = false;
        isBoroDataLoaded[3] = false;
        isBoroDataLoaded[4] = false;
        isBoroDataLoaded[5] = false;
}
function resetResult(topTenKeys){
     crimesBorosDone = 0;
    
    for(var k = 0; k < topTenKeys.length; k++){
          var districtShapes = districts[topTenKeys[k].boroNumber][topTenKeys[k].districtNumber];
          
          for(var i = 0; i < districtShapes.length; i++){
           districtShapes[i].setOptions({
            strokeColor: 'black',
            strokeOpacity: 0.7,
            strokeWeight: 0.5,
            fillOpacity: 0.6,
            fillColor:districtShapes[i].originalColor
            
           });
         }
        
       }
       topTenKeys = [];
       
}
function loadCrimeData(){
     //too lazy to write a for loop
        loadCrimesInDistrictByBoro(5);
        loadCrimesInDistrictByBoro(4);
        loadCrimesInDistrictByBoro(3);
        loadCrimesInDistrictByBoro(2);
        loadCrimesInDistrictByBoro(1);
        
        }
function loadClosest(){
    //fast-and-furious function
     //check by boro
        identifyClosestDistrictsByBoro(1);
        identifyClosestDistrictsByBoro(2);
        identifyClosestDistrictsByBoro(3);
        identifyClosestDistrictsByBoro(4);
        identifyClosestDistrictsByBoro(5);  
}

function loadBestOfAll(){
    loadBestOfAllInterval = setInterval(findAverageTop3All, 800);
        loadCrimeData();
        
        Mypopup.playLoadingScreen();
       // Mypopup.clear();
        //Mypopup.slideUp();
}
function loadMostAffordable(){
    
     Mypopup.stopLoadingScreen();
     Mypopup.clear();
     Mypopup.setTitle("The <b>top 10 most affordable</b> Districts to live in");
     Mypopup.slideDown();
     findTheTopTen(topTenAffordable, districtELIUCounter, false);
     highlightTopTen(topTenAffordable, "blue", "blue");
}
///***************PUBLIC ACCESSORS*****************************************************************/

this.loadCrimeData = function(){
    
        loadCrimeData();
      
  };
  
this.loadClosest = function(){
     
        loadClosest();
};
  
this.loadMostAffordable = function(){
    
        loadMostAffordable();
    
};  

this.loadBestOfAll = function(){
        
        if(Object.keys(candidatesForTop3).length === 0)
             loadBestOfAll();
        else{
            // console.log(candidatesForTop3);
             Mypopup.stopLoadingScreen();
             Mypopup.clear();
             Mypopup.setTitle("Safest, closest & most affordable Districts");
             Mypopup.slideDown();
             findTheTopTen(finalist, candidatesForTop3, false);
             finalist.splice(3);
             highlightTopTen(finalist, "blue", "green");
        }
        
};



this.resetResults = function(){
    
        resetAllResults();
  };
  
  
  
  
    
}