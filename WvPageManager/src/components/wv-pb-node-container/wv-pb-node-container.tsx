import { Component,Prop,State,Watch } from '@stencil/core';
import { Store,Action } from '@stencil/redux';
import * as action from '../../store/actions';
import _ from "lodash";
import guid from "../../utils/guid";

function GetContainerNodes(parentNodeId: string, containerId: string, pageNodes: Array<Object>) : Array<Object>{
    let containerNodes : Array<Object> = new Array<Object>();
    _.forEach(pageNodes,function(node){
        if(!parentNodeId && !node["parent_id"]){
            if(!containerId && !node["container_id"]){
                containerNodes.push(node);
            }
            else if(containerId && node["container_id"] && containerId.toLowerCase() === node["container_id"].toLowerCase()){
                containerNodes.push(node);
            }  
        }
        else if(parentNodeId && node["parent_id"] && parentNodeId.toLowerCase() === node["parent_id"].toLowerCase()){
            if(!containerId && !node["container_id"]){
                containerNodes.push(node);
            }
            else if(containerId && node["container_id"] && containerId.toLowerCase() === node["container_id"].toLowerCase()){
                containerNodes.push(node);
            }  
        }
      
    });  
    if(containerNodes.length === 0){
        
    }    
    return _.sortBy(containerNodes,['weight']);
}

