import { v4 as uuidv4 } from "uuid";

enum Workouts {
  RUNNING,
  WALKING,
  BIKING,
}

export class Workout {
  id: string = uuidv4();
  date: Date = new Date();
  type: Workouts;
  coords: number[];
  distance: number;
  duration: number;

  constructor(type: Workouts, coords: number[], distance: number, duration: number) {
    this.type = type;
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }

  addWorkout(event: Event) {
    event.preventDefault();
  }

  renderWorkout(workout: Workout) {}

  deleteWorkout(event: Event) {
    event.preventDefault();
  }
}
