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

// Auth service
import { AuthService } from "./shared/services/auth.service";
import { ProjectHomeComponent } from './components/projectHome/projectHome.component';
import { ProjectTreeComponent } from './components/projectTree/projectTree.component';


@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    SignUpComponent,
    DashboardComponent,
    VerifyEmailComponent,
    ProjectHomeComponent,
    ProjectTreeComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule,
    AngularFirestoreModule,
    ReactiveFormsModule,
    TreeModule
  ],
  providers: [AuthService],
  bootstrap: [AppComponent]
})

export class AppModule { }
