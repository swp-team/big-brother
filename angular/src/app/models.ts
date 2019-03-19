export interface Tag {
  id: number;
  name: string;
}

export interface RawActivity {
  id: number;
  name: string;
  tags: number[];
  start: string;
  end: string;
}

export interface Activity {
  id: number;
  name: string;
  tags: number[];
  start: Date;
  end: Date;
  duration: Duration;
}

export class Duration {
  readonly minutes: string;
  readonly seconds: string;

  constructor();
  constructor(time: number);
  constructor(date: Date);
  constructor(start: Date, end: Date);
  constructor(timeOrDate: number | Date = 0, end: Date = null) {
    let time: number;
    if (timeOrDate instanceof Date) {
      if (end === null) time = Duration.timeFrom(timeOrDate);
      else time = Duration.timeBetween(timeOrDate, end);
    } else {
      time = timeOrDate;
    }
    this.minutes = Duration.toMinutes(time);
    this.seconds = Duration.toSeconds(time);
  }

  toString(): string {
    return `${this.minutes}:${this.seconds}`;
  }

  static toMinutes(time: number): string {
    let minutes = Math.floor(time / 60000);
    if (minutes < 10) return '0' + minutes;
    else              return minutes.toString();
  }

  static toSeconds(time: number): string {
    let seconds = Math.floor(time / 1000) % 60;
    if (seconds < 10) return '0' + seconds;
    else              return seconds.toString();
  }

  static timeFrom(date: Date): number {
    return Date.now() - date.getTime();
  }

  static timeBetween(a: Date, b: Date): number {
    return a.getTime() - b.getTime();
  }

}
