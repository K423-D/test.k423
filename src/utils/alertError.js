import Vue from "vue";
const vm = new Vue()

export function alertError(result, errorMsg) {
  console.log(result, 'result');
  if (result == null) {
    vm.$message.error("接口调用失败，请检查服务器软件是否已开启！");
  }
  else if (result.code == 0) {
    vm.$message.error(result.msg);
  }
  else if (result.retval != 0) {
    if (result.func == "TyA_Request") {
      errorMsg = errorMsg + "请检查卡片是否存在，";
    }
    else if (result.func == "Sys_Open") {
      errorMsg = errorMsg + "请检查设备是否连接，";
    }
    vm.$message.error(errorMsg + "错误码：" + result.retval);
  }
  else {
    // vm.$message.error(model);
    return false;
  }
  return true;
}