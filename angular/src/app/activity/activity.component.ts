import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subscription, interval } from 'rxjs';

import { Activity, Duration } from '@app/models';
import { ApiService } from '@app/api.service';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class ActivityComponent implements OnInit {
  history: Activity[] = [];
  tracked: Activity = null;
  clockSubscription: Subscription = null;
  activity = new FormControl(null, [
    Validators.required,
    Validators.minLength(8),
    Validators.maxLength(128),
  ]);

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.api.getActivities().subscribe(x => this.history = x);
  }

  track(event: KeyboardEvent) {
    if (this.activity.invalid || this.tracked ||
        event.keyCode !== 13) return;
    this.tracked = {
      id: null,
      tags: [],
      name: this.activity.value,
      start: new Date(),
      duration: new Duration(),
      end: null,
    };
    this.activity.reset();
    this.history.unshift(this.tracked);
    this.clockSubscription = interval(1000).subscribe(() => {
      this.tracked.duration = new Duration(this.tracked.start);
    });
    this.api.postActivities(this.tracked).subscribe();
  }

  stop() {
    if (this.tracked === null) {
      throw Error('Cannot stop tracking: no tracked activity');
    }
    this.clockSubscription.unsubscribe();
    this.clockSubscription = null;
    this.tracked.end = new Date();
    this.api.patchActivities(this.tracked).subscribe(
      x => this.history[0] = x,
    );
    this.tracked = null;
  }

  delete(i: number) {
    if (i === 0 && this.tracked !== null) {
      this.clockSubscription.unsubscribe();
      this.clockSubscription = null;
      this.tracked = null;
    }
    if (this.history[i].id !== null) {
      this.api.deleteActivity(this.history[i].id).subscribe();
    }
    this.history = this.history.slice(0, i)
                   .concat(this.history.splice(i + 1));
  }

}
