import { LatLngExpression } from "leaflet";

class App {
  map!: L.Map;
  constructor() {
    this.getPosition();
  }

  getPosition() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.loadMap.bind(this), () =>
        alert("Could not get current position :(")
      );
    }
  }

  loadMap(position: GeolocationPosition) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    const coords: LatLngExpression = [latitude, longitude];

    this.map = L.map("map", {
      zoomControl: false,
    }).setView(coords, 13);

    L.control.zoom({ position: "topright" }).addTo(this.map);
    L.tileLayer("https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);
  }
}

const app = new App();
