export default class WvTimeLogListStore {
    isDebug: boolean = false;
    records:  Array<Object>= new Array<Object>();
    currentUser:  Object = null;
    relatedRecords:string = null;
    siteRootUrl = "http://localhost:2202";
    reloadPostIndex: number = 1;
    isBillable:boolean = true;
 }