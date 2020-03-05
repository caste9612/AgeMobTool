import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { DataServiceService } from 'src/app/shared/services/dataService.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConditionalExpr } from '@angular/compiler';
import { tick } from '@angular/core/testing';


@Component({
  selector: 'app-dashboard',
  templateUrl: './student-list.component.html',
  styleUrls: ['./student-list.component.css']
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
  displayUpload = 'none';
  displayDownloadDepartureTicket = 'none';
  departureTicketUrl: string;
  columns: string[] = [];
  rows: number[] = [];
  ols1;
  ols2;

  toggle = true;
  status = 'Enable';
  prova;
  email;
  contact;
  selectedProject;

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

        if (element.payload.doc.data().departureTicket ==='Uploaded') {
          document.getElementById('departureTicketUploadButton' + element.payload.doc.id).style.backgroundColor = 'lightgreen';
        }else{
          document.getElementById('departureTicketUploadButton' + element.payload.doc.id).style.backgroundColor = 'white';
        }
      })
      );
  }



  goToSelectedProject(project) {
    this.dataService.setProject(project);
    this.router.navigate(['project-home']);
  }

  onCloseHandled(){
    this.display = 'none';
    this.displayUpload = 'none';
    this.displayDownloadDepartureTicket = 'none';
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

 openModalUpload(student) {

  this.displayUpload = 'block';
  this.nome = student;
  this.dataService.uploadingStudent = student;
  this.dataService.getStudentTicketsFolder().snapshotChanges().subscribe(
    tickets => tickets.forEach(ticket => {
      if (ticket.payload.doc.id === 'departure') {
        this.dataService.downloadURL = ticket.payload.doc.data().downloadURL;
        this.departureTicketUrl = ticket.payload.doc.data().downloadURL;
        this.displayDownloadDepartureTicket = 'flex';
      }
    })
  )
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
    }
/*
    updateDoc(_id: string, _value: string) {
      let doc = this.afs.collection('options', ref => ref.where('id', '==', _id));
      doc.snapshotChanges().pipe(
        map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        }))).subscribe((_doc: any) => {
         let id = _doc[0].payload.doc.id; //first result of query [0]
         this.afs.doc(`options/${id}`).update({rating: _value});
        })
    }
*/
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



}

