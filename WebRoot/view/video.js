
	

$(function(){
	video("视频监控平台");
	sidebar();
	//selectvideo();
	//mainvideo();
	//down();
	
	InitWebVideoCtrl();
	
	initDatepicker("yyyy-mm-dd hh:ii:ss");
	
})


// 获取登陆参数信息
function NationInfo(szip, szPort, szUsername, szPassword) {
    this.szip = szip;
    this.szPort = szPort;
    this.szUsername = szUsername;
    this.szPassword = szPassword;
}

// 设置视频插件的长和宽
function videosize(height, width) {
    this.videoheight = height;
    this.videowidth = width;
}

function video(titlename) {
    "use strict";

    var divtitle = document.createElement("div");
    var divLogo = document.createElement("div");
    var Text = document.createElement("span");

    divtitle.id = "title";
    divtitle.className = "head";
    divLogo.id = "loge";
    divLogo.className = "images";
    Text.id = "Text";
    Text.innerHTML = titlename ;

    document.body.appendChild(divtitle);
    divtitle.appendChild(divLogo);
    divLogo.appendChild(Text);
}

function sidebar() {
    "use strict";

    /**
    var node = document.createElement("div");
    node.id = "nodeselect";
    node.className = "sidebar";
    document.body.appendChild(node);
	*/
    //拼接字符串
    //这里保护公司隐私，去掉了获取设备的数据传输过程以及一些相关操作，这里放一个字符串作为示例
    //拼接字符串以这个格式为标准
    var tree = [/**
        {
            text: "盐田厂",
            tags:['113.98.199.13,admin,sz123456,9091'],//'IP,用户名,密码,端口'   1级节点存储登录信息
            nodes: [
                //{
                    //text: "摄像头1",
                        //tags:['113.98.199.13,admin,sz123456,9091']//'IP,用户名,密码,端口,通道号'
                //}
            ]
        },*/
        {
            text: "盐田区",
            nodes: [
                {
                    text: "盐田厂",
            		tags:['113.98.199.13,admin,sz123456,9091','1'],//'IP,用户名,密码,端口','NVR序号'
                },
                {
                	text: "红花岭1",
            		tags:['119.136.19.158,admin,admin12345,81','2'],//'IP,用户名,密码,端口','NVR序号'
                },
                {
                	text: "红花岭2",
            		tags:['119.136.19.158,admin,admin12345,91','3'],//'IP,用户名,密码,端口','NVR序号'
                }
            ]
        }
    ];
    
    $("#nodeselect").treeview({
        //默认只显示第一层级的数据
        levels: 2,
        data: tree
    });
    
    settingTree(null,tree,null,null);

}

function mainvideo() {
    "use strict";

    var video = document.createElement("div");
    var divVideoplay = document.createElement("div");

    video.id = "video";
    video.className = "video";
    divVideoplay.id = "divPlugin";
    divVideoplay.className = "plugin";

    document.body.appendChild(video);
    video.appendChild(divVideoplay);

    var videoheight = document.getElementById("video").offsetHeight;
    var videowidth = document.getElementById("video").offsetWidth;
    
    var b = new videosize(videoheight, videowidth);
    ///getvideosize(b);

}

