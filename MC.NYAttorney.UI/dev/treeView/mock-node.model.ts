import {TreeNodeModel} from '../treeView/tree-node.model';

export class MockDocuments {
    p: TreeNodeModel = new TreeNodeModel(-1, "", false,"");
    private MainNode = new TreeNodeModel(1, "Main", false, "");
   
    public getdocs(): TreeNodeModel {
        this.MainNode.expanded = true;
        this.MainNode.childNodes = this.getLvl_1_Node();
        this.p.childNodes = [this.MainNode]
        return this.p;
    }
    private getNode() {
        var temp = new TreeNodeModel(1, "Main", false,"");
    }
    private getLvl_1_Node(): Array<TreeNodeModel> {
        var temp = new TreeNodeModel(1, "Main_Child_1", false,"");
        temp.childNodes = [new TreeNodeModel(1, "Main_Child_1_child_1", true, "/pdf/test.pdf"),
            new TreeNodeModel(1, "Main_Child_1_child_2", true, "/pdf/1.pdf"),
            new TreeNodeModel(1, "Main_Child_1_child_3", true, "/pdf/2.pdf")];
        var temp1 = new TreeNodeModel(1, "Main_Child_2", true, "/pdf/3.pdf");
        var temp2 = new TreeNodeModel(1, "Main_Child_3", true, "/pdf/4.pdf");
        var temp3 = new TreeNodeModel(1, "Main_Child_4", true, "/pdf/5.pdf");
        var moc: TreeNodeModel[] = [temp, temp1, temp2, temp3];
        return moc;
    }
}