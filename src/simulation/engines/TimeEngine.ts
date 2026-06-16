import { GameState } from '../core/SimulationEngine';

export interface TimeState {
  currentDay: number;
  hourOfDay: number;
  minuteOfHour: number;
  gameSpeed: number;
  timeMultiplier: number;
  pressureAccumulator: number;
  deadlineHoursRemaining: number;
}

export interface TimeEffect {
  daysElapsed?: number;
  hoursElapsed?: number;
  minutesElapsed?: number;
  multiplierChange?: number;
  pressureIncrease?: number;
}

export class TimeEngine {
  private state: TimeState;

  constructor(initialDeadline: number = 72) {
    this.state = {
      currentDay: 1,
      hourOfDay: 0,
      minuteOfHour: 0,
      gameSpeed: 1,
      timeMultiplier: 1,
      pressureAccumulator: 0,
      deadlineHoursRemaining: initialDeadline
    };
  }

  tick(timeStep: number = 1): TimeEffect {
    // Apply time multiplier for faster progression when needed
    const effectiveTimeStep = timeStep * this.state.timeMultiplier;
    
    // Convert time step to hours, minutes, and update day if needed
    let totalMinutes = this.state.hourOfDay * 60 + this.state.minuteOfHour + (effectiveTimeStep * 60);
    
    const newHour = Math.floor((totalMinutes / 60) % 24);
    const newMinute = Math.floor(totalMinutes % 60);
    const fullDays = Math.floor(totalMinutes / (24 * 60));
    
    // Update state
    this.state.currentDay += fullDays;
    this.state.hourOfDay = newHour;
    this.state.minuteOfHour = newMinute;
    
    // Decrement deadline counter
    this.state.deadlineHoursRemaining = Math.max(0, this.state.deadlineHoursRemaining - effectiveTimeStep);
    
    // Calculate time pressure - increases exponentially as deadline approaches
    const deadlineRatio = this.state.deadlineHoursRemaining / 72; // Assume 72 hour default
    const pressureIncrease = this.calculatePressureFromTimeFactor(deadlineRatio);
    this.state.pressureAccumulator += pressureIncrease;
    
    return {
      hoursElapsed: timeStep,
      multiplierChange: this.state.timeMultiplier,
      pressureIncrease
    };
  }

  private calculatePressureFromTimeFactor(deadlineRatio: number): number {
    // Pressure increases dramatically as deadline approaches
    if (deadlineRatio <= 0.1) return 5.0; // Very high pressure in last 10%
    if (deadlineRatio <= 0.25) return 3.0; // High pressure in last 25%
    if (deadlineRatio <= 0.5) return 1.5; // Medium pressure in last 50%
    return 0.5; // Low pressure early on
  }

  adjustSpeed(multiplier: number): void {
    this.state.timeMultiplier = Math.max(0.1, Math.min(5, multiplier));
  }

  setTimeOfDay(hour: number, minute: number): void {
    this.state.hourOfDay = Math.max(0, Math.min(23, hour));
    this.state.minuteOfHour = Math.max(0, Math.min(59, minute));
  }

  getFormattedTime(): string {
    const period = this.state.hourOfDay >= 12 ? 'PM' : 'AM';
    const displayHour = this.state.hourOfDay % 12 || 12;
    return `${displayHour}:${this.state.minuteOfHour.toString().padStart(2, '0')} ${period}`;
  }

  getTimeState(): TimeState {
    return { ...this.state };
  }

  setDeadline(hoursRemaining: number): void {
    this.state.deadlineHoursRemaining = hoursRemaining;
  }

  getTimePressure(): number {
    return this.state.pressureAccumulator;
  }
}