function selectvideo() {
    "use strict";

    var control = document.createElement("div");
    control.id = "control";
    control.className = "videocontrol";

    //定义生成图标函数
    function div(id,name,annotation,functiondiv) {
        var div = document.createElement("div");
        div.id = id;
        div.className = name;
        div.setAttribute("data-toggle", "tooltip");
        div.setAttribute("title", annotation);
        div.setAttribute("onclick", functiondiv);
        control.appendChild(div);
    }

    //开始播放
    var play = div("play","play","开始播放","clickStartRealPlay()");
    //停止播放
    var stopplay = div("stop","stop","停止播放","clickStopRealPlay()");
    //抓图
    var catpic = div("catpic","pic","抓图","clickCapturePic()");
    //设置路径
    var setlocal = div("view","see","设置路径","clickOpenFileDlg('previewPicPath', 0)");
    //自动聚焦
    var focusauto = div("focusauto","focusauto","自动聚焦","null");

    //定义控制图标函数
    function divcontrol(name,annotation,mousedoenfunbction,mouseupfunction,mouseoutfunction) {
        var div = document.createElement("div");
        div.className = name;
        div.setAttribute("data-toggle", "tooltip");
        //控件提示名称
        div.setAttribute("title", annotation);
        //鼠标按下事件
        div.setAttribute("onmousedown", mousedoenfunbction);
        //鼠标弹起事件
        div.setAttribute("onmouseup", mouseupfunction);
        //鼠标移出事件
        div.setAttribute("onmouseout",mouseoutfunction);
        control.appendChild(div);
    }

    //左上方
    var leftup = divcontrol("leftup","左上方","mouseDownPTZControl(5)","mouseUpPTZControl()","mouseUpPTZControl()");
    //上方
    var up = divcontrol("up","上方","mouseDownPTZControl(1)","mouseUpPTZControl()","mouseUpPTZControl()");
    //右上方
    var rightup = divcontrol("rightup","右上方","mouseDownPTZControl(7)","mouseUpPTZControl()","mouseUpPTZControl()");
    //左边
    var left = divcontrol("left","左边","mouseDownPTZControl(3)","mouseUpPTZControl()","mouseUpPTZControl()");
    //巡航
    var around = divcontrol("around","巡航","mouseDownPTZControl(9)","mouseUpPTZControl()","mouseUpPTZControl()");
    //向右
    var right = divcontrol("right","向右","mouseDownPTZControl(4)","mouseUpPTZControl()","mouseUpPTZControl()");
    //左下
    var leftdown = divcontrol("leftdown","左下","mouseDownPTZControl(6)","mouseUpPTZControl()","mouseUpPTZControl()");
    //向下
    var downward = divcontrol("downward","向下","mouseDownPTZControl(2)","mouseUpPTZControl()","mouseUpPTZControl()");
    //右下
    var rightdown = divcontrol("rightdown","右下","mouseDownPTZControl(8)","mouseUpPTZControl()","mouseUpPTZControl()");

    //焦距变大
    var ZoomIn = divcontrol("ZoomIn","调焦+","PTZZoomIn()","PTZZoomStop()","PTZZoomStop()");
    //焦距变小
    var ZoomOut = divcontrol("ZoomOut","调焦-","PTZZoomout()","PTZZoomStop()","PTZZoomStop()");
    //聚焦+
    var FocusIn = divcontrol("FocusIn","聚焦+","PTZFocusIn()","PTZFoucusStop()","PTZFoucusStop()");
    //聚焦-
    var FocusOut = divcontrol("FocusOut","聚焦-","PTZFoucusOut()","PTZFoucusStop()","PTZFoucusStop()");
    //光圈+
    var IrisIn = divcontrol("IrisIn","光圈+","PTZIrisIn()","PTZIrisStop()","PTZIrisStop()");
    //光圈-
    var IrisOut = divcontrol("IrisOut","光圈-","PTZIrisOut()","PTZIrisStop()","PTZIrisStop()");

    //云台速度选择
    var speed = document.createElement("div");
    var speedname = document.createElement("span");
    var speedselect = document.createElement("select");
    speed.className = "selectseppd";
    speedname.innerHTML = "选择速度:";
    speedselect.className = "speedlevel";
    speedselect.id = "ptzspeed";

    var speedlevel = new Array();

    for (var i = 1; i < 8; i++) {
        speedlevel[i] = document.createElement("option");
        speedlevel[i].innerHTML = i;
        speedlevel[i].setAttribute("value",i);
        speedselect.appendChild(speedlevel[i]);
        //默认速度为4
    }

    //定义fieldset标签，设置为定点巡航
    var cruise = document.createElement("fieldset");
    cruise.className = "cruise";
    var legend = document.createElement("legend");
    legend.innerHTML = "定点巡航";

    document.body.appendChild(control);
    control.appendChild(speed);
    speed.appendChild(speedname);
    control.appendChild(speedselect);
    control.appendChild(cruise);
}

function down() {
    "use strict";

    var down = document.createElement("div");
    down.id = "down";
    down.className = "down";

    var span = document.createElement("span");
    span.innerHTML = "XX公司";

    document.body.appendChild(down);
    down.appendChild(span);
}

