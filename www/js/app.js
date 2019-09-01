/*
 * Copyright 2017 Google Inc. All rights reserved.
 *
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this
 * file except in compliance with the License. You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF
 * ANY KIND, either express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

// Style credit: https://snazzymaps.com/style/1/pale-dawn
const mapStyle = [
  {
    "featureType": "administrative",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "lightness": 20
      }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [
      {
        "color": "#d3d1cf"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c5dac6"
      }
    ]
  },
  {
    "featureType": "poi.park",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "lightness": 20
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "all",
    "stylers": [
      {
        "lightness": 20
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#c5c6c6"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#e4d7c6"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#fbfaf7"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "color": "#607e96"
      }
    ]
  }
];
var storeFileName='data/PMS.json';
$(window).on('load',function () {
    var previous = null;
    var current = null;
    setInterval(function() {
        $.getJSON(storeFileName, function(json) {
            current = JSON.stringify(json);  
            if (previous && current && previous !== current) {
                console.log('refresh');
                location.reload();
            }
            previous = current;
        });                       
    }, 2000);   
});
// Escapes HTML characters in a template literal string, to prevent XSS.
// See https://www.owasp.org/index.php/XSS_%28Cross_Site_Scripting%29_Prevention_Cheat_Sheet#RULE_.231_-_HTML_Escape_Before_Inserting_Untrusted_Data_into_HTML_Element_Content
function sanitizeHTML(strings) {
  const entities = {'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'};
  let result = strings[0];
  for (let i = 1; i < arguments.length; i++) {
      //replace(/[?&]+([^=&]+)=([^&]*)/gi
    result += String(arguments[i]).replace(/[&<>'"]/g, (char) => {
       // alert (result);
      return entities[char];
   });
    result += strings[i];
  }
  return result;
}
function initMap() {

  // Create the map.
  const map = new google.maps.Map(document.getElementsByClassName('map')[0], {
    zoom: 6.6,
    center: {lat: 54.1500000, lng: -4.4833300},
  styles: mapStyle
  });
  // Load the stores GeoJSON onto the map.
/*  if ( sessionStorage.getItem("SessionName") === 'PMS'){
    storeFileName="https://drive.google.com/file/d/1XTVFOcq4z4_SEEKKaswcte08ZICESP8Y/view?usp=sharing"
  } else{
    storeFileName="https://drive.google.com/file/d/1AxUJO9ghN0Fa4QOAdVxpXTvvioQ6FzGy/view?usp=sharing"
  //storeFileName="https://tranquil-matter-123610.appspot.com/json/"+sessionStorage.getItem("SessionName")+".json"
  }
  */
  storeFileName="https://storage.googleapis.com/tranquil-matter-123610.appspot.com/json/"+sessionStorage.getItem("SessionName")+".json"
  //storeFileName="data/"+sessionStorage.getItem("SessionName")+".json"
  
  map.data.loadGeoJson(storeFileName);
  
  map.data.setStyle(feature => {
        //alert(feature.getProperty('category'));
        var content;
        var position;
        var dim, img, tit;
        
        if ( feature.getProperty('category') === 'Pharmacy'){
            if ( feature.getProperty('region') === 'No' ){
                img=`img/green-dot.png`
            }
            
            if ( feature.getProperty('region') === 'En' ){
                img=`img/red-dot.png`
            }
            if ( feature.getProperty('region') === 'Wa' ){
                img=`img/blue-dot.png`
            }

           dim=32;  tit='STORE'; 
          // alert(img);
        }

        if ( feature.getProperty('category') === 'DSP'){
            dim=32;  tit='STORE';
        
            if ( feature.getProperty('region') === 'DI'){
                dim=64; img='img/red-dot.png';
            }else{
                img='img/blue-dot.png';
            }

            //Preston Address: Dodd Way, Walton Summit, Preston, PR5 8AE  
        }
        
        if ( feature.getProperty('category') === 'SERVICE CENTRE'){
            dim=128; img='img/icon_Pharmacy.png'; tit='SERVICE CENTRE';   
            const infoWindow = new google.maps.InfoWindow();
            const addr = feature.getProperty('address');
            
            infoWindow.setOptions({pixelOffset: new google.maps.Size(0, -30)});
            position = feature.getGeometry().get();
            content = sanitizeHTML`
            <div style="margin-bottom:20px">
            <h5>PRESTON - SERVICE CENTRE</h5>
            <img style="float:left; width:100px; margin-top:0px" src="img/logo_Pharmacy.png">
            </div>`;
            //Preston Address: Dodd Way, Walton Summit, Preston, PR5 8AE  
            infoWindow.setContent(content);
            infoWindow.setPosition(position);
            infoWindow.open(map);
        }
        return {
            icon: {
            url: img,
         //url: `img/icon_Pharmacy.png`,
            //url: `https://maps.google.com/mapfiles/ms/icons/blue-dot.png`,
            scaledSize: new google.maps.Size(dim, dim),
            title: tit
      }
    };
  });

    

  const infoWindow = new google.maps.InfoWindow();
  infoWindow.setOptions({pixelOffset: new google.maps.Size(0, -30)});

  // Show the information for a store when its marker is clicked.
  map.data.addListener('click', event => {
if ( event.feature.getProperty('category') === 'SERVICE CENTRE'){
    const address = event.feature.getProperty('address');
    position = event.feature.getGeometry().get();
    content = sanitizeHTML`
      <div style=margin-bottom:20px;">
        <h2>SERVICE CENTRE</h2>
        <p>${address}</p>
        <img style="float:left; width:100px; margin-top:0px" src="img/logo_Pharmacy.png">
      </div>`;

}else{
    const category = event.feature.getProperty('category');
    const storecode = event.feature.getProperty('storecode');
    const address = event.feature.getProperty('address');
    const companycode = event.feature.getProperty('companycode');
    position = event.feature.getGeometry().get();

    content = sanitizeHTML`
      <div style=margin-bottom:20px;">
        <h2>STORE: ${storecode}</h2>
        <p>${address}</p>
        <img style="float:left; width:100px; margin-top:0px" src="img/logo_Pharmacy.png">
      </div>`;
}
    infoWindow.setContent(content);
    infoWindow.setPosition(position);
    infoWindow.open(map);
  });

  
}
function setMarkers(map) {
        // Adds markers to the map.

        // Marker sizes are expressed as a Size of X,Y where the origin of the image
        // (0,0) is located in the top left of the image.

        // Origins, anchor positions and coordinates of the marker increase in the X
        // direction to the right and in the Y direction down.
        var image = {
          url: 'https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png',
          // This marker is 20 pixels wide by 32 pixels high.
          size: new google.maps.Size(20, 32),
          // The origin for this image is (0, 0).
          origin: new google.maps.Point(0, 0),
          // The anchor for this image is the base of the flagpole at (0, 32).
          anchor: new google.maps.Point(0, 32)
        };
        // Shapes define the clickable region of the icon. The type defines an HTML
        // <area> element 'poly' which traces out a polygon as a series of X,Y points.
        // The final coordinate closes the poly by connecting to the first coordinate.
        var shape = {
          coords: [1, 1, 1, 20, 18, 20, 18, 1],
          type: 'poly'
        };

        $.getJSON(storeFileName, function(data){
            $.each(data, function(i){
            var category =  data[i]["Street"] + ", Nottingham, UK";

            if( i == 10 ){ return false; }

           
                var emoji = 'poop.png';
                var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location,
                    animation: google.maps.Animation.DROP,
                    icon: emoji
                    });

            });
        });

        for (var i = 0; i < beaches.length; i++) {
          var beach = beaches[i];
          var marker = new google.maps.Marker({
            position: {lat: beach[1], lng: beach[2]},
            map: map,
            icon: image,
            title: beach[0],
            zIndex: beach[3]
          });
        }
      }
