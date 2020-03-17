import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

//Tree
import { TreeModule } from 'ng2-tree';


// Reactive Form
import { ReactiveFormsModule } from "@angular/forms";

// App routing modules
import { AppRoutingModule } from './shared/routing/app-routing.module';

// App components
import { AppComponent } from './app.component';
import { SignInComponent } from './components/sign-in/sign-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';

// Firebase services + enviorment module
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { firebaseConfig } from '../environments/environment';
import {AngularFireStorageModule} from "@angular/fire/storage";

//Google charts
import {GoogleChartsModule} from 'angular-google-charts'


// Auth service
import { AuthService } from "./shared/services/auth.service";

//Directive
import { DropzoneDirective } from './shared/services/dropzone.directive';


//Components
import { ProjectHomeComponent } from './components/projectHome/projectHome.component';
import { ProjectTreeComponent } from './components/projectTree/projectTree.component';
import { StudentListComponent } from './components/student-list/student-list.component';
import { UploadTaskComponent } from './components/upload-task/upload-task.component';
import { UploaderComponent } from './components/uploader/uploader.component';
import { NgForOf, NgIf } from '@angular/common';


@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    DashboardComponent,
    VerifyEmailComponent,
    ProjectHomeComponent,
    ProjectTreeComponent,
    StudentListComponent,
    UploadTaskComponent,
    UploaderComponent,
    DropzoneDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    ReactiveFormsModule,
    TreeModule,
    GoogleChartsModule,
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})

export class AppModule { }