@Component({
    tag: 'wv-pb-node-container'
  })

  export class WvContainer {
    @Prop({ context: 'store' }) store: Store;
    @Prop() containerId:string = null;
    @Prop() parentNodeId:string = null;

    @State() activeNodeId:string;
    @State() hoveredNodeId:string;
    @State() hoveredContainerId:string;
    @State() pageNodeChangeIndex:string;

    addDrakeContainerId:Action;
    setActiveNode:Action;
    hoverNode:Action;
    hoverContainer:Action;
    setNodeCreation:Action;
    addReloadNodeIds:Action;

    componentWillLoad() {
        //Connect store
        this.store.mapStateToProps(this, (state) => {
            return { 
                activeNodeId:state.activeNodeId,
                hoveredNodeId:state.hoveredNodeId,
                hoveredContainerId:state.hoveredContainerId,
                pageNodeChangeIndex:state.pageNodeChangeIndex
            };
        });           
        this.store.mapDispatchToProps(this, {
            addDrakeContainerId:action.addDrakeContainerId,
            hoverContainer:action.hoverContainer,
            hoverNode:action.hoverNode,
            setActiveNode:action.setActiveNode,
            setNodeCreation:action.setNodeCreation,
            addReloadNodeIds:action.addReloadNodeIds            
          });
    }

    componentDidLoad() {
        let scope = this;
        scope.addDrakeContainerId("wv-container-" + scope.parentNodeId + "-" + scope.containerId);
        let containerNodes = GetContainerNodes(scope.parentNodeId,scope.containerId,scope.store.getState().pageNodes);
        let loadNodeIdList = new Array<string>();
        _.forEach(containerNodes,function(childNode){
            loadNodeIdList.push(childNode["id"]);
        });
        scope.addReloadNodeIds(loadNodeIdList);

    }

    @Watch("pageNodeChangeIndex")
    pageNodeIndexChangeHandler(){
        //Container needs to be reinited when removed and rendered again so drake can attach proper listeners
        let scope = this;
        //Check if the curent container is not in the drake containers list and add it
        let containerHtmlId = "wv-container-" + scope.parentNodeId + "-" + scope.containerId;
        let container = document.getElementById(containerHtmlId)
        if(container){
            let drake = scope.store.getState().drake;
            let drakeContainers = drake.containers;
            let currentDrakeIndex = _.findIndex(drakeContainers,function(drakeContainer){return drakeContainer.id === containerHtmlId});
            if(currentDrakeIndex == -1){
                //console.log("container added");
                drake.containers.push(container);
            }
        }
    }

    hoverContainerHandler(event){
        event.preventDefault();
        event.stopPropagation();
        let containerId = "wv-container-" + this.parentNodeId + "-" + this.containerId;
        this.hoverContainer(containerId);
    }    

    unhoverContainerHandler(event){
        event.preventDefault();
        event.stopPropagation();

        
        let closestHovarableNode = event.target.parentNode.closest(".wv-pb-node.hovarable");
        if(closestHovarableNode){
            let elNodeIdAttr = closestHovarableNode.attributes["data-node-id"];
            if(elNodeIdAttr){
                this.hoverNode(elNodeIdAttr.value);
            }
        }       
        else{
            this.hoverContainer(null);
        }
    }  

    nodeClickHandler(event,nodeId){
        event.preventDefault();
        event.stopPropagation();
        this.setActiveNode(nodeId);
    }   

    hoverNodeHandler(event){
        event.preventDefault();
        event.stopPropagation();
        let nodeId = event.target.getAttribute("data-node-id");
        this.hoverNode(nodeId);
    }    

    unhoverNodeHandler(event){
        event.preventDefault();
        event.stopPropagation();
        let closestHovarableContainer = event.target.parentNode.closest(".wv-container-inner.hovarable");
        if(closestHovarableContainer){
            let elNodeIdAttr = closestHovarableContainer.attributes["data-container-id"];
            if(elNodeIdAttr){
                this.hoverContainer(elNodeIdAttr.value);
            }
        }
        else{
            this.hoverNode(null);
        }
    }  

    addNodeHandler(event  : UIEvent){
        event.preventDefault();
        event.stopPropagation();
        let biggestWeight = 0;
        let containerNodes = GetContainerNodes(this.parentNodeId,this.containerId,this.store.getState().pageNodes);
        _.forEach(containerNodes,function(node){
            if(node["weight"] > biggestWeight){
                biggestWeight = node["weight"];
            }
        });
        let nodeObj = {
            id:guid.newGuid(),
            container_id: this.containerId,
            parent_id: this.parentNodeId,
            weight: biggestWeight +1,
            page_id: this.store.getState().pageId,
            component_name:null,
            node_id:null,
            options:{},
            nodes:[]            
        };
        this.setNodeCreation(nodeObj);
    }    

    render() {
        let scope = this;
        let containerNodes = GetContainerNodes(scope.parentNodeId,scope.containerId,scope.store.getState().pageNodes);
        let containerElId = "wv-container-" + scope.parentNodeId + "-" + scope.containerId;
        let containerClass = "";
        if(!scope.containerId){
            containerClass += " first";
        }       
        if(scope.hoveredContainerId == containerElId){
            containerClass += " hovered";
        }
        if(containerNodes.length === 0){
            containerClass += " empty";
        }  
        let componentMeta = scope.store.getState().componentMeta;
        return(
            <div class={"wv-container-inner hovarable " + containerClass}  onClick={(e) => this.addNodeHandler(e)}
            onMouseEnter={(event: UIEvent) => scope.hoverContainerHandler(event)}
            onMouseLeave={(event: UIEvent) => scope.unhoverContainerHandler(event)} data-container-id={containerElId}>
                <div class="actions"><i class="fa fa-plus go-green"></i> add in {scope.containerId}</div>
                <div class="wv-container" id={containerElId}
                    data-parent-id={scope.parentNodeId}
                    data-container-id={scope.containerId}>
                {
                    containerNodes.map(function(node){
                        let nodeClass= "";
                        if(scope.activeNodeId && node["id"] === scope.activeNodeId){
                            nodeClass += " selected";
                        }                        
                        if(scope.hoveredNodeId && node["id"] === scope.hoveredNodeId && !scope.hoveredContainerId){
                            nodeClass += " hovered";
                        }       
                        if(componentMeta[node["component_name"]]["is_inline"]){
                            nodeClass += " d-inline-block";
                        }                                            
                        return(
                            <div key={node["id"]} id={"wv-node-" + node["id"]} class={"wv-node-wrapper draggable-node hovarable " + nodeClass}
                                data-node-id={node["id"]} data-page-id={node["page_id"]}
                                onClick={(event: UIEvent) => scope.nodeClickHandler(event,node["id"])} 
                                onMouseEnter={(event: UIEvent) => scope.hoverNodeHandler(event)}
                                onMouseLeave={(event: UIEvent) => scope.unhoverNodeHandler(event)}>
                                <div class="actions"><i class="fa fa-search go-blue"></i> select {componentMeta[node["component_name"]]["label"]}</div>
                                <wv-pb-node nodeId={node["id"]}></wv-pb-node>
                            </div>
                        )
                    })
                }
                </div>
            </div>
        )
    }
  }  