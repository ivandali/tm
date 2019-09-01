#!/bin/bash

#jq '.data.messages += [{"date": "2010-01-07T19:55:99.999Z", "xml": "xml_samplesheet_2017_01_07_run_09.xml", "status": "OKKK", "message": "metadata loaded into iRODS successfullyyyyy"}]'
#jq --arg v "$PRJNAME" '.dev.projects."$v"' config.json
lastelem=`cat ../data/stores.json | jq -r '.features[].properties.storecode' | wc -l`
lastelem=102
cat ../data/stores.json | jq --arg v $lastelem -r '.features[$v|tonumber] +=
    {
      "geometry": {
        "type": "Point",
        "coordinates": [
          $1,
          $2
        ]
      },
      "type": "Feature",
      "properties": {
        "category": "$3",
        "companycode": "$4",
        "address": "$5,$6",
        "storecode": "$7"
      }
    }'
