import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { DataServiceService } from 'src/app/shared/services/dataService.service';
import { TreeviewItem } from 'ngx-treeview';


@Component({
  selector: 'app-projectHome',
  templateUrl: './projectHome.component.html',
  styleUrls: ['./projectHome.component.css']
})

export class ProjectHomeComponent implements OnInit {


  constructor(
    public authService: AuthService,
    public router: Router,
    private dataService: DataServiceService
  ) { }



  projectCode = 'null';

  ngOnInit() {
    this.projectCode = this.dataService.selectedProject;
  }

}
