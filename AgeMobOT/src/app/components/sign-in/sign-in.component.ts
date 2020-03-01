import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})

export class SignInComponent implements OnInit {

  constructor(
    public authService: AuthService
  ) { }

  loadAnimation = true;
  loadcounter = 0;

  activateLoadAnimation() {
    if ( this.loadcounter === 0) {
      this.loadcounter = 1;
    } else {
      this.loadAnimation = false;
    }
  }

  ngOnInit() { }

}
