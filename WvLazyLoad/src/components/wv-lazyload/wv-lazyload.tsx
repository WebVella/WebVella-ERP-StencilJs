import { Component, Prop,State } from '@stencil/core';
import axios from 'axios';

function ErrorScreen(props){
  return(
    <div class="go-red">{props.error}</div>
  )
}

function ComponentBody(props){
  let scope = props.scope;
  if(scope.error){
    return(
      <ErrorScreen error={scope.error}/>
    )    
  }
  else{
    return(
      <div id={"lazyload-" + scope.nodeId}></div>
    )
  }
}

//Thanks to https://ghinda.net/article/script-tags/ for the following code of running injected scripts
////////////////////////////////////////////////////////////////////////////////
// runs an array of async functions in sequential order
function seq (arr, callback, index) {
  // first call, without an index
  if (typeof index === 'undefined') {
    index = 0
  }
  if(!arr[index]){
    return;
  }
  arr[index](function () {
    index++
    if (index === arr.length) {
      callback();
    } else {
      seq(arr, callback, index)
    }
  })
}

// trigger DOMContentLoaded
function scriptsDone () {
  var DOMContentLoadedEvent = document.createEvent('Event')
  DOMContentLoadedEvent.initEvent('DOMContentLoaded', true, true)
  document.dispatchEvent(DOMContentLoadedEvent)
}

/* script runner
 */

function insertScript ($script, callback) {
  var s = document.createElement('script')
  s.type = 'text/javascript'
  if ($script.src) {
    s.onload = callback
    s.onerror = callback
    s.src = $script.src
  } else {
    s.textContent = $script.innerText
  }

  // re-insert the script tag so it executes.
  document.head.appendChild(s)

  // clean-up
  $script.parentNode.removeChild($script)

  // run the callback immediately for inline scripts
  if (!$script.src) {
    callback()
  }
}

// https://html.spec.whatwg.org/multipage/scripting.html
var runScriptTypes = [
  'application/javascript',
  'application/ecmascript',
  'application/x-ecmascript',
  'application/x-javascript',
  'text/ecmascript',
  'text/javascript',
  'text/javascript1.0',
  'text/javascript1.1',
  'text/javascript1.2',
  'text/javascript1.3',
  'text/javascript1.4',
  'text/javascript1.5',
  'text/jscript',
  'text/livescript',
  'text/x-ecmascript',
  'text/x-javascript'
]

function runScripts ($container) {
  // get scripts tags from a node
  var $scripts = $container.querySelectorAll('script')
  var runList = []
  var typeAttr

  [].forEach.call($scripts, function ($script) {
    typeAttr = $script.getAttribute('type')

    // only run script tags without the type attribute
    // or with a javascript mime attribute value
    if (!typeAttr || runScriptTypes.indexOf(typeAttr) !== -1) {
      runList.push(function (callback) {
        insertScript($script, callback)
      })
    }
  })

  // insert the script tags sequentially
  // to preserve execution order
  seq(runList, scriptsDone,0)
}
////////////////////////////////////////////////////////////////////////////

function ComponentLoadedCallback(scope){
  let injectTarget = document.querySelector("#lazyload-" + scope.nodeId);
  if(injectTarget){
    var injectorDiv = document.createElement("div");
    injectorDiv.setAttribute("id", "lazyload-injector-" + scope.nodeId);
    injectorDiv.innerHTML = scope.viewHtml;
    injectTarget.appendChild(injectorDiv);
    runScripts(injectorDiv);
  }
}

@Component({
  tag: 'wv-lazyload'
})
export class MyComponent {
  @Prop() componentName: string;
  @Prop() siteRootUrl: string;
  @Prop() pageId: string;
  @Prop() nodeId: string;
  @Prop() nodeOptions: string;
  @Prop() recordId: string;
  @Prop() entityId: string;
  @State() isLoading: boolean = true;
  @State() viewHtml: string;
  @State() error:string = "";


  componentWillLoad(){
    let scope = this;
    scope.isLoading = true;
    scope.viewHtml = "";
    let requestConfig = {
      headers: {
          'Content-Type': 'application/json;charset=UTF-8',
          "Access-Control-Allow-Origin": "*",
      }
    };
    let apiUrl = scope.siteRootUrl + "/api/v3.0/pc/" + scope.componentName + "/view/display?nid=" + scope.nodeId + "&pid=" + scope.pageId ;    
    let options = JSON.parse(scope.nodeOptions);
    axios.post(apiUrl,options,requestConfig)
    .then(function (response) {
      scope.viewHtml = response.data;
      scope.isLoading = false;
      window.setTimeout(function(){
        ComponentLoadedCallback(scope);
      },100);         
    })
    .catch(function (error) {
      if(error.response){
        scope.error = error.response.statusText + ":" +  error.response.data;
        }
        else{
          scope.error = error.message;
        }
        scope.isLoading = false;      
    })
  }

  render() {
    if(this.isLoading){
      return <div class="loading-panel">Loading...</div>
    }
    return (
      <ComponentBody scope={this}></ComponentBody>
    );
  }
}
