
export class TreeNodeModel {

    public nodeId: number;
    public parentId: number;
    public ID2: number;
    public ID1: number;
    public DocTypeID: number;
    public RowId: number;
    public Description: string;
    public DocDescription: string;
    public nodeName: string;
    public childNodes: Array<TreeNodeModel>;
    public nodeType: string;
    public isLeaf: boolean;
    public ischecked: boolean;
    public File: any;
    public isClicked = false;
    public islocked = false;
    public FilePath: string;
    public DocumentFolder: string;
    public UploadfromWeb: boolean;
    public UploadBy: string;
    checked: boolean;
    showCheckBox: boolean;
    expanded: boolean;

    constructor(id: number, name: string, isLeaf: boolean, path: string) {
        this.nodeId = id;
        this.nodeName = name;
        this.isLeaf = isLeaf;
        this.childNodes = null;
        this.FilePath = path;
    }

    public toggle() {
        this.expanded = !this.expanded;
        this.nodeclick();
    }
    public nodeclick() {
        
    }
    public rightClick() { alert("right clicked on : " + this.nodeName); }


    check() {
        let newState = !this.checked;
        this.checked = newState;
        this.checkRecursive(newState);
    }

    checkRecursive(state) {
        if (this.childNodes !== null) {
            this.childNodes.forEach(d => {
                d.checked = state;
                d.checkRecursive(state);
            })
        }
    }
}