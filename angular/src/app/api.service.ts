import { Injectable } from '@angular/core';
import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { RawActivity, Activity, Duration, Student, Faculty, Course, Project, Diff } from './models';

export interface AuthTokens {
  access: string;
  refresh: string;
}

@Injectable()
export class ApiService {
  set tokens(x: AuthTokens) {
    window.localStorage.setItem('access', x.access);
    window.localStorage.setItem('refresh', x.refresh);
  }
  get tokens(): AuthTokens {
    return { access: window.localStorage.getItem('access'),
             refresh: window.localStorage.getItem('refresh') };
  }

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

  getStudents(): Observable<Student[]> {
    return this.http.get<Student[]>('/api/students/');
  }

  getStudent(id: number): Observable<Student[]> {
    return this.http.get<Student[]>(`/api/students/${id}/`);
  }

  getFaculties(): Observable<Faculty[]> {
    return this.http.get<Faculty[]>('/api/faculties/');
  }

  getFaculty(id: number): Observable<Faculty[]> {
    return this.http.get<Faculty[]>(`/api/faculties/${id}/`);
  }

  getCourses(): Observable<Course[]> {
    return this.http.get<Course[]>('/api/courses/');
  }

  getCourse(id: number): Observable<Course[]> {
    return this.http.get<Course[]>(`/api/courses/${id}/`);
  }

  getProjects(): Observable<Project[]> {
    return this.http.get<Project[]>('/api/projects/');
  }

  getProject(id: number): Observable<Project[]> {
    return this.http.get<Project[]>(`/api/projects/${id}/`);
  }

  postProject(project: Diff<Project, 'id' | 'course'>)
    : Observable<Project> {
    return this.http.post<Project>(`/api/projects/`, project);
  }

  putProject(project: Diff<Project, 'course'>): Observable<Project> {
    return this.http.put<Project>(
      `/api/projects/${project.id}/`, project);
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

  postActivity(activity: Diff<Activity, 'id'>): Observable<Activity> {
    return this.http.put<RawActivity>(
      `/api/activities/`, activity).pipe(
      map(x => this._deserialize(x)),
    );
  }

  putActivity(activity: Activity): Observable<Activity> {
    return this.http.put<RawActivity>(
      `/api/activities/${activity.id}/`, activity).pipe(
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
