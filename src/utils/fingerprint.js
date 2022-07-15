export let index; //手指序号
export let strBmp; //bmp图像
export let strFTP;//模板 一般存于数据库
export let strFTR1;//特征1
export let strFTR2;//特征1
export let strFTR3;//特征3

export let WS_RET_ERR_OK = "0";//操作成功
export let WS_RET_ERR_PARAM = "-1"; //参数错误
export let WS_RET_ERR_MEMORY = "-2"; //内存分配失败，没有分配到足够的内存
export let WS_RET_ERR_FUN = "-3"; //功能未实现
export let WS_RET_ERR_DEVICE = "-4"; //设备不存在
export let WS_RET_ERR_INIT = "-5"; //设备未初始化
export let WS_RET_ERR_UNKOWN = "-6"; //非法错误号
export let WS_RET_ERR_EXTRACT = "-7"; //提取特征失败或合成模板失败
export let WS_RET_ERR_ELSE = "-9";//其它错误

export let WS_FM_Init = "FM_Init";
//{"reqcode":"FM_Init"}
//{"repcode":"FM_Init","result":"xx"}
export let WS_FM_Deinit = "FM_Deinit";
//{"reqcode":"FM_Deinit"}
//{"repcode":"FM_Deinit","result":"xx"}
export let WS_FM_GetDevVerison = "FM_GetDevVerison";
//{"reqcode":"FM_GetDevVerison"}
//{"repcode":"FM_GetDevVerison","result":"xx":"version":"string"}
export let WS_FM_GetSdkVerison = "FM_GetSdkVerison";
//{"reqcode":"FM_GetSdkVerison"}
//{"repcode":"FM_GetSdkVerison","result":"xx":"version":"string"}
export let WS_FM_DetectFinger = "FM_DetectFinger";
//{"reqcode":"FM_DetectFinger"}
//{"repcode":"FM_DetectFinger","result":"xx"}
export let WS_FM_Extract = "FM_Extract";
//{"reqcode":"FM_Extract","index":"(1~6)"}
//{"repcode":"FM_Extract","result":"xx","feature":"base64"}
export let WS_FM_Enroll = "FM_Enroll";
//{"reqcode":"FM_Enroll"}
//{"repcode":"FM_Enroll","result":"xx","template":"base64"}
export let WS_FM_Match = "FM_Match";
//{"reqcode":"FM_Match","template":"base64","feature":"base64"}
//{"repcode":"FM_Extract","result":"xx"}
export let WS_FPM_FeatureMatch = "FPM_FeatureMatch";

//--------------------------------------------------------------//
// 清空显示页面
//--------------------------------------------------------------//
export function ClearPage_OnClick() {
  document.getElementById('mb').value = "";
  document.getElementById("output").textContent = "";
}
//--------------------------------------------------------------//
// FM_Init
//--------------------------------------------------------------//
export function FM_Init_OnClick() {
  ClearPage_OnClick();
  let obj = { "reqcode": WS_FM_Init };
  let str = JSON.stringify(obj);
  plguin_send(str);
}
//--------------------------------------------------------------//
// FM_Deinit
//--------------------------------------------------------------//
export function FM_Deinit_OnClick() {
  ClearPage_OnClick();
  let obj = { "reqcode": WS_FM_Deinit };
  let str = JSON.stringify(obj);
  plguin_send(str);
}
//--------------------------------------------------------------//
// FM_GetSdkVerison
//--------------------------------------------------------------//
export function FM_GetSdkVerison_OnClick() {
  ClearPage_OnClick();
  let obj = { "reqcode": WS_FM_GetSdkVerison };
  let str = JSON.stringify(obj);
  plguin_send(str);
}
//--------------------------------------------------------------//
// FM_GetDevVerison
//--------------------------------------------------------------//
export function FM_GetDevVerison_OnClick() {
  ClearPage_OnClick();
  let obj = { "reqcode": WS_FM_GetDevVerison }
  let str = JSON.stringify(obj);
  plguin_send(str);
}

//--------------------------------------------------------------//
// FM_Extract
//--------------------------------------------------------------//
export function FM_Extract_OnClick() {
  // ClearPage_OnClick();
  let obj = { "reqcode": WS_FM_Extract, "index": document.getElementById("Select1").selectedIndex + 1 + "" };
  let str = JSON.stringify(obj);
  plguin_send(str);
}
//--------------------------------------------------------------//
// FM_Enroll
//--------------------------------------------------------------//
export function FM_Enroll_OnClick() {
  let obj = { "reqcode": WS_FM_Enroll }
  let str = JSON.stringify(obj);
  plguin_send(str);
}
//--------------------------------------------------------------//
// FM_DetectFinger
//--------------------------------------------------------------//
export function FM_DetectFinger_OnClick() {
  let obj = { "reqcode": WS_FM_DetectFinger }
  let str = JSON.stringify(obj);
  plguin_send(str);

}
//--------------------------------------------------------------//
// FM_Match
//--------------------------------------------------------------//
export function FM_Match_OnClick() {
  let obj = { "reqcode": WS_FM_Match, "template": strFTP, "feature": strFTR1 }
  let str = JSON.stringify(obj);
  plguin_send(str);

}

