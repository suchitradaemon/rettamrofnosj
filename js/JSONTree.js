var JSONTree=function(root,respRoot,json){
	this.ARRAY='array';this.OBJECT='object';this.LEAF='leaf';this.SAMPLE='sample';
	this.root=root;
	this.respRoot=respRoot;
	var container=document.createElement("div");this.container=container;
	this.root.appendChild(this.container);
	var respContainer=document.createElement("div");this.respContainer=respContainer;
	this.respRoot.appendChild(this.respContainer);
	var obj=null;
	if(IsJsonString(json)){obj=JSON.parse(json);}
	else if('object'==typeof(json)){obj=json;}
	
	if(obj){
		this.addElements(obj,container,"",5);
	}
}


JSONTree.prototype.createSample=function(ObjectRoot,sample,name,log){
	if(log){
		console.log("Sample start",JSON.stringify(ObjectRoot),JSON.stringify(sample),name);
	}
	
	var that=this;
	var root=null;
	if( isArray(ObjectRoot) ) {
		var map={};
		var childType="";
		if(ObjectRoot[0]){
			//console.log("Condition",('object'==typeof(ObjectRoot[0])||isArray(ObjectRoot[0])));
			if(!('object'==typeof(ObjectRoot[0])||isArray(ObjectRoot[0]))){childType=typeof(ObjectRoot[0]);}
		}
		if(!sample){sample=[];root=sample;}
		else if(null==name||""==name){root=sample;}
		else if(!sample[name]){sample[name]=[];}
		if(name&&sample[name]){root=sample[name];}
		
		if(log){console.log("Root is ",root);}
		//console.log("ObjectRoot[0]",ObjectRoot[0],childType);
		if(ObjectRoot[0]&&""==childType){
			//console.log("Looping through each element");
			//var obj=isArray(ObjectRoot[0])?[]:{};
			for(var i=0;i<ObjectRoot.length;++i){
				var obj=null;
				obj=that.createSample(ObjectRoot[i],obj,"",true);
				console.log("Root",root,"Obj",obj);
				root.push(obj);
				console.log("After push",root);
			}
			//if(obj){root[0]=obj;}
		}else{
			root=root.concat(ObjectRoot);
		}
	}else if('object'==typeof(ObjectRoot)){
		if(!sample){sample={};root=sample;}
		else if(""==name||null==name){root=sample;}
		else if(!sample[name]){sample[name]={};}
		if(name&&sample[name]){root=sample[name];}
		for(var item in ObjectRoot){
			root=that.createSample(ObjectRoot[item],root,item);
		}
	}else{
		if(sample){sample[name]=ObjectRoot;}
	}
	if(log){console.log("Sample",sample,"Root",root);}
	//console.log("Sample end",JSON.stringify(sample));
	return sample;
}
JSONTree.prototype.indent=function(context,ObjectRoot, respContainer, name, level){
	//console.log("indent ObjectRoot ", ObjectRoot,"respContainer",respContainer);
	//console.log("Typeof ObjectRoot "+typeof(ObjectRoot));
	var element=null;
	if( isArray(ObjectRoot) ) {
		var map={};
		var childType="";
		if(ObjectRoot[0]){
			//console.log("Condition",('object'==typeof(ObjectRoot[0])||isArray(ObjectRoot[0])));
			if(!('object'==typeof(ObjectRoot[0])||isArray(ObjectRoot[0]))){childType=typeof(ObjectRoot[0]);}
		}
		element=context.createElement(context,this.ARRAY,name,level,null,childType);
		respContainer.appendChild(element);
		//console.log("ObjectRoot[0]",ObjectRoot[0],childType);
		if(ObjectRoot[0]&&""==childType){
			//console.log("Looping through each element");
			ObjectRoot.forEach(function(item){
				for(var key in item){
					context.indent(context,item[key],element.getElementsByTagName("div")[0],key,level+1);
				}	
			});
		}else{
			//console.log("In else");
			element.getElementsByTagName("div")[0].appendChild(context.createElement(context,this.SAMPLE,null,level+1,ObjectRoot));
		}
		//console.log("Map is ",map);
	}else if('object'==typeof(ObjectRoot)){
		element=context.createElement(context,this.OBJECT,name,level);
		respContainer.appendChild(element);
		for(var item in ObjectRoot){
			//console.log("item "+item+": "+typeof(ObjectRoot[item]));
			context.indent(this,ObjectRoot[item],element.getElementsByTagName("div")[0],item,level+1);
		}
	}else{
		element=context.createElement(context,this.LEAF,name,level,ObjectRoot,typeof(ObjectRoot));
		respContainer.appendChild(element);
	}
}
JSONTree.prototype.showSample=function(ObjectRoot, parent, name, level){
	var that=this;
	console.log("Typeof ObjectRoot "+isArray(ObjectRoot)?"array":typeof(ObjectRoot),"ObjectRoot ", JSON.stringify(ObjectRoot),ObjectRoot);
	var element=null;
	if( isArray(ObjectRoot) ) {
		var map={};
		var childType="";
		if(ObjectRoot[0]){
			console.log("Condition",('object'==typeof(ObjectRoot[0])||isArray(ObjectRoot[0])));
			if(!('object'==typeof(ObjectRoot[0])||isArray(ObjectRoot[0]))){childType=typeof(ObjectRoot[0]);}
		}
		//if(""==name){element=parent;}
		//else{element=that.createElement(that.ARRAY,name,level,null,childType);}
		element=that.createElement(that.ARRAY,name,level,null,childType);
		parent.appendChild(element);
		console.log("ObjectRoot[0]",ObjectRoot[0],childType);
		if(ObjectRoot[0]&&""==childType){
			console.log("Looping through each element");
			for(var i=0;i<ObjectRoot.length;++i){
				//var arrElement=that.createElement(that.ARRAY,name,level,null,childType);
				console.log("Typeof item "+isArray(ObjectRoot)?"array":typeof(ObjectRoot));
				that.showSample(ObjectRoot[i],element.getElementsByTagName("div")[0],"",level+1);
			}
			/*ObjectRoot.forEach(function(item){
				for(var key in item){
					if(!map[key]){
						map[key]=typeof(item[key]);
						console.log(" Array item "+key+": "+typeof(item[key]),that,item[key],element,key,level+1);
						that.addElements(item[key],element.getElementsByTagName("div")[0],key,level+1);
					}
				}	
			});*/
		}else{
			console.log("In else");
			element.getElementsByTagName("div")[0].appendChild(that.createElement(that.SAMPLE,null,level+1,ObjectRoot));
		}
		console.log("Map is ",map);
	}else if('object'==typeof(ObjectRoot)){
		//if(""==name){element=parent;}
		//else{element=that.createElement(that.OBJECT,name,level);}
		element=that.createElement(that.OBJECT,name,level);
		parent.appendChild(element);
		for(var item in ObjectRoot){
			console.log("item "+item+": "+typeof(ObjectRoot[item]));
			that.showSample(ObjectRoot[item],element.getElementsByTagName("div")[0],item,level+1);
		}
	}else{
		element=that.createElement(that.LEAF,name,level,ObjectRoot,typeof(ObjectRoot));
		parent.appendChild(element);
	}
}
/*JSONTree.prototype.addElements=function(ObjectRoot, parent, name, level){
	var that=this;
	console.log("ObjectRoot ", JSON.stringify(ObjectRoot),"Parent",parent);
	console.log("Typeof ObjectRoot "+typeof(ObjectRoot));
	var element=null;
	if( isArray(ObjectRoot) ) {
		var map={};
		var childType="";
		if(ObjectRoot[0]){
			console.log("Condition",('object'==typeof(ObjectRoot[0])||isArray(ObjectRoot[0])));
			if(!('object'==typeof(ObjectRoot[0])||isArray(ObjectRoot[0]))){childType=typeof(ObjectRoot[0]);}
		}
		element=that.createElement(that.ARRAY,name,level,null,childType);
		parent.appendChild(element);
		console.log("ObjectRoot[0]",ObjectRoot[0],childType);
		if(ObjectRoot[0]&&""==childType){
			console.log("Looping through each element");
			ObjectRoot.forEach(function(item){
				for(var key in item){
					if(!map[key]){
						map[key]=typeof(item[key]);
						console.log(" Array item "+key+": "+typeof(item[key]),that,item[key],element,key,level+1);
						that.addElements(item[key],element.getElementsByTagName("div")[0],key,level+1);
					}
				}	
			});
		}else{
			console.log("In else");
			element.getElementsByTagName("div")[0].appendChild(that.createElement(that.SAMPLE,null,level+1,ObjectRoot));
		}
		console.log("Map is ",map);
	}else if('object'==typeof(ObjectRoot)){
		element=that.createElement(that.OBJECT,name,level);
		console.log("Parent is ",parent);
		parent.appendChild(element);
		for(var item in ObjectRoot){
			console.log("item "+item+": "+typeof(ObjectRoot[item]));
			that.addElements(ObjectRoot[item],element.getElementsByTagName("div")[0],item,level+1);
		}
	}else{
		element=that.createElement(that.LEAF,name,level,ObjectRoot,typeof(ObjectRoot));
		parent.appendChild(element);
	}
}*/
JSONTree.prototype.addElements=function(ObjectRoot, parent, name, level){
	var that=this;
	console.log("ObjectRoot ", JSON.stringify(ObjectRoot),"Parent",parent);
	console.log("Typeof ObjectRoot "+typeof(ObjectRoot));
	var element=null;
	if( isArray(ObjectRoot) ) {
		var map={};
		var childType="";
		if(ObjectRoot[0]){
			console.log("Condition",('object'==typeof(ObjectRoot[0])||isArray(ObjectRoot[0])));
			if(!('object'==typeof(ObjectRoot[0])||isArray(ObjectRoot[0]))){childType=typeof(ObjectRoot[0]);}
		}
		element=that.createElement(that.ARRAY,name,level,null,childType);
		parent.appendChild(element);
		console.log("ObjectRoot[0]",ObjectRoot[0],childType);
		ObjectRoot.forEach(function(item){
			that.addElements(item,element.getElementsByTagName("div")[0],"",level+1);
		});
		/*if(ObjectRoot[0]&&""==childType){
			console.log("Looping through each element");
			ObjectRoot.forEach(function(item){
				for(var key in item){
					if(!map[key]){
						map[key]=typeof(item[key]);
						console.log(" Array item "+key+": "+typeof(item[key]),that,item[key],element,key,level+1);
						that.addElements(item[key],element.getElementsByTagName("div")[0],key,level+1);
					}
				}	
			});
		}else{
			console.log("In else");
			element.getElementsByTagName("div")[0].appendChild(that.createElement(that.SAMPLE,null,level+1,ObjectRoot));
		}*/
		//console.log("Map is ",map);
	}else if('object'==typeof(ObjectRoot)){
		element=that.createElement(that.OBJECT,name,level);
		console.log("Parent is ",parent);
		parent.appendChild(element);
		for(var item in ObjectRoot){
			console.log("item "+item+": "+typeof(ObjectRoot[item]));
			that.addElements(ObjectRoot[item],element.getElementsByTagName("div")[0],item,level+1);
		}
	}else{
		element=that.createElement(that.LEAF,name,level,ObjectRoot,typeof(ObjectRoot));
		parent.appendChild(element);
	}
}
JSONTree.prototype.createElement=function(type,name,level,value,datatype){
	var element=null;
	switch(type){
		case this.ARRAY:
		element=document.createElement("div");element.style.paddingLeft=level*2+"px";
		var container=document.createElement("div");container.className="treeElementHolder";
		var labelHolder=document.createElement("div");labelHolder.className="labelHolder";
		var icon=document.createElement("img");icon.src="images/collapse.png";icon.className="iconExpand";
		icon.onclick=this.clickCallback.bind(this);labelHolder.appendChild(icon);
		var label=document.createElement("label");label.innerHTML=name+" ["+(""==datatype?" ":datatype)+"]";label.className="elementLabel";
		labelHolder.appendChild(label);container.appendChild(labelHolder);
		element.appendChild(container);
		break;
		case this.OBJECT:
		element=document.createElement("div");element.style.paddingLeft=level*2+"px";
		var container=document.createElement("div");container.className="treeElementHolder";
		var labelHolder=document.createElement("div");labelHolder.className="labelHolder";
		var icon=document.createElement("img");icon.src="images/collapse.png";icon.className="iconExpand";
		icon.onclick=this.clickCallback.bind(this);labelHolder.appendChild(icon);
		var label=document.createElement("label");label.innerHTML=name+" { }";label.className="elementLabel";
		labelHolder.appendChild(label);container.appendChild(labelHolder);
		element.appendChild(container);
		break;
		case this.LEAF:
		element=document.createElement("div");element.style.paddingLeft=(level*2+2)+"px";
		var labelHolder=document.createElement("div");labelHolder.className="labelHolder";
		var label=document.createElement("label");label.innerHTML=name +" ("+datatype+") ";label.className="elementLabel";
		labelHolder.appendChild(label);element.appendChild(labelHolder);element.title="example value: "+value;
		break;
		case this.SAMPLE:
		element=document.createElement("div");element.style.paddingLeft=(level*2+2)+"px";
		var labelHolder=document.createElement("div");labelHolder.className="exampleHolder";
		var label=document.createElement("label");/*label.innerHTML=name +" ("+datatype+") ";*/label.className="elementLabel";
		var innerHTML="";value.forEach(function(val){innerHTML+=((innerHTML?", ":"")+val);});label.innerHTML="e.g. "+innerHTML;
		labelHolder.appendChild(label);element.appendChild(labelHolder);element.title="example value: "+value;
		break;
	}
	console.log("Element is ",element);
	return element;
}
/*JSONTree.prototype.createElement=function(type,name,level,value,datatype){
	var element=null;
	switch(type){
		case this.ARRAY:
		element=document.createElement("div");element.style.paddingLeft=level*2+"px";
		var container=document.createElement("div");container.className="treeElementHolder";
		var labelHolder=document.createElement("div");labelHolder.className="labelHolder";
		var icon=document.createElement("img");icon.src="images/collapse.png";icon.className="iconExpand";
		icon.onclick=this.clickCallback.bind(this);labelHolder.appendChild(icon);
		var label=document.createElement("label");label.innerHTML=name+" ["+(""==datatype?" ":datatype)+"]";label.className="elementLabel";
		labelHolder.appendChild(label);container.appendChild(labelHolder);
		element.appendChild(container);
		break;
		case this.OBJECT:
		element=document.createElement("div");element.style.paddingLeft=level*2+"px";
		var container=document.createElement("div");container.className="treeElementHolder";
		var labelHolder=document.createElement("div");labelHolder.className="labelHolder";
		var icon=document.createElement("img");icon.src="images/collapse.png";icon.className="iconExpand";
		icon.onclick=this.clickCallback.bind(this);labelHolder.appendChild(icon);
		var label=document.createElement("label");label.innerHTML=name+" { }";label.className="elementLabel";
		labelHolder.appendChild(label);container.appendChild(labelHolder);
		element.appendChild(container);
		break;
		case this.LEAF:
		element=document.createElement("div");element.style.paddingLeft=(level*2+2)+"px";
		var labelHolder=document.createElement("div");labelHolder.className="labelHolder";
		var label=document.createElement("label");label.innerHTML=name +" ("+datatype+") ";label.className="elementLabel";
		labelHolder.appendChild(label);element.appendChild(labelHolder);element.title="example value: "+value;
		break;
		case this.SAMPLE:
		element=document.createElement("div");element.style.paddingLeft=(level*2+2)+"px";
		var labelHolder=document.createElement("div");labelHolder.className="exampleHolder";
		var label=document.createElement("label");label.className="elementLabel";
		var innerHTML="";value.forEach(function(val){innerHTML+=((innerHTML?", ":"")+val);});label.innerHTML="e.g. "+innerHTML;
		labelHolder.appendChild(label);element.appendChild(labelHolder);element.title="example value: "+value;
		break;
	}
	console.log("Element is ",element);
	return element;
}*/
JSONTree.prototype.clickCallback=function(event){
	console.log("Click ",event,'img'==event.target.tagName.toLowerCase());
	if('img'==event.target.tagName.toLowerCase()){
		console.log("className is "+event.target.className,'iconCollapse'==event.target.className);
		if('iconCollapse'==event.target.className){this.expand(event.target);}
		else{this.collapse(event.target);}
	}
}
JSONTree.prototype.collapse=function(image){
	var siblingDivs=Array.from(image.parentNode.parentNode.childNodes).filter(function(node){return image.parentNode!=node&&'div'.toLowerCase()==node.tagName.toLowerCase();}).
		forEach(function(div){div.className='hide';});
		image.className='iconCollapse';
	console.log("Changed classname to iconCollapse");
}
JSONTree.prototype.collapseAll=function(){
	this.clickButtonsWithClass("iconExpand");
}
JSONTree.prototype.clickButtonsWithClass=function(className){
	var x = Array.from(document.getElementsByClassName(className));
	x.forEach(function(button){button.click();})
}
JSONTree.prototype.expand=function(image){
	var siblingDivs=Array.from(image.parentNode.parentNode.childNodes).filter(function(node){return image.parentNode!=node&&'div'.toLowerCase()==node.tagName.toLowerCase();}).
		forEach(function(div){div.className='';});
	image.className='iconExpand';
	console.log("Changed classname to iconExpand");
}
JSONTree.prototype.expandAll=function(){
	this.clickButtonsWithClass("iconCollapse");
}

