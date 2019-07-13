export default class WvPostListStore {
    isDebug: boolean = false;
    posts:  Array<Object>= new Array<Object>();
    currentUser:  Object = null;
    editorConfig: Object = null;
    relatedRecordId:string = null;
    relatedRecords:string = null;
    siteRootUrl = "http://localhost:2202";
    reloadPostIndex: number = 1;
 }