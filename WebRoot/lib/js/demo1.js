var szIP = "",
    szPort = "",
    szUsername = "",
    szPassword = "",
    szInfo = "";
    szChannel = "";
    sziWndowType = 3;

    //参数初始化
function openvideo(a) {
    szIP = a.szip;
    szPort = a.szPort,
    szUsername = a.szUsername,
    szPassword = a.szPassword;
    szChannel = a.szchannel;
}

//视屏控件初始化
var getvideosize =  function (b) {
    // 初始化插件参数及插入插件
    WebVideoCtrl.I_InitPlugin(b.videowidth,b.videoheight, {
        iWndowType: sziWndowType,
        cbSelWnd: function (xmlDoc) {
            g_iWndIndex = $(xmlDoc).find("SelectWnd").eq(0).text();
        }
    });
    WebVideoCtrl.I_InsertOBJECTPlugin("divPlugin");

    //初始化日期时间
    var szCurTime = dateFormat(new Date(), "yyyy-MM-dd");
    $("#starttime").val(szCurTime + " 00:00:00");
    $("#endtime").val(szCurTime + " 23:59:59");
};

// 显示操作信息
function showOPInfo(szInfo) {
    szInfo = "<div>" + dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss") + " " + szInfo + "</div>";
    $("#opinfo").html(szInfo + $("#opinfo").html());
}

// 获取窗口尺寸
function getWindowSize() {
    var nWidth = $(this).width() + $(this).scrollLeft(),
        nHeight = $(this).height() + $(this).scrollTop();

    return {width: nWidth, height: nHeight};
}

// 打开选择框 0：文件夹  1：文件
function clickOpenFileDlg(id, iType) {
    var szDirPath = WebVideoCtrl.I_OpenFileDlg(iType);
    if (szDirPath != -1 && szDirPath != "" && szDirPath != null) {
        $("#" + id).val(szDirPath);
    }
    clickSetLocalCfg();
}

// 获取本地参数
function clickGetLocalCfg() {
    var xmlDoc = WebVideoCtrl.I_GetLocalCfg();

    $("#netsPreach").val($(xmlDoc).find("BuffNumberType").eq(0).text());
    $("#wndSize").val($(xmlDoc).find("PlayWndType").eq(0).text());
    $("#rulesInfo").val($(xmlDoc).find("IVSMode").eq(0).text());
    $("#captureFileFormat").val($(xmlDoc).find("CaptureFileFormat").eq(0).text());
    $("#packSize").val($(xmlDoc).find("PackgeSize").eq(0).text());
    $("#recordPath").val($(xmlDoc).find("RecordPath").eq(0).text());
    $("#downloadPath").val($(xmlDoc).find("DownloadPath").eq(0).text());
    $("#previewPicPath").val($(xmlDoc).find("CapturePath").eq(0).text());
    $("#playbackPicPath").val($(xmlDoc).find("PlaybackPicPath").eq(0).text());
    $("#playbackFilePath").val($(xmlDoc).find("PlaybackFilePath").eq(0).text());
    $("#protocolType").val($(xmlDoc).find("ProtocolType").eq(0).text());

    showOPInfo("本地配置获取成功！");
}

// 设置本地参数
function clickSetLocalCfg() {
    var arrXml = [],
        szInfo = "";

    arrXml.push("<LocalConfigInfo>");
    arrXml.push("<PackgeSize>" + $("#packSize").val() + "</PackgeSize>");
    arrXml.push("<PlayWndType>" + $("#wndSize").val() + "</PlayWndType>");
    arrXml.push("<BuffNumberType>" + $("#netsPreach").val() + "</BuffNumberType>");
    arrXml.push("<RecordPath>" + $("#recordPath").val() + "</RecordPath>");
    arrXml.push("<CapturePath>" + $("#previewPicPath").val() + "</CapturePath>");
    arrXml.push("<PlaybackFilePath>" + $("#playbackFilePath").val() + "</PlaybackFilePath>");
    arrXml.push("<PlaybackPicPath>" + $("#playbackPicPath").val() + "</PlaybackPicPath>");
    arrXml.push("<DownloadPath>" + $("#downloadPath").val() + "</DownloadPath>");
    arrXml.push("<IVSMode>" + $("#rulesInfo").val() + "</IVSMode>");
    arrXml.push("<CaptureFileFormat>" + $("#captureFileFormat").val() + "</CaptureFileFormat>");
    arrXml.push("<ProtocolType>" + $("#protocolType").val() + "</ProtocolType>");
    arrXml.push("</LocalConfigInfo>");

    var iRet = WebVideoCtrl.I_SetLocalCfg(arrXml.join(""));

    if (0 == iRet) {
        szInfo = "本地配置设置成功！";
    } else {
        szInfo = "本地配置设置失败！";
    }
    showOPInfo(szInfo);
}


