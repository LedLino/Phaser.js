console.log("Phaser.js initiated");
(function phaser(){ 
	
	//var cacheFrame = null;
	window.cacheFrame = null;
	IE8prototypes();

	window.device = document.createElement("CACHE");
	window.cache = function(selector){return cache(selector)};
	window.async = function(args){async(args)};//{clear:false}
	window.phaser = Object();
	window.phaser.loading = false;
	window.phaser.preview = function(){preview()};
	window.phaser.render = function(){render()};
	window.phaser.clear = function(){clear()};
	if(typeof window.phaser !== undefined)
		{
		console.log("found phaser");
		window.addEventListener('load', windowready, false);
			
		} 
	window.element = function(selector){return element(selector)};
	window.phaser.urlparams = function () {
		var query_string = {};
  		var query = window.location.search.substring(1);
  		var vars = query.split("&");
 		for (var i=0;i<vars.length;i++) {
			var pair = vars[i].split("=");
        	// If first entry with this name
    		if (typeof query_string[pair[0]] === "undefined") query_string[pair[0]] = pair[1];
        	else if (typeof query_string[pair[0]] === "string") {
      			var arr = [ query_string[pair[0]], pair[1] ];
      			query_string[pair[0]] = arr;
        	// If third or later entry with this name
    		}
    		else query_string[pair[0]].push(pair[1]);
  		} 
    	return query_string;
	}
	window.phaser.runGET = function(getparam,jsfunction) {
		var p = window.phaser.urlparams()[getparam];
		if( p !== undefined && typeof window[jsfunction] == 'function') window[jsfunction](p);
	}

	function windowready() {
		console.log('windowready');
		if(typeof window.autostart == 'function') autostart();
		window.removeEventListener('load',windowready);
	}

	function render(){document.body.innerHTML=device.content()}
	function clear(){device.innerHTML = ""};
	function async(args){
		var formToPost = findForm();
		var preparedUrl = "";
		//var serverFunc = null;
//		console.log("form to post: "+formToPost);
		if(formToPost==null) console.log("Phaser error: invalid Form");
		else if(!window.phaser.loading) {
//			var cacheFrame; sera declarada no escopo global da phaser para ser acessado pelo update
//			console.log('before');
			prepareFrame();
			prepareUrl();
			prepareForm();
			sendRequest();
		} else {
			console.log("PHASER is already working on a requisition, wait for it to be done");
		}
		
		function findForm() {
			var formParamType = typeof(args.form);
			var _form = null;
			if(formParamType == "undefined") return false;
			if(formParamType == "string") _form = document.getElementById(args.form);
			if(formParamType == "object" && args.form.nodeName == "FORM") _form=args.form;
//			console.log("Form found! type: "+formParamType+" // name: "+_form.name);
			//if(_form==null) console.log("JS cache error: invalid Form");
			return _form;
		}

		function prepareFrame(){
			cacheFrame = document.getElementById("cache-iframe");
			if(!cacheFrame){
				try {
					//=======IE problem: Dinamically created iframes can't have their 'names' set with iframe.name = ''
					//var cacheFrame = document.createElement("IFRAME");
					cacheFrame=document.createElement('<iframe name="cache-iframe" id="cache-iframe">');
				}
				catch(e) {
					cacheFrame=document.createElement('iframe');
					cacheFrame.name = "cache-iframe";
					cacheFrame.id = "cache-iframe";
				}
			}
			cacheFrame.style.cssText="display:none;";			
			cacheFrame.onload = whenReady;
			document.body.appendChild(cacheFrame);
			/*
			cacheFrame.onload = function() {
				cacheFrame.onloadcount++;
				console.log('onloadcount = '+cacheFrame.onloadcount);
				device.innerHTML = cacheFrame.contentWindow.document.head.innerHTML + cacheFrame.contentWindow.document.body.innerHTML;
				for(var i = 0; i < 300; i++) {
					if(device.innerHTML.length == 0) {
						setTimeout(function(){},10);
					}
					else {
						if(document.getElementById("cache-iframe"))document.body.removeChild(cacheFrame);
						break;
					}
				}
			};
			*/
		}

		function prepareUrl(){
			var g = [];

			//deprecated arguments.callee
			//if(typeof args.phase !== 'string') args.phase = arguments.callee.caller.caller.caller.caller.name;
			//alternative for IE9 that does not contain callee or caller
			if(typeof args.phase !== 'string') {
				// se a propriedade name de do objecto caller nao existir (depende do browser)
				if(prepareUrl.caller.name===undefined){
					var f = prepareUrl.caller.caller.caller.toString();
					//f = f.substring(f.indexOf(" ")+1,f.indexOf("("));
					//if(f.length==0) f = prepareUrl.caller.caller.caller.caller.toString();
					f = f.substring(f.indexOf(" ")+1,f.indexOf("("));
					if(f.length==0) f = console.log("AUTO PHASE failed: Function name not found, or caller function is anonymous")
					args.phase = f;
				}
				else {
					var n = prepareUrl.caller.caller.caller.name;
					//if(n.length==0) n = prepareUrl.caller.caller.caller.caller.name;
					if(n.length==0) n = console.log("AUTO PHASE failed: Function name not found, or caller function is anonymous")
					args.phase = n;
				}
//				console.log("----AUTO PHASE: "+args.phase);
			} else {
				//alert("manual phase");
//				console.log("----MANUAL PHASE: "+args.phase);
			}

			for(var i in args) if(args.hasOwnProperty(i)) g.push(i+"="+encodeURI(args[i]));
			preparedUrl = args.url+(args.url.indexOf("?")==-1?"?":"&")+g.join("&");
			/*
			var g = ["phase=1"];
			if(!typeof args.phase == 'string') args.phase = 'key='+arguments.callee.caller.caller.caller.caller.name;
			for(var i in args) if(args.hasOwnProperty(i)) g.push(i+"="+encodeURI(args[i]));
			return (args.url.indexOf("?")==-1?"?":"&")+g.join("&");
			*/
		}
			
		function prepareForm() {
			formToPost.action = preparedUrl;
			formToPost.method = "POST";
			formToPost.target = "cache-iframe";
			formToPost.enctype = "multipart/form-data";
			//formToPost.onsubmit = formToPost.preventDefault();
		}

		function sendRequest(){
			//alert(args.url+prepareUrl());
			window.phaser.loading = true;
			document.body.style.cursor='progress';
			console.log(formToPost);
			if(formToPost) { //setTimeout(function(){formToPost.submit()},1000);
				formToPost.submit();
			}
			else cacheFrame.src = preparedUrl;
		}
		function whenReady() {
//			console.log("LOADED: "+cacheFrame.contentWindow.location);
			window.phaser.loading = false;
			document.body.style.cursor='';
			//device.innerHTML = cacheFrame.contentWindow.document.head.innerHTML + cacheFrame.contentWindow.document.body.innerHTML;

//			chrome fires onLoad when the iframe is first loaded
//			if(cacheFrame.src!=""){ doesn't work because a frame is submitted to the iframe, its src property becomes empty
//			console.log('whenReady src = '+cacheFrame.contentWindow.location.toString());
			if(cacheFrame.contentWindow.location.toString().indexOf('http')!==-1) {

				device.innerHTML = cacheFrame.contentWindow.document.body.innerHTML;
				preview();
				document.body.removeChild(window.cacheFrame);
				//setTimeout(function(){document.body.removeChild(window.cacheFrame);},3000);

				//for(var i in args)if(i=='run')
				alert(typeof args.run);
				if(typeof args.run=='function') args.run();
				else if(typeof args.run=='string')
					try{eval(args.run)}
					catch(err){alert('PHASE\nJavascript error in "run" argument of phase:\nARGUMENT:\n'+args.run)}
				var allrunjs = device.getElementsByTagName("runjs");
				for(var i=0; i<allrunjs.length; i++){
					var jscode=htmlspecialchars_decode(allrunjs[i].innerHTML.trim());
					if(typeof window[jscode]=='function')window[jscode]();
					try{eval(jscode)}
					catch(err){alert('PHASE\nJavascript error in "jsrun" command in page:\n'+args.url+'\n\nCODE:\n'+jscode)}
				}
			}
		}
	}


	function cache(selector){
		var cachePacks = device.getElementsByTagName("CACHE");
		var cacheContent, parsedCache;
		var thisCachePack = null;
//		console.log("cahce selector: "+typeof selector + " : " + selector);
		if(typeof(selector)=="number") {
			if(cachePacks[selector-1]) thisCachePack = cachePacks[selector-1];
		}
		else if(typeof(selector)=="string"){
			for(var i=0; i<cachePacks.length; i++) {
				if(selector==cachePacks[i].id) thisCachePack = cachePacks[i];
			}
		}
		if(thisCachePack){
			cacheContent = htmlspecialchars_decode(thisCachePack.innerHTML.trim());	
			try{parsedCache = JSON.parse(cacheContent)}catch(e){parsedCache = cacheContent}
			parsedCache.modify = function(){
				delete this.modify;
				thisCachePack.innerHTML = JSON.stringify(this);
//				console.log(JSON.stringify(this));
			}
			return parsedCache;
		}
		else return null
	}

	function element(selector){
		var arr = [];
		if(typeof selector == 'object') {
			arr.push(selector);
		}
		else {
			var type = selector.substr(0,1);
			var name = selector.substr(1, selector.length);
			switch(type) {
				case ".": arr=document.getElementsByClassName(name); break;
				case "#": var obj=document.getElementById(name); if(obj)arr.push(obj); break;
				default : arr=document.getElementsByTagName(selector);
			}
		}
//		console.log("SELECTOR: "+selector+" - LENGHT: "+arr.length);console.log(arr);
		if(arr.length==0) return false;
		else {
		//if(arr) { 
			arr.set=function(attr){return set2(this,attr)};
			arr.clearCSS=function(){return clearCSS2(this)};
			arr.update=function(attr,cacheSelector){return update2(this,selector,cacheSelector,attr)};
			for(var i=0; i<arr.length; i++){
				arr[i].set=function(attr){return set2(arr,attr)};
				arr[i].clearCSS=function(attr){return clearCSS2(arr)};
				arr[i].update=function(attr,cacheSelector){return update2(arr,selector,cacheSelector,attr)};
			}
		}
		function set2(arr,attr){
//			console.log(attr);
			if(typeof attr == 'object' ){
				for(var i=0; i<arr.length; i++) {
					for(var name in attr){
//						alert("processing: "+name);
						var v=attr[name];
						var o=arr[i];
//						console.log("setting... "+name+" = "+v);
						if(name=='css') o.style.cssText=v;
						else if(name=='+css') o.style.cssText+=v;
						else if(name=='class') o.className=v;
						else if(name=='+class') {
							o.className=o.className.trim()+" "+v.trim();
							//o.className=o.className.split(' ').push(v).join(' ');
						}
						else if(name=='-class') {
							var classArr = o.className.split(' ');
							var index = classArr.indexOf(v);
							if(index>-1) {
								classArr.splice(index,1);
								o.className = classArr.join(' ');
							}
						}
						//se for um style
						else if(o.style[name]!==undefined) o.style[name]=v;
						//se for um evento
						else if(o[name]===null && name.substr(0,2)=='on') o.setAttribute(name,v);
						//se for uma propriedade geral existente. no momento nao faz distinções entre funçoes, numbers, e booleans. aplica tudo como string
						else if(o[name]!==undefined) o[name]=v;
						//se for o innerHTML
						else if(name=='html' || name=='innerHTML') arr[i].innerHTML=v;
						//se for :url indica para mudar de página
						else if(name.indexOf(':')>-1){
							if(name==':url') {
								v=v.split(',');
//								alert(':url =>'+v[0]);
								if(v.length==2 && parseInt(v[1])!==NaN) setTimeout('window.location="'+v[0]+'";',parseInt(v[1]));
								else window.location=v[0];
							}
							else {
								v = String(v);
								v='"' + v.replace("'","").replace('"','').replace(',','","') + '"';
								var f = name.slice(1);
//								alert(f+"("+v+")");
								if(typeof(window[f])=='function') eval('window[f]('+v+')');
							}
						}
						//se o usuario quiser forçar como atributo
						else if(name.indexOf('!')>-1) o.setAttribute(name.replace('!',''),String(v));
					}
				}
			}
			if(arr.length==1) return arr[0];
			else return arr;
		}
		function clearCSS2(arr){
			for(var i=0; i<arr.length; i++)arr[i].style.cssText="";
			if(arr.length==1) return arr[0];
			else return arr;
		}
		function update2_OLD(arr,selector,cacheSelector,attr){
			//console.log('update2');
			var loading = document.getElementById("cache-iframe");
			if(loading) {
				loading.addEventListener('load',function(){
					update3(arr,selector,cacheSelector,attr)
				});
			}
			else update3(arr,selector,cacheSelector,attr);
		}
		function update2(arr,selector,cacheSelector,attr){
			//console.log("UPDATE3 : cacheSelector = "+(cacheSelector==undefined)+" - "+cacheSelector);
			if( cacheSelector==undefined ) cacheSelector = selector;
			var correspondingCache = window.cache( cacheSelector );
			if( !correspondingCache)  {
				console.log('Phaser warning: Update of selector "'+selector+'" is not possible: No such cache');
				return arr;
			}
			else {
				if(typeof attr!=='string' && attr!==undefined) {
					console.log('Phaser error: Update of selector "'+selector+'" is not possible: Attributes set are invalid: '+attr);
					return arr;
				}
				else {
					if(attr==undefined || attr=='*') {
						attr=[];
						for(name in correspondingCache) attr.push(name);
					}
					else if(typeof attr == 'string') attr = attr.split(" ");
					var props = Object();
					//window.props = props;
					for(var i=0; i<attr.length; i++) props[attr[i]] = correspondingCache[attr[i]];
//					console.log("PROPS: ");console.log(props);
//					console.log("ARR: ");console.log(arr);
//					console.log("UPDATING PROPS : "+attr.join(','));
					return arr.set(props);
				}
			}
		}
		function updateOld(arr,selector,cacheSelector,attr){
//			console.log("UPDATE "+selector);
//			console.log(arr);
//			console.log("UPDATE / "+arr+" / "+selector+" / "+cacheSelector+" / "+attr);
			if(typeof cacheSelector !== 'undefined' ) selector = cacheSelector;
			var cache = window.cache(selector);
			if(typeof cache !== 'undefined') {
				if(typeof attr == 'undefined') {
					attr = [];
					for(name in cache) attr[name] = cache[name];
				}
				else if(typeof attr == 'string') attr = attr.split(" ");
				else console.log("Update of selector "+selector+" not possible: attributes wrongly especified");
//				console.log("UPDATE / "+arr+" / "+selector+" / "+cacheSelector+" / "+attr);
				for(var i=0; i<arr.length; i++) {
					for(var j=0; j<attr.length; i++) {
						var attrName=attr[j];
						var obj=arr[i];
						if (attrName=='css') obj.style.cssText+=c.css;
						else if (obj.style[attrName]!==undefined) obj.style[attrName] = cache[attrName];
						else if (attrName=='html') obj.innerHTML = cache.html;
						else if (obj[attrName]!==undefined) obj.setAttribute(attrName,cache[attrName]);
						else obj[attrName]=cache[attrName];
					}
				}
			}
			else console.log("Update not possible: cache "+selector+" not found");

		}
		if(arr.length==1) return arr[0];
		else return arr;
	}

	function htmlspecialchars(str) {
		return String(str)/*.replace(/&/g, '&amp;')*/.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, "&#039;").replace(/&/g, '&amp;');
	}
	function htmlspecialchars_decode(str) {
		return String(str)/*.replace(/&/g, '&amp;')*/.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#0*39;/g, "'").replace(/&amp;/g, '&');
	}

	function preview() {
		console.log("PREVIEW BUILDING");
		var dsdbg = createDebuggerDIV();
		createShowButton();//must be created afterDebuggerDiv so it will be on top
		writeDebuggerContent();

		function createShowButton(){
		var sb = document.getElementById("cache-toggleButton");
			if(!sb) {
				sb = document.createElement("DIV");
				sb.id = "cache-toggleButton";
			}
			sb.innerHTML = "JS cache";
//			sb.className = foundAnyError? "ds-uiButton ds-Error" : "ds-uiButton";
			sb.className = "cache-uiButton";
			sb.onclick = toggleDebugger;
			document.body.appendChild(sb);
		}

		function createDebuggerDIV(){
			var dsdbg = document.getElementById("cache-preview");
			if(!dsdbg) {
				dsdbg = document.createElement("DIV");
				dsdbg.id = "cache-preview";
			}
			dsdbg.style.display="none";
			document.body.appendChild(dsdbg);
			return dsdbg;
		}

		function writeDebuggerContent(){
			dsdbg.innerHTML=
			//"<link rel='stylesheet' type='text/css' href='darkside.css'>"+
			//normal style:
			//"<style>#dsdbg{box-sizing:border-box;position:fixed;top:0;left:0;height:100%;width:100%;background:rgba(0, 0, 0, 0.9);padding:30px 80px;color:#fff;font-family:Consolas,Sans-Serif;font-size:12px;text-shadow:1px 1px 4px #000;overflow:auto;display:block;z-index:2147483646;}#dsdbg div,#dsdbg span, #dsdbg ol, #dsdbg li{box-sizing:border-box;word-break:break-all;}#ds-title{border-bottom:1px dotted rgba(255,255,255,0.3);padding:10px 0;font-weight:normal;text-align:right;margin-bottom:15px;}#ds-alert{margin-bottom:15px;padding:0;}#dsdbg>#ds-sections ol{display:block;width:100%;line-height:150%;padding:10px 30px 10px 60px;overflow:hidden;margin:0 0 1px 0;white-space:pre-wrap;list-style: decimal-leading-zero outside;}.ds-SCRIPT{color:#C4F;box-shadow:25px 0 25px -25px #C0F inset,-25px 0 25px -25px #C0F inset,5px 0 5px -5px #C2F inset,-5px 0 5px -5px #C2F inset;border-left:1px solid #C6F;border-right:1px solid #C6F;}.ds-CONTENT{color:#F44;box-shadow:25px 0 25px -25px #F12 inset,-25px 0 25px -25px #F12 inset,5px 0 5px -5px #F44 inset,-5px 0 5px -5px #F44 inset;border-left:1px solid #F44;border-right:1px solid #F44;}.ds-LOOSE{color:#EEE;box-shadow:25px 0 25px -25px #AAA inset,-25px 0 25px -25px #AAA inset,5px 0 5px -5px #BBB inset,-5px 0 5px -5px #BBB inset;border-left:1px solid #DDD;border-right:1px solid #DDD;}.ds-phpErrors {font-family:Calibri,Sans-Serif;border:1px dotted #444;background:rgba(140,140,140,0.1);padding:20px;margin-top:20px;}.ds-phpErrors table{width:100%;text-shadow:none;}.ds-LineHighlight{background:rgba(255,255,255,0.1);}.ds-CharHighlight{	background:#C00;}.ds-uiButton{box-sizing:border-box;background:purple;color:white;font-size:12px;font-family:Consolas,sans-serif;text-shadow:0 0 4px #000;text-align:center;padding:4px;width:40px;position:fixed;left:20px;bottom:0;box-shadow:2px 2px 2px rgba(0,0,0,0.5);cursor:pointer;z-index:2147483647;}.ds-uiButton.ds-Error{background:#DF0016;}#dsdbg textarea{outline:none;overflow:auto;box-sizing:border-box;color:white;width:100%;resize:vertical;padding:8px 10px;font-family:Consolas,sans-serif}</style>"+
			//discreet style:
			//"<style>#dsdbg{box-sizing:border-box;position:fixed;top:0;left:0;height:100%;width:100%;background:rgba(0, 0, 0, 0.9);padding:30px 80px;color:#fff;font-family:Consolas,Sans-Serif;font-size:12px;text-shadow:1px 1px 4px #000;overflow:auto;display:block;z-index:2147483646;}#dsdbg div,#dsdbg span, #dsdbg ol, #dsdbg li{box-sizing:border-box;word-break:break-all;}#ds-title{border-bottom:1px dotted rgba(255,255,255,0.3);padding:10px 0;font-weight:normal;text-align:right;margin-bottom:15px;}#ds-alert{margin-bottom:15px;padding:0;}#dsdbg>#ds-sections ol{display:block;width:100%;line-height:150%;padding:10px 30px 10px 60px;overflow:hidden;margin:0 0 1px 0;white-space:pre-wrap;list-style: decimal-leading-zero outside;}.ds-SCRIPT{color:#C4F;box-shadow:25px 0 25px -25px #C0F inset,-25px 0 25px -25px #C0F inset,5px 0 5px -5px #C2F inset,-5px 0 5px -5px #C2F inset;border-left:1px solid #C6F;border-right:1px solid #C6F;}.ds-CONTENT{color:#F44;box-shadow:25px 0 25px -25px #F12 inset,-25px 0 25px -25px #F12 inset,5px 0 5px -5px #F44 inset,-5px 0 5px -5px #F44 inset;border-left:1px solid #F44;border-right:1px solid #F44;}.ds-LOOSE{color:#EEE;box-shadow:25px 0 25px -25px #AAA inset,-25px 0 25px -25px #AAA inset,5px 0 5px -5px #BBB inset,-5px 0 5px -5px #BBB inset;border-left:1px solid #DDD;border-right:1px solid #DDD;}.ds-phpErrors {font-family:Calibri,Sans-Serif;border:1px dotted #444;background:rgba(140,140,140,0.1);padding:20px;margin-top:20px;}.ds-phpErrors table{width:100%;text-shadow:none;}.ds-LineHighlight{background:rgba(255,255,255,0.1);}.ds-CharHighlight{	background:#C00;}.ds-uiButton{box-sizing:border-box;background:purple;opacity:0.02;color:white;font-size:12px;font-family:Consolas,sans-serif;text-shadow:0 0 4px #000;text-align:center;padding:4px;width:40px;position:fixed;left:20px;bottom:0;box-shadow:2px 2px 2px rgba(0,0,0,0.5);cursor:pointer;z-index:2147483647;}.ds-uiButton.ds-Error{background:#DF0016;}#dsdbg textarea{outline:none;overflow:auto;box-sizing:border-box;color:white;width:100%;resize:vertical;padding:8px 10px;font-family:Consolas,sans-serif}</style>"+
			//cache style
			"<style>#cache-preview{box-sizing:border-box;position:fixed;top:0;left:0;height:100%;width:100%;background:rgba(255, 255, 255, 1);padding:30px 80px;overflow:auto;display:block;z-index:2147483646;}#cache-title{border-bottom:1px dotted rgba(0,0,0,0.3);padding:10px 0;font-weight:normal;text-align:right;margin-bottom:15px;}.cache-uiButton{box-sizing:border-box;background:purple;opacity:0.4;color:white;font-size:12px;font-family:Consolas,sans-serif;text-shadow:0 0 4px #000;text-align:center;padding:4px;width:40px;position:fixed;left:20px;bottom:0;box-shadow:2px 2px 2px rgba(0,0,0,0.5);cursor:pointer;z-index:2147483647;}.cache-uiButton.cache-Error{background:#DF0016;}</style>"+
			"<div id='cache-title'>&lt; Phaser - v 0.1 /&gt;</div>"+
			"<div style='margin-bottom:20px'></div>"+
			"<section id='cachebody'>"+device.innerHTML+"</section>";
		}

		function toggleDebugger(){
			var d = dsdbg.style;
			var t = element("#cache-toggleButton");
			var b = document.body.style;
			if(d.display=="none"){
				d.display = "";
				t.innerHTML = "x";
				b.overflow = "hidden";
			}
			else {
				d.display = "none";
				t.innerHTML = "d$";
				b.overflow = "auto";
			}
			//dsdbg.style.display = dsdbg.style.display=="none"?"":"none";
		}
	}

	function IE8prototypes() {
		if(typeof String.prototype.trim !== 'function') {
			String.prototype.trim = function() {
				return this.replace(/^\s+|\s+$/g, '');
			}
		}
		if(!Array.prototype.indexOf) {
			Array.prototype.indexOf=function(obj, start) {
 		   		for(var i=(start||0),j=this.length;i<j;i++){
 		   			if(this[i]===obj)return i;
 		   		}
 		   		return -1;
    		}
		}
	}

	function htmlEntities(str) {
		return String(str)/*.replace(/&/g, '&amp;')*/.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	}

	function htmlCode(str) {
		return String(str)/*.replace(/&/g, '&amp;')*/.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');
	}

})();

