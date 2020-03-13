import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { DataServiceService } from 'src/app/shared/services/dataService.service';


@Component({
  selector: 'upload-task',
  templateUrl: './upload-task.component.html',
  styleUrls: ['./upload-task.component.css']
})
export class UploadTaskComponent implements OnInit {

  @Input() file: File;

  task: AngularFireUploadTask;

  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: string;

  constructor(private storage: AngularFireStorage, private db: AngularFirestore, private dataService: DataServiceService) {}

  ngOnInit() {
    this.startUpload();
  }

  startUpload() {

    // The storage path
    const path = `tickets/` + this.dataService.uploadingStudent + `/${Date.now()}_${this.file.name}`;

    // Reference to storage bucket
    const ref = this.storage.ref(path);

    // The main task
    this.task = this.storage.upload(path, this.file);

    // Progress monitoring
    this.percentage = this.task.percentageChanges();

    this.snapshot   = this.task.snapshotChanges().pipe(
      tap(console.log),
      // The file's download URL
      finalize( async() =>  {
        this.downloadURL = await ref.getDownloadURL().toPromise();

        if(this.dataService.actionUpload === 'departure'){
          this.dataService.getStudentTicketsFolder().doc('departure').set( { downloadURL: this.downloadURL, path });
          this.dataService.student.doc(this.dataService.uploadingStudent).update({departureTicket: 'Uploaded'}).then(() => {
            console.log('done');
          })
          .catch(function(error) {
          console.error('Error writing document: ', error);
          });
        }
        if(this.dataService.actionUpload === 'return'){
          this.dataService.getStudentTicketsFolder().doc('return').set( { downloadURL: this.downloadURL, path });
          this.dataService.student.doc(this.dataService.uploadingStudent).update({returnTicket: 'Uploaded'}).then(() => {
            console.log('done');
          })
          .catch(function(error) {
          console.error('Error writing document: ', error);
          });
        }
      }),
    );
  }

  isActive(snapshot) {
    return snapshot.state === 'running' && snapshot.bytesTransferred < snapshot.totalBytes;
  }

}

