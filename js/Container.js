var Container=function(root){
	this.root=root;
	var that=this;
	
	var container=document.createElement("div");container.id="multipleMarkerContainer";container.className="Container";
	this.container=container;
	
	var visibleContainer=document.createElement("div");visibleContainer.id="visibleContainer";visibleContainer.className="visibleContainer";
	/*visibleContainer.ondblclick=function(){
		if('visibleContainer'==that.visibleContainer.className){that.visibleContainer.className='visibleContainerFullScreen';}
		else{that.visibleContainer.className='visibleContainer';}
	}*/
	this.visibleContainer=visibleContainer;
	
	var urlLabel=document.createElement("label");urlLabel.id="urlLabel";urlLabel.className="urlLabel";
	urlLabel.ondblclick=function(){event.stopPropagation();}
	urlLabel.innerHTML="API url";this.urlLabel=urlLabel;

	var url=document.createElement("input");url.type="textbox";url.id="url";url.className="url";
	url.ondblclick=function(){event.stopPropagation();}
	//url.value="http://localhost/atomiton/airdata/devices.php";this.url=url;
	//url.value="http://localhost/atomiton/airdata/test.json";this.url=url;
	//url.value="http://localhost/git/etalpmetnosj/js/test.json";this.url=url;
	url.value="http://localhost/git/etalpmetnosj/js/test1.json";this.url=url;
	var send=document.createElement("button");send.innerHTML="send";send.className="send";
	send.onclick=this.callApi.bind(this);this.send=send;

	var urlContainer=document.createElement("div");urlContainer.id="urlContainer";urlContainer.className="urlContainer";
	urlContainer.appendChild(this.urlLabel);
	urlContainer.appendChild(this.url);
	urlContainer.appendChild(this.send);
	this.urlContainer=urlContainer;this.visibleContainer.appendChild(this.urlContainer);

	var apiResponse=document.createElement("div");apiResponse.id="apiResponse";apiResponse.className="apiResponse";this.apiResponse=apiResponse;
	/*var apiResponseToolbar=new ApiResponseToolbar(apiResponse);this.apiResponseToolbar=apiResponseToolbar;
	apiResponseToolbar.setExpandCallback(this.expandCallback.bind(this));
	apiResponseToolbar.setCollapseCallback(this.collapseCallback.bind(this));*/
	var apiContent=document.createElement("div");apiContent.id="apiContent";this.apiContent=apiContent;
	apiResponse.appendChild(apiContent);
	
	var template=document.createElement("div");template.id="template";template.className="template";this.template=template;
	var templateToolbar=new TemplateToolbar(template);this.templateToolbar=templateToolbar;
	templateToolbar.setExpandCallback(this.expandCallback.bind(this));
	templateToolbar.setCollapseCallback(this.collapseCallback.bind(this));
	var templateContent=document.createElement("div");templateContent.id="templateContent";this.templateContent=templateContent;
	template.appendChild(templateContent);
	
	this.visibleContainer.appendChild(this.template);
	this.visibleContainer.appendChild(this.apiResponse);
	this.container.appendChild(this.visibleContainer);
	this.root.appendChild(this.container);
}
Container.prototype.expandCallback=function(){if(this.responseTree){this.responseTree.expandAll();}}
Container.prototype.collapseCallback=function(){console.log("In collapseCallback");if(this.responseTree){console.log("responseTree is not null.. calling tree's collapse");this.responseTree.collapseAll();}}
Container.prototype.callApi=function(){
	var that=this;
	this.send.disabled=true;
	var url=this.url.value;
	var templateContent=this.templateContent;
	templateContent.innerHTML="";
	var apiContent=this.apiContent;
	apiContent.innerHTML="";
	var httpRequest=null;
	// Old compatibility code, no longer needed.
	if (window.XMLHttpRequest) { // Mozilla, Safari, IE7+ ...
		httpRequest = new XMLHttpRequest();
	} else if (window.ActiveXObject) { // IE 6 and older
		httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
	}
	if(httpRequest){
		
		httpRequest.onreadystatechange = function(){
			if (httpRequest.readyState === XMLHttpRequest.DONE) {
				that.send.disabled=false;
			  if (httpRequest.status === 200) {
				console.log(httpRequest.responseText);
				if(IsJsonString(httpRequest.responseText)){
					//apiResponse.innerHTML=httpRequest.responseText;
					that.responseTree=new JSONTree(templateContent,apiContent,httpRequest.responseText);
					/*function determineType(root){
						console.log("Typeof root "+typeof(root));
						
						if( Object.prototype.toString.call( root ) === '[object Array]' ) {
							var map={};
							root.forEach(function(item){
								for(var key in item){
									if(!map[key]){
										map[key]=typeof(item[key]);
										console.log(" Array item "+key+": "+typeof(item[key]));
										determineType(item[key]);
									}
								}							
							});
							console.log("Map is ",map);
						}else if('object'==typeof(root))
						for(var item in root){
							console.log("item "+item+": "+typeof(root[item]));
							determineType(root[item]);
						}
					}
					determineType(JSON.parse(httpRequest.responseText));*/
				}
				else{console.log("The response is not a valid JSON!");apiContent.innerHTML="The repsonse is not a valid JSON!";}
			  } else {
				console.log('There was a problem with the request.');
			  }
			}
		};
		httpRequest.open('GET', url);
		httpRequest.setRequestHeader('Access-Control-Allow-Origin', '*');
		httpRequest.send();
	}else{console.log("Some problem with request object!");}
}