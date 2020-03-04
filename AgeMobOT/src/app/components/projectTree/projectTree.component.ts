import { Component, OnInit, ViewChild } from '@angular/core';
import { TreeModel,RenamableNode, NodeEvent, NodeCreatedEvent } from 'ng2-tree';
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { DataServiceService } from 'src/app/shared/services/dataService.service';
import { NodeMenuItemAction, MenuItemSelectedEvent, Ng2TreeSettings} from 'ng2-tree';
import { emit } from 'cluster';
import { EventEmitter } from 'protractor';


@Component({
  selector: 'projectTree',
  templateUrl: './projectTree.component.html',
  styleUrls: ['./projectTree.component.css']
})



export class ProjectTreeComponent implements OnInit {

  public project: TreeModel = {
    value: '/',
    id: 1,
    settings: {
      rightMenu: true,
      leftMenu: true,
      cssClasses: {
        expanded: 'fa fa-caret-down',
        collapsed: 'fa fa-caret-right',
        empty: 'fa fa-caret-right disabled',
        leaf: 'fa',
      },
      templates: {
        node: '<i class="fas fa-folder"></i>',
        leaf: '<i class="far fa-folder"></i>',
        leftMenu: '<i class="fa fa-navicon fa-lg"></i>'
      },
      menuItems: [
        { action: NodeMenuItemAction.Custom, name: 'Send Message', cssClass: 'fas fa-envelope' },
        //{ action: NodeMenuItemAction.NewTag, name: 'New Student', cssClass: '' },
        { action: NodeMenuItemAction.NewFolder, name: 'New Folder', cssClass: 'fas fa-folder-plus' },
        { action: NodeMenuItemAction.Rename, name: 'Rename', cssClass: '' },
        { action: NodeMenuItemAction.Remove, name: 'Remove Folder', cssClass: 'fas fa-folder-minus' }
      ]
    },
    children: [
      {
        value: 'Countries',
        id: 2,
        children: [],
        settings: {
          isCollapsedOnInit: true
        }
      }
    ]
  };


  private lastFFSNodeId = 2;

  @ViewChild('treeFFS') public treeFFS;



  public pls: TreeModel;

  public settings: Ng2TreeSettings = {
    rootIsVisible: false,
  };

  public disabledCheckboxesSettings: Ng2TreeSettings = {
    rootIsVisible: false
  };


  constructor(
    public router: Router,
    private dataService: DataServiceService
  ) { }

  // 3 - print caught event to the console
  public logEvent(e: NodeEvent): void {
    console.log(e);
  }

  private countries = [];
  private destinations = [];
  private date = [];
  private students = [];

  ngOnInit() {
    var idCountries = 2;

    this.dataService.getCountries().subscribe(
      countries => countries.forEach(element => {

        // se il paese non era gia nell albero
        if (this.countries.includes(element.payload.doc.id) === false) {
          // mettiamolo dunque nella lista di nuovo(se gia esistente, se e stato cancellato nel database non verra reinserito)
          this.countries.push(element.payload.doc.id);

          // creiamo il nuovo nodo
          let newNode: TreeModel = {
            value: element.payload.doc.id,
            id: 'countries/' + element.payload.doc.id,
            children: [],
            templates: {
              node: '<i class="far fa-folder"></i>',
              leaf: '<i class="far fa-folder"></i>'
            }
          };

          //newNode.id = ++this.lastFFSNodeId;
          const treeController = this.treeFFS.getControllerByNodeId(idCountries);
          if (treeController) {
            //aggiungiamo il nuovo nodo
            treeController.addChild(newNode);

            //iteriamo per le destinazioni del country
            this.dataService.getDestinations(element.payload.doc.id).subscribe(
              destinations => destinations.forEach(destination => {
                if (this.destinations.includes(destination.payload.doc.id) === false){
                  this.destinations.push(destination.payload.doc.id);

                  let newNodeDest: TreeModel = {
                    value: destination.payload.doc.id,
                    id: 'destinations/' + destination.payload.doc.id,
                    children: [],
                    templates: {
                      node: '<i class="far fa-folder"></i>',
                      leaf: '<i class="far fa-folder"></i>'
                    }
                  };

                  const DestinationController = this.treeFFS.getControllerByNodeId('countries/' + element.payload.doc.id);
                  if (treeController) {
                  DestinationController.addChild(newNodeDest);

                  //iteriamo per le date del country
                  this.dataService.getDate(element.payload.doc.id, destination.payload.doc.id).subscribe(
                  date => date.forEach(data => {
                  if (this.date.includes(data.payload.doc.id) === false){
                    this.destinations.push(data.payload.doc.id);

                    let newNodeDate: TreeModel = {
                      value: data.payload.doc.id,
                      id: 'date/' + data.payload.doc.id,
                      children: [],
                      templates: {
                        node: '<i class="far fa-folder"></i>',
                        leaf: '<i class="far fa-folder"></i>'
                      }
                    };

                    const DateController = this.treeFFS.getControllerByNodeId('destinations/' + destination.payload.doc.id);
                    if (DateController) {
                      DateController.addChild(newNodeDate);
                    } else {
                    console.log(`Controller is absent for a node with id: ${'destinations/' + destination.payload.doc.id}`);
                  }
                }
              })
            );
                  } else {
                    console.log(`Controller is absent for a node with id: ${'countries/' + element.payload.doc.id}`);
                  }
                }
              })
            );
          } else {
            console.log(`Controller is absent for a node with id: ${idCountries}`);
          }
        }
      })
    );
  }

