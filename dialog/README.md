##jquery.dialog
对话框插件

<pre>
// 不带参数：
$.dialog();


// 带参数：
$.dialog({
	width: "auto",         // 对话框宽
	height: "auto",        // 对话框高
	type: null,            // 对话框类型
	buttons: null,         // 按钮数组           
	message: null,         // 对话框提示信息      
	maskOpacity: null,     // 对话框遮罩透明度      
	delayCallback: null,   // 延时关闭的回调函数   
	maskClose: !0,         // 点击遮罩层是否可以关闭, 默认点击可关闭
	maskShow: 0,           // 是否显示遮罩背景, 默认隐藏
	delay: 0,              // 弹出框多久关闭
	delayShow: 0,          // 是否显示倒计时读秒， 默认隐藏    
	effect: !0,            // 是否添加对话框动画效果, 默认有动画 
})
</pre>
