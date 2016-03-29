/**
 *  Author:hoyuet
 *  Date: 2016/3/29
 */
'use strict';
function ZQuery(arg){
    this.elements=[]; //存选出来元素
    this.domString=''; //存带创建的元素的字符串

    switch (typeof arg){
        case 'function':
            domReady(arg);
            break;
        case 'string':
            if(arg.indexOf('<')!=-1){
                this.domString=arg;
            }else{
                this.elements=getEle(arg);

                this.length=this.elements.length;
            }
            break;
        default:
            if(arg instanceof Array){
                this.elements=arg;
            }else{
                this.elements.push(arg);
            }
            break;
    }
}
function $(arg){
    return new ZQuery(arg);
}
//each
ZQuery.prototype.each=function(fn){
    for(var i=0; i<this.elements.length; i++){
        fn.call(this.elements[i], i, this.elements[i]);
    }
};
//css
ZQuery.prototype.css=function(name,value){
    if(arguments.length==2){
        /*for(var i=0; i<this.elements.length; i++){
            this.elements[i].style[name]=value;
        }*/
        this.each(function(index,element){
            this.style[name]=value;
        });
    }else{
        if(typeof name=='string'){
            return getStyle(this.elements[0],name);
        }else{
            var json=name;
            this.each(function(index,element){
                for(var name in json){
                    this.style[name]=json[name];
                }
            });
        }
    }
    return this;
};
//attr
ZQuery.prototype.attr=function(name,value){
    if(arguments.length==2){
        this.each(function(index,element){
            this.setAttribute(name,value);
        });
    }else{
        if(typeof name=='string'){
            return this.elements[0].getAttribute(name);
        }else{
            var json=name;
            this.each(function(index,element){
                for(var name in json){
                    this.setAttribute(name,json[name]);
                }
            });
        }
    }
    return this;
};
//html
ZQuery.prototype.html=function(str){
    if(str || str==''){
        this.each(function(){
            this.innerHTML=str;
        });
    }else{
        return this.elements[0].innerHTML;
    }
    return this;
};
//val
ZQuery.prototype.val=function(str){
    if(str || str==''){
        this.each(function(){
            this.value=str;
        });
    }else{
        return this.elements[0].value;
    }
    return this;
};
//基本事件
/*ZQuery.prototype.click=function(fn){
    this.each(function(index,element){
        addEvent(this,'click',fn);
    });
};*/
'click mouseover mouseout mousedown mousemove mouseup keydown keyup load scroll resize blur focus contextmenu'.replace(/\w+/g,function(sEv){
    ZQuery.prototype[sEv]=function(fn){
        this.each(function(index,element){
            addEvent(this,sEv,fn);
        });
        return this;
    };
});
//class
ZQuery.prototype.addClass=function(sClass){
    var reg=new RegExp('\\b'+sClass+'\\b');
    this.each(function(){
        if(this.className){
            if(!reg.test(this.className)){
                this.className+=' '+sClass;
            }
        }else{
            this.className=sClass;
        }
    });
    return this;
};
ZQuery.prototype.removeClass=function(sClass){
    var reg=new RegExp('\\b'+sClass+'\\b','g');
    this.each(function(){
        if(reg.test(this.className)){
            this.className=this.className.replace(reg,'').replace(/^\s+|\s+$/g,'').replace(/\s+/g,' ');
        }
    });
    return this;
};
//animate
ZQuery.prototype.animate=function(json,options){
    this.each(function(){
        move(this,json,options);
    });
    return this;
};

//eq
ZQuery.prototype.eq=function(n){
    return $(this.elements[n]);
};
//get
ZQuery.prototype.get=function(n){
    return this.elements[n];
};
//index
ZQuery.prototype.index=function(){
    var obj=this.elements[this.elements.length-1];

    var aSibling=obj.parentNode.children;

    for(var i=0; i<aSibling.length; i++){
        if(aSibling[i]==obj){
            return i;
        }
    }
    return this;
};
//show
ZQuery.prototype.show=function(){
    this.each(function(){
        this.style.display='block';
    });
    return this;
};
//hide
ZQuery.prototype.hide=function(){
    this.each(function(){
        this.style.display='none';
    });
    return this;
};
//appendTo
ZQuery.prototype.appendTo=function(str){
    var aParent=getEle(str);

    for(var i=0; i<aParent.length; i++){
        aParent[i].insertAdjacentHTML('beforeEnd',this.domString);
    }
    return this;
};
ZQuery.prototype.prependTo=function(str){
    var aParent=getEle(str);

    for(var i=0; i<aParent.length; i++){
        aParent[i].insertAdjacentHTML('afterBegin',this.domString);
    }
    return this;
};
ZQuery.prototype.insertBefore=function(str){
    var aParent=getEle(str);

    for(var i=0; i<aParent.length; i++){
        aParent[i].insertAdjacentHTML('beforeBegin',this.domString);
    }
    return this;
};
ZQuery.prototype.insertAfter=function(str){
    var aParent=getEle(str);

    for(var i=0; i<aParent.length; i++){
        aParent[i].insertAdjacentHTML('afterEnd',this.domString);
    }
    return this;
};
//remove
ZQuery.prototype.remove=function(){
    this.each(function(){
        this.parentNode.removeChild(this);
    });
    return this;
};

