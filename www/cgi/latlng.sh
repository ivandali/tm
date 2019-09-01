#!/bin/bash
# Quick and dirty geocoding with Google Maps API
MAPSAPIURL="http://maps.googleapis.com/maps/api/geocode/json"
while read line; do
    #echo "REC: [$line]"
    addrkey=`echo $line | cut -d";" -f4 | sed -e 's/ /+/g'`
    addr=`echo $line | cut -d";" -f4`
    siteCode=`echo $line | cut -d";" -f3`
    region=`echo $line | cut -d";" -f1`
    
    coord=`./geocode.sh "$addrkey"` #curl -G -s --data sensor=true --data-urlencode address=$address "$MAPSAPIURL" -o results.json
    lng=`echo $coord | cut -d' ' -f1 `
    lat=`echo $coord | cut -d' ' -f2 `
    #echo "ADDR:$addr"
    #echo "SITE:$siteCode"
    #echo "LAT:"$lat
    #echo "LNG:"$lng
    echo $siteCode";"$addr";"$lat";"$lng";"$region
    sleep 1
done < $1
