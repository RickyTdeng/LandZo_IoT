    //红外测距
    function ir_range() :number {
		let buf = pins.createBuffer(4);.
		buf[0] = 0xa4;
		buf[1] = 0x01;
		buf[2] = 0x01;
		buf[3] = 0xff;
		pins.i2cWriteBuffer(WUXIANMISA_I2C_ADDR, buf);
		basic.pause(1);
        return pins.i2cReadNumber(WUXIANMISA_I2C_ADDR, NumberFormat.UInt16BE);
    }
	//红外遥控
	//ctl_dat:01录入，02发送，03获取值
	function ir_control(ctl_dat: number) :number{
		let buf = pins.createBuffer(5);
		buf[0] = 0xa4;
		buf[1] = 0x02;
		buf[2] = 0x02;
		buf[3] = ctl_dat;
		buf[4] = 0xff;
		if(ctl_dat==0x02){
			pins.i2cWriteBuffer(WUXIANMISA_I2C_ADDR, buf);
			basic.pause(1);
		}
		else{
			return pins.i2cReadNumber(WUXIANMISA_I2C_ADDR, NumberFormat.UInt32BE);
		}
		return 0;				
	}
	//光敏电阻
	function gmdz_get() :number{
		let buf = pins.createBuffer(4);
		buf[0] = 0xa4;
		buf[1] = 0x01;
		buf[2] = 0x03;
		buf[3] = 0xff;
		pins.i2cWriteBuffer(WUXIANMISA_I2C_ADDR, buf);
		basic.pause(1);
		return pins.i2cReadNumber(WUXIANMISA_I2C_ADDR, NumberFormat.UInt16BE);
	}
	//温湿度
	function wsd_get() :number{
		let buf = pins.createBuffer(4);
		buf[0] = 0xa4;
		buf[1] = 0x01;
		buf[2] = 0x04;
		buf[3] = 0xff;
		pins.i2cWriteBuffer(WUXIANMISA_I2C_ADDR, buf);
		basic.pause(1);
		return pins.i2cReadNumber(WUXIANMISA_I2C_ADDR, NumberFormat.UInt32BE);	
	}
	//人体红外
	function rthw_get() :number{
		let buf = pins.createBuffer(4);
		buf[0] = 0xa4;
		buf[1] = 0x01;
		buf[2] = 0x05;
		buf[3] = 0xff;
		pins.i2cWriteBuffer(WUXIANMISA_I2C_ADDR, buf);
		basic.pause(1);
		return pins.i2cReadNumber(WUXIANMISA_I2C_ADDR, NumberFormat.UInt8BE);
	}
	//电位器
	function rthw_get() :number{
		let buf = pins.createBuffer(4);
		buf[0] = 0xa4;
		buf[1] = 0x01;
		buf[2] = 0x06;
		buf[3] = 0xff;
		pins.i2cWriteBuffer(WUXIANMISA_I2C_ADDR, buf);
		basic.pause(1);
		return pins.i2cReadNumber(WUXIANMISA_I2C_ADDR, NumberFormat.UInt16BE);
	}
	//按键
	function key_get() :number{
		let buf = pins.createBuffer(4);
		buf[0] = 0xa4;
		buf[1] = 0x01;
		buf[2] = 0x07;
		buf[3] = 0xff;
		pins.i2cWriteBuffer(WUXIANMISA_I2C_ADDR, buf);
		basic.pause(1);
		return pins.i2cReadNumber(WUXIANMISA_I2C_ADDR, NumberFormat.UInt8BE);
	}
	//屏幕显示传感器值
	//cgq_dat：传感器编号
	function cgq_print(cgq_dat:number): void {
		let buf = pins.createBuffer(5);
		buf[0] = 0xa4;
		buf[1] = 0x02;
		buf[2] = 0x08;
		buf[3] = cgq_dat;
		buf[4] = 0xff;
		pins.i2cWriteBuffer(WUXIANMISA_I2C_ADDR, buf);
		basic.pause(1);		
	}
	//文字功能（待定）A4 XX 09 00 XX XX XX XX ... FF
	
	//设置文字颜色
	function font_colset(col_dat:number):void{
		let buf = pins.createBuffer(6);
		buf[0] = 0xa4;
		buf[1] = 0x02;
		buf[2] = 0x09;
		buf[3] = 0x01;
		buf[4] = col_dat;
		buf[5] = 0xff;
		pins.i2cWriteBuffer(WUXIANMISA_I2C_ADDR, buf);
		basic.pause(1);
	}
	//设置文字字体大小
	function font_sizset(siz_dat:number): void {
		let buf = pins.createBuffer(6);
		buf[0] = 0xa4;
		buf[1] = 0x02;
		buf[2] = 0x09;
		buf[3] = 0x02;
		buf[3] = col_dat;
		buf[5] = 0xff;
		pins.i2cWriteBuffer(WUXIANMISA_I2C_ADDR, buf);
		basic.pause(1);
	}
	
	//设置文字显示模式
	function font_modset(mod_dat:number): void {
		let buf = pins.createBuffer(6);
		buf[0] = 0xa4;
		buf[1] = 0x02;
		buf[2] = 0x09;
		buf[3] = 0x03;
		buf[3] = mod_dat;
		buf[5] = 0xff;
		pins.i2cWriteBuffer(WUXIANMISA_I2C_ADDR, buf);
		basic.pause(1);
	}
	//设置文本样式Text style set
	function text_styset(sty_dat:number): void {
		let buf = pins.createBuffer(6);
		buf[0] = 0xa4;
		buf[1] = 0x02;
		buf[2] = 0x09;
		buf[3] = 0x04;
		buf[3] = sty_dat;
		buf[5] = 0xff;
		pins.i2cWriteBuffer(WUXIANMISA_I2C_ADDR, buf);
		basic.pause(1);
	}
	//显示数字
	//mod:1（10进制） 2（2进制） 3（16进制）
	//X,Y:显示坐标
	//num：要显示的数值
	function show_num(mod:number,x:number,y:number,num:number): void {
		let buf = pins.createBuffer(14);
		buf[0] = 0xa4;
		buf[1] = 0x0a;
		buf[2] = 0x0a;
		buf[3] = 0x01;
		buf[4] = mod;
		buf[5] =(x>>8);
		buf[6] =(x&0x00ff);
		buf[7] =(y>>8);
		buf[8] =(y&0x00ff);
		buf[9] =(num>>24);
		buf[10] =(num>>16);
		buf[11] =(num>>8);
		buf[12] =(num&0x000000ff);
		buf[13] = 0xff;
		pins.i2cWriteBuffer(WUXIANMISA_I2C_ADDR, buf);
		basic.pause(1);
	}