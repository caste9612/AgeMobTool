import { Component, OnInit, NgZone } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { DataServiceService } from 'src/app/shared/services/dataService.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
 //styleUrls: ['./dashboard.component.css']
 styles: [`
 .backdrop{
   background-color:rgba(0,0,0,0.4);
   position:fixed;
   top:0;
   left:0;
   width:100%;
   height:100vh;
   }`]
})

export class DashboardComponent implements OnInit {

  constructor(
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone,
    private dataService: DataServiceService
  ) { }

  projects = [];
  display = 'none';




  ngOnInit() {
    this.dataService.getProjects().subscribe(
      projects => projects.forEach(element => {
        if(this.projects.includes(element.payload.doc.id)) {
          this.projects.splice(this.projects.indexOf(element.payload.doc.id), 1);
        }
        this.projects.push(element.payload.doc.id);
      })
    );
  }



  goToSelectedProject(project) {
    this.dataService.setProject(project);
    this.router.navigate(['project-home']);
  }

  onCloseHandled(){
    this.display='none';
  }

  openModal(){
    this.display='block';
    }
  getData(input){
    console.log(input);
  }

  addProject(projectName){

       // Add a new document in collection "students"
        const prog= this.dataService.projects.doc(projectName);

        prog.set({
            //setsomevalue
        })
        .then(function() {
            console.log("Document successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing document: ", error);
        });
    };

}

