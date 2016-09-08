var Observable_1 = require('rxjs/Observable');
var HTTPService = (function () {
    function HTTPService() {
    }
    HTTPService.prototype.handleError = function (error) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable_1.Observable.throw(error.json().error || 'Server error');
    };
    return HTTPService;
})();
exports.HTTPService = HTTPService;
//# sourceMappingURL=http-service.js.map