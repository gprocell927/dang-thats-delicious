import axios from 'axios';
import { $ } from './bling';

const mapOptions = {
  center: {lat: null, lng: null},
  zoom: 2
}

function loadPlaces(map, lat, lng) {
  axios.get(`/api/v1/stores/near?lat=${lat}&lng=${lng}`)
    .then(res => {
      const places = res.data;
      if(!places.length) {
        alert('No places found!');
        return;
      }

      const markers = places.map(place => {
        const [placeLng, placeLat] = place.location.coordinates;
      });
    });
}

function getCoords(lat, lng, mapDiv){
    mapOptions.center.lat = lat;
    mapOptions.center.lng = lng;
    finishMap(mapDiv)
}

function finishMap (mapDiv){
  const map = new google.maps.Map(mapDiv, mapOptions);
  loadPlaces(map, mapOptions.center.lat, mapOptions.center.lng);
  const input = $('[name="geolocate"]');
  const autocomplete = new google.maps.places.Autocomplete(input);
}

function makeMap(mapDiv) {
  if(!mapDiv){
    return;
  } else if (!mapOptions.center.lat && !mapOptions.center.lng) {
    navigator.geolocation.getCurrentPosition((pos) => getCoords(pos.coords.latitude, pos.coords.longitude, mapDiv));
  } else {
   finishMap(mapDiv);
 }

  // make out map




}

export default makeMap;