// 登录
function clickLogin() {
    if ("" == szIP || "" == szPort) {
        return;
    }

    var iRet = WebVideoCtrl.I_Login(szIP, 1, szPort, szUsername, szPassword, {
        success: function (xmlDoc) {
            showOPInfo(szIP + " 登录成功！");

            $("#ip").prepend("<option value='" + szIP + "'>" + szIP + "</option>");
            setTimeout(function () {
                $("#ip").val(szIP);
                getChannelInfo();
            }, 10);
        },
        error: function () {
            showOPInfo(szIP + " 登录失败！");
        }
    });

    if (-1 == iRet) {
        showOPInfo(szIP + " 已登录过！");
    }
}

// 退出
function clickLogout() {

    if (szIP == "") {
        return;
    }

    var iRet = WebVideoCtrl.I_Logout(szIP);
    if (0 == iRet) {
        szInfo = "退出成功！";

        $("#ip option[value='" + szIP + "']").remove();
        getChannelInfo();
    } else {
        szInfo = "退出失败！";
    }
    showOPInfo(szIP + " " + szInfo);
}

// 获取通道
function getChannelInfo() {
    var oSel = szChannel,
        nAnalogChannel = 0;

    if ("" == szIP) {
        return;
    }

    // 模拟通道
    WebVideoCtrl.I_GetAnalogChannelInfo(szIP, {
        async: false,
        success: function (xmlDoc) {
            var oChannels = szChannel;
            nAnalogChannel = oChannels.length;

            $.each(oChannels, function (i) {
                var id = parseInt($(this).find("id").eq(0).text(), 10),
                    name = $(this).find("name").eq(0).text();
                if ("" == name) {
                    name = "Camera " + (id < 9 ? "0" + id : id);
                }
                oSel.append("<option value='" + id + "' bZero='false'>" + name + "</option>");
            });
            showOPInfo(szIP + " 获取模拟通道成功！");
        },
        error: function () {
            showOPInfo(szIP + " 获取模拟通道失败！");
        }
    });

    // 数字通道
    WebVideoCtrl.I_GetDigitalChannelInfo(szIP, {
        async: false,
        success: function (xmlDoc) {
            var oChannels = szChannel;

            $.each(oChannels, function (i) {
                var id = parseInt($(this).find("id").eq(0).text(), 10),
                    name = $(this).find("name").eq(0).text(),
                    online = $(this).find("online").eq(0).text();
                if ("false" == online) {// 过滤禁用的数字通道
                    return true;
                }
                if ("" == name) {
                    name = "IPCamera " + ((id - nAnalogChannel) < 9 ? "0" + (id - nAnalogChannel) : (id - nAnalogChannel));
                }
                oSel.append("<option value='" + id + "' bZero='false'>" + name + "</option>");
            });
            showOPInfo(szIP + " 获取数字通道成功！");
        },
        error: function () {
            showOPInfo(szIP + " 获取数字通道失败！");
        }
    });
    // 零通道
    WebVideoCtrl.I_GetZeroChannelInfo(szIP, {
        async: false,
        success: function (xmlDoc) {
            var oChannels = szChannel;

            $.each(oChannels, function (i) {
                var id = parseInt($(this).find("id").eq(0).text(), 10),
                    name = $(this).find("name").eq(0).text();
                if ("" == name) {
                    name = "Zero Channel " + (id < 9 ? "0" + id : id);
                }
                if ("true" == $(this).find("enabled").eq(0).text()) {// 过滤禁用的零通道
                    oSel.append("<option value='" + id + "' bZero='true'>" + name + "</option>");
                }
            });
            showOPInfo(szIP + " 获取零通道成功！");
        },
        error: function () {
            showOPInfo(szIP + " 获取零通道失败！");
        }
    });
}

// 开始预览
function clickStartRealPlay() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        iStreamType = parseInt(1, 10),
        iChannelID = parseInt(szChannel, 10),

        bZeroChannel = false,
        szInfo = "";

    if ("" == szIP) {
        return;
    }

    if (oWndInfo != null) {// 已经在播放了，先停止
        WebVideoCtrl.I_Stop();
    }

    var iRet = WebVideoCtrl.I_StartRealPlay(szIP, {
        iStreamType: iStreamType,
        iChannelID: iChannelID,
        bZeroChannel: bZeroChannel
    });

    if (0 == iRet) {
        szInfo = "开始预览成功！";
    } else {
        szInfo = "开始预览失败！";
    }

    showOPInfo(szIP + " " + szInfo);
}

// 停止预览
function clickStopRealPlay() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        szInfo = "";

    if (oWndInfo != null) {
        var iRet = WebVideoCtrl.I_Stop();
        if (0 == iRet) {
            szInfo = "停止预览成功！";
        } else {
            szInfo = "停止预览失败！";
        }
        showOPInfo(oWndInfo.szIP + " " + szInfo);
    }
}

// 抓图
function clickCapturePic() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        szInfo = "";

    if (oWndInfo != null) {
        var szChannelID = szChannel,
            szPicName = oWndInfo.szIP + "_" + szChannelID + "_" + new Date().getTime(),
            iRet = WebVideoCtrl.I_CapturePic(szPicName);
        if (0 == iRet) {
            szInfo = "抓图成功！";
            //alert("抓图成功");
        } else {
            szInfo = "抓图失败！";
            // alert("抓图失败");
        }
        showOPInfo(oWndInfo.szIP + " " + szInfo);
    }
}

