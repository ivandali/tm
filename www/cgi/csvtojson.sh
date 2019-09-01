#!/bin/bash

if [ ! -e ../data/$2.json ]
then
echo "Creating Stores Json file"
items=( )
while IFS=';' read -r siteCode companyCode Addr ZipCode Merd; do
	echo "$Addr;$ZipCode;$companyCode;$siteCode"
    Address=`echo ${Addr} | cut -d'(' -f1`
    AddrKey=`echo ${Address}";"${ZipCode} |  sed -e 's/ /+/g'`
    echo $AddrKey
    coord=`./geocode.sh "$AddrKey"` #curl -G -s --data sensor=true --data-urlencode address=$address "$MAPSAPIURL" -o results.json
    echo $coord
    lng=`echo $coord | cut -d' ' -f1 `
    lat=`echo $coord | cut -d' ' -f2 `
    region=`echo $coord | cut -d' ' -f3`
    region=`expr substr "$Merd" 1 2`
	echo "${Address};$ZipCode;$companyCode;$lat;$lng;$region"
    printf -v item ' 
    {
      "geometry": {
        "type": "Point",
        "coordinates": [
          %s,
          %s
        ]
      },
      "type": "Feature",
      "properties": {
        "category": "%s",
        "companycode": "%s",
        "address": "%s,%s",
	    "storecode": "%s",
        "region": "%s"
      }
    }' "$lat" "$lng" "$3" "$companyCode" "${Address}" "$ZipCode" "$siteCode" "${region}"
	  items+=( "$item" )

done <$1
IFS=','
printf '{\n"type": "FeatureCollection",\n "features": [\n%s\n]\n}' "${items[*]}">> ../data/$2.json
else
cp ../data/$2.json ../data/$2.json.old
rm -f ../data/$2.json.tmp
while IFS=';' read -r siteCode companyCode Addr ZipCode Merd; do
check=`cat ../data/$2.json.old | jq -r '.features[].properties.storecode' | grep $siteCode`
if [ ! "$check" != "" ]
then
    Address=`echo ${Addr} | cut -d'(' -f1`
    AddrKey=`echo ${Address}";"${ZipCode} |  sed -e 's/ /+/g'`
    echo $AddrKey
    coord=`./geocode.sh "$AddrKey"` #curl -G -s --data sensor=true --data-urlencode address=$address "$MAPSAPIURL" -o results.json
    echo "COORD:"$coord
    lng=`echo $coord | cut -d' ' -f1 `
    lat=`echo $coord | cut -d' ' -f2 `
    region=`echo $coord | cut -d' ' -f3`
    region=`expr substr "$Merd" 1 2`
    if [ "$lng" = "null" ]
    then
        lat=$prevLat
        lng=$prevLng
    else
        prevLng=$lng
        prevLat=$lat
    fi
    echo "adding [$companyCode $siteCode $Address $ZipCode $lat $lng $3 $region]"
    lastelem=`cat ../data/$2.json | jq -r '.features[].properties.storecode' | wc -l`
    cat ../data/$2.json | jq --arg n $lastelem --arg companycode $companyCode --arg sitecode $siteCode --arg ad "$Address" --arg Zip "$ZipCode" --arg Lat $lat --arg lng $lng --arg ct $3 --arg rg $region -r '.features[$n|tonumber] +=
    {
      "geometry": {
        "type": "Point",
        "coordinates": [
          $Lat|tonumber,
          $lng|tonumber
        ]
      },
      "type": "Feature",
      "properties": {
        "category": $ct,
        "companycode": $companycode,
        "address": $ad,$Zip,
        "storecode": $sitecode,  
        "region": $rg
      }
    }'>../data/$2.json.tmp

    mv ../data/$2.json.tmp ../data/$2.json
fi
done <$1
fi
if [  -e ../data/$2.json ]
then
    dataAgg=`date +%d-%m-%Y`
    Tot=`cat ../data/$2.json | jq -r '.features[].properties.category' | grep "$3" | wc -l`
    if [ "$region" != "DS" -a "$region" != "DI"]
    then
    NI=`cat ../data/$2.json | jq -r '.features[].properties.region' | grep No | wc -l`
    WA=`cat ../data/$2.json | jq -r '.features[].properties.region' | grep Wa | wc -l`
    EN=`cat ../data/$2.json | jq -r '.features[].properties.region' | grep En | wc -l`
    echo "Number of elements: $Tot"
    echo "- NI : $NI"
    echo "- WA : $WA"
    echo "- EN : $EN"
    echo "$dataAgg;$Tot;$NI;$WA;$EN" > ../data/$2.counter.csv
    else
    echo "$dataAgg;$Tot" > ../data/$2.counter.csv
    echo "Number of elements: $Tot"
    fi
    gsutil rm gs://tranquil-matter-123610.appspot.com/json/$2.json
    gsutil rm gs://tranquil-matter-123610.appspot.com/json/$2.counter.csv
    gsutil cp ../data/$2.json gs://tranquil-matter-123610.appspot.com/json
    gsutil cp ../data/$2.counter.csv gs://tranquil-matter-123610.appspot.com/json
    gsutil -m acl ch -u AllUsers:R gs://tranquil-matter-123610.appspot.com/json/*
else
    echo "../data/$2.json not created"
fi
