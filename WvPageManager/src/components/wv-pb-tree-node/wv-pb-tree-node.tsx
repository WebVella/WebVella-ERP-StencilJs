import { Component, Prop,State } from '@stencil/core';
import { Store,Action } from '@stencil/redux';
import * as action from '../../store/actions';
import _ from 'lodash';


function GetChildNodes(scope) : Array<Object>{
    let childNodes : Array<Object> = new Array<Object>();
    let pageNodes = scope.store.getState().pageNodes;
    let nodeId = scope.node["id"];
    _.forEach(pageNodes,function(node){
        if(nodeId && node["parent_id"] && nodeId.toLowerCase() === node["parent_id"].toLowerCase() && nodeId.toLowerCase() !== node["id"].toLowerCase()){
            childNodes.push(node);
        }
    });  
    return _.sortBy(childNodes,['weight']);
}

function GetMeta(scope){
    let library = scope.store.getState().library;
    let metaIndex = _.findIndex(library,(x) => x["name"] === scope.node["component_name"]);
    if(metaIndex > -1){
        return library[metaIndex];
    }
    return null;
}

@Component({
    tag: 'wv-pb-tree-node'
  })

  export class WvPbTreeNode {
    @Prop({ context: 'store' }) store: Store;
    @Prop() node:Object;
    @Prop() level:number = 0;

    @State() activeNodeId:string = null;
    @State() hoveredNodeId:string = null;
    @State() pageNodeChangeIndex: number = 1;

    setActiveNode:Action;
    hoverNode:Action;

    componentWillLoad() {
        let scope = this;
        //Connect store
        scope.store.mapStateToProps(this, (state) => {
            return { 
                activeNodeId:state.activeNodeId,
                hoveredNodeId: state.hoveredNodeId,
                pageNodeChangeIndex:state.pageNodeChangeIndex
            };
        });      
        scope.store.mapDispatchToProps(this, {
            setActiveNode: action.setActiveNode,
            hoverNode: action.hoverNode
        });
      }  

    nodeClickHandler(event){
        event.preventDefault();
        event.stopPropagation();
        this.setActiveNode(this.node["id"]);
    }

    hoverNodeHandler(event){
        event.preventDefault();
        event.stopPropagation();
        this.hoverNode(this.node["id"]);
    }    

    unhoverNodeHandler(event){
        event.preventDefault();
        event.stopPropagation();
        this.hoverNode(null);
    }        

    render() {
        let scope = this;
        let componentMeta = GetMeta(scope);
        let childNodes = GetChildNodes(scope);
        let iconClass = "ti-file";
        if(componentMeta["icon_class"]){
            iconClass = componentMeta["icon_class"];
        }

        let activeClass = "";
        if(scope.activeNodeId && scope.activeNodeId === scope.node["id"]){
            activeClass = " selected";
        }    

        let hoveredClass = "";
        if(scope.hoveredNodeId && scope.hoveredNodeId === scope.node["id"]){
            hoveredClass = " hovered";
        }            
        let paddingLeftString = "15px";
        if(scope.level === 0){
            paddingLeftString = "0px";
        }
        let nodeContainers = new Array<string>();
        _.forEach(childNodes,function(node){
            let ncId = node["container_id"];
            let ncIdIndex = _.findIndex(nodeContainers,function(record){return record === ncId});
            if(ncIdIndex === -1){
                nodeContainers.push(ncId);
            }
        });
        nodeContainers = _.sortBy(nodeContainers);
        if(nodeContainers.length < 2){
            return(
                <div class={"tree-node level-" + (scope.level) + activeClass + hoveredClass} 
                    style={{paddingLeft:paddingLeftString}}
                    onClick={(event: UIEvent) => scope.nodeClickHandler(event)}>
                    <div class="header"
                    onMouseEnter={(event: UIEvent) => scope.hoverNodeHandler(event)}
                    onMouseLeave={(event: UIEvent) => scope.unhoverNodeHandler(event)}>
                        <span class={"icon " + iconClass}></span>
                        <span class="name">{componentMeta["label"]}</span>
                    </div>
                    <div>
                        {
                        childNodes.map(function(childNode){
                            return(
                                <wv-pb-tree-node key={childNode["id"]} node={childNode} level={scope.level + 1}></wv-pb-tree-node>
                            )
                        })
                        }  
                    </div>
                </div>            
            )
        }
        else{
            return(
                <div class={"tree-node level-" + (scope.level) + activeClass + hoveredClass} 
                    style={{paddingLeft:paddingLeftString}}
                    onClick={(event: UIEvent) => scope.nodeClickHandler(event)}>
                    <div class="header"
                    onMouseEnter={(event: UIEvent) => scope.hoverNodeHandler(event)}
                    onMouseLeave={(event: UIEvent) => scope.unhoverNodeHandler(event)}>
                        <span class={"icon " + iconClass}></span>
                        <span class="name">{componentMeta["label"]}</span>
                    </div>
                    {
                    nodeContainers.map(function(container){
                        return(
                            <div key={container["id"]}>
                                <div style={{paddingLeft:"15px"}} class="go-teal">{container}</div>
                                {
                                childNodes.map(function(childNode){
                                    if(childNode["container_id"] === container){
                                        return(
                                            <wv-pb-tree-node key={childNode["id"]} node={childNode} level={scope.level + 1}></wv-pb-tree-node>
                                        )
                                    }
                                    else{
                                        return null
                                    }
                                })
                                }  
                            </div>
                            )
                        })
                    }
                </div>            
            )          
        }
    }

  }