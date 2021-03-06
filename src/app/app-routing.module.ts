import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AppComponent} from './app.component';
import {RegisterComponent} from './register/register.component';
import {MainComponent} from './common/main/main.component';
import {ProfileComponent} from './profile/profile.component';
import {TimelineComponent} from './timeline/timeline.component';
import {FinduserComponent} from './finduser/finduser.component';
import {TestComponent} from './test/test.component';
import {OtherProfileComponent} from './other-profile/other-profile.component';


const routes: Routes = [
  {path: '', component: MainComponent},

  {
    path: 'register', component: RegisterComponent
  },

  {
    path: 'profile', component: ProfileComponent
  },
  {
    path: 'timeline', component: TimelineComponent
  },
  {
    path: 'finduser', component: FinduserComponent
  },
  {
    path: 'test', component: TestComponent
  },
  {
    path: 'other_profile/:username', component: OtherProfileComponent
  }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