// Submit form with id function
function myfunction() {
    var name = document.getElementById("name").value;
    var email = document.getElementById("email").value;
    var contact = document.getElementById("contact").value;
if (validation()) // Calling validation function
{
    document.getElementById("form_id").action = "success.php"; // Setting form action to "success.php" page
    document.getElementById("form_id").submit(); // Submitting form
}
}
function storeCounters(storeType){
 var data;
	$.ajax({
	  type: "GET",  
 	  url: "https://storage.googleapis.com/tranquil-matter-123610.appspot.com/json/"+sessionStorage.getItem("SessionName")+".counter.csv",
  	  //url: "data/"+sessionStorage.getItem("SessionName")+".counter.csv",
	  dataType: "text",       
	  success: function(response)  
	  {
		data = $.csv.toArrays(response);
        if(typeof(data[0]) === 'undefined') {
            return null;
        } else {
		    $.each(data, function(index, row ) {
		    rec=row[0].split(";");
            var element;
            //alert(sessionStorage.getItem("SessionName"));
            if ( sessionStorage.getItem("SessionName") === 'PMS')
            {
                element = document.getElementById("RolloutDatePMS");
                element.innerHTML = rec[0];
                //element.innerHTML = "<h2> Columbus Pharmacy Management System - Last Rollout Date: "+rec[0]+"</h2>";
            
            //storeFileName='https://tranquil-matter-123610.appspot.com/data/PMS.json';
            element = document.getElementById("PH");
            element.innerHTML = "<strong>Total Stores: "+rec[1]+"</strong>";
            if ( rec[5] === 'ON')
            {
                switchOnFW();
            }
	        else
            {
                switchOffFW();
            }
            element = document.getElementById("NI");
            element.innerHTML = "NI     : "+rec[2];
            element = document.getElementById("WL");
            element.innerHTML = "Wales  : "+rec[3];
            element = document.getElementById("EN");
            element.innerHTML = "England: "+rec[4];
            element = document.getElementById("SC");
            if ( typeof(rec[5]) === 'undefined')
            {
                element.innerHTML = "Scotland: 0";    //bind header
            }else{
                element.innerHTML = "Scotland: "+rec[5];    //bind header
                }
            }
            else
            {
                element = document.getElementById("RolloutDateDSP");
                element.innerHTML = rec[0];
                element = document.getElementById("DSP");
                element.innerHTML = "<strong>Total Served Stores: "+rec[1]+"</strong>";
                element = document.getElementById("DI");
                element.innerHTML = "Columbus Served Stores: "+rec[2];
                element = document.getElementById("DS");
                element.innerHTML = "Nexphase Served Stores: "+rec[3];
            }
	        });
        }
      }
    });
        

}
function switchOffFW(){
    document.getElementById("fireworks").style.display = "none";

}
function switchOnFW(){
    var x = document.createElement("IMG");
    x.setAttribute("src", "img/fw.gif");
                x.setAttribute("width", "1900");
                x.setAttribute("height", "1200");
                x.setAttribute("border", "0");
                x.setAttribute("style", "float:left; margin-right:0px;");

    document.getElementById("fireworks").appendChild(x);
    document.getElementById("fireworks").style.display = "block";

}

