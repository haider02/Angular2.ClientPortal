"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = require('@angular/core');
var logging_1 = require('../common/logging');
var PdfViewerComponent = (function () {
    //#endregion 
    /** --Constructor--
    *   Initilizing local variables
    **/
    function PdfViewerComponent(_logservice) {
        /** --Property Segment--
        * List of the properties.
        **/
        this.pdfPath = "";
        this.ViewPDF = new core_1.EventEmitter();
        this.scale = 1.0;
        this.totalPages = 0;
        this.currentPage = 1;
        this.logService = _logservice;
        this.logService.log(PDFJS);
    }
    /** --ngOnChanges--
    *   Recieve changes from parent model (path of PDF file), and triggers related functions
    **/
    PdfViewerComponent.prototype.ngOnChanges = function () {
        this.loadPDF(this.pdfPath);
        this.currentPage = 1;
        this.logService.log(this.totalPages);
    };
    /** --ngOnInit--
    *   Loads PDF on init
    **/
    PdfViewerComponent.prototype.ngOnInit = function () {
        this.loadPDF(this.pdfPath);
        this.logService.log(this.pdfPath);
    };
    /** --LoadPDF--
    *   PDF loader
    **/
    PdfViewerComponent.prototype.loadPDF = function (path) {
        var _this = this;
        this.logService.log('LoadPDF');
        PDFJS.getDocument(path).then(function (response) { return _this.pdfsuccess(response); }, this.pdfFailure);
        this.logService.log('LoadPDF');
    };
    /** --LoadPDF--
    *   PDF success handler
    **/
    PdfViewerComponent.prototype.pdfsuccess = function (data) {
        var _this = this;
        this.pdf = data;
        this.logService.log('successPDF');
        this.logService.log(data);
        this.totalPages = this.pdf.numPages;
        this.pdf.getPage(1).then(function (response) { return _this.pageSuccess(response); }, function (faiure) { return _this.pageFailure(faiure); });
        this.logService.log('successPDF');
    };
    /** --pdfFailure--
    *   PDF failure handler
    **/
    PdfViewerComponent.prototype.pdfFailure = function (data) {
        this.logService.log("--fail--");
        this.logService.log(data);
    };
    /** --pageSuccess--
    *   page success handler
    **/
    PdfViewerComponent.prototype.pageSuccess = function (data) {
        if (this.renderTask) {
            this.renderTask.cancel();
        }
        this.logService.log('loadpagesucess');
        this.logService.log(data);
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
    };
    /** --pageFailure--
    *   page failure handler
    **/
    PdfViewerComponent.prototype.pageFailure = function (data) {
        this.logService.log("--fail page--");
        this.logService.log(data);
    };
    /** --clicknext--
    *   click event of next/perv/goto last/gotofirst
    **/
    PdfViewerComponent.prototype.loadPageNumber = function (pagenumer) {
        var _this = this;
        this.currentPage += pagenumer;
        this.pdf.getPage(this.currentPage).then(function (response) { return _this.pageSuccess(response); }, function (faiure) { return _this.pageFailure(faiure); });
    };
    /** --gotopage--
    *   goto given page number
    **/
    PdfViewerComponent.prototype.gotopage = function (pagenumer) {
        var _this = this;
        this.pdf.getPage(this.currentPage).then(function (response) { return _this.pageSuccess(response); }, function (faiure) { return _this.pageFailure(faiure); });
    };
    __decorate([
        core_1.Input()
    ], PdfViewerComponent.prototype, "pdfPath", void 0);
    __decorate([
        core_1.Output()
    ], PdfViewerComponent.prototype, "ViewPDF", void 0);
    PdfViewerComponent = __decorate([
        core_1.Component({
            selector: 'pdf-viewer',
            templateUrl: '../dev/tpl/pdf-viewer.html'
        }),
        __param(0, core_1.Inject(logging_1.LoggingService))
    ], PdfViewerComponent);
    return PdfViewerComponent;
}());
exports.PdfViewerComponent = PdfViewerComponent;
//# sourceMappingURL=pdf-viewer.component.js.map