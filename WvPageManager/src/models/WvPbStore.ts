export default class WvPbStore {
    library:  Array<Object>= new Array<Object>();
    pageNodes: Array<Object> = new Array<Object>();
    pageId:string = null;
    siteRootUrl: string = null;
    drake:Object = new Object();
    activeNodeId: string = null;
    hoveredNodeId: string = null;
    hoveredContainerId: string = null;    
    pageNodeChangeIndex: number = 1;
    isCreateModalVisible: boolean = false;
    createdNode: Object = new Object as any;
    isOptionsModalVisible: boolean = false;
    isHelpModalVisible: boolean = false;
    reloadNodeIdList:Array<string> = new Array<string>();
    componentMeta:Object = new Object() as any;
    recordId:string = null;
 }