console.log("WARP initiated");
(function a1(){ 
	
	window.warpframe = null;
	IE8prototypes();

	window.warp = function(args){async(args)};//{clear:false}
	window.warp.buffer = document.createElement("WARPBUFFER");
	window.warp.pack = function(selector){return pack(selector)};
	window.warp.loading = false;
	window.warp.preview = function(){preview()};
	window.warp.render = function(){render()};
	window.warp.clear = function(){clear()};
	if(typeof window.warp !== undefined)
		{
		console.log("Found WARP!");
		window.addEventListener('load', windowready, false);
			
		} 
	window.warp.obj = function(selector){return element(selector)};
	window.warp.urlparams = function () {
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
	window.warp.runGET = function(getparam,jsfunction) {
		var p = window.phaser.urlparams()[getparam];
		if( p !== undefined && typeof window[jsfunction] == 'function') window[jsfunction](p);
	}

	function windowready() {
		console.log('windowready');
		if(typeof window.autostart == 'function') autostart();
		window.removeEventListener('load',windowready);
	}

	function render(){document.body.innerHTML=warp.buffer.content()}
	function clear(){warp.buffer.innerHTML = ""};
	function async(args){
		var formToPost = findForm();
		var preparedUrl = "";
		//var serverFunc = null;
//		console.log("form to post: "+formToPost);
		if(formToPost==null) console.log("Warp error: invalid Form");
		else if(!window.warp.loading) {
//			var warpframe; sera declarada no escopo global da phaser para ser acessado pelo update
//			console.log('before');
			prepareFrame();
			prepareUrl();
			prepareForm();
			sendRequest();
		} else {
			console.log("WARP is already working on a requisition, wait for it to be done");
		}
		
		function findForm() {
			var formParamType = typeof(args.form);
			var _form = null;
			if(formParamType == "undefined") return false;
			if(formParamType == "string") _form = document.getElementById(args.form);
			if(formParamType == "object" && args.form.nodeName == "FORM") _form=args.form;
//			console.log("Form found! type: "+formParamType+" // name: "+_form.name);
			//if(_form==null) console.log("WARP error: invalid Form");
			return _form;
		}

		function prepareFrame(){
			warpframe = document.getElementById("warpframe");
			if(!warpframe){
				try {
					//=======IE problem: Dinamically created iframes can't have their 'names' set with iframe.name = ''
					//var warpframe = document.createElement("IFRAME");
					warpframe=document.createElement('<iframe name="warpframe" id="warpframe">');
				}
				catch(e) {
					warpframe=document.createElement('iframe');
					warpframe.name = "warpframe";
					warpframe.id = "warpframe";
				}
			}
			warpframe.style.cssText="display:none;";			
			warpframe.onload = whenReady;
			document.body.appendChild(warpframe);
			/*
			warpframe.onload = function() {
				warpframe.onloadcount++;
				console.log('onloadcount = '+warpframe.onloadcount);
				warp.buffer.innerHTML = warpframe.contentWindow.document.head.innerHTML + warpframe.contentWindow.document.body.innerHTML;
				for(var i = 0; i < 300; i++) {
					if(warp.buffer.innerHTML.length == 0) {
						setTimeout(function(){},10);
					}
					else {
						if(document.getElementById("WARPFRAME"))document.body.removeChild(warpframe);
						break;
					}
				}
			};
			*/
		}

		function prepareUrl(){
			var g = [];

			//deprecated arguments.callee
			//if(typeof args.phase !== 'string') args.freq = arguments.callee.caller.caller.caller.caller.name;
			//alternative for IE9 that does not contain callee or caller
			if(typeof args.freq !== 'string') {
				// se a propriedade name de do objecto caller nao existir (depende do browser)
				if(prepareUrl.caller.name===undefined){
					var f = prepareUrl.caller.caller.caller.toString();
					//f = f.substring(f.indexOf(" ")+1,f.indexOf("("));
					//if(f.length==0) f = prepareUrl.caller.caller.caller.caller.toString();
					f = f.substring(f.indexOf(" ")+1,f.indexOf("("));
					if(f.length==0) f = console.log("AUTO WARP FREQUENCY failed: Function name not found, or caller function is anonymous")
					args.freq = f;
				}
				else {
					var n = prepareUrl.caller.caller.caller.name;
					//if(n.length==0) n = prepareUrl.caller.caller.caller.caller.name;
					if(n.length==0) n = console.log("AUTO WARP FREQUENCY failed: Function name not found, or caller function is anonymous")
					args.freq = n;
				}
//				console.log("----AUTO WARP FREQUENCY: "+args.freq);
			} else {
				//alert("manual freq");
//				console.log("----MANUAL WARP FREQUENCY: "+args.freq);
			}

			for(var i in args) if(args.hasOwnProperty(i)) g.push(i+"="+encodeURI(args[i]));
			preparedUrl = args.url+(args.url.indexOf("?")==-1?"?":"&")+g.join("&");
			/*
			var g = ["freq=1"];
			if(!typeof args.freq == 'string') args.freq = 'key='+arguments.callee.caller.caller.caller.caller.name;
			for(var i in args) if(args.hasOwnProperty(i)) g.push(i+"="+encodeURI(args[i]));
			return (args.url.indexOf("?")==-1?"?":"&")+g.join("&");
			*/
		}
			
		function prepareForm() {
			formToPost.action = preparedUrl;
			formToPost.method = "POST";
			formToPost.target = "warpframe";
			formToPost.enctype = "multipart/form-data";
			//formToPost.onsubmit = formToPost.preventDefault();
		}

		function sendRequest(){
			//alert(args.url+prepareUrl());
			window.warp.loading = true;
			document.body.style.cursor='progress';
			console.log(formToPost);
			if(formToPost) { //setTimeout(function(){formToPost.submit()},1000);
				formToPost.submit();
			}
			else warpframe.src = preparedUrl;
		}
		function whenReady() {
//			console.log("LOADED: "+warpframe.contentWindow.location);
			window.warp.loading = false;
			document.body.style.cursor='';
			//warp.buffer.innerHTML = warpframe.contentWindow.document.head.innerHTML + warpframe.contentWindow.document.body.innerHTML;

//			chrome fires onLoad when the iframe is first loaded
//			if(warpframe.src!=""){ doesn't work because a frame is submitted to the iframe, its src property becomes empty
//			console.log('whenReady src = '+warpframe.contentWindow.location.toString());
			if(warpframe.contentWindow.location.toString().indexOf('http')!==-1) {

				warp.buffer.innerHTML = warpframe.contentWindow.document.body.innerHTML;
				preview();
				document.body.removeChild(window.warpframe);
				//setTimeout(function(){document.body.removeChild(window.warpframe);},3000);

				//for(var i in args)if(i=='run')
				if(typeof args.run=='function') args.run();
				else if(typeof args.run=='string')
					try{eval(args.run)}
					catch(err){alert('WARP\nJavascript error in "run" argument of warp:\nARGUMENT:\n'+args.run)}
				var allrunjs = warp.buffer.getElementsByTagName("runjs");
				for(var i=0; i<allrunjs.length; i++){
					var jscode=htmlspecialchars_decode(allrunjs[i].innerHTML.trim());
					if(typeof window[jscode]=='function')window[jscode]();
					try{eval(jscode)}
					catch(err){alert('WARP\nJavascript error in "jsrun" command in file:\n'+args.url+'\n\nCODE:\n'+jscode)}
				}
			}
		}
	}


	function pack(selector){
		var packs = warp.buffer.getElementsByTagName("pack");
		var packContent, parsedPack;
		var thisPack = null;
//		console.log("cahce selector: "+typeof selector + " : " + selector);
		if(typeof(selector)=="number") {
			if(packs[selector-1]) thisPack = packs[selector-1];
		}
		else if(typeof(selector)=="string"){
			for(var i=0; i<packs.length; i++) {
				if(selector==packs[i].id) thisPack = packs[i];
			}
		}
		if(thisPack){
			packContent = htmlspecialchars_decode(thisPack.innerHTML.trim());	
			try{parsedPack = JSON.parse(packContent)}catch(e){parsedPack = packContent}
			parsedPack.modify = function(){
				delete this.modify;
				thisPack.innerHTML = JSON.stringify(this);
//				console.log(JSON.stringify(this));
			}
			return parsedPack;
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
			arr.update=function(attr,packSelector){return update2(this,selector,packSelector,attr)};
			for(var i=0; i<arr.length; i++){
				arr[i].set=function(attr){return set2(arr,attr)};
				arr[i].clearCSS=function(attr){return clearCSS2(arr)};
				arr[i].update=function(attr,packSelector){return update2(arr,selector,packSelector,attr)};
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
		function update2_OLD(arr,selector,packSelector,attr){
			//console.log('update2');
			var loading = document.getElementById("WARPFRAME");
			if(loading) {
				loading.addEventListener('load',function(){
					update3(arr,selector,packSelector,attr)
				});
			}
			else update3(arr,selector,packSelector,attr);
		}
		function update2(arr,selector,packSelector,attr){
			//console.log("UPDATE3 : packSelector = "+(packSelector==undefined)+" - "+packSelector);
			if( packSelector==undefined ) packSelector = selector;
			var correspondingPack = window.warp.pack( packSelector );
			if( !correspondingPack)  {
				console.log('WARP warning: Update of element "'+selector+'" is not possible: No such pack');
				return arr;
			}
			else {
				if(typeof attr!=='string' && attr!==undefined) {
					console.log('WARP error: Update of element "'+selector+'" is not possible: Attributes set are invalid: '+attr);
					return arr;
				}
				else {
					if(attr==undefined || attr=='*') {
						attr=[];
						for(name in correspondingPack) attr.push(name);
					}
					else if(typeof attr == 'string') attr = attr.split(" ");
					var props = Object();
					//window.props = props;
					for(var i=0; i<attr.length; i++) props[attr[i]] = correspondingPack[attr[i]];
//					console.log("PROPS: ");console.log(props);
//					console.log("ARR: ");console.log(arr);
//					console.log("UPDATING PROPS : "+attr.join(','));
					return arr.set(props);
				}
			}
		}
		function updateOld(arr,selector,packSelector,attr){
//			console.log("UPDATE "+selector);
//			console.log(arr);
//			console.log("UPDATE / "+arr+" / "+selector+" / "+packSelector+" / "+attr);
			if(typeof packSelector !== 'undefined' ) selector = packSelector;
			var pack = window.pack(selector);
			if(typeof pack !== 'undefined') {
				if(typeof attr == 'undefined') {
					attr = [];
					for(name in pack) attr[name] = pack[name];
				}
				else if(typeof attr == 'string') attr = attr.split(" ");
				else console.log("Update of selector "+selector+" not possible: attributes wrongly especified");
//				console.log("UPDATE / "+arr+" / "+selector+" / "+packSelector+" / "+attr);
				for(var i=0; i<arr.length; i++) {
					for(var j=0; j<attr.length; i++) {
						var attrName=attr[j];
						var obj=arr[i];
						if (attrName=='css') obj.style.cssText+=c.css;
						else if (obj.style[attrName]!==undefined) obj.style[attrName] = pack[attrName];
						else if (attrName=='html') obj.innerHTML = pack.html;
						else if (obj[attrName]!==undefined) obj.setAttribute(attrName,pack[attrName]);
						else obj[attrName]=pack[attrName];
					}
				}
			}
			else console.log("Update not possible: pack "+selector+" not found");

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
		var sb = document.getElementById("buffer-toggleButton");
			if(!sb) {
				sb = document.createElement("DIV");
				sb.id = "buffer-toggleButton";
			}
			sb.innerHTML = "JS Buffer";
//			sb.className = foundAnyError? "ds-uiButton ds-Error" : "ds-uiButton";
			sb.className = "buffer-uiButton";
			sb.onclick = toggleDebugger;
			document.body.appendChild(sb);
		}

		function createDebuggerDIV(){
			var dsdbg = document.getElementById("buffer-preview");
			if(!dsdbg) {
				dsdbg = document.createElement("DIV");
				dsdbg.id = "buffer-preview";
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
			//buffer style
			"<style>#buffer-preview{box-sizing:border-box;position:fixed;top:0;left:0;height:100%;width:100%;background:rgba(255, 255, 255, 1);padding:30px 80px;overflow:auto;display:block;z-index:2147483646;}#buffer-title{border-bottom:1px dotted rgba(0,0,0,0.3);padding:10px 0;font-weight:normal;text-align:right;margin-bottom:15px;}.buffer-uiButton{box-sizing:border-box;background:purple;opacity:0.4;color:white;font-size:12px;font-family:Consolas,sans-serif;text-shadow:0 0 4px #000;text-align:center;padding:4px;width:40px;position:fixed;left:20px;bottom:0;box-shadow:2px 2px 2px rgba(0,0,0,0.5);cursor:pointer;z-index:2147483647;}.buffer-uiButton.buffer-Error{background:#DF0016;}</style>"+
			"<div id='buffer-title'>&lt; Phaser - v 0.1 /&gt;</div>"+
			"<div style='margin-bottom:20px'></div>"+
			"<section id='bufferbody'>"+warp.buffer.innerHTML+"</section>";
		}

		function toggleDebugger(){
			var d = dsdbg.style;
			var t = element("#buffer-toggleButton");
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

e("#botao").update(pack:"#botao.nice",attr:"innerHTML");
e(element).update(pack,)
e("#botao").set({innerHTML:pack("#botao.nice")};
e("#botao").set({pack:"botao.nice"}).update("innerHTML");
e("#botao").innerHTML = pack("botao.nice").innerHTML;
e("#botao").changeSelector({addClass:"nice", removeClass:"jogo", setId).removeClass("hello")


SELECT.SET() ADD AND REMOVE CLASSES
select("#botao").set({addClass:"nice", removeClass:"jogo")


SELECT.UPDATE()
select("#botao").update({attr:"innerHTML", pack:".nicebox"});
select("#botao").update("innerHTML",".nicebox");


CACHE()
pack("@#.selector") => will return a json
pack("<body>").

CACHE.SOLIDIFY()	CACHE.CREATE("DIV")
pack("@example").solidify()
pack("@example").solidify("div")
--newElement("@packselector")
--newElement({pack:#blab})

CACHE.APPLY()
pack("@example").apply() => the same as select("@example").update()


NEW TITLE IDEA:
-PHP  -> GAS: create clouds of information to supply the JavaScript rivers
-JS   -> LIQUID: transform and make the information flow between the server and the client
-HTML -> SOLID: consolidate the information on the user's brwoser, updating the elements

NEW TITLE IDEA: CACHE AND CPU - cacheandcpu.js
-PHP -> create caches of information
-JS  -> processes and transforms the information

dispensa, cachepack, jscloud, dispenser, htmlDispenser cachepack.js, provider.js, pageghost.js, stashed, pagetrunk, keeper, reference book, library
*/