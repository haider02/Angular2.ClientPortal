"use strict";
var tree_node_model_1 = require('../treeView/tree-node.model');
var MockDocuments = (function () {
    function MockDocuments() {
        this.p = new tree_node_model_1.TreeNodeModel(-1, "", false, "");
        this.MainNode = new tree_node_model_1.TreeNodeModel(1, "Main", false, "");
    }
    MockDocuments.prototype.getdocs = function () {
        this.MainNode.expanded = true;
        this.MainNode.childNodes = this.getLvl_1_Node();
        this.p.childNodes = [this.MainNode];
        return this.p;
    };
    MockDocuments.prototype.getNode = function () {
        var temp = new tree_node_model_1.TreeNodeModel(1, "Main", false, "");
    };
    MockDocuments.prototype.getLvl_1_Node = function () {
        var temp = new tree_node_model_1.TreeNodeModel(1, "Main_Child_1", false, "");
        temp.childNodes = [new tree_node_model_1.TreeNodeModel(1, "Main_Child_1_child_1", true, "/pdf/test.pdf"),
            new tree_node_model_1.TreeNodeModel(1, "Main_Child_1_child_2", true, "/pdf/1.pdf"),
            new tree_node_model_1.TreeNodeModel(1, "Main_Child_1_child_3", true, "/pdf/2.pdf")];
        var temp1 = new tree_node_model_1.TreeNodeModel(1, "Main_Child_2", true, "/pdf/3.pdf");
        var temp2 = new tree_node_model_1.TreeNodeModel(1, "Main_Child_3", true, "/pdf/4.pdf");
        var temp3 = new tree_node_model_1.TreeNodeModel(1, "Main_Child_4", true, "/pdf/5.pdf");
        var moc = [temp, temp1, temp2, temp3];
        return moc;
    };
    return MockDocuments;
}());
exports.MockDocuments = MockDocuments;
//# sourceMappingURL=mock-node.model.js.map