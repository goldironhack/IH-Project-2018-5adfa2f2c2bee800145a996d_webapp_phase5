var GOOGLEMARKERS = [];
var GOOGLEMUSEUMMARKERS = [];
var GOOGLEHOODSMARKER = [];
function Mypopup(){
    var mypopup = $("#mypopup");
    var ptitle = $("#mypopup-title");
    var pbody = $("#mypopup-body");
    var back = $("#back");
   
    
    this.showIntro = function(title){
        Mypopup.clear();
        ptitle.append(title);
        
        pbody.append("<button class='button-welcome' id='button-safest'>The safest Districts</button><br>");
        pbody.append("<button class='button-welcome' id='button-closest'>The closest to NYU</button><br>");
        pbody.append("<button class='button-welcome' id='button-mostAffordable'>The most affordable Districts</button><br>");
        pbody.append("<button class='button-welcome' id='button-bestOfAll'>The closest, most affordable and safest</button><br>");
        
        //safest
        $("#button-safest").on("click", function(){
          
            Mypopup.slideUp();
            Mypopup.playLoadingScreen();
            back.attr({"hidden":false});
        });
        //closest
        $("#button-closest").on("click", function(){
         
            Mypopup.slideUp();
            Mypopup.playLoadingScreen();
            back.attr({"hidden":false});
        });
        //most affodable
        $("#button-mostAffordable").on("click", function(){
        
            Mypopup.slideUp();
            Mypopup.playLoadingScreen();
            back.attr({"hidden":false});
        });
        //best three
        $("#button-bestOfAll").on("click", function(){
            
            Mypopup.slideUp();
            Mypopup.playLoadingScreen();
            back.attr({"hidden":false});
        });
        
        //////////////////////
        //slide down
        $("#mypopup-footer").on("mouseover",function(){
            Mypopup.slideDown();
        });
        //slideup
        $(".container").on("click",function(){
            Mypopup.slideUp();
        });
        
      };
      
      
      
}

 //loader
      Mypopup.playLoadingScreen = function(){
         $("#loader").show();
         $(".container").css({opacity:"0.3"});  
         
      };
      
      Mypopup.stopLoadingScreen = function(){
          $(".container").css({opacity:"1"}); 
          $("#loader").hide();
      };
      
     Mypopup.slideUp = function(){
         $("#mypopup").animate({top:"-70%"},  200);
     };
      
     Mypopup.slideDown = function(){
        $("#mypopup").animate({top:"5%"},  500);
     };
     
     Mypopup.addDistrictResults = function(name, topNumber){
         
         var r = $("<button class='district-result' id='district-result-"+ topNumber + "'>" + name + "</button>");
         $("#mypopup-body").append(r);
     };
     
     Mypopup.clear = function(){
         $("#mypopup-title").empty();
         $("#mypopup-body").empty();
     };
     
     Mypopup.setTitle = function(title){
         $("#mypopup-title").empty();
         $("#mypopup-title").html(title);
     };
     
     Mypopup.addListenerToBestOnes = function(shape, topNumber){
         var r = $("#district-result-"+ topNumber);
         
         r.on("mouseover", function(){
             
             shape.setOptions({
                "fillOpacity":0.7
             });
         });
         r.on("mouseout", function(){
            
             shape.setOptions({
                "fillOpacity":0.0
             });
         });
         
         r.on("click", function(){
            
             shape.setOptions({
                "fillOpacity":0.0
             });
             
             map.setZoom(14);
             //that's where the magic happends
           //  console.log(shape.getBoundingBox().getCenter());
             map.setCenter(shape.getBoundingBox().getCenter());
             console.log(shape)
             Mypopup.slideUp();

         });

     };
     
     //markers
         Mypopup.addMarkerListenerToBestOnes = function(shape0, topNumber){
              var r = $("#district-result-"+ topNumber);
              
              r.on("click", function(){
                  Mypopup.clearMarkers();
                  Mypopup.placeMarkers(shape0);
              });
         };
        
         //create museum markers on click
         Mypopup.createMuseumMarker = function(museum){

             var content = "<p>Museum </p>" + 
                             "<p>" + museum.name + "</p>" + 
                            "<p>Telephone: " + museum.tel +  "</p>";
             
             var infowindow = new google.maps.InfoWindow({
             content: content
            });
             
               var icon = {
                    url: "http://icons.iconarchive.com/icons/aha-soft/large-home/512/Museum-icon.png", 
                    scaledSize: new google.maps.Size(50, 60), 
                    
                    };
             
                var pos = new google.maps.LatLng(museum.latitud,museum.longitud);
             
                var marker = new google.maps.Marker({
                position: pos,
                icon:icon,
                map: map

            });
            GOOGLEMUSEUMMARKERS.push(marker);
            marker.addListener('mouseover', function() {
                 infowindow.open(map, marker);
            });
            marker.addListener('mouseout', function() {
                 infowindow.close(map, marker);
            });
         };
         //////create hoods markers on click
         Mypopup.createHoodsMarker = function(hood){
             
            
             var content = "<p><b>Neighboorhood</b></p>" +
                            "<p>" + hood.name + "</p>" + 
                            "<p>" + hood.boro + "</p>";
             
             var infowindow = new google.maps.InfoWindow({
             content: content
            });
             
               var icon = {
                    url: "http://boulderna.org/wp-content/uploads/2016/06/neighborhood-icon.png", 
                    scaledSize: new google.maps.Size(50, 60), 
                    
                    };
             
                var pos = new google.maps.LatLng(hood.latitud,hood.longitud);
             
                var marker = new google.maps.Marker({
                position: pos,
                icon:icon,
                map: map

            });
            GOOGLEHOODSMARKER.push(marker);
            marker.addListener('mouseover', function() {
                 infowindow.open(map, marker);
            });
            marker.addListener('mouseout', function() {
                 infowindow.close(map, marker);
            });
         };
     //////create markers on click
         Mypopup.createMarker = function(house){
             
            
             var content = "<p><b>Housing info</b></p>" + 
                           "<p>Extremily Low Income Units: " + house.ELIU +  "<p/>" + 
                           "<p>Very Low Income Units: " + house.VLIU +"</p>";
             
             var infowindow = new google.maps.InfoWindow({
             content: content
            });
             
               var icon = {
                    url: "http://www.iconarchive.com/download/i19000/iconshock/vista-general/house.ico", 
                    scaledSize: new google.maps.Size(50, 60), 
                    
                    };
             
                var pos = new google.maps.LatLng(house.latitud,house.longitud);
             
                var marker = new google.maps.Marker({
                position: pos,
                icon:icon,
                map: map

            });
            GOOGLEMARKERS.push(marker);
            marker.addListener('mouseover', function() {
                 infowindow.open(map, marker);
            });
            marker.addListener('mouseout', function() {
                 infowindow.close(map, marker);
            });
         };
         
         //place markers that are in a district
         Mypopup.placeMarkers = function(shape0){
              var houses = shape0.houses;
              for(var i = 0; i < houses.length; i++){
            
                 Mypopup.createMarker(houses[i]);
                 
            }
         };
         //place market markers
         Mypopup.placeMuseumMarkers = function(shape0){
              var museums = shape0.museums;
              for(var i = 0; i < markets.length; i++){
            
                 Mypopup.createMuseumMarker(museums);
                 
            }
         };
         //clear markers
        Mypopup.clearMarkers = function(){
            for(var m = 0; m < GOOGLEMARKERS.length; m++){
                GOOGLEMARKERS[m].setMap(null);
            }
            GOOGLEMARKERS = [];
        };
        
        Mypopup.clearMuseumMarkers = function(){
            for(var m = 0; m < GOOGLEMUSEUMMARKERS.length; m++){
                GOOGLEMUSEUMMARKERS[m].setMap(null);
            }
            GOOGLEMUSEUMMARKERS = [];
            $("#museums").css({"opacity":"0.5"});
        };
        
         Mypopup.clearHoodMarkers = function(){
            for(var m = 0; m < GOOGLEHOODSMARKER.length; m++){
                GOOGLEHOODSMARKER[m].setMap(null);
            }
            GOOGLEHOODSMARKER = [];
            $("#hoods").css({"opacity":"0.5"});
        };
        
    