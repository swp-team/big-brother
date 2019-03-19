import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ApiService } from '@app/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  login: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: ApiService,
  ) { }

  ngOnInit() {
    this.login = this.fb.group({
      email: ['', [Validators.email, Validators.required]],
      password: ['', [Validators.minLength(8),
                      Validators.maxLength(16)]]
    });
  }

  onSubmit() {
    if (this.login.invalid) return;
    this.api.postAuthenticate(
      this.login.get('email').value,
      this.login.get('password').value,
    ).subscribe(
      () => this.router.navigate(['/']),
    );
  }

}
