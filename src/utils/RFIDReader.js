/*
错误码：
0x00 成功
0x0A 通用错误
0x0B 不支持该命令
0x0C 命令参数错
0x0D 无卡
0x0E 射频基站损坏
0x14 寻卡失败
0x15 卡复位失败
0x16 密钥验证失败
0x17 读卡失败
0x18 写卡失败
0x51 Flash块号错误
0x52 Flash偏移地址错误
0x53 Flash数据长度错误
0x54 读Flash失败
0x55 写Flash失败
0x56 擦除Flash失败
0xC0 通信一般错误
0xC1 没找到设备
0xC2 设备未打开
0xC3 设备已经打开
0xC4 数据传输超时
0xC5 数据传输失败
0xC6 获取设备信息失败
0xC7 设备句柄错误
0xC8 缓存大小错误
0xC9 系统错误
0xCA 通信未知错误
0xE0 通用错误
0xE1 返回数据的校验错误
0xE2 返回数据的长度错误
0xE3 发送数据的参数错误*/
// import request from '@/utils/request'
// import axios from 'axios'
// import QueryString from 'qs';
import jQuery from 'jquery';

export const RFIDReader = {
	createNew() {
		let reader = {};

		/*
		*调用读卡器函数, 必须等待回调后才可继续执行下一个调用
		*
		*参数：
		*func：函数名
		*
		*param：参数，数组类型
		*
		*callback:回调函数
		*
		*回调返回数据：
		*
		*访问服务器失败时返回null
		*
		*否则返回如下参数：
		*result.code 指示函数是否调用成功，返回1表示成功，0表示失败，具体信息参考result.msg。当调用不存在的函数，函数参数类型或个数不正确时都有可能导致调用失败
		*result.msg 函数调用失败时，返回的错误说明
		*result.func 调用的函数名
		*result.cbdata 调用时传入的自定义参数
		*result.retval 为函数返回值,返回0表示成功，非0表示失败，详见错误码说明
		*result.data.xxx 为函数返回的附加参数，详见具体函数说明
		*/
		reader.call = function (func, param, callback) {
			jQuery.support.cors = true;
			jQuery.ajax({
				url: 'http://localhost:13570/reader',
				// url: 'http://localhost:13570/reader',
				type: 'POST',
				timeout: 2000,
				beforeSend: function (request) {
					request.setRequestHeader("myHeade", true);
				},
				dataType: 'json',
				data: JSON.stringify({ func: func, cbdata: "", parameters: param }),
				success: function (data) {
					if (callback != null) {
						callback(data);
					}
				},
				error: function (request, error, thrown) {
					if (callback != null) {
						callback(null);
					}
				}
			});

			// const option = {
			// 	url: '/reader',
			// 	method: 'POST',
			// 	headers: { 'Content-Type': 'application/json;charset=utf-8' },
			// 	// headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			// 	baseURL: process.env.VUE_APP_BASE_NFC_URL,
			// 	data: { func: func, cbdata: "", parameters: param },
			// 	// data: QueryString.stringify({ func: func, cbdata: "", parameters: param }),
			// }
			// axios(option).then(data => {
			// 	console.log(data.data);
			// 	if (callback != null) {
			// 		callback(data.data);
			// 	}
			// }).catch(err => {
			// 	console.log(err);
			// 	if (callback != null) {
			// 		callback(null);
			// 	}
			// })

			// const myHeaders = new Headers();
			// myHeaders.append("Content-Type", "application/json");

			// const raw = JSON.stringify({ func: func, cbdata: "", parameters: param });

			// const requestOptions = {
			// 	method: 'POST',
			// 	headers: myHeaders,
			// 	body: raw,
			// 	redirect: 'follow'
			// };
			// const url = process.env.VUE_APP_BASE_NFC_URL + '/reader'

			// fetch(url, requestOptions)
			// 	.then(response => response.text())
			// 	.then(data => {
			// 		console.log(data);
			// 		if (callback != null) {
			// 			callback(JSON.parse(data));
			// 		}
			// 	})
			// 	.catch(err => {
			// 		console.log(err);
			// 		if (callback != null) {
			// 			callback(null);
			// 		}
			// 	});

			return true;
		}

		/*
		*Des加密
		*
		*参数：
		*data：加密数据，8字节的整数倍
		*
		*key：加密key，如果大于8字节是3des，如果小于等于8字节单des，不足补零。
		*
		*callback:回调函数
		*
		*返回数据：
		*加密后的数据
		*/
		reader.Des_Encrypt = function (data, key, callback) {
			return reader.call("Des_Encrypt", [data, key], callback);
		}

		/*
		*Des解密
		*
		*参数：
		*data：解密数据，8字节的整数倍
		*
		*key：解密key，如果大于8字节是3des，如果小于等于8字节单des，不足补零。
		*
		*callback:回调函数
		*
		*返回数据：
		*解密后的数据
		*/
		reader.Des_Decrypt = function (data, key, callback) {
			return reader.call("Des_Decrypt", [data, key], callback);
		}


		/*
		*打开HID设备
		*
		*参数：
		*index：要打开设备的索引号，其数值范围为0 ~ (Sys_GetDeviceNum()-1)，仅一台设备时传0即可
		*
		*callback:回调函数
		*
		*返回数据：
		*device_id: 设备ID，后面的函数基本都需要用到。
		*/
		reader.Sys_Open = function (index, callback) {
			return reader.call("Sys_Open", [index], callback);
		}

		/*
		*读取读写卡器的产品序列号
		*
		*参数：
		*device_id: 设备ID
		*
		*callback:回调函数
		*
		*返回数据：
		*value: 序列号，4字节
		*/
		reader.Sys_GetSnr = function (device_id, callback) {
			return reader.call("Sys_GetSnr", [device_id], callback);
		}

		/*
		*读取读写卡器型号信息
		*
		*参数：
		*device_id: 设备ID
		*
		*callback:回调函数
		*
		*返回数据：
		*无
		*/
		reader.Sys_GetModel = function (device_id, callback) {
			return reader.call("Sys_GetModel", [device_id], callback);
		}

		/*
		*设置读写器非接触工作方式
		*
		*参数：
		*device_id: 设备ID
		*
		*type：读写卡器工作方式
		*'A' -> 设置为ISO14443A方式，ISO14443A类别的函数使用此方式；
		*'B' -> 设置为ISO14443B方式，SGIDC(二代证)、ISO14443B-4类别的函数使用此方式；
		*'r' -> 设置为AT88RF020卡方式，AT88RF020类别的函数使用此方式；
		*'s' -> 设置为ST卡方式，SR176、SRI4K类别的函数使用此方式；
		*'1' -> 设置为ISO15693方式，ISO15693类别的函数使用此方式；
		*
		*callback:回调函数
		*
		*返回数据：
		*无
		*/
		reader.Sys_InitType = function (device_id, type, callback) {
			return reader.call("Sys_InitType", [device_id, type], callback);
		}

		/*
		*蜂鸣
		*
		*参数：
		*device_id: 设备ID
		*
		*time：蜂鸣时间，单位是10毫秒
		*
		*callback:回调函数
		*
		*返回数据：
		*无
		*/
		reader.Sys_SetBuzzer = function (device_id, time, callback) {
			return reader.call("Sys_SetBuzzer", [device_id, time], callback);
		}

		/*
		*设置指示灯颜色
		*
		*参数：
		*device_id: 设备ID
		*
		*color：0-熄灭，1-红色，2-绿色
		*
		*callback:回调函数
		*
		*返回数据：
		*无
		*/
		reader.Sys_SetLight = function (device_id, color, callback) {
			return reader.call("Sys_SetLight", [device_id, color], callback);
		}

		/*
		*关闭HID设备
		*
		*参数：
		*device_id: 设备ID
		*
		*callback:回调函数
		*
		*返回数据：
		*无
		*/
		reader.Sys_Close = function (device_id, callback) {
			return reader.call("Sys_Close", [device_id], callback);
		}

		/*
		*设置读写器天线状态 
		*
		*参数：
		*device_id: 设备ID
		*
		*mode:天线状态, 0=关闭天线, 1=开启天线
		*
		*callback:回调函数
		*
		*返回数据：
		*无
		*/
		reader.Sys_SetAntenna = function (device_id, mode, callback) {
			return reader.call("Sys_SetAntenna", [device_id, mode], callback);
		}

		/*
		*命令已激活的TYPE_A卡进入HALT状态 
		*
		*参数：
		*device_id: 设备ID
		*
		*callback:回调函数
		*
		*返回数据：
		*无
		*/
		reader.TyA_Halt = function (device_id, callback) {
			return reader.call("TyA_Halt", [device_id], callback);
		}

		/*
		*寻TYPE_A卡
		*
		*参数：
		*device_id: 设备ID
		*
		*mode: 寻卡模式
		*0x52：WUPA方式，寻所有状态的卡，所有在感应区的卡都可以作出响应，
		*0x26：REQA方式，寻未进入休眠状态的卡，只有不在Halt状态的卡才作出响应
		*
		*callback:回调函数
		*
		*返回数据：
		*type：卡类型
		*0x0044 = Ultralight/Ultralight C/NTAG203/NTAG210/NTAG212/NTAG213/NTAG215/NTAG216
		*0x0004 = Mifare Classic 1K/FM11RF08
				*0x0002 = Mifare Classic 4K/FM11RF32
				*0x0344 = Mifare_DESFire
				*0x0008 = Mifare_Pro
				*0x0304 = Mifare_ProX
				*0x3300 = SHC1102
		*/
		reader.TyA_Request = function (device_id, mode, callback) {
			return reader.call("TyA_Request", [device_id, mode], callback);
		}

		/*
		*TYPE_A卡防冲撞(Level 1)
		*
		*参数：
		*device_id: 设备ID
		*
		*callback:回调函数
		*
		*返回数据:
		*snr：卡序列号
		*/
		reader.TyA_Anticollision = function (device_id, callback) {
			return reader.call("TyA_Anticollision", [device_id], callback);
		}

		/*
		*TYPE_A卡选卡(Level 1)，可在TyA_Request()或TyA_Anticollision()之后执行
		*
		*参数：
		*device_id: 设备ID
		*
		*snr：卡序列号
		*
		*callback:回调函数
		*
		*返回数据:
		*sak：1字节的SAK响应信息
		*/
		reader.TyA_Select = function (device_id, snr, callback) {
			return reader.call("TyA_Select", [device_id, snr], callback);
		}

		/*
		*用当前发送的密钥验证Mifare One卡
		*
		*参数：
		*device_id: 设备ID
		*
		*mode: 寻卡模式
		*0x60：验证A密钥
		*0x61：验证B密钥
		*
		*block: 要验证密码的绝对块号
		*
		*key: 密钥，6 字节
		*
		*callback:回调函数
		*
		*返回数据:
		*无
		*/
		reader.TyA_CS_Authentication2 = function (device_id, mode, block, key, callback) {
			return reader.call("TyA_CS_Authentication2", [device_id, mode, block, key], callback);
		}

		/*
		*读取Mifare One卡中的1块数据
		*
		*参数：
		*device_id: 设备ID
		*
		*block: 绝对块号
		*
		*callback:回调函数
		*
		*返回数据:
		*value: 返回的块数据内容
		*/
		reader.TyA_CS_Read = function (device_id, block, callback) {
			return reader.call("TyA_CS_Read", [device_id, block], callback);
		}

		/*
		*向Mifare One卡写入1块数据
		*
		*参数：
		*device_id: 设备ID
		*
		*block: 绝对块号
		*
		*data: 写入的数据，16字节
		*
		*callback:回调函数
		*
		*返回数据:
		*无
		*/
		reader.TyA_CS_Write = function (device_id, block, data, callback) {
			return reader.call("TyA_CS_Write", [device_id, block, data], callback);
		}

		/*
		*向UID卡0扇区0块写入数据，在写入的数据Byte[0] ~ Byte[15]中，Byte[4]必须是Byte[0] ~ Byte[3]异或运算的结果，函数内部会自动修改Byte[4]的值
		*
		*参数：
		*device_id: 设备ID
		*
		*data: 写入的数据，16字节
		*
		*callback:回调函数
		*
		*返回数据:
		*无
		*/
		reader.TyA_UID_Write = function (device_id, data, callback) {
			return reader.call("TyA_UID_Write", [device_id, data], callback);
		}

		/*
		*寻感应区内符合ISO14443A标准的CPU卡并复位
		*
		*参数：
		*device_id: 设备ID
		*
		*mode: 寻卡方式
		*0x26：REQA方式，寻未进入休眠状态的卡，只有不在Halt状态的卡才作出响应
		*0x52：WUPA方式，寻所有状态的卡，所有在感应区的卡都可以作出响应
		*
		*callback:回调函数
		*
		*返回数据:
		*value: 4字节CSN + 复位信息内容
		*/
		reader.TyA_Reset = function (device_id, mode, callback) {
			return reader.call("TyA_Reset", [device_id, mode], callback);
		}

		/*
		*向符合ISO14443A标准的CPU卡发送COS命令
		*
		*参数：
		*device_id: 设备ID
		*
		*cmd: 命令内容
		*
		*callback:回调函数
		*
		*返回数据:
		*value: COS命令返回的数据
		*/
		reader.TyA_CosCommand = function (device_id, cmd, callback) {
			return reader.call("TyA_CosCommand", [device_id, cmd], callback);
		}

		/*
		*NTag卡选卡防冲突
		*
		*参数：
		*device_id: 设备ID
		*
		*callback:回调函数
		*
		*返回数据:
		*value：8字节卡号
		*/
		reader.TyA_NTAG_AnticollSelect = function (device_id, callback) {
			return reader.call("TyA_NTAG_AnticollSelect", [device_id], callback);
		}

		/*
		*验证NTag卡
		*
		*参数：
		*device_id: 设备ID
		*
		*key: 密钥，4 字节
		*
		*callback:回调函数
		*
		*返回数据:
		*无
		*/
		reader.TyA_NTAG_PwdAuth = function (device_id, key, callback) {
			return reader.call("TyA_NTAG_PwdAuth", [device_id, key], callback);
		}

		/*
		*向NTAG卡写入1页数据
		*
		*参数：
		*device_id: 设备ID
		*
		*addr: 页地址
		*
		*data: 写入的数据，4字节
		*
		*callback:回调函数
		*
		*返回数据:
		*无
		*/
		reader.TyA_NTAG_Write = function (device_id, addr, data, callback) {
			return reader.call("TyA_NTAG_Write", [device_id, addr, data], callback);
		}

		/*
		*向NTAG卡写入1页数据，（兼容写）
		*
		*参数：
		*device_id: 设备ID
		*
		*addr: 页起始地址
		*
		*data: 写入的数据，16字节，实际上只写入前4字节（1页数据）
		*
		*callback:回调函数
		*
		*返回数据:
		*无
		*/
		reader.TyA_NTAG_CompWrite = function (device_id, addr, data, callback) {
			return reader.call("TyA_NTAG_CompWrite", [device_id, addr, data], callback);
		}

		/*
		*读取NTAG卡addr开始的连续4页数据
		*
		*参数：
		*device_id: 设备ID
		*
		*addr: 页起始地址
		*
		*callback:回调函数
		*
		*返回数据:
		*value: 返回连续4页(16字节)数据内容
		*/
		reader.TyA_NTAG_Read = function (device_id, addr, callback) {
			return reader.call("TyA_NTAG_Read", [device_id, addr], callback);
		}

		//生成guid
		function guid() {
			function S4() {
				return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
			}
			return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
		}

		/*
		*获取二代身份证的UID
		*
		*参数：
		*device_id: 设备ID
		*
		*callback:回调函数
		*
		*返回数据:
		*value: 身份证UID
		*/
		reader.TyB_SGIDC_GetUid = function (device_id, callback) {
			return reader.call("TyB_SGIDC_GetUid", [device_id], callback);
		}

		/*
		*寻感应区内的二代身份证卡并激活
		*
		*参数：
		*device_id: 设备ID
		*
		*mode: 寻卡方式0＝REQB,1=WUPB
		*
		*callback:回调函数
		*
		*返回数据:
		*value: 卡片数据
		*/
		reader.TyB_SGIDC_RequestAttrib = function (device_id, mode, callback) {
			return reader.call("TyB_SGIDC_RequestAttrib", [device_id, mode], callback);
		}
		return reader;
	}
};