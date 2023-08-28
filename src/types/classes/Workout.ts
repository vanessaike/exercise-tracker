export class Workout {
  id: string = (Date.now() + "").slice(-10);
  date: Date = new Date();
  type: string;
  coords: number[];
  distance: number;
  duration: number;

  constructor(type: string, coords: number[], distance: number, duration: number) {
    this.type = type;
    this.coords = coords;
    this.distance = distance;
    this.duration = duration;
  }
}
