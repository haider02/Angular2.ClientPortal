import {Component, OnChanges, EventEmitter, Output, Input, OnInit, Inject} from '@angular/core';
import {LoggingService} from '../common/logging';
declare var PDFJS: any;  

@Component({
    selector: 'pdf-viewer',
    templateUrl: '../dev/tpl/pdf-viewer.html'
})
export class PdfViewerComponent implements OnChanges, OnInit {
    
    /** --Property Segment--
    * List of the properties.
    **/
    @Input() pdfPath = ""
    @Output() ViewPDF = new EventEmitter();
    private pdfConvas: any;  
    public scale = 1.0;  
    public pdf: any;
    public currentPage: number;
    public totalPages = 0; 
    public renderContext: any;
    public renderTask: any;
    logService: LoggingService;
    //#endregion 
    
    /** --Constructor--
    *   Initilizing local variables
    **/
    constructor(@Inject(LoggingService) _logservice) {
        this.currentPage = 1;  
        this.logService = _logservice;
        this.logService.log(PDFJS);
    }
    
    /** --ngOnChanges--
    *   Recieve changes from parent model (path of PDF file), and triggers related functions
    **/
    ngOnChanges() {
        this.loadPDF(this.pdfPath);
        this.currentPage = 1;
        this.logService.log(this.totalPages);
    }
    
    /** --ngOnInit--
    *   Loads PDF on init
    **/
    ngOnInit() {
        this.loadPDF(this.pdfPath); 
        this.logService.log(this.pdfPath);
    }
    
    /** --LoadPDF--
    *   PDF loader
    **/
    public loadPDF(path) { 
        this.logService.log('LoadPDF');
        PDFJS.getDocument(path).then((response) => this.pdfsuccess(response), this.pdfFailure);
        this.logService.log('LoadPDF');
    }
    
    /** --LoadPDF--
    *   PDF success handler
    **/
    public pdfsuccess(data) {

        this.pdf = data;
        this.logService.log('successPDF');
        this.logService.log(data);
        this.totalPages = this.pdf.numPages;
        this.pdf.getPage(1).then(response => this.pageSuccess(response), faiure => this.pageFailure(faiure)); 

        this.logService.log('successPDF');
    }

    /** --pdfFailure--
    *   PDF failure handler
    **/
    pdfFailure  (data) {
        this.logService.log("--fail--");
        this.logService.log(data)
    }
    
    /** --pageSuccess--
    *   page success handler
    **/
    pageSuccess(data) {

        if (this.renderTask) {
            this.renderTask.cancel();
        }
        this.logService.log('loadpagesucess');
        this.logService.log(data)
        var scale = 1.5;
        var viewport = data.getViewport(scale);
        this.pdfConvas = document.getElementById('pdfviewerconvas');

        var context = this.pdfConvas.getContext('2d');
        this.pdfConvas.height = viewport.height;
        this.pdfConvas.width = viewport.width;

        this.renderContext = {
            canvasContext: context,
            viewport: viewport
        };
        this.renderTask = data.render(this.renderContext);


    }

    /** --pageFailure--
    *   page failure handler
    **/
    pageFailure  (data) {
        this.logService.log("--fail page--");
        this.logService.log(data);
    }
    
    /** --clicknext--
    *   click event of next/perv/goto last/gotofirst
    **/
    public loadPageNumber(pagenumer) {
        this.currentPage += pagenumer;
        this.pdf.getPage(this.currentPage).then(response => this.pageSuccess(response), faiure => this.pageFailure(faiure));
    }
    /** --gotopage--
    *   goto given page number
    **/
    public gotopage(pagenumer) {
        this.pdf.getPage(this.currentPage).then(response => this.pageSuccess(response), faiure => this.pageFailure(faiure));
    }  
}