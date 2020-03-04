import { Injectable } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import {CollectionReference} from "@angular/fire/firestore"
import {DocumentReference} from "@angular/fire/firestore"



@Injectable({
  providedIn: 'root'
})
export class DataServiceService {

  constructor(private db: AngularFirestore) { }

  projects = this.db.collection('projects');
  selectedProject;

  getProjects() {
    return this.projects.snapshotChanges();
  }

  getDestinations(country: string) {
    return this.projects.doc(this.selectedProject).collection('Countries').doc(country).collection("Destinations").snapshotChanges();
  }

  getDate(country: string, destination: string) {
    return this.projects.doc(this.selectedProject).collection('Countries').doc(country).collection("Destinations")
    .doc(destination).collection('Date').snapshotChanges();
  }

  getCountries() {
    return this.projects.doc(this.selectedProject).collection('Countries').snapshotChanges();
  }


  setProject(project) {
   this.selectedProject = project;
  }




}
