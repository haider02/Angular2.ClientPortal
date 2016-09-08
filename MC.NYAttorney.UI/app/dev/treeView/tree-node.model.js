"use strict";
var TreeNodeModel = (function () {
    function TreeNodeModel(id, name, isLeaf, path) {
        this.isClicked = false;
        this.islocked = false;
        this.nodeId = id;
        this.nodeName = name;
        this.isLeaf = isLeaf;
        this.childNodes = null;
        this.FilePath = path;
    }
    TreeNodeModel.prototype.toggle = function () {
        this.expanded = !this.expanded;
        this.nodeclick();
    };
    TreeNodeModel.prototype.nodeclick = function () {
    };
    TreeNodeModel.prototype.rightClick = function () { alert("right clicked on : " + this.nodeName); };
    TreeNodeModel.prototype.check = function () {
        var newState = !this.checked;
        this.checked = newState;
        this.checkRecursive(newState);
    };
    TreeNodeModel.prototype.checkRecursive = function (state) {
        if (this.childNodes !== null) {
            this.childNodes.forEach(function (d) {
                d.checked = state;
                d.checkRecursive(state);
            });
        }
    };
    return TreeNodeModel;
}());
exports.TreeNodeModel = TreeNodeModel;
//# sourceMappingURL=tree-node.model.js.map