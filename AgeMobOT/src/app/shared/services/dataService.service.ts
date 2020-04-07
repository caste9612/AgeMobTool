import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFirestoreCollection } from '@angular/fire/firestore';
import {CollectionReference} from '@angular/fire/firestore'
import {DocumentReference} from "@angular/fire/firestore"
import {DocumentData} from "@angular/fire/firestore"
import {UserData} from './user'



@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  constructor(public db: AngularFirestore) { }

  downloadURL: string;

  projects = this.db.collection('projects');
  users: AngularFirestoreCollection<UserData> = this.db.collection('users');
  selectedProject = 'PCODE2019';
  selectedCountry = 'Spain';
  selectedDestination = 'Madrid';
  selectedDate = '10-03.11-06';
  selectedStudents = 'Students';
  selectedOls = 'ols1';
  uploadingStudent;

  actionUploadAttribute;
  actionUpload;

  student = this.projects.doc(this.selectedProject).collection('Countries').doc(this.selectedCountry)
  .collection('Destinations').doc(this.selectedDestination).collection('Date').doc(this.selectedDate).collection('Students');


  getProjects() {
    return this.projects.snapshotChanges();
  }

  getDestinations(country: string) {
    return this.projects.doc(this.selectedProject).collection('Countries').doc(country).collection('Destinations').snapshotChanges();
  }

  getDate(country: string, destination: string) {
    return this.projects.doc(this.selectedProject).collection('Countries').doc(country).collection('Destinations')
    .doc(destination).collection('Date').snapshotChanges();
  }

  getCountries() {
    return this.projects.doc(this.selectedProject).collection('Countries').snapshotChanges();
  }


  setProject(project) {
   this.selectedProject = project;
  }

  getStudentList() {
    return  this.projects.doc(this.selectedProject).collection('Countries').doc(this.selectedCountry)
    .collection('Destinations').doc(this.selectedDestination).collection('Date').doc(this.selectedDate)
    .collection('Students').snapshotChanges();
    // .doc(this.selectedDestination).collection('Date').
    // doc(this.selectedDate).collection('Students').snapshotChanges();
  }

  getStudentListReference() {
    return this.projects.doc(this.selectedProject).collection('Countries').doc(this.selectedCountry)
    .collection('Destinations').doc(this.selectedDestination).collection('Date').doc(this.selectedDate)
    .collection('Students');
  }

  getStudentReference(student){
    return this.projects.doc(this.selectedProject).collection('Countries').doc(this.selectedCountry)
    .collection('Destinations').doc(this.selectedDestination).collection('Date').doc(this.selectedDate)
    .collection('Students').doc(student);
  }

  getProva() {

    return this.projects.doc(this.selectedProject).collection('Countries').doc(this.selectedCountry)
    .collection('Destinations').doc(this.selectedDestination).collection('Date').doc(this.selectedDate);
  }

  getStudentTicketsFolder() {
    return this.projects.doc(this.selectedProject).collection('Countries')
        .doc(this.selectedCountry).collection('Destinations').doc(this.selectedDestination)
        .collection('Date').doc(this.selectedDate).collection('Students').doc(this.uploadingStudent)
        .collection('tickets');
  }

  getStudentDocumentFolder() {
    return this.projects.doc(this.selectedProject).collection('Countries')
    .doc(this.selectedCountry).collection('Destinations').doc(this.selectedDestination)
    .collection('Date').doc(this.selectedDate).collection('Students').doc(this.uploadingStudent)
    .collection('document');
  }

  getStudentFeedbackFolder() {
    return this.projects.doc(this.selectedProject).collection('Countries')
    .doc(this.selectedCountry).collection('Destinations').doc(this.selectedDestination)
    .collection('Date').doc(this.selectedDate).collection('Students').doc(this.uploadingStudent)
    .collection('feedbacks');
  }

  addMessage(student: string, type: string) {
    this.users.get().subscribe(
      users => users.forEach(
        user => {
        if (user.data().student === student) {
          this.users.doc(user.id).collection('notifications').add({
            text: type
          });
        }
      })
    );
  }

  getStudentUid(student) {
    this.users.get().subscribe(
      users => users.forEach(
        user => {
        if (user.data().student === student) {
          return user.id;
        }
      })
    );
  }

  getUsers(){
    return this.users.snapshotChanges();
  }

  getMessageList(uid) {
    return this.users.doc(uid).collection('notifications').snapshotChanges();
  }


}