/* 
IDEAS

e("#botao").update(cache:"#botao.nice",attr:"innerHTML");
e(element).update(cache,)
e("#botao").set({innerHTML:cache("#botao.nice")};
e("#botao").set({cache:"botao.nice"}).update("innerHTML");
e("#botao").innerHTML = cache("botao.nice").innerHTML;
e("#botao").changeSelector({addClass:"nice", removeClass:"jogo", setId).removeClass("hello")


SELECT.SET() ADD AND REMOVE CLASSES
select("#botao").set({addClass:"nice", removeClass:"jogo")


SELECT.UPDATE()
select("#botao").update({attr:"innerHTML", cache:".nicebox"});
select("#botao").update("innerHTML",".nicebox");


CACHE()
cache("@#.selector") => will return a json
cache("<body>").

CACHE.SOLIDIFY()	CACHE.CREATE("DIV")
cache("@example").solidify()
cache("@example").solidify("div")
--newElement("@cacheselector")
--newElement({cache:#blab})

CACHE.APPLY()
cache("@example").apply() => the same as select("@example").update()


NEW TITLE IDEA:
-PHP  -> GAS: create clouds of information to supply the JavaScript rivers
-JS   -> LIQUID: transform and make the information flow between the server and the client
-HTML -> SOLID: consolidate the information on the user's brwoser, updating the elements

NEW TITLE IDEA: CACHE AND CPU - cacheandcpu.js
-PHP -> create caches of information
-JS  -> processes and transforms the information

dispensa, cachepack, jscloud, dispenser, htmlDispenser cachepack.js, provider.js, pageghost.js, stashed, pagetrunk, keeper, reference book, library
*/