/* eslint-disable */
<template>
  <div id="app">
    <img src="./assets/logo.png" />
    <div>
      <el-input
        style="width: 10rem; margin-right: 1rem"
        v-model="form.password"
        placeholder="请输入内容"
      ></el-input>
      <el-button @click.prevent="readCard">读取卡号</el-button>
      <el-divider>指纹</el-divider>
      <el-button @click.prevent="">检测设备</el-button>
      <el-button @click.prevent="">插件版本</el-button>
      <el-button @click.prevent="">设备版本</el-button>
      <el-button @click.prevent="">关闭设备</el-button>
      <el-button @click.prevent="">清空数据</el-button>
      <el-button @click.prevent="">检测手指</el-button>
      <el-button @click.prevent="">提取特征</el-button>
      <el-button @click.prevent="">合成模板</el-button>
      <el-divider></el-divider>
      <div class="box">
        <div class="item" v-for="(item, index) in msgs" :key="index">
          <el-alert :title="item" type="info" :closable="false" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { alertError } from "@/utils/alertError";
import { ReaderFunction } from "@/utils/ReaderFunction";
import * as fingerprint from "./utils/fingerprint";

export default {
  name: "app",
  components: {},
  data() {
    return {
      form: {
        password: "",
      },
      url: "ws://localhost:9618",
      msgs: [],
      input: "",
      ws: null,
      strFTP: "",
      strFTR1: "",
      strFTR2: "",
      strFTR3: "",
    };
  },
  methods: {
    readCard() {
      let device = 0;
      const _this = this;
      console.log(ReaderFunction);
      let reader = ReaderFunction.createNew();
      // console.log(reader);
      reader.TyA_GetUID(parseInt(device), function (result) {
        if (!alertError(result, "获取UID失败！")) {
          reader.Sys_SetBuzzer(reader.device_id, 20, null);
          _this.form.password = result.data.snr;
          console.log(JSON.stringify(result));
        }
      });
    },
    logF(msg) {
      this.$message({
        type: "info",
        message: msg,
      });
    },
    setConnected(status) {
      const msgs = this.msgs;
      msgs.push(status);
    },
    // 初始化插件
    plugin_connect() {
      let ws = this.ws;
      const logF = this.logF;
      const setConnected = this.setConnected;
      if (ws != null) {
        logF("现已连接");
        return;
      }
      const url = this.url;
      if ("WebSocket" in window) {
        ws = new WebSocket(url);
      } else if ("MozWebSocket" in window) {
        // ws = new MozWebSocket(url);
      } else {
        logF("unsupported WebSocket");
        return;
      }
      ws.onopen = function () {
        logF("open");
        setConnected("已连接");
        //设置发信息送类型为：ArrayBuffer
        ws.binaryType = "arraybuffer";
      };
      ws.onmessage = function (e) {
        logF("[recv]:" + e.data.toString());
        var s = e.data.toString();
        var obj = JSON.parse(s);

        if (obj.repcode == fingerprint.WS_FM_Init) {
          //
          fingerprint.errAlert(obj.result);
        } else if (obj.repcode == fingerprint.WS_FM_Deinit) {
          //
          fingerprint.errAlert(obj.result);
        } else if (obj.repcode == fingerprint.WS_FM_GetDevVerison) {
          //
          var info = "Ver:" + obj.version;
          alert(info);
        } else if (obj.repcode == fingerprint.WS_FM_GetSdkVerison) {
          //
          alert(obj.version);
        } else if (obj.repcode == fingerprint.WS_FM_Extract) {
          if (obj.result == fingerprint.WS_RET_ERR_OK) {
            if (0 == document.getElementById("Select1").selectedIndex) {
              this.strFTR1 = obj.feature;
            }
            if (1 == document.getElementById("Select1").selectedIndex) {
              this.strFTR2 = obj.feature;
            }
            if (2 == document.getElementById("Select1").selectedIndex) {
              this.strFTR3 = obj.feature;
            }
          } else fingerprint.errAlert(obj.result);
        } else if (obj.repcode == fingerprint.WS_FM_Enroll) {
          fingerprint.errAlert(obj.result);
          if (obj.result == fingerprint.WS_RET_ERR_OK) {
            document.getElementById("mb").value = obj.template;
            this.strFTP = obj.template;
          }
        } else if (obj.repcode == fingerprint.WS_FPM_FeatureMatch) {
          fingerprint.errAlert(obj.result);
        } else {
          logF("Unkown");
        }
      };
      ws.onclose = function (e) {
        logF("closed");
        ws = null;
      };
      ws.onerror = function (e) {
        logF("error");
        ws = null;
      };
    },
  },
  mounted() {
    this.plugin_connect();
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.box {
  display: flex;
  flex-direction: column;
  justify-items: start;
  align-items: center;
}
.item {
  width: 80vw;
}
</style>
