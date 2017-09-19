/*
* jQuery Form Plugin:jquery.dialog.js 
* 对话框插件
*
* author:  damys
* version: 1.1
* url:     https://github.com/damys/lab-js/tree/master/dialog
* Date:    2016/12
*/
;(function ($) {
    var Dialog = function (config) {
        var _this = this;
        // 默认配置参数
        this.config = {
            width: "auto",         // 对话框宽
            height: "auto",        // 对话框高
            type: null,            // 对话框类型
            buttons: null,         // 按钮数组           
            message: null,         // 对话框提示信息      
            maskOpacity: null,     // 对话框遮罩透明度      
            delayCallback: null,   // 延时关闭的回调函数   
            maskClose: !0,         // 点击遮罩层是否可以关闭, 默认点击可关闭
            maskShow: 0,           // 是否显示遮罩背景, 默认隐藏
	delay: 0,                 // 弹出框多久关闭
	delayShow: 0,          // 是否显示倒计时读秒， 默认隐藏    
            effect: !0,               // 是否添加对话框动画效果, 默认有动画
        };

        if (config && $.isPlainObject(config)) {
            $.extend(this.config, config);
        } else {
            //没有传递参数
            this.isConfig = true;
        }
		
        // console.log(this.config);  // 测试传入的参数
        this.body      = $("body");                                     // 创建基本的DOM   
        this.mask      = $('<div class="g-dialog-container"></div>');   // 创建遮罩层
        this.win       = $('<div class="dialog-window"></div>');        // 创建弹出框
        this.winHeader = $('<div class="dialog-header"></div>');        // 创建弹出框头部
        this.icon      = $('<div class="icon"></div>');                 // 显示状态图标
        this.winBody   = $('<div class="dialog-body"></div>');          // 显示文本信息区
        this.winFooter = $('<div class="dialog-footer"></div>');        // 显示按钮区

        // 渲染DOM
        this.create();
    };

    Dialog.zIndex = 10000;

    Dialog.prototype = {
        // 动画函数
        animate: function () {
            var self = this;
            this.win.addClass('dialog-animate');
            setTimeout(function () {
                self.win.addClass('dialog-animated');
            }, 100);
        },
        create: function () {
            var self      = this,
                config    = this.config,
                mask      = this.mask,
                win       = this.win,
                winHeader = this.winHeader,
                icon      = this.icon;
                winBody   = this.winBody,
                winFooter = this.winFooter,
                body      = this.body;

            Dialog.zIndex++;
            this.mask.css("z-index", Dialog.zIndex);
			
            // 没有传递任何参数，就弹出一个等待的图标
            if (this.isConfig) {
                icon.html('<div class="loading"></div>');
                winHeader.append(icon);
                win.append(winHeader);
                mask.append(win);
                body.append(mask);
            } else {
                // 根据传递的参数来配置： 警告，确认，加载中(默认)
                var html = undefined;
                html = config.type == 'warning' ? '<div class="warning"></div>' :
                       config.type == 'success' ? '<div class="success"></div>' :
                       '<div class="loading"></div>';
                icon.html(html);
                winHeader.append(icon);
                win.append(winHeader);                
				
                // 设置宽
                if (config.width != "auto") {
                    win.width(config.width);
                }
				
                // 设置高
                if (config.height != "auto") {
                    win.height(config.height);
                }
				
				// message 提示
                config.message && winBody.html(config.message);
                win.append(winBody);

                // button 组
                if (config.buttons) {
                    this.createButtons(winFooter, config.buttons);
                    win.append(winFooter);
                }
				
                // 透明度
                if (config.maskOpacity) {
                    win.css("background", "rgba(0,0,0," + config.maskOpacity + ")");
                }
				
                // 是否显示背景
                if (!config.maskShow) {
                    this.mask.css("background", "none");
                }
				
	// 动画效果
                if (config.effect) {
                    self.animate();
                }
				
	// 显示透明背景
                if (config.maskClose) {
                    mask.click(function () {
                        self.close();
                    });
                }

                // 定时倒计时及消失方法
                var delay = config.delay / 1000;
				
                function delayTime() {
		// 防止传入非整秒
		delay = parseInt(delay);
		
		// 显示倒计时				
		if(config.delayShow){				
			winBody.text(delay + '秒 ' + config.message);						
		}                   

                    // 当延迟时间小于,等于0时，remove ui
                    if (delay <= 0) {
                        self.close();
                        config.delayCallback && config.delayCallback();
                        return;
                    }					
					delay--;                    

                    setTimeout(function () {
                        delayTime();
                    }, 1000)
                }

                // 调用：定时倒计时及消失方法
                if (config.delay && config != 0) {
                    delayTime();
                }
				
				
                // 插入到win
                mask.append(win);
                body.append(mask);
				
        	// 居中
        	wins = $(win)
        	wins.addClass('dialog-center')
				

                /* wins.css("margin-top" , 200 );  */               // 偏上一点, 兼容移动iframe 包含
                wins.css("margin-top" , - wins.innerHeight()/2);   // PC 居中一点
                wins.css("margin-left" , -wins.innerWidth()/2);	
		
            }
        },
        close: function () {
            this.mask.remove();
        },
        createButtons: function (footer, buttons) {
            // console.log(buttons);
            var self = this;
            $(buttons).each(function (index, item) {
                // console.log(index);
                var type = item.type ? " class=" + item.type : "";
                var btnText = this.text || "按钮" + (index);
                var callback = this.callback || null;
                var button = $('<button' + type + '>' + btnText + '</button>');
                footer.append(button);

                if (callback) {
                    button.click(function (e) {
                        // 返回值false不关闭
                        if (callback() != false) {
                            self.close();
                        }
                        // 阻止事件冒泡
                        e.stopPropagation();
                    });

                } else {
                    button.click(function (e) {
                        self.close();
                        // 阻止事件冒泡
                        e.stopPropagation();
                    });
                }
            })
        }
    };

    window['Dialog'] = Dialog;
    $.dialog = function (config) {
        return new Dialog(config);
    };
})($);