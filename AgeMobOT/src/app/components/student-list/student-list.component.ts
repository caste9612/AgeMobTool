import { Component, OnInit, AfterViewInit, NgZone } from '@angular/core';
import { AuthService } from '../../shared/services/auth.service';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { DataServiceService } from 'src/app/shared/services/dataService.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ConditionalExpr } from '@angular/compiler';
import { tick } from '@angular/core/testing';
import { stringify } from 'querystring';





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
  display1 = 'none';
  displayUpload = 'none';
  displayDocumentDownload = 'none';
  displayDownloadDepartureTicket = 'none';
  displayCredential = 'none';
  departureTicketUrl: string;
  columns: string[] = [];
  rows: number[] = [];
  display2 = 'none';
  ols1;
  ols2;

  toggle = true;
  status = 'Enable';
  prova;
  email;
  contact;
  selectedProject;
  input;

  emailLogIn;
  password;

  nome ;

  messages = [];

  documentFront;
  documentBack;





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

        if(element.payload.doc.data().ols1==='lightgreen'){
          document.getElementById('ols1'+element.payload.doc.id).textContent = 'Verified';
        }
        else if (element.payload.doc.data().ols1==='yellow'){
          document.getElementById('ols1'+element.payload.doc.id).textContent = 'Waiting';
        }
        else{
          document.getElementById('ols1'+element.payload.doc.id).textContent = 'Miss';

        }


        document.getElementById('ols2'+element.payload.doc.id).style.backgroundColor=element.payload.doc.data().ols2;

        if(element.payload.doc.data().ols2==='lightgreen'){
          document.getElementById('ols2'+element.payload.doc.id).textContent = 'Verified';
        }
        else if (element.payload.doc.data().ols2 ==='yellow'){
          document.getElementById('ols2'+element.payload.doc.id).textContent = 'Waiting';
        }
        else{
          document.getElementById('ols2'+element.payload.doc.id).textContent = 'Miss';

        }

        document.getElementById('report'+element.payload.doc.id).style.backgroundColor=element.payload.doc.data().report;

        if(element.payload.doc.data().report==='lightgreen'){
          document.getElementById('report'+element.payload.doc.id).textContent = 'Done';

        }else{
          document.getElementById('report'+element.payload.doc.id).textContent = 'Miss';

        }

        if (element.payload.doc.data().departureTicket ==='Uploaded') {
          document.getElementById('departureTicketUploadButton' + element.payload.doc.id).style.backgroundColor = 'lightgreen';
        }else{
          document.getElementById('departureTicketUploadButton' + element.payload.doc.id).style.backgroundColor = 'white';
        }
        if (element.payload.doc.data().returnTicket ==='Uploaded') {
          document.getElementById('returnTicketUploadButton' + element.payload.doc.id).style.backgroundColor = 'lightgreen';
        }else{
          document.getElementById('returnTicketUploadButton' + element.payload.doc.id).style.backgroundColor = 'white';
        }

        if (element.payload.doc.data().front ==='accepted' && element.payload.doc.data().back ==='accepted') {
          document.getElementById('documentButton' + element.payload.doc.id).style.backgroundColor = 'lightgreen';
        }else{
          document.getElementById('documentButton' + element.payload.doc.id).style.backgroundColor = 'red';
        }


        this.dataService.getUsers().subscribe(
          users => users.forEach(
            user => {
              if (user.payload.doc.data().student === element.payload.doc.id){
               document.getElementById('credentialButton' + element.payload.doc.id).style.backgroundColor = '#343a40';
               document.getElementById('credentialButton' + element.payload.doc.id).style.color = 'white';
              }
            }
          )
        );
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
    this.displayCredential = 'none';
    this.displayDocumentDownload = 'none';

  }

  openModal(student){
    this.messages.length = 0;

    this.display='block';
    this.nome = student;

    this.dataService.getStudentList().subscribe(
      studentList => studentList.forEach(studentG => {
        if(studentG.payload.doc.id===student){
          this.email = studentG.payload.doc.data().email;
          this.contact = studentG.payload.doc.data().contact;
        }
    }));

    this.dataService.getUsers().subscribe(
      users => users.forEach(
        user => {
          if (user.payload.doc.data().student === student){
            this.dataService.getMessageList(user.payload.doc.id).subscribe(
              messages => messages.forEach(
                message => {
                  this.messages.push(message.payload.doc.data().text);
                }
              )
            )
          }
        }
      )
    );
 }

 openModalDocument(student){
   this.displayDocumentDownload = 'block';

   this.documentFront = null;
   this.documentBack = null;

   this.dataService.uploadingStudent = student;

   this.dataService.getStudentDocumentFolder().snapshotChanges().subscribe(
    documents => documents.forEach(document => {
      if (document.payload.doc.id === 'front'){
        this.documentFront= document.payload.doc.data().downloadUrl;
      }
      if (document.payload.doc.id === 'back'){
        this.documentBack= document.payload.doc.data().downloadUrl;
      }
    })
  )
}

acceptDocument(student, type){
  if(type == 'front'){
    this.dataService.getStudentReference(this.dataService.uploadingStudent).update({front: "accepted"});
  }
  if(type == 'back'){
    this.dataService.getStudentReference(this.dataService.uploadingStudent).update({back: "accepted"});
  }
}


 openModalUpload(student,action) {

  this.displayUpload = 'block';
  this.nome = student;
  this.dataService.uploadingStudent = student;
  this.dataService.actionUpload = action;
  this.dataService.getStudentTicketsFolder().snapshotChanges().subscribe(
    tickets => tickets.forEach(ticket => {
      if (ticket.payload.doc.id === action) {
        this.dataService.downloadURL = ticket.payload.doc.data().downloadURL;
        this.departureTicketUrl = ticket.payload.doc.data().downloadURL;
        this.displayDownloadDepartureTicket = 'flex';
      }
    })
  )
  }

  getUserCredential(student: string){
    this.displayCredential = 'block';

    this.dataService.getStudentList().subscribe(
      studentList => studentList.forEach(studentG => {
        if(studentG.payload.doc.id===student){
          this.email = student.replace(/\s/g,'').toLowerCase() + "@agemob.com";
          this.contact = studentG.payload.doc.data().contact;
          this.nome = student;
        }
      }))
  }

  generateCredential(psw){
    this.authService.SignUp(this.email, psw, this.dataService.selectedProject, this.dataService.selectedCountry,
       this.dataService.selectedDestination, this.dataService.selectedDate, this.nome);
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

  this.dataService.getProva().collection('Students').doc('/' + student).update({ols1: 'lightgreen'}).then(() => {
  console.log('done');
  })
  .catch(function(error) {
  console.error('Error writing document: ', error);
  });
}

changeValueOls2(student){

  this.dataService.getProva().collection('Students').doc('/' + student).update({ols2: 'lightgreen'}).then(() => {
  console.log('done');
  })
  .catch(function(error) {
  console.error('Error writing document: ', error);
  });
}

changeValueReport(student){

  this.dataService.getProva().collection('Students').doc('/' + student).update({report: 'lightgreen'}).then(() => {
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

addStudent(studentName, mail, number){

  // Add a new document in collection "students"
  const stud= this.dataService.getStudentListReference().doc(studentName);

  stud.set({

    ols1: 'red',
    ols2: 'red',
    email: mail,
    contact: number,
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

  sendNotification(student:string, type:string){
    console.log("notifica a " + student + " " + type);
    this.dataService.addMessage(student, type);
  }
}