// PTZ控制 9为自动，1,2,3,4,5,6,7,8为方向PTZ
var g_bPTZAuto = false;

function mouseDownPTZControl(iPTZIndex) {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        bZeroChannel = false,
        iPTZSpeed = $("#ptzspeed").val(),
        bStop = false;

    if (bZeroChannel) {// 零通道不支持云台
        return;
    }

    if (oWndInfo != null) {
        if (9 == iPTZIndex && g_bPTZAuto) {
            iPTZSpeed = 0;// 自动开启后，速度置为0可以关闭自动
            bStop = true;
        } else {
            g_bPTZAuto = false;// 点击其他方向，自动肯定会被关闭
            bStop = false;
        }

        WebVideoCtrl.I_PTZControl(iPTZIndex, bStop, {
            iPTZSpeed: iPTZSpeed,
            success: function (xmlDoc) {
                if (9 == iPTZIndex) {
                    g_bPTZAuto = !g_bPTZAuto;
                }
                showOPInfo(oWndInfo.szIP + " 开启云台成功！");
            },
            error: function () {
                showOPInfo(oWndInfo.szIP + " 开启云台失败！");
            }
        });
    }
}

// 方向PTZ停止
function mouseUpPTZControl() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(1, true, {
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szIP + " 停止云台成功！");
            },
            error: function () {
                showOPInfo(oWndInfo.szIP + " 停止云台失败！");
            }
        });
    }
}

// 设置预置点
function clickSetPreset() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        iPresetID = parseInt($("#preset").val(), 10);

    if (oWndInfo != null) {
        WebVideoCtrl.I_SetPreset(iPresetID, {
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szIP + " 设置预置点成功！");
            },
            error: function () {
                showOPInfo(oWndInfo.szIP + " 设置预置点失败！");
            }
        });
    }
}

// 调用预置点
function clickGoPreset() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex),
        iPresetID = parseInt($("#preset").val(), 10);

    if (oWndInfo != null) {
        WebVideoCtrl.I_GoPreset(iPresetID, {
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szIP + " 调用预置点成功！");

            },
            error: function () {
                showOPInfo(oWndInfo.szIP + " 调用预置点失败！");
            }
        });
    }

    clickCapturePic();
}

function PTZZoomIn() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(10, false, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szIP + " 调焦+成功！");
            },
            error: function () {
                showOPInfo(oWndInfo.szIP + "  调焦+失败！");
            }
        });
    }
}

function PTZZoomout() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(11, false, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szIP + " 调焦-成功！");
            },
            error: function () {
                showOPInfo(oWndInfo.szIP + "  调焦-失败！");
            }
        });
    }
}

function PTZZoomStop() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(11, true, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szIP + " 调焦停止成功！");
            },
            error: function () {
                showOPInfo(oWndInfo.szIP + "  调焦停止失败！");
            }
        });
    }
}

function PTZFocusIn() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(12, false, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szIP + " 聚焦+成功！");
            },
            error: function () {
                showOPInfo(oWndInfo.szIP + "  聚焦+失败！");
            }
        });
    }
}

function PTZFoucusOut() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(13, false, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szIP + " 聚焦-成功！");
            },
            error: function () {
                showOPInfo(oWndInfo.szIP + "  聚焦-失败！");
            }
        });
    }
}

function PTZFoucusStop() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(12, true, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szIP + " 聚焦停止成功！");
            },
            error: function () {
                showOPInfo(oWndInfo.szIP + "  聚焦停止失败！");
            }
        });
    }
}

function PTZIrisIn() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(14, false, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szIP + " 光圈+成功！");
            },
            error: function () {
                showOPInfo(oWndInfo.szIP + "  光圈+失败！");
            }
        });
    }
}

function PTZIrisOut() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(15, false, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szIP + " 光圈-成功！");
            },
            error: function () {
                showOPInfo(oWndInfo.szIP + "  光圈-失败！");
            }
        });
    }
}

function PTZIrisStop() {
    var oWndInfo = WebVideoCtrl.I_GetWindowStatus(g_iWndIndex);

    if (oWndInfo != null) {
        WebVideoCtrl.I_PTZControl(14, true, {
            iWndIndex: g_iWndIndex,
            success: function (xmlDoc) {
                showOPInfo(oWndInfo.szIP + " 光圈停止成功！");
            },
            error: function () {
                showOPInfo(oWndInfo.szIP + "  光圈停止失败！");
            }
        });
    }
}

dateFormat = function (oDate, fmt) {
    var o = {
        "M+": oDate.getMonth() + 1, //月份
        "d+": oDate.getDate(), //日
        "h+": oDate.getHours(), //小时
        "m+": oDate.getMinutes(), //分
        "s+": oDate.getSeconds(), //秒
        "q+": Math.floor((oDate.getMonth() + 3) / 3), //季度
        "S": oDate.getMilliseconds()//毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (oDate.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};

