/**
 * makecode I2C LCD1602 package for microbit.
 * From microbit/micropython Chinese community.
 * http://www.micropython.org.cn
 */
    
/**
 * Custom blocks
 */
//% weight=100 color=#0fbc11 icon="L" block="LandZo_IoT"
namespace LANDZO_WXMS {   
    const WUXIANMISA_I2C_ADDR = 0x20
    
    export enum IR_CTL {
        Entry = 0x01,
		Send = 0x02,
        Get = 0x03,
    }
	export enum WSD_CTL {
		temperature = 0x00;
		humidity = 0x01;
		
	}
	export enum SENSOR_CTL {
		all_sensor = 0x00;
		range_sensor = 0x01;
		remote_control = 0x02;
		light_resistors = 0x03;
		Temp_hum_sensor = 0x04;
		Human_infrared = 0x05;
		potentiometer  = 0x06;
		large_key = 0x07; 
	}
	export enum COLOUR_CTL {
		Blue = 0x01;
		Green = 0x02;
		Red = 0x03;
		Cyan = 0x04;
		Magenta = 0x05;
		Yellow = 0X06;
		Lightblue = 0x07;
		Lightgreen = 0x08;
		Lightred = 0x09;
		Lightcyan = 0x0a;
		Lightmagenta = 0x0b;
		Lightyellow = 0x0c;
		Darkblue = 0x0d;
		Darkgreen = 0x0e;
		Darkred = 0x0f;
		Darkcyan = 0x10;
		Darkmagenta = 0x11;
		Darkyellow = 0x12;
		White = 0x13;
		Lightgray = 0x14;
		Gray = 0x15;
		Darkgray = 0x16;
		Black = 0x17;
		Brown = 0x18;
		Orange = 0x19;	
	}
	export enum SIZE_CTL {
		size4_6 = 0x01;
		size6_8 = 0x02;
		size6_9 = 0x03;
		size8_8 = 0x04;
		size8_9 = 0x05;
		size8_10 = 0x06;
		size8_12 = 0x07;
		size8_13 = 0x08;
		size8_15 = 0x09;
		size8_16 = 0x0a;
		size8_17 = 0x0b;
		size8_18 = 0x0c;
		size24_32= 0x0d;
		size32_32 = 0x0e;
		size36_48 = 0x0f;
		size48_48 = 0x10;
		size48_64 = 0x11;
		size64_64 = 0x12;
		size60_80 = 0x13;
		size80_80 = 0x14;
	}
	export enum FONTSHOW_CTL {
		normal_mod = 0x01;
		Flip_mod = 0x02;
		transparent_mod = 0x03;
		XOR_mod = 0x04;
	}
	export enum TEXTSTYLE_CTL {
		normal_mod = 0x01;
		Underline_mod = 0x02;
		Delet_line_mod = 0x03;
		Over_line_mod = 0x04;
	}
	export enum NUMMOD_CTL {
		DEC_mod = 0x01;
		BIN_mod = 0x02;
		HEX_mod = 0x03;
	}
    
	
    //红外测距
    function ir_range() :number {
		let buf = pins.createBuffer(4);.
		buf[0] = 0xa4;
		buf[1] = 0x01;
		buf[2] = 0x01;
		buf[3] = 0xff;
		pins.i2cWriteBuffer(WUXIANMISA_I2C_ADDR, buf);//可能存在问题，需要重点关注修改！！！
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
	function write_byte1(cmd: number, dat: number): void {
        let buf = pins.createBuffer(2);
        buf[0] = cmd;
        buf[1] = dat;
        pins.i2cWriteBuffer(BASE_BOARD_I2C_ADDR, buf)
    }
	//% blockId="Led_Dimmer" block="调节灯光亮度"
    //% weight=50
    export function Led_Dimmer(cmd: number, data: number)  {
      write_byte1(cmd,data);
    }
		//% blockId="Wind_Dimmer" block="调节风速大小"
    //% weight=50
	    export function Wind_Dimmer(cmd: number, data: number)  {
      write_byte1(cmd,data);
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
	//mod:0(温度) 1（湿度）
	function wsd_get(mod:number) :number{
		let buf = pins.createBuffer(4);
		let sum_dat = 0;
		let wd_dat = 0;
		let sd_dat = 0;
		buf[0] = 0xa4;
		buf[1] = 0x01;
		buf[2] = 0x04;
		buf[3] = 0xff;
		pins.i2cWriteBuffer(WUXIANMISA_I2C_ADDR, buf);
		basic.pause(1);
		sum_dat = pins.i2cReadNumber(WUXIANMISA_I2C_ADDR, NumberFormat.UInt32BE);
		wd_dat = sum_dat>>16;
		sd_dat = sum_dat&0x000000ff;
		if(mod==1){
			return sd_dat;
		}
		else{
			return wd_dat;
		}
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
	 //% blockId="distance_get" block="读取红外距离"
    //% weight=50
    export function distance_get() :number {
        return ir_range();
    }
	
	//% blockId="Ir_read" block="红外遥控|%sed_mod|"
    //% weight=50
    export function Ir_read(sed_mod: IR_CTL) :number {
        return ir_control(sed_mod);
    }
	
	//% blockId="gmdz_read" block="读取光敏电阻传感器值"
    //% weight=50
    export function gmdz_read() :number {
        return gmdz_get();//WSD_MOD
    }
	
	//% blockId="wsd_read" block="读取温湿度传感器|%wsd_mod|值"
    //% weight=50
    export function wsd_read(wsd_mod: WSD_CTL) :number {
        return wsd_get(wsd_mod);
    }
	
	//% blockId="rthw_read" block="读取人体红外传感器值"
    //% weight=50
    export function rthw_read() :number {
        return rthw_get();
    }
	
	//% blockId="key_read" block="读取大按键值"
    //% weight=50
    export function key_read() :number {
        return key_get();
    }
	
	//% blockId="sensor_print" block="彩屏显示|%sensor_mod|值"
    //% weight=50
    export function sensor_print(sensor_mod: SENSOR_CTL) :void {
        cgq_print(sensor_mod);
    }
	
	//% blockId="TFT_setfontcol " block="设置彩屏字体颜色为|%colour_mod|"
    //% weight=50
    export function TFT_setfontcol(colour_mod: COLOUR_CTL) :void {
        font_colset(colour_mod);
    }
	
	//% blockId="TFT_setfontsize " block="设置彩屏字体大小为|%size_mod|"
    //% weight=50
    export function TFT_setfontsize(size_mod: SIZE_CTL) :void {
        font_sizset(size_mod);
    }
		
	//% blockId="TFT_setfontshowmod " block="设置彩屏字体显示模式为|%fontshow_mod|"
    //% weight=50
    export function TFT_setfontshowmod(fontshow_mod: FONTSHOW_CTL) :void {
        font_modset(fontshow_mod);
    }
		
	//% blockId="TFT_settextstyle " block="设置彩屏文本样式为|%textstyle_mod|"
    //% weight=50
    export function TFT_settextstyle(textstyle_mod: TEXTSTYLE_CTL) :void {
        text_styset(textstyle_mod);
    }
		
	//% blockId="TFT_shownum " block="彩屏以|%num_mod|模式在坐标|%xx||%yy|处显示|%numb|数字"
    //% weight=50
    export function TFT_settextstyle(num_mod: NUMMOD_CTL,xx:number,yy:number,numb:number) :void {
        text_styset(num_mod,xx,yy,numb);
    }   
}
