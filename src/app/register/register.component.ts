import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent implements OnInit {

  registerUserData =  {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    username: ''
  };

  constructor(
    private router: Router,
    private authService: AuthService
    ) { }
  ngOnInit() {
  }
  onSubmit() {
    console.log('click');
    console.log(this.registerUserData);
    this.authService.usernameAvailablility(this.registerUserData.username)
      .subscribe(() => {

        this.authService.emailAvailibility(this.registerUserData.email)
          .subscribe(() => {
            this.authService.createUser(this.registerUserData)
              .subscribe(data => {
                console.log(data);
                console.log('yes');
                this.router.navigate(['/']);
              }, err => {
                if (err.status === 400) {
                  alert('Bad request! Please fill in all blanks');
                } else if (err.status === 500) {
                  alert('Creation Failed on the Server!');
                }
                console.log(err);
              });
          }, err2 => {
            if (err2.status === 400) {
              alert('Please fill in all blanks');
            } else if (err2.status === 500) {
              alert('Server error');
            } else if (err2.status === 403) {
              alert('Email Taken! please choose another one');
            }
          });

      }, err => {
        if (err.status === 400) {
          alert('Please fill in all blanks');
        } else if (err.status === 500) {
          alert('Server error');
        } else if (err.status === 403) {
          alert('Username Taken! please choose another one');
        }
      });
  }
}

