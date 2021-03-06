import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {OtherService} from '../other.service';

@Component({
  selector: 'app-other-profile',
  templateUrl: './other-profile.component.html',
  styleUrls: ['../../assets/css/vendor/all.css']
})
export class OtherProfileComponent implements OnInit {
  jsonUserName = {
    username: ''
  };

  quotedPostComment: string[] = [];
  posts = [
    // username: '',
    // content: '',
    // tags: [],
    // likedByUser: [],
    // numberOfLikes: Number,
    // quoted: Boolean,
    // comment: '',
    // originName: ''
  ];
  jsonLikedID = {
    postID: ''
  };
  getUserName = '';
  getFirstName = '';
  getLastName = '';
  // getAge = '';
  // getSchool = '';
  // getGender = '';
  // getPhone = '';
  // getAddress = '';
  getTag = '';
  getTagList = [];
  getFollowStatus: boolean;
  follow = {
    username: '',
    levelOfInteraction: 0
  };
  notFollow = false;
  taglist = [];
  tagListCurrent = [];
  unfollow = {
    username: ''
  };
  getLikeNum: number[] = [];
  constructor(private _auth: AuthService, private _router: Router, private _other: OtherService, private _activateroute: ActivatedRoute) { }

  ngOnInit() {
    // set all profile value from local storage
    this.jsonUserName.username = this._activateroute.snapshot.params.username;
    this._other.getOthersProfile(this.jsonUserName)
      .subscribe( (res: any) => {
        this.getFirstName = res.firstName;
        this.getLastName = res.lastName;
        this.getUserName = res.username;
        this.getTagList = res.userTags;
      }, err => {
        if (err.status === 400) {
          alert('Bad request! please fill in all the blanks!');
        } else if (err.status === 403) {
          alert('User Not Found!');
        } else if (err.status === 500) {
          alert('Server Error!');
        }
      });

    this._other.getUserLine(this.jsonUserName).subscribe((res: any) => {
      this.posts = res;
      console.log('the posts is: ', res);
      for (const post of this.posts) {
        this.getLikeNum.push(post.numberOfLikes);
      }
    });


      // this._other.getUserLine(this.jsonUserName).subscribe((res: any) => {
      //   this.posts = res;
      //   // console.log('the post in other profile is: ', this.posts);
      // });

      this._other.checkFollowStatus(this.jsonUserName).subscribe( (res: any) => {
        console.log('res: ', res);
        this.notFollow = !res.followed;
        this.taglist = res.taglist;
        console.log('check follow: ', this.notFollow);
        console.log('taglist we get at the beginning', this.taglist);
      });
    // if (this.notFollow === false) {
    //   console.log('wo tmd guangzhul');
    //   this._other.getFollowedTags(this.jsonUserName).subscribe((res2: any) => {
    //     this.taglist = res2.taglist;
    //     console.log('taglist we get at the beginning', this.taglist);
    //   });
    // }
  }

  onAddLike(likedPostID, index) {
    this.jsonLikedID.postID = likedPostID;
    this._other.likePost(this.jsonLikedID).subscribe( (res: any) => {

    }, error => {
      if (error.status === 406) {
        alert('Already Liked!');
        window.location.reload();
      }
    });
    this.getLikeNum[index] = this.posts[index].numberOfLikes + 1;
    console.log(this.getLikeNum[index]);
  }
  onQuote(quotePostID, index) {
    this._other.quote(quotePostID, this.quotedPostComment[index]).subscribe( (res: any) => {
      console.log('Quoted!');
    });
  }

  onFollow() {
    this.follow.username = this._activateroute.snapshot.params.username;
    this.follow.levelOfInteraction = 0;
    this._other.followUser(this.follow).subscribe(res => {
      // console.log('follow success');
      alert('follow success');
      window.location.reload();
    }, err => {
      if (err.status === 400) {
        alert('Bad request! Please fill in all the blanks');
      } else if (err.status === 403) {
        alert('User not found');
      } else if (err.status === 406) {
        alert('Repeated Follow!');
      } else if (err.status === 500) {
        alert('Server Error!');
      }
      // console.log(err);
    });
  }

  onunFollow() {
    this.unfollow.username = this._activateroute.snapshot.params.username;
    this._other.unfollowUser(this.unfollow).subscribe(res => {
      console.log('unfollow success');
      alert('unfollow success');
      window.location.reload();
    }, err => {
      if (err.status === 400) {
        alert('Bad request! Please fill in all the blanks');
      } else if (err.status === 403) {
        alert('User not found');
      } else if (err.status === 500) {
        alert('Server Error!');
      }
      console.log(err);
    });
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
  // todo check duplicate tags
  addFollowTag(tag) {
    console.log('tag need to add: ', tag);
    this.tagListCurrent.push(tag);
  }
  updateTag() {
    console.log('the tag list is: ', this.taglist);
    this._other.changeFrollowedTag(this.jsonUserName.username, this.tagListCurrent)
      .subscribe((res: any) => {
        console.log('add tag success');
        alert('add follow tag success');
        window.location.reload();
      }, err => {
        if (err.status === 400) {
          alert('Bad request! please fill in all the blanks!');
        } else if (err.status === 403) {
          alert('User Not Found!');
        } else if (err.status === 500) {
          alert('Server Error!');
        }
      });
  }

}
