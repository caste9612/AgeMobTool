import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { DataServiceService } from 'src/app/shared/services/dataService.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConditionalExpr } from '@angular/compiler';


@Component({
  selector: 'app-dashboard',
  templateUrl: './student-list.component.html',
  //styleUrls: ['./student-list.component.css']
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

export class StudentListComponent implements OnInit , AfterViewInit{

  constructor(
    public authService: AuthService,
    public router: Router,
    public ngZone: NgZone,
    private dataService: DataServiceService
  ) { }

  projects = [];
  students = [];
  display = 'none';
  display1 = 'none';
  display2 = 'none';
  columns:string[]=[];
  rows:number[]=[];
  ols1;
  ols2;

  toggle = true;
  status = 'Enable';
  prova;
  email;
  contact;
  selectedProject;
  input;

  nome ;

  ngOnInit() {

    this.selectedProject = this.dataService.selectedProject;

    this.dataService.getStudentList().subscribe(
      students => students.forEach(element => {
        if(this.students.includes(element.payload.doc.id)) {
          this.students.splice(this.students.indexOf(element.payload.doc.id));

        }
        this.students.push(element.payload.doc.id);
        console.log(element.payload.doc.data().ols1);
        console.log('ols2'+element.payload.doc.id);
        document.getElementById('ols2'+element.payload.doc.id);
      })
      );

    }
    ngAfterViewInit(): void {
      this.dataService.getStudentList().subscribe(
        students => students.forEach(element => {

          document.getElementById('ols1'+element.payload.doc.id).style.backgroundColor=element.payload.doc.data().ols1;

          if(element.payload.doc.data().ols1==='green'){
            document.getElementById('ols1'+element.payload.doc.id).textContent = 'Verified';
          }
          else if (element.payload.doc.data().ols1==='yellow'){
            document.getElementById('ols1'+element.payload.doc.id).textContent = 'Waiting';
          }
          else{
            document.getElementById('ols1'+element.payload.doc.id).textContent = 'Not loaded';

          }


          document.getElementById('ols2'+element.payload.doc.id).style.backgroundColor=element.payload.doc.data().ols2;

          if(element.payload.doc.data().ols2==='green'){
            document.getElementById('ols2'+element.payload.doc.id).textContent = 'Verified';
          }
          else if (element.payload.doc.data().ols2==='yellow'){
            document.getElementById('ols2'+element.payload.doc.id).textContent = 'Waiting';
          }
          else{
            document.getElementById('ols2'+element.payload.doc.id).textContent = 'Not loaded';

          }

          document.getElementById('report'+element.payload.doc.id).style.backgroundColor=element.payload.doc.data().report;

          if(element.payload.doc.data().report==='green'){
            document.getElementById('report'+element.payload.doc.id).textContent = 'Done';

          }else{
            document.getElementById('report'+element.payload.doc.id).textContent = 'Not loaded';

          }

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

  openModal(student){
    this.display='block';
    this.nome = student;

    this.dataService.getStudentList().subscribe(
      studentList => studentList.forEach(studentG => {
        if(studentG.payload.doc.id===student){
          this.email = studentG.payload.doc.data().email;
          this.contact = studentG.payload.doc.data().contact;
        }
      }))
 }

 closeAndOpen(){
  this.display1='block';
  
 }
 onCloseNewModal(){
  this.display1='none';
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

    modifiedField(input,input2,student){

      this.dataService.getProva().collection('Students').doc('/' + student).update({email: input})

      this.dataService.getProva().collection('Students').doc('/' + student).update({contact: input2})

    }

    

    changeValueOls1(student){


      this.dataService.getProva().collection('Students').doc('/' + student).update({ols1: 'green'}).then(() => {
        console.log('done');
      })
      .catch(function(error) {
      console.error('Error writing document: ', error);
      });


    }

    changeValueOls2(student){

      this.dataService.getProva().collection('Students').doc('/' + student).update({ols2: 'green'}).then(() => {
        console.log('done');
      })
      .catch(function(error) {
      console.error('Error writing document: ', error);
      });
    }

    changeValueReport(student){

      this.dataService.getProva().collection('Students').doc('/' + student).update({report: 'green'}).then(() => {
        console.log('done');
      })
      .catch(function(error) {
      console.error('Error writing document: ', error);
      });
    }


    openModalNewStudent(){
      this.display2 = 'block';
      
    }

    onCloseModalNewStudent(){
      this.display2 = 'none';
    }

    addStudent(studentName){

      // Add a new document in collection "students"
       const stud= this.dataService.student.doc(studentName);

       stud.set({

        ols1: 'red',
        ols2: 'red',
        email: '',
        contact: '',
        report: 'red'
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

