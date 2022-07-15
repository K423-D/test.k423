import { RFIDReader } from './RFIDReader'

export const ReaderFunction = {
	createNew() {
		let obj = RFIDReader.createNew();

		obj.OpenDevice = function (device, callback) {
			if (obj.device_id == null) {
				obj.Sys_Open(device, function (result) {
					if (result != null && result.code == 1) {
						obj.device_id = result.data.device_id;
					}
					callback(result);
				});
			}
			else {
				var result = {};
				result.code = 1;
				result.retval = 0;
				result.data = {};
				result.data.device_id = obj.device_id;
				callback(result);
			}
		}

		/*
		*字符串转16进制数的ASCII码
		*/
		obj.stringToHex = function (str) {
			var val = "";
			for (var i = 0; i < str.length; i++) {
				val += str.charCodeAt(i).toString(16);
			}
			return val;
		}

		/*
		*16进制数的ASCII码转字符串
		*/
		obj.hexToString = function (hex) {
			var val = "";
			for (var i = 0; i < hex.length; i += 2) {
				val += String.fromCharCode(parseInt(hex.substring(i, i + 2), 16));
			}
			return val;
		}

		/*
		*获取卡号（UID）
		*
		*参数：
		*device：设备号，只连接一台设备的情况下填0即可
		*
		*返回数据:
		*成功：result.data.snr:卡号 
		*出错：见RFIDReader.js说明
		*/
		obj.TyA_GetUID = function (device, callback) {
			this.OpenDevice(device, function (result) {
				if (result == null || result.code != 1 || result.retval != 0) {
					callback(result);
					return;
				}
				obj.Sys_InitType(obj.device_id, 'A', function (result) {
					if (result == null || result.code != 1 || result.retval != 0) {
						callback(result);
						return;
					}
					obj.Sys_SetAntenna(obj.device_id, 1, function (result) {
						if (result == null || result.code != 1 || result.retval != 0) {
							callback(result);
							return;
						}
						obj.TyA_Request(obj.device_id, 0x52, function (result) {
							if (result == null || result.code != 1 || result.retval != 0) {
								callback(result);
								return;
							}
							obj.TyA_Anticollision(obj.device_id, callback);
						});
					});
				});
			});
		}

		/*
		*获取8字节卡号（UID）
		*
		*参数：
		*device：设备号，只连接一台设备的情况下填0即可
		*
		*返回数据:
		*成功：result.data.snr:卡号 
		*出错：见RFIDReader.js说明
		*/
		obj.TyA_GetUID2 = function (device, callback) {
			this.OpenDevice(device, function (result) {
				if (result == null || result.code != 1 || result.retval != 0) {
					callback(result);
					return;
				}
				obj.Sys_InitType(obj.device_id, 'A', function (result) {
					if (result == null || result.code != 1 || result.retval != 0) {
						callback(result);
						return;
					}
					obj.Sys_SetAntenna(obj.device_id, 1, function (result) {
						if (result == null || result.code != 1 || result.retval != 0) {
							callback(result);
							return;
						}
						obj.TyA_Request(obj.device_id, 0x52, function (result) {
							if (result == null || result.code != 1 || result.retval != 0) {
								callback(result);
								return;
							}
							obj.TyA_NTAG_AnticollSelect(obj.device_id, callback);
						});
					});
				});
			});
		}

		/*
		*读取Mifare卡扇区数据
		*
		*参数：
		*device：设备号，只连接一台设备的情况下填0即可
		*block: 块号
		*key: 块号所在扇区的密钥
		*
		*返回数据:
		*成功：
		*	result.data.snr:卡号
		*	result.data.value:扇区数据
		*出错：见RFIDReader.js说明
		*/
		obj.TyA_CS_Read2 = function (device, block, key, callback) {
			this.OpenDevice(device, function (result) {
				if (result == null || result.code != 1 || result.retval != 0) {
					callback(result);
					return;
				}
				obj.Sys_InitType(obj.device_id, 'A', function (result) {
					if (result == null || result.code != 1 || result.retval != 0) {
						callback(result);
						return;
					}
					obj.Sys_SetAntenna(obj.device_id, 1, function (result) {
						if (result == null || result.code != 1 || result.retval != 0) {
							callback(result);
							return;
						}
						obj.TyA_Request(obj.device_id, 0x52, function (result) {
							if (result == null || result.code != 1 || result.retval != 0) {
								callback(result);
								return;
							}
							obj.TyA_Anticollision(obj.device_id, function (result) {
								if (result == null || result.code != 1 || result.retval != 0) {
									callback(result);
									return;
								}
								obj.TyA_Select(obj.device_id, result.data.snr, function (result) {
									if (result == null || result.code != 1 || result.retval != 0) {
										callback(result);
										return;
									}
									obj.TyA_CS_Authentication2(obj.device_id, 0x60, block, key, function (result) {
										if (result == null || result.code != 1 || result.retval != 0) {
											callback(result);
											return;
										}
										obj.TyA_CS_Read(obj.device_id, block, callback);
									});
								});
							});
						});
					});
				});
			});
		}

		/*
		*写Mifare卡扇区数据
		*
		*参数：
		*device：设备号，只连接一台设备的情况下填0即可
		*block: 块号
		*key: 块号所在扇区的密钥
		*data：扇区数据，16字节
		*
		*返回数据:
		*成功：
		*
		*出错：见RFIDReader.js说明
		*/
		obj.TyA_CS_Write2 = function (device, block, key, data, callback) {
			this.OpenDevice(device, function (result) {
				if (result == null || result.code != 1 || result.retval != 0) {
					callback(result);
					return;
				}
				obj.Sys_InitType(obj.device_id, 'A', function (result) {
					if (result == null || result.code != 1 || result.retval != 0) {
						callback(result);
						return;
					}
					obj.Sys_SetAntenna(obj.device_id, 1, function (result) {
						if (result == null || result.code != 1 || result.retval != 0) {
							callback(result);
							return;
						}
						obj.TyA_Request(obj.device_id, 0x52, function (result) {
							if (result == null || result.code != 1 || result.retval != 0) {
								callback(result);
								return;
							}
							obj.TyA_Anticollision(obj.device_id, function (result) {
								if (result == null || result.code != 1 || result.retval != 0) {
									callback(result);
									return;
								}
								obj.TyA_Select(obj.device_id, result.data.snr, function (result) {
									if (result == null || result.code != 1 || result.retval != 0) {
										callback(result);
										return;
									}
									obj.TyA_CS_Authentication2(obj.device_id, 0x60, block, key, function (result) {
										if (result == null || result.code != 1 || result.retval != 0) {
											callback(result);
											return;
										}
										obj.TyA_CS_Write(obj.device_id, block, data, callback);
									});
								});
							});
						});
					});
				});
			});
		}

		/*
		*读取NTag卡扇区数据
		*
		*参数：
		*device：设备号，只连接一台设备的情况下填0即可
		*addr: 页地址
		*key: 卡片密钥
		*
		*返回数据:
		*成功：
		*	result.data.value:4页（16字节）数据
		*出错：见RFIDReader.js说明
		*/
		obj.TyA_NTAG_Read2 = function (device, addr, key, callback) {
			this.OpenDevice(device, function (result) {
				if (result == null || result.code != 1 || result.retval != 0) {
					callback(result);
					return;
				}
				obj.Sys_InitType(obj.device_id, 'A', function (result) {
					if (result == null || result.code != 1 || result.retval != 0) {
						callback(result);
						return;
					}
					obj.Sys_SetAntenna(obj.device_id, 1, function (result) {
						if (result == null || result.code != 1 || result.retval != 0) {
							callback(result);
							return;
						}
						obj.TyA_Request(obj.device_id, 0x52, function (result) {
							if (result == null || result.code != 1 || result.retval != 0) {
								callback(result);
								return;
							}
							obj.TyA_NTAG_AnticollSelect(obj.device_id, function (result) {
								if (result == null || result.code != 1 || result.retval != 0) {
									callback(result);
									return;
								}

								obj.TyA_NTAG_PwdAuth(obj.device_id, key, function (result) {
									if (result == null || result.code != 1 || result.retval != 0) {
										callback(result);
										return;
									}
									obj.TyA_NTAG_Read(obj.device_id, addr, callback);
								});
							});

						});
					});
				});
			});
		}

		/*
		*向NTag卡写入1页数据
		*
		*参数：
		*device：设备号，只连接一台设备的情况下填0即可
		*addr: 页地址
		*key: 卡片密钥
		*data：扇区数据，4字节
		*
		*返回数据:
		*成功：
		*
		*出错：见RFIDReader.js说明
		*/
		obj.TyA_NTAG_Write2 = function (device, addr, key, data, callback) {
			this.OpenDevice(device, function (result) {
				if (result == null || result.code != 1 || result.retval != 0) {
					callback(result);
					return;
				}
				obj.Sys_InitType(obj.device_id, 'A', function (result) {
					if (result == null || result.code != 1 || result.retval != 0) {
						callback(result);
						return;
					}
					obj.Sys_SetAntenna(obj.device_id, 1, function (result) {
						if (result == null || result.code != 1 || result.retval != 0) {
							callback(result);
							return;
						}
						obj.TyA_Request(obj.device_id, 0x52, function (result) {
							if (result == null || result.code != 1 || result.retval != 0) {
								callback(result);
								return;
							}
							obj.TyA_NTAG_AnticollSelect(obj.device_id, function (result) {
								if (result == null || result.code != 1 || result.retval != 0) {
									callback(result);
									return;
								}

								obj.TyA_NTAG_PwdAuth(obj.device_id, key, function (result) {
									if (result == null || result.code != 1 || result.retval != 0) {
										callback(result);
										return;
									}
									obj.TyA_NTAG_Write(obj.device_id, addr, data, callback);
								});
							});
						});
					});
				});
			});
		}

		/*
		*向NTag卡写入4页数据
		*
		*参数：
		*device：设备号，只连接一台设备的情况下填0即可
		*addr: 页地址
		*key: 卡片密钥
		*data：页数据，16字节
		*
		*返回数据:
		*成功：
		*
		*出错：见RFIDReader.js说明
		*/
		obj.TyA_NTAG_CompWrite2 = function (device, addr, key, data, callback) {
			this.OpenDevice(device, function (result) {
				if (result == null || result.code != 1 || result.retval != 0) {
					callback(result);
					return;
				}
				obj.Sys_InitType(obj.device_id, 'A', function (result) {
					if (result == null || result.code != 1 || result.retval != 0) {
						callback(result);
						return;
					}
					obj.Sys_SetAntenna(obj.device_id, 1, function (result) {
						if (result == null || result.code != 1 || result.retval != 0) {
							callback(result);
							return;
						}
						obj.TyA_Request(obj.device_id, 0x52, function (result) {
							if (result == null || result.code != 1 || result.retval != 0) {
								callback(result);
								return;
							}
							obj.TyA_NTAG_AnticollSelect(obj.device_id, function (result) {
								if (result == null || result.code != 1 || result.retval != 0) {
									callback(result);
									return;
								}

								obj.TyA_NTAG_PwdAuth(obj.device_id, key, function (result) {
									if (result == null || result.code != 1 || result.retval != 0) {
										callback(result);
										return;
									}
									obj.TyA_NTAG_Write(obj.device_id, addr, data, callback);
								});
							});
						});
					});
				});
			});
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
		*
		*出错：见RFIDReader.js说明
		*/
		obj.TyA_UID_Write2 = function (device, key, data, callback) {
			this.OpenDevice(device, function (result) {
				if (result == null || result.code != 1 || result.retval != 0) {
					callback(result);
					return;
				}
				obj.Sys_InitType(obj.device_id, 'A', function (result) {
					if (result == null || result.code != 1 || result.retval != 0) {
						callback(result);
						return;
					}
					obj.Sys_SetAntenna(obj.device_id, 1, function (result) {
						if (result == null || result.code != 1 || result.retval != 0) {
							callback(result);
							return;
						}
						obj.TyA_Request(obj.device_id, 0x52, function (result) {
							if (result == null || result.code != 1 || result.retval != 0) {
								callback(result);
								return;
							}
							obj.TyA_Anticollision(obj.device_id, function (result) {
								if (result == null || result.code != 1 || result.retval != 0) {
									callback(result);
									return;
								}
								obj.TyA_Select(obj.device_id, result.data.snr, function (result) {
									if (result == null || result.code != 1 || result.retval != 0) {
										callback(result);
										return;
									}
									obj.TyA_UID_Write(obj.device_id, data, callback);
								});
							});
						});
					});
				});
			});
		}
		return obj;
	}
};

