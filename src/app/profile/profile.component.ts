import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {AuthService} from '../auth.service';
import {OtherService} from '../other.service';
import {DatePipe} from '@angular/common';
import {error} from 'util';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['../../assets/css/vendor/all.css']
})
export class ProfileComponent implements OnInit {

  constructor(private _auth: AuthService, private _router: Router, private _other: OtherService, private datepipe: DatePipe) {}
  newProfile = {};
  changeProfile = {
      enteredFirstName: '',
      enteredLastName: '',
      enteredAge: '',
      enteredSchool: '',
      enteredGender: '',
      enteredAddress: '',
      enteredPhone: ''
    };
  jsonUserName = {
      username: ''
  };
  jsontag = {
    tag: ''
  };
  getUserName = '';
  getFirstName = '';
  getLastName = '';
  // getEmail = '';
  getAge: number;
  getSchool = '';
  getGender = '';
  getPhone: number;
  getAddress = '';
  getTag = '';
  getTagList = [];
  getUserList = [];
  getFollowersList = [];
  getPostList: Array<any> = [
  ];

  ngOnInit() {
    // set all profile value from local storage
    this.jsonUserName.username = localStorage.getItem('userName');
    this._other.getOthersProfile(this.jsonUserName)
    .subscribe( (res: any) => {
      this.changeProfile.enteredFirstName = res.firstName;
      this.changeProfile.enteredLastName = res.lastName;
      this.getUserName = res.username;
      this.getTagList = res.userTags;
      this.changeProfile.enteredAge = res.age;
      this.changeProfile.enteredSchool = res.school;
      this.changeProfile.enteredGender = res.gender;
      this.changeProfile.enteredPhone = res.phone;
      this.changeProfile.enteredAddress = res.address;
      this.getFirstName = this.changeProfile.enteredFirstName;
      this.getLastName = this.changeProfile.enteredLastName;
    });
    this._other.getUserLine(this.jsonUserName).subscribe( (res: any) => {
      this.getPostList = res;
      console.log(res);
    });
    this._other.getFollowedUsers().subscribe((res: any) => {
      this.getUserList = res.userList;
      console.log('the userList is:', this.getUserList);
    });

    this._other.getFollowers().subscribe((res: any) => {
      this.getFollowersList = res.followers;
      console.log('the getFollowersList is:', this.getFollowersList);
    });

    // this.getUserName = localStorage.getItem('userName');
    // this.getFirstName = localStorage.getItem('firstName');
    // this.getLastName = localStorage.getItem('lastName');
    // this.getEmail = localStorage.getItem('email');
    // this.getAge = localStorage.getItem('age');
    // this.getGender = localStorage.getItem('gender');
    // this.getPhone = localStorage.getItem('phone');
    // this.getAddress = localStorage.getItem('address');

    // console.log(localStorage);
    // this.UpdateUserInfo.username = this.getUserName;
    // this.UpdateUserInfo.firstName = this.getFirstName;
    // this.UpdateUserInfo.lastName = this.getLastName;
    // this.UpdateUserInfo.email = this.getEmail;
    // this.UpdateUserInfo.newUserName = this.getUserName;
    // this.UpdatePassword.username = this.getUserName;
  }

  submit() {
    console.log('click');
  }

  onAddTag() {
    if (this.getTag === '') {
      alert('Please enter a name for tag!');
      return;
    }
    for (const tag of this.getTagList) {
      if (tag === this.getTag) {
        alert('Existing Tag!');
        return;
      }
    }
    this.getTagList.push(this.getTag);
    this.jsontag.tag = this.getTag;
    this._other.addNewTag(this.jsontag)
      .subscribe(res => {
        console.log('add tag success');
      }, err => {
        if (err.status === 400) {
          alert('Bad Request!');
        } else if (err.status === 403) {
          alert('No such user!');
        } else if (err.status === 406) {
          alert('Repeated Tags!');
        } else if (err.status === 500) {
          alert('Server Error!');
        }
        console.log(err);
      });
  }

  deleteAccount() {
    this._auth.deleteAccount().subscribe((res: any ) => {
      alert('deleteAccount');
      console.log('delete success');
      this._router.navigate(['/']);
    });
  }

  onSaveProfile() {
    // this.getFirstName = this.changeProfile.enteredFirstName;
    // this.getLastName = this.changeProfile.enteredLastName;
    // this.getAge = this.changeProfile.enteredAge;
    // this.getSchool = this.changeProfile.enteredSchool;
    // this.getGender = this.changeProfile.enteredGender;
    // this.getPhone = this.changeProfile.enteredPhone;
    // this.getAddress = this.changeProfile.enteredAddress;
    this.getAge = +this.changeProfile.enteredAge;
    if (this.getAge < 0 || this.getAge > 120) {
      alert('Please enter a valid age');
      return;
    }
    this.getPhone = +this.changeProfile.enteredPhone;
    if (this.getPhone.toString().length !== 10) {
      alert('Please enter a valid 10 digits Phone number!');
      return;
    }
    this._other.changeProfile(this.changeProfile)
      .subscribe(res => {
        console.log('change profile success');
        this.getFirstName = this.changeProfile.enteredFirstName;
        this.getLastName = this.changeProfile.enteredLastName;
      });
    window.location.reload();
  }


  logOut() {
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('email');
    localStorage.removeItem('userName');
    localStorage.removeItem('token');
    localStorage.removeItem('age');
    localStorage.removeItem('school');
    localStorage.removeItem('gender');
    localStorage.removeItem('phone');
    localStorage.removeItem('address');
    localStorage.removeItem('searchUser');
  }
  navigateToUserProfile(username) {
    this._router.navigate(['/other_profile', username]);
  }
}