function settingTree(treeContainer,tree,numTag,channels){
	//
	if(numTag != null && numTag > 0 && channels.length > 0){
		var nodeNodes = tree[0].nodes;
		var NVRNode = nodeNodes[numTag-1];
		NVRNode.nodes = channels;
	}
	
	
	$("#nodeselect").treeview({
        //默认只显示第一层级的数据
        levels: 2,
        data: tree
    });
	
    $('#nodeselect').on('nodeSelected', function (event, node) {//alert(node.text);
    	var tagsArray = node.tags;
    	var numTag = (tagsArray != undefined && tagsArray.length > 1) ? tagsArray[1] : null;
    	console.log(dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")+" 节点numTag："+numTag)
    	//alert(numTag);
    	var nodeNodes = node.nodes;//alert(nodeNodes);
    	//2级节点（NVR节点）
    	if(numTag >= 0){
    		if(nodeNodes == undefined){console.log(dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")+" 点击NVR节点")
    			//登录
    			
    			//数组转字符串
		        var IRSTinfo = tagsArray[0].toString();
		        //字符串拼接数组
		        var abcArray = IRSTinfo.split(',');
		        //用户登陆IP
		        var IRSTIP = abcArray[0];
		        //用户登陆名
		        var IRSTUSER = abcArray[1];
		        //用户登陆密码
		        var IRSTPSW = abcArray[2];
		        //用户登陆端口号
		        var IRSTPort = abcArray[3];
		        //摄像头的通道号
		        //var IRSTChannel = abcArray[4];
		        var a = new NationInfo(IRSTIP, IRSTPort, IRSTUSER, IRSTPSW);
		        openvideo(a);
		        clickLogin(tree,numTag);
    		}
    	}
    	
    	//alert(324);
    	
    	
    	
    	var parentNode = $('#nodeselect').treeview('getParent', node);//alert(parentNode.tags);
    	var parentTagsArray = parentNode.tags;
    	var parentNumTag = (parentTagsArray != undefined && parentTagsArray.length > 1) ? parentTagsArray[1] : null;
    	console.log(dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")+" 父节点parentNumTag："+parentNumTag)
    	
    	//3级节点(摄像头节点)
    	if(tagsArray != undefined && tagsArray.length == 1){
    		if(parentNumTag >= 0 && nodeNodes == undefined){console.log(dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss")+" 点击摄像头节点")
    		var tagsval = node.tags.toString();
    		var tagsArray = tagsval.split(',');//id,bZero,szDeviceIdentify
    		
    		var szDeviceIdentify = tagsArray[2];
       		var iChannelID = tagsArray[0];
        	var bZeroChannel = tagsArray[1];
        	bZeroChannel == "true" ? true : false;
        	
        	$("#ip").val(szDeviceIdentify);
        	var oSel = $("#channels");
        	oSel.val(iChannelID);
        	oSel.attr('bZero',bZeroChannel);
        	clickStartRealPlay(2);
    	}
    	}
    	
    	
    	/**
    	var isParent = $('#nodeselect').treeview('getParent', node);//alert(isParent.nodeId);
    	var nodeNodes = node.nodes;//alert(nodeNodes);
    	//1级节点
    	if(isParent.nodeId == undefined){
    		//子节点为null
    		if(nodeNodes != null && nodeNodes.length == 0){
    			//登录
    			
    			//数组转字符串
		        var IRSTinfo = node.tags.toString();
		        //字符串拼接数组
		        var abcArray = IRSTinfo.split(',');
		        //用户登陆IP
		        var IRSTIP = abcArray[0];
		        //用户登陆名
		        var IRSTUSER = abcArray[1];
		        //用户登陆密码
		        var IRSTPSW = abcArray[2];
		        //用户登陆端口号
		        var IRSTPort = abcArray[3];
		        //摄像头的通道号
		        //var IRSTChannel = abcArray[4];
		        var a = new NationInfo(IRSTIP, IRSTPort, IRSTUSER, IRSTPSW);
		        openvideo(a);
		        clickLogin(tree);
    		}
    	}
    	
    	//2级节点
    	if(isParent.nodeId != undefined && nodeNodes == null){
    		var tagsval = node.tags.toString();
    		var tagsArray = tagsval.split(',');//id,bZero,szDeviceIdentify
    		
    		var szDeviceIdentify = tagsArray[2];
       		var iChannelID = tagsArray[0];
        	var bZeroChannel = tagsArray[1];
        	bZeroChannel == "true" ? true : false;
        	
        	$("#ip").val(szDeviceIdentify);
        	var oSel = $("#channels");
        	oSel.val(iChannelID);
        	oSel.attr('bZero',bZeroChannel);
        	clickStartRealPlay(2);
    	
		}
    	
    	*/
        
    });
    
    
}

function initDatepicker(format){
	$(".datepicker").datetimepicker({
        //language: "zh-CN",
        //autoclose: true,//选中之后自动隐藏日期选择框
        //clearBtn: true,//清除按钮
        //todayBtn: true,//今日按钮
        format: format//日期格式
    });
}
