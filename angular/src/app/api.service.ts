import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { Tag, RawActivity, Activity, Duration } from './models';

export interface AuthTokens {
  access: string;
  refresh: string;
}

@Injectable()
export class ApiService {
  tokens: AuthTokens = { access: null, refresh: null };

  constructor(private http: HttpClient) { }

  postAuthenticate(email: string,
                   password: string): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(
      '/api/tokens/auth/',
      { email: email, password: password },
    ).pipe(tap(x => this.tokens = x));
  }

  postRefreshTokens(): Observable<AuthTokens> {
    return this.http.post<AuthTokens>(
      '/api/tokens/refresh/',
      { refresh: this.tokens.refresh },
    ).pipe(tap(x => this.tokens = x));
  }

  postVerifyTokens(token: string): Observable<any> {
    return this.http.post<any>('/api/tokens/verify/', { token: token });
  }

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>('/api/tags/');
  }

  getTag(id: number): Observable<Tag> {
    return this.http.get<Tag>(`/api/tags/${id}/`);
  }

  postTags(name: string): Observable<Tag> {
    return this.http.post<Tag>('/api/tags/', { name: name });
  }

  deleteTag(id: number): Observable<Tag> {
    return this.http.delete<Tag>(`/api/tags/${id}`);
  }

  getActivities(): Observable<Activity[]> {
    return this.http.get<RawActivity[]>('/api/activities/').pipe(
      map(x => x.map(a => this._deserialize(a))),
    );
  }

  getActivity(id: number): Observable<Activity> {
    return this.http.get<RawActivity>(`/api/activities/${id}/`).pipe(
      map(x => this._deserialize(x)),
    );
  }

  postActivities(a: Activity): Observable<Activity> {
    return this.http.post<RawActivity>(
      '/api/activities/',
      this._serialize(a),
    ).pipe(map(x => this._deserialize(x)));
  }

  patchActivities(a: Activity): Observable<Activity> {
    return this.http.patch<RawActivity>(
      `/api/activities/${a.id}/`,
      this._serialize(a),
    ).pipe(map(x => this._deserialize(x)));
  }

  deleteActivity(id: number): Observable<any> {
    return this.http.delete<any>(`/api/activities/${id}/`);
  }

  private _deserialize(a: RawActivity): Activity {
    let b: any = {};
    b.id = a.id;
    b.name = a.name;
    b.tags = a.tags;
    b.start = new Date(a.start);
    if (a.end !== null) {
      b.end = new Date(a.end);
      b.duration = new Duration(b.start, b.end);
    }
    return b;
  }

  private _serialize(a: Activity): RawActivity {
    let b: any = {};
    if (a.id !== null) b.id = a.id;
    b.name = a.name;
    b.tags = a.tags;
    b.start = formatDate(a.start, 'yyyy-MM-ddTHH:mm:ss\ZZ', 'en');
    if (a.end !== null) {
      b.end = formatDate(a.end, 'yyyy-MM-ddTHH:mm:ss\ZZ', 'en');
    }
    return b;
  }

}
