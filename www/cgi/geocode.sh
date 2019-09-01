export address=${1}
API_KEY="AIzaSyAMzMI_Bz-xsY4N2la9w7_Yv4kNGXZuiuM"
info=`curl -s "https://maps.googleapis.com/maps/api/geocode/json?address="$address"&key=$API_KEY"` 
coord=`echo $info | jq -r '.results[0].geometry.bounds.northeast | "\(.lat) \(.lng)"' | head -2` 
coord=`echo $info | jq -r '.results[0].geometry.location | "\(.lat) \(.lng)"' | head -2` 
region=`echo $info | jq -r '.results[0].address_components[]| "\(.short_name) \(.types)"' | grep administrative_area_level_1 | cut -f 1 -d ' '`
# jq -r '.results[0].address_components[]| "\(.short_name)"' | head -2` 
echo $coord $region
echo $info
