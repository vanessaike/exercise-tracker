import { LatLngExpression, LeafletMouseEvent } from "leaflet";
import { Workout } from "./types/classes/Workout.js";
import { renderWorkout } from "./components/workout.js";
import { renderPopupContent } from "./components/popup.js";

const modal = document.querySelector(".modal")! as HTMLElement;
const overlay = document.querySelector(".overlay")! as HTMLElement;
const containerWorkouts = document.querySelector(".workouts")! as HTMLUListElement;
const workoutForm = document.querySelector(".form")! as HTMLFormElement;
const inputWorkoutType = document.querySelector(".form__input--type")! as HTMLSelectElement;
const inputWorkoutDuration = document.querySelector(".form__input--duration")! as HTMLInputElement;
const inputWorkoutDistance = document.querySelector(".form__input--distance")! as HTMLInputElement;
const btnDeleteAllWorkouts = document.querySelector(".btn--reset");

class App {
  map!: L.Map;
  mapEvent!: LeafletMouseEvent;
  mapMarkers: L.Marker[] = [];
  workouts: Workout[] = [];

  constructor() {
    this.getPosition();
    overlay.addEventListener("click", this.closeModal.bind(this));
    workoutForm.addEventListener("submit", this.newWorkout.bind(this));
    containerWorkouts.addEventListener("click", this.moveToMarker.bind(this));
    containerWorkouts.addEventListener("click", this.deleteWorkout.bind(this));
    btnDeleteAllWorkouts?.addEventListener("click", this.deleteAllWorkouts.bind(this));
    setTimeout(() => this.getLocalStorage(), 2000);
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

    // show modal when map is clicked
    this.map.on("click", this.openModal.bind(this));
  }

  newWorkout(event: Event) {
    event.preventDefault();

    // input validation
    const validInputs = (...inputs: number[]) => inputs.every((input) => Number.isFinite(input));
    const allPositive = (...inputs: number[]) => inputs.every((input) => input > 0);
    // form's data
    const workoutType = inputWorkoutType.value;
    const workoutDistance = +inputWorkoutDistance.value;
    const workoutDuration = +inputWorkoutDuration.value;
    const { lat, lng } = this.mapEvent.latlng;

    if (!validInputs(workoutDistance, workoutDuration) || !allPositive(workoutDistance, workoutDuration))
      return alert("Invalid inputs. Please, try again.");

    const workout = new Workout(workoutType, [lat, lng], workoutDistance, workoutDuration);
    this.workouts.push(workout);
    this.renderMarker(workout);
    this.renderWorkout(workout);
    this.closeModal();
    // clear input fields
    inputWorkoutDistance.value = inputWorkoutDuration.value = "";
    this.setLocalStorage();
  }

  renderMarker(workout: Workout) {
    const type = workout.type.toLowerCase();
    const coords = workout.coords as LatLngExpression;
    const marker = L.marker(coords)
      .addTo(this.map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: "popup",
        })
      )
      .setPopupContent(renderPopupContent(type) + type.charAt(0).toUpperCase() + type.slice(1))
      .openPopup();

    this.mapMarkers.push(marker);
  }

  renderWorkout(workout: Workout) {
    const type = workout.type.toLowerCase();
    const html = renderWorkout(type, workout);

    containerWorkouts.insertAdjacentHTML("afterbegin", html);
  }

  deleteWorkout(event: Event) {
    if (event.target instanceof HTMLElement) {
      const workoutEl = event.target.closest(".workout");
      if (!workoutEl) return;

      if (event.target.classList.contains("btn--delete-workout")) {
        const workoutIndex = this.workouts.findIndex((workout) => workout.id === (workoutEl as HTMLElement).dataset.id);
        // delete marker
        this.map.removeLayer(this.mapMarkers[workoutIndex]);
        this.mapMarkers.splice(workoutIndex, 1);
        // delete the element from the UI
        this.workouts.splice(workoutIndex, 1);
        workoutEl.remove();
        this.setLocalStorage();
      }
    }
  }

  deleteAllWorkouts() {
    this.workouts.splice(0, this.workouts.length);
    containerWorkouts.innerHTML = "";
    this.mapMarkers.forEach((marker) => this.map.removeLayer(marker));
    // delete from local storage
    localStorage.clear();
  }

  moveToMarker(event: Event) {
    if (event.target instanceof HTMLElement) {
      const workoutEl = event.target.closest(".workout");
      if (!workoutEl) return;

      // find the workout that matches the one we clicked
      const workout = this.workouts.find((workout) => workout.id === (workoutEl as HTMLElement).dataset.id);
      // take the coordinates from the element and move to the position
      this.map.setView(workout?.coords as LatLngExpression, 13, { animate: true });
    }
  }

  setLocalStorage() {
    localStorage.setItem("workouts", JSON.stringify(this.workouts));
  }

  getLocalStorage() {
    const workoutsData = JSON.parse(localStorage.getItem("workouts") as string);
    if (!workoutsData) return;
    this.workouts = workoutsData;
    this.workouts.forEach((workout) => {
      this.renderWorkout(workout);
      if (this.map) {
        this.renderMarker(workout);
      }
    });
  }

  openModal(mapEvent: LeafletMouseEvent) {
    this.mapEvent = mapEvent;
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
  }

  closeModal() {
    if (!modal.classList.contains("hidden")) {
      modal.classList.add("hidden");
      overlay.classList.add("hidden");
    }
  }
}

const app = new App();
