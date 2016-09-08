import {Component, EventEmitter, Input, Output, OnInit} from '@angular/core';

@Component({
    selector: 'directory-view',
    templateUrl: '../dev/tpl/tree-view.html', 
    directives: [DirectoryViewComponent]
})
export class DirectoryViewComponent implements OnInit { 
    /** --Property Segment--
    * List of the properties.
    **/
    @Output() editSelectedRow = new EventEmitter();
    @Input() treeViewList: any;
    @Input() eventemiter: any;
    @Input() isCheckboxEnabled: any; 
    //#endregion 

    constructor() {
    } 

    /** 
    *   Initilize vairables
	**/
    ngOnInit() {
        if (this.eventemiter != null)
            this.editSelectedRow = this.eventemiter;
    } 
        
    /** 
    *   emits data to parent component
	**/
    public clicked(dir) {
        dir.toggle();
        if (this.eventemiter != null) {
            this.eventemiter.emit(dir);
        }
        else {
            this.editSelectedRow.emit(dir);
        }
    }
}