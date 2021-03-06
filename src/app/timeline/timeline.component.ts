import { Component, OnInit } from '@angular/core';
import {AuthService} from '../auth.service';
import {OtherService} from '../other.service';
import {Router} from '@angular/router';
import {NumberValueAccessor} from '@angular/forms/src/directives/number_value_accessor';


@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['../../assets/css/vendor/all.css']
})
export class TimelineComponent implements OnInit {
  postData = {
    username: '',
    content: '',
    tags: [],
  };
  quotedPostComment: string[] = [];
  quotedHighLightedPostComment: string[] = [];
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
  highLightedPosts = [];
  // todo check duplicate
  // posts: any[] = [];
  jsonUserName = {
    username: ''
  };
  jsonLikedID = {
    postID: ''
  };
  getTagList = [];
  getTag = '';
  getAddedTagList = [];
  getLikeNum: number[] = [];
  selectedTagArray = [];
  selectedTag: '';
  // valueOfLikes: Array<any> = [];


  constructor(private _auth: AuthService, private _other: OtherService, private _router: Router) { }

  ngOnInit() {
    this.jsonUserName.username = localStorage.getItem('userName');
    // getTagList
    this._other.getOwnProfile().subscribe(
      (res: any) => {
        this.getTagList = res.userTags;
      });

    // hard code, need to be changed
    this.postData.username = localStorage.getItem('userName');
    // this.postData.tags.push('a new tag');
    this._other.getMorePosts().subscribe((res: any) => {
      this.posts = res;
      // this.valueOfLikes.push(res.numberOfLikes);
      console.log('the posts is: ', res);
      for (const post of this.posts) {
        this.getLikeNum.push(post.numberOfLikes);
      }
    });
    // todo check it is works
    this._other.getHighlightedPosts().subscribe((res: any) => {
      this.highLightedPosts = res;
      // this.valueOfLikes.push(res.numberOfLikes);
      console.log('the high lighted posts is: ', res);
    });


  }
  logOut() {
    localStorage.removeItem('email');
    localStorage.removeItem('address');
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
    localStorage.removeItem('role');
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('searchUser');
  }

  newPost() {
    if (this.postData.content.length >= 280) {
      console.log(this.postData.content.length );
      alert('the maximum characters is 280 ');
      return;
    }
    this._other.createNewPost(this.postData)
      .subscribe(res => {
          console.log('post success');
          alert('Post success!');

          }, err => {
          if (err.status === 400) {
            alert('Bad request! Please fill in content and choose tags!');
          } else if (err.status === 401) {
            alert('Unmatched username compared to your token');
          } else if (err.status === 500) {
            alert('Post creation failed!');
          }
          console.log(err);
      });
    this.postData.content = '';
    this.postData.tags = [];
    this.getAddedTagList = [];
  }

  onTagToPost(tagValue: string) {
    if (this.postData.tags.length === 3) {
      alert('Too many tags!');
      return;
    }
    for (const tag of this.getAddedTagList) {
      if (tag === tagValue) {
        alert('Existed tag!');
        return;
      }
    }
    this.getTag = tagValue;
    this.getAddedTagList.push(this.getTag);
    this.postData.tags.push(this.getTag);
    console.log(this.postData.tags[0]);
  }
  onRemoveTag() {
    window.location.reload();
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
    console.log(quotePostID);
    console.log(this.quotedPostComment[index]);
    this._other.quote(quotePostID, this.quotedPostComment[index]).subscribe( (res: any) => {
    });
    console.log('Quoted!');
    alert('Quoted success');
  }

  onQuoteHighLightedPost(quotePostID, index) {
    console.log(quotePostID);
    console.log(this.quotedHighLightedPostComment[index]);
    this._other.quote(quotePostID, this.quotedHighLightedPostComment[index]).subscribe( (res: any) => {
    });
    console.log('Quoted!');
  }

  newSortByTag() {
    console.log('the tag is:', this.selectedTagArray);
    this._other.getPostsWithTags(this.selectedTagArray).subscribe( (res: any) => {
      this.posts = res;
      console.log(this.posts);
    });
  }

  onAddSelectedTag() {
    if (this.selectedTagArray.length >= 3) {
      alert('The length of the Selected tags should be less than 3');
      return;
    }
    this.selectedTagArray.push(this.selectedTag);
    console.log(this.selectedTag + 'added');
    console.log(this.selectedTagArray);
  }

  onReselectTag() {
    this.selectedTagArray = [];
    this.selectedTag = '';
  }

  newSortByPotential() {
    this._other.getPotentialPosts().subscribe( (res: any) => {
      this.posts = res;
    });
    console.log('the potential post is: ', this.posts);
  }

  newSortByRelevance() {
    this._other.getRelevantPost().subscribe( (res: any) => {
      this.posts = res;
    });
    console.log('the potential post is: ', this.posts);
  }

  newUnsort() {
    this._other.getMorePosts().subscribe((res: any) => {
      this.posts = res;
      // this.valueOfLikes.push(res.numberOfLikes);
      console.log('the posts is: ', res);
      for (const post of this.posts) {
        this.getLikeNum.push(post.numberOfLikes);
      }
    });
  }
}
