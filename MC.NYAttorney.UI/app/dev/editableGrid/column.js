"use strict";
var Column = (function () {
    function Column(name, desc, isEditable) {
        if (isEditable === void 0) { isEditable = false; }
        this.name = name;
        this.desc = desc;
        this.isEditable = isEditable;
    }
    return Column;
}());
exports.Column = Column;
//# sourceMappingURL=column.js.map