function LoadFile(map){
 var data;
	$.ajax({
	  type: "GET",  
	  url: "esp.csv",
	  dataType: "text",       
	  success: function(response)  
	  {
		data = $.csv.toArrays(response);
		readData(data,map);
	  }   
	});
}
 function readData(data,map) {
     
     //COMPANY_CODE;SITE_CODE;PRINTER_LABEL_ADDRESS;POSTAL_CODE;LIVE
      var CompanyCode;
      var SiteCode;
      var address;
      var ZIPCode;
      var Live;
      var rec;
      var stores;
   
     console.log("Geocoder");
var geocoder = new google.maps.Geocoder();
  //    document.write('<table border="1">');
      if(typeof(data[0]) === 'undefined') {
        return null;
      } else {
		$.each(data, function( index, row ) {
		  //bind header
		  if(index > 0) {
                document.write('<tr>');
              
                rec=row[0].split(";");
                CompanyCode=rec[0];
                SiteCode=rec[1];
                address=rec[2].split("(",1);
                ZIPCode=rec[3];
                Live=rec[4];
                if ( Live === 'Y')
                {
                    
                    
                console.log("Geocode For CompanyCode:"+CompanyCode+ " Address:"+ address+ " ZIP:" +ZIPCode);

                sleep(2000);
                geocoder.geocode({'address': address+","+ZIPCode}, function(results, status) {
                if (status === 'OK') {
/*
                    document.write('<td>' + CompanyCode + '</td>');
                    document.write('<td>' + SiteCode + '</td>');
                    document.write('<td>' + address + '</td>');
                    document.write('<td>' + ZIPCode + '</td>');
                    document.write('<td>' + results[0].geometry.location.lat() + '</td>');
                    document.write('<td>' + results[0].geometry.location.lng() + '</td>');
  */
                    var marker = new google.maps.Marker({
                    map: map,
                    position: results[0].geometry.location
                    });
                    
                    //writeJsonFile(address,CompanyCode,SiteCode,ZIPCode,Live,results[0].geometry.location);
                    
                } else {
                    alert('Geocode was not successful for the following reason: ' + status);
                }
                console.log ("Status:"+status);
                
		        });
                }
   //document.write('</tr>');
	  }
    });
      }
//document.write('</table>');
    }
function sleep(millis)
{
    var date = new Date();
    var curDate = null;
    do { curDate = new Date(); }
    while(curDate-date < millis);
}
function writeJsonFile(address,CompanyCode,SiteCode,ZIPCode,Live,location){
    var geojson = {};
    geojson['type'] = 'FeatureCollection';
    geojson['features'] = [];

    var url = "objects.json";
                
            
    //console.log("LAT: "+location.lat()+" LNG: "+location.lng());
                    var newFeature = {
                                        "type": "Feature",
                                        "geometry": {
                                            "type": "Point",
                                            "coordinates":[10,10]
                                            //"coordinates":[ parseFloat(location.lat()), parseFloat(location.lng())]
                                        },
                                        "properties": {
                                        "address": address,
                                        "companycode": CompanyCode,
                                        "Site": SiteCode,
                                        "ZIP":ZIPCode
                                        }
                                    }
                    geojson['features'].push(newFeature);
                var dataString=JSON.stringify(geojson);

    $.ajax({
    type: "POST",
    timeout: 50000,
    url: url,
    data: dataString,
    success: function (data) {
        alert('success');
        return false;
    }
    
});
    console.log("write");

}
function LoadXLS(){
    var oFileIn;

    $(function() {
        oFileIn = document.getElementById('my_file_input');
        if(oFileIn.addEventListener) {
            oFileIn.addEventListener('change', filePicked, false);
        }
    });
}


function filePicked(oEvent) {
    // Get The File From The Input
    var oFile = oEvent.target.files[0];
    var sFilename = oFile.name;
    // Create A File Reader HTML5
    var reader = new FileReader();

    // Ready The Event For When A File Gets Selected
    reader.onload = function(e) {
        var data = e.target.result;
        var cfb = XLS.CFB.read(data, {type: 'binary'});
        var wb = XLS.parse_xlscfb(cfb);
        // Loop Over Each Sheet
        wb.SheetNames.forEach(function(sheetName) {
            // Obtain The Current Row As CSV
            var sCSV = XLS.utils.make_csv(wb.Sheets[sheetName]);   
            var oJS = XLS.utils.sheet_to_row_object_array(wb.Sheets[sheetName]);   

            $("#my_file_output").html(sCSV);
            console.log(oJS)
        });
    };

    // Tell JS To Start Reading The File.. You could delay this if desired
    reader.readAsBinaryString(oFile);
}