  public onNodeRemoved(e: NodeEvent): void {
    console.log(e, 'Removed');

    if (e.node.parent.value === "Countries") {
      this.dataService.projects.doc(this.dataService.selectedProject).collection('Countries').doc(e.node.value).delete();
    }

    if( e.node.parent.parent.value === "Countries") {
      this.dataService.projects.doc(this.dataService.selectedProject).collection('Countries').doc(e.node.parent.value)
      .collection('Destinations').doc(e.node.value).delete();
    }

    if( e.node.parent.parent.parent.value === "Countries") {
      this.dataService.projects.doc(this.dataService.selectedProject).collection('Countries').doc(e.node.parent.parent.value)
      .collection('Destinations').doc(e.node.parent.value)
      .collection('Date').doc(e.node.value).delete();
    }

  }

  public onNodeMoved(e: NodeEvent): void {
    console.log(e, 'Moved');
  }

  public onNodeRenamed(e: NodeEvent): void {
    console.log(e, 'Renamed');
  }

  public onNodeCreated(e: NodeEvent): void {
    console.log(e, 'Created');
    }

  public onNodeSelected(e: NodeEvent): void {
    console.log(e, 'Selected');

    if (e.node.parent.parent.parent != null){
      if (e.node.parent.parent.parent.value === "Countries"){
      //sett la roba del data service e naviga con il ruter
      this.dataService.selectedCountry = e.node.parent.parent.value;
      this.dataService.selectedDestination = e.node.parent.value;
      this.dataService.selectedDate = e.node.value;
      this.router.navigate(['student-list']);
      }
    }
  }

  public onNodeUnselected(e: NodeEvent): void {
    console.log(e, 'Unselected');
  }

  public onMenuItemSelected(e: MenuItemSelectedEvent) {
    console.log(e, `You selected ${e.selectedItem} menu item`);
  }

  public onNodeExpanded(e: NodeEvent): void {
    console.log(e, 'Expanded');
  }

  public onNodeCollapsed(e: NodeEvent): void {
    console.log(e, 'Collapsed');
  }

  public onNodeFFSCreated(e: NodeEvent): void {

    console.log(e, 'Created');
    // if (controller) {
      // controller.changeNodeId(++this.lastFFSNodeId);
    // }

    if( e.node.parent.value === "Countries" && this.countries.includes(e.node.value) === false) {
      this.countries.push(e.node.value);
      const country = this.dataService.projects.doc(this.dataService.selectedProject).collection('Countries').doc(e.node.value);
      country.set({
          // setsomevalue
        })
        .then( function() {
            console.log("Country successfully written!");
        })
        .catch(function(error) {
            console.error("Error writing Country: ", error);
        });
    }

    if (e.node.parent.parent != null){
      if( e.node.parent.parent.value === "Countries" && this.destinations.includes(e.node.value) === false) {
        this.destinations.push(e.node.value);
        const country = this.dataService.projects.doc(this.dataService.selectedProject).collection('Countries').doc(e.node.parent.value)
        .collection('Destinations').doc(e.node.value);

        country.set({
            // setsomevalue
          })
          .then( function() {
              console.log("Destination successfully written!");
          })
          .catch(function(error) {
              console.error("Error writing Destination: ", error);
          });
      }
    }

    if (e.node.parent.parent.parent != null){
      if ( e.node.parent.parent.parent.value === "Countries" && this.date.includes(e.node.value) === false) {
        this.date.push(e.node.value);
        const country = this.dataService.projects.doc(this.dataService.selectedProject).collection('Countries')
        .doc(e.node.parent.parent.value).collection('Destinations').doc(e.node.parent.value)
        .collection('Date').doc(e.node.value);

        country.set({
            // setsomevalue
          })
          .then( function() {
              console.log("Date successfully written!");
          })
          .catch(function(error) {
              console.error("Error writing Date: ", error);
          });
      }
    }

  }

  public handleActionOnFFS(id: number | string, action: string) {
    const treeController = this.treeFFS.getControllerByNodeId(id);
    if (treeController && typeof treeController[action] === 'function') {
      treeController[action]();
    } else {
      console.log('There isn`t a controller for a node with id - ' + id);
    }
  }

  public renameFFS(id: number | string) {
    const treeController = this.treeFFS.getControllerByNodeId(id);
    if (treeController) {
      treeController.rename('unicode.pf');
    } else {
      console.log('There isn`t a controller for a node with id - ' + id);
    }
  }

  public setChildrenFFS(id: number | string) {
    const treeController = this.treeFFS.getControllerByNodeId(id);
    if (treeController && typeof treeController.setChildren === 'function') {
      treeController.setChildren([
        { value: 'apache2', id: 82, children: [] },
        { value: 'nginx', id: 83, children: [] },
        { value: 'dhcp', id: 84, children: [] },
        { value: 'dpkg', id: 85, children: [] },
        { value: 'gdb', id: 86, children: [] }
      ]);
    } else {
      console.log('There isn`t a controller for a node with id - ' + id);
    }
  }

  public addChildFFS(id: number | string, newNode: TreeModel) {
    newNode.id = ++this.lastFFSNodeId;
    const treeController = this.treeFFS.getControllerByNodeId(id);
    if (treeController) {
      treeController.addChild(newNode);
    } else {
      console.log(`Controller is absent for a node with id: ${id}`);
    }
  }

  public checkFolder(id: number): void {
    const treeController = this.treeFFS.getControllerByNodeId(id);
    if (treeController) {
      treeController.check();
    } else {
      console.log(`Controller is absent for a node with id: ${id}`);
    }
  }

  public uncheckFolder(id: number): void {
    const treeController = this.treeFFS.getControllerByNodeId(id);
    if (treeController) {
      treeController.uncheck();
    } else {
      console.log(`Controller is absent for a node with id: ${id}`);
    }
  }
}






