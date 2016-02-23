var TemplateToolbar=function(root){
	this.root=root;
	var that=this;
	var container=document.createElement("div");container.className="toolbar";
	this.container=container;
	var expand=document.createElement("button");expand.innerHTML="[ + ]";expand.className="expandAll";
	this.expand=expand;
	var collapse=document.createElement("button");collapse.innerHTML="[ - ]";collapse.className="collapseAll";
	this.collapse=collapse;
	this.container.appendChild(this.expand);
	this.container.appendChild(this.collapse);
	this.root.appendChild(this.container);
}
TemplateToolbar.prototype.setExpandCallback=function(callback){this.expandCallBack=callback;this.expand.onclick=callback;}
TemplateToolbar.prototype.setCollapseCallback=function(callback){this.collapseCallBack=callback;this.collapse.onclick=callback;}