//mouseenter
ZQuery.prototype.mouseenter=function(fn){
    this.each(function(){
        addEvent(this,'mouseover',function(ev){
            var from=ev.fromElement || ev.relatedTarget;
            if(this.contains(from))return;

            fn && fn.apply(this,arguments);
        });
    });
    return this;
};

//mouseleave
ZQuery.prototype.mouseleave=function(fn){
    this.each(function(){
        addEvent(this,'mouseout',function(ev){
            var to=ev.toElement || ev.relatedTarget;
            if(this.contains(to))return;

            fn && fn.apply(this,arguments);
        });
    });
    return this;
};

ZQuery.prototype.hover=function(fnOver,fnOut){
    this.mouseenter(fnOver);
    this.mouseleave(fnOut);
    return this;
};

//toggle
ZQuery.prototype.toggle=function(){
    var arg=arguments;
    this.each(function(){
        var _this=this;
        (function(count){
            addEvent(_this,'click',function(){
                var fn=arg[count%arg.length];

                fn && fn.apply(this,arguments);

                count++;
            });
        })(0);
    });
    return this;
};
//find
ZQuery.prototype.find=function(str){
    var aEle=getEle(str,this.elements);
    return $(aEle);
};

//交互
$.ajax=function(json){
    ajax(json);
    return this;
};

//插件
$.fn=ZQuery.prototype;
$.fn.extend=function(json){
    for(var name in json){
        ZQuery.prototype[name]=json[name];
    }
    return this;
};




/*以下是一些公共函数*/
function json2url(json){
    json.t=Math.random();

    var arr=[];
    for(var name in json){
        arr.push(name+'='+json[name]);
    }
    return arr.join('&');
}
function ajax(json){
    json=json || {};
    if(!json.url)return;
    json.data=json.data || {};
    json.timeout=json.timeout || 5000;
    json.type=json.type || 'get';

    if(json.dataType=='jsonp'){
        json.jsonp=json.jsonp || 'callback';

        var fnName='zQuery'+Math.random();
        fnName=fnName.replace('.','');

        json.data[json.jsonp]=fnName;

        var oS=document.createElement('script');
        oS.src=json.url+'?'+json2url(json.data);
        var oHead=document.getElementsByTagName('head')[0];
        oHead.appendChild(oS);

        window[fnName]=function(data){
            json.success && json.success(data);

            oHead.removeChild(oS);
        };
        return;
    }

    var timer=null;

    if(window.XMLHttpRequest){
        var oAjax=new XMLHttpRequest();
    }else{
        var oAjax=new ActiveXObject('Microsoft.XMLHTTP');
    }

    switch(json.type){
        case 'get':
            oAjax.open('GET',json.url+'?'+json2url(json.data),true);
            oAjax.send();
            break;
        case 'post':
            oAjax.open('POST',json.url,true);
            oAjax.setRequestHeader('Content-Type','application/x-www-form-urlencoded');
            oAjax.send(json2url(json.data));
            break;
    }

    //网络中...
    json.fnLoading && json.fnLoading();

    oAjax.onreadystatechange=function(){
        if(oAjax.readyState==4){

            json.complete && json.complete();

            clearTimeout(timer);
            if(oAjax.status>=200 && oAjax.status<300 || oAjax.status==304){
                if(json.dataType=='xml'){
                    json.success && json.success(oAjax.responseXML);
                }else{
                    json.success && json.success(oAjax.responseText);
                }
            }else{
                json.error && json.error(oAjax.status);
            }
        }
    };

    //网络超时
    timer=setTimeout(function(){
        oAjax.onreadystatechange=null;
        alert('您的网络不给力');
    },json.timeout);
}


function addEvent(obj,sEv,fn){
    if(obj.addEventListener){
        obj.addEventListener(sEv,function(ev){
            var oEvent=ev || event;
            if(fn.call(obj,oEvent)==false){
                oEvent.preventDefault();
                oEvent.cancelBubble=true;
            }
        },false);
    }else{
        obj.attachEvent('on'+sEv,function(ev){
            var oEvent=ev || event;
            if(fn.call(obj,oEvent)==false){
                oEvent.cancelBubble=true;
                return false;
            }
        });
    }
}

function getStyle(obj,name){
    return (obj.currentStyle || getComputedStyle(obj,false))[name];
}
function move(obj,json,options){
    //考虑默认值
    options=options || {};
    options.duration=options.duration || 500;
    options.easing=options.easing || 'linear';

    var count=Math.floor(options.duration/30);

    var start={};
    var dis={};
    for(var name in json){
        start[name]=parseFloat(getStyle(obj,name));
        if(isNaN(start[name])){
            switch (name){
                case 'left':
                    start[name]=obj.offsetLeft;
                    break;
                case 'top':
                    start[name]=obj.offsetTop;
                    break;
                case 'width':
                    start[name]=obj.offsetWidth;
                    break;
                case 'height':
                    start[name]=obj.offsetHeight;
                    break;
                case 'opacity':
                    start[name]=1;
                    break;
                case 'padding-left':
                    start[name]=0;
                    break;
                //font-size,border-width,margin-left....
            }
        }
        dis[name]=json[name]-start[name];
    }

    var n=0;
    clearInterval(obj.timer);
    obj.timer=setInterval(function(){
        n++;

        for(var name in json){

            switch (options.easing){
                case 'linear':
                    var scale=n/count;
                    var cur=start[name]+dis[name]*scale;
                    break;
                case 'ease-in':
                    var scale=n/count;
                    var cur=start[name]+dis[name]*Math.pow(scale,3);
                    break;
                case 'ease-out':
                    var scale=1-n/count;
                    var cur=start[name]+dis[name]*(1-Math.pow(scale,3));
                    break;
            }

            if(name=='opacity'){
                obj.style[name]=cur;
                obj.style.filter='alpha(opacity:'+cur*100+')';
            }else{
                obj.style[name]=cur+'px';
            }
        }

        if(n==count){
            clearInterval(obj.timer);
            options.complete && options.complete.call(obj);
        }
    },30);
}

function domReady(fn){
    if(document.addEventListener){
        document.addEventListener('DOMContentLoaded',fn,false);
    }else{
        document.attachEvent('onreadystatechange',function(){
            if(document.readyState=='complete' || document.readyState=='loaded'){
                fn && fn();
            }
        });
    }
}
function getByClass(oParent,sClass){
    if(oParent.getElementsByClassName){
        return oParent.getElementsByClassName(sClass);
    }else{
        var arr=[];
        var reg=new RegExp('\\b'+sClass+'\\b');
        var aEle=oParent.getElementsByTagName('*');
        for(var i=0; i<aEle.length; i++){
            if(reg.test(aEle[i].className)){
                arr.push(aEle[i]);
            }
        }
        return arr;
    }
}

function getByStr(aParent,str){
    var aChild=[];

    for(var i=0; i<aParent.length; i++){
        switch (str.charAt(0)){
            case '#':
                var obj=document.getElementById(str.substring(1));
                aChild.push(obj);
                break;
            case '.':
                var aEle=getByClass(aParent[i],str.substring(1));

                for(var j=0; j<aEle.length; j++){
                    aChild.push(aEle[j]);
                }
                break;
            default:
                if(/\w+\[\w+=\w+\]/.test(str)){ //input[type=button]
                    var aStr=str.split(/\[|=|\]/);
                    var aEle=aParent[i].getElementsByTagName(aStr[0]);
                    for(var j=0; j<aEle.length; j++){
                        if(aEle[j].getAttribute(aStr[1])==aStr[2]){
                            aChild.push(aEle[j]);
                        }
                    }
                }else if(/\w+:\w+(\(\d+\))?/.test(str)){ //li:first li:eq(3)
                    var aStr=str.split(/:|\(|\)/);
                    var aEle=aParent[i].getElementsByTagName(aStr[0]);
                    switch (aStr[1]){
                        case 'first':
                            aChild.push(aEle[0]);
                            break;
                        case 'last':
                            aChild.push(aEle[aEle.length-1]);
                            break;
                        case 'eq':
                            aChild.push(aEle[aStr[2]]);
                            break;
                        case 'lt':
                            for(var j=0; j<aStr[2]; j++){
                                aChild.push(aEle[j]);
                            }
                            break;
                        case 'gt':
                            for(var j=parseInt(aStr[2])+1; j<aEle.length; j++){
                                aChild.push(aEle[j]);
                            }
                            break;
                        case 'odd':
                            for(var j=1; j<aEle.length; j+=2){
                                aChild.push(aEle[j]);
                            }
                            break;
                        case 'even':
                            for(var j=0; j<aEle.length; j+=2){
                                aChild.push(aEle[j]);
                            }
                            break

                    }

                }else if(/\w+>\w+/.test(str)){  //ul>li
                    var aStr=str.split('>');
                    var aEle=aParent[i].getElementsByTagName(aStr[0]);
                    for(var j=0; j<aEle.length; j++){
                        for(var k=0; k<aEle[j].children.length; k++){
                            if(aEle[j].children[k].tagName.toLowerCase()==aStr[1]){
                                aChild.push(aEle[j].children[k]);
                            }
                        }
                    }
                }else{
                    var aEle=aParent[i].getElementsByTagName(str);

                    for(var j=0; j<aEle.length; j++){
                        aChild.push(aEle[j]);
                    }
                }
                break;
        }
    }

    return aChild;
}

function getEle(str,aParent){
    var arr=str.replace(/^\s+|\s+$/g,'').split(/\s+/);

    var aParent=aParent || [document];
    var aChild=[];

    for(var i=0; i<arr.length; i++){
        aChild=getByStr(aParent,arr[i]);

        aParent=aChild; //这一次选出来结果，作为下一次父级
    }

    return aChild;
}
