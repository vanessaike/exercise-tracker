import { Workout } from "../types/classes/Workout";

export function renderWorkout(type: string, workout: Workout) {
  return `
      <li class="workout workout--${type}" data-id="${workout.id}">
        <div class="workout__header">
          <div class="workout__title" aria-label="${type}">
            <i class="fas fa-${type}" aria-hidden="true"></i> ${workout.type}
          </div>
          <button class="btn btn--delete-workout" aria-label="Delete workout">
            <i class="far fa-times-circle" aria-hidden="true"></i>
          </button>
        </div>
        <div class="workout__row">
          <div class="workout__details">
            <span class="workout__icon"><i class="fas fa-calendar-alt" aria-hidden="true"></i></span>
            <span class="workout__value">08/22/2023</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon"><i class="fas fa-stopwatch" aria-hidden="true"></i></span>
            <span class="workout__value">${workout.duration}</span>
            <span class="workout__unit">min</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon"><i class="fas fa-bolt" aria-hidden="true"></i></span>
            <span class="workout__value">${workout.distance}</span>
            <span class="workout__unit">km</span>
          </div>
        </div>
      </li>
    `;
}
