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

  getProjects(){
    return this.projects.snapshotChanges();
  }


  setProject(project) {
   this.selectedProject = project;
  }




}