export function errAlert(iret) {
  if (iret === WS_RET_ERR_OK) {
    alert("操作成功");
  }
  else if (iret === WS_RET_ERR_PARAM) {
    alert("参数错误");
  }
  else if (iret === WS_RET_ERR_MEMORY) {
    alert("内存分配失败，没有分配到足够的内存");
  }
  else if (iret === WS_RET_ERR_FUN) {
    alert("功能未实现");
  }
  else if (iret === WS_RET_ERR_DEVICE) {
    alert("设备不存在");
  }
  else if (iret === WS_RET_ERR_EXTRACT) {
    alert("提取特征失败或合成模板失败");
  }
  else if (iret === WS_RET_ERR_INIT) {
    alert("设备未初始化");
  }
  else if (iret === WS_RET_ERR_UNKOWN) {
    alert("非法错误号");
  }
  else if (iret === WS_RET_ERR_ELSE) {
    alert("其它错误");
  }
}


let mb = null;
//显示信息  
let log = function (s) {
  if (document.readyState !== "complete") {
    log.buffer.push(s);
  } else {
    document.getElementById("output").textContent += (s + "\n");
    document.getElementById("outputdiv").scrollTop = document.getElementById("outputdiv").scrollHeight;

    this.$message({
      type: 'info',
      message: s
    })
  }
}
log.buffer = [];
//显示连接状态  
export function setConnected(status) {
  document.getElementById("socketstatus").innerHTML = status;
}
let ws = null;

//连接  
export function plguin_connect() {
  if (ws != null) {
    log("现已连接");
    return;
  }
  let url = "ws://localhost:9618";
  if ('WebSocket' in window) {
    ws = new WebSocket(url);
  } else if ('MozWebSocket' in window || false) {
    // ws = new MozWebSocket(url);
  } else {
    log("unsupported WebSocket");
    return;
  }
  ws.onopen = function () {
    log("open");
    setConnected("已连接");
    //设置发信息送类型为：ArrayBuffer  
    ws.binaryType = "arraybuffer";
  }
  ws.onmessage = function (e) {
    log("[recv]:" + e.data.toString());
    let s = e.data.toString();
    let obj = JSON.parse(s);

    if (obj.repcode == WS_FM_Init) {
      //
      errAlert(obj.result);
    }
    else if (obj.repcode == WS_FM_Deinit) {
      //
      errAlert(obj.result);
    }
    else if (obj.repcode == WS_FM_GetDevVerison) {
      //
      let info = "Ver:" + obj.version;
      alert(info);
    }
    else if (obj.repcode == WS_FM_GetSdkVerison) {
      //
      alert(obj.version);
    }
    else if (obj.repcode == WS_FM_Extract) {
      if (obj.result == WS_RET_ERR_OK) {
        if (0 == document.getElementById("Select1").selectedIndex) {
          strFTR1 = obj.feature;
        }
        if (1 == document.getElementById("Select1").selectedIndex) {
          strFTR2 = obj.feature;
        }
        if (2 == document.getElementById("Select1").selectedIndex) {
          strFTR3 = obj.feature;
        }

      }
      else
        errAlert(obj.result);
    }
    else if (obj.repcode == WS_FM_Enroll) {
      errAlert(obj.result);
      if (obj.result == WS_RET_ERR_OK) {
        document.getElementById('mb').value = obj.template;
        strFTP = obj.template;
      }
    }
    else if (obj.repcode == 'WS_FPM_FeatureMatch') {
      errAlert(obj.result);
    }
    else {
      log("Unkown");
    }
  }
  ws.onclose = function (e) {
    log("closed");
    ws = null;
  }
  ws.onerror = function (e) {
    log("error");
    ws = null;
  }
}

//断开连接  
export function plguin_close() {
  if (ws != null) {
    ws.close();
    ws = null;
    setConnected("已断开");
  }
}
export function plguin_send(s) {
  log("[send]:" + s);
  if (ws != null) {
    ws.send(s);
  }
  else {
    log("[send]: ws null");
  }
}