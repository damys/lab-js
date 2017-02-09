/*
* jQuery Form Plugin:jquery.CCMessage.js 
* 提示信息框架
*
* author:  damys
* version: 1.1
* url:     https://github.com/damys/lab-js
* Date:    2017/2
*/

;(function($){
	var CCMessage = function(config){
		var _this = this;
		
		// 默认配置参数
		this.config = {
			width:"auto",
			height:"auto",
			message:null,        // 提示信息
			maskOpacity:null,    // 遮罩背景
			delayCallback:null,  // 延时关闭的回调孙数
			maskShow:0,          // 显示遮罩，默认隐藏
			maskClose:!0,        // 点击遮罩层是否可以关闭，默认点击可关闭
			delay:2000,          // 弹出框多久关闭，默认2s
			effect:!0            // 动画效果
		};
		
		// 判断参数是否已设置
		if(config && $.isPlainObject(config)){
			$.extend(this.config, config);
		} else {
			this.isConfig = true;
		}
		
		// 设置DOM
		this.mask    = $('<div class="cc-mask"></div>');		
		this.winBody = $('<div class="cc-body"></div>');
		this.win     = $('<div class="cc-win"></div>');
		this.body    = $('body');
		
		// 渲染DOM
		this.create();
		
		// console.log(this.config);  
	};
	
	
	// 定义方法 
	CCMessage.prototype = {
		// 动画
		animate:function(){
			var self = this;
			this.win.addClass('cc-animate');
			
			setTimeout(function(){
				self.win.addClass('cc-animated');
			}, 100)
		},
		create:function(){
			var self    = this,
			    config  = this.config,				
				mask    = this.mask,
				winBody = this.winBody,
				win     = this.win,
				body    = this.body;
				
			// 没有传递任何参数，就弹出一个提示加载信息
			if(this.isConfig){
				winBody.html('加载中...');
				win.append(winBody);
				mask.append(win);
				body.append(win);	
				
				// 加载动画
				self.animate();	
				
				// 居中
				self.center();	
					
			} else {
			
				// 设置宽
				if(config.width != 'auto'){
					win.width(config.width);
				}
				
				// 设置高
				if(config.height != 'auto'){
					win.height(config.height);
				}
				
				// 设置提示信息
				config.message && winBody.html(config.message);
				win.append(winBody);
				
				// 透明度
				if(config.maskOpacity){
					win.css("background", "rgba(0,0,0,"+ config.maskOpacity +")");
				}
				
				// 是否显示遮罩
				if(config.maskShow){
					this.mask.css("background", "none");
				}
				
				// 设置点击遮罩是否显示
				if(config.maskClose){
					mask.click(function(){
						self.close();
					});
				}
				
				//定时消失
				if(config.delay && config != 0){
					window.setTimeout(function(){
						self.close();
						config.delayCallback && config.delayCallback();
					},config.delay);
				}
				
				// 动画效果
				if(config.effect){
					self.animate();
				}

				
				// 添加DOM 到body
				mask.append(win);
				body.append(mask);
				
				// 居中
				self.center();
			}
		},
			
		close:function(){
			this.mask.remove();
		}, 
		
		center:function(){
			// 居中
			this.win.css('margin-left', -this.win.innerWidth()/2);
			this.win.css('margin-top', -this.win.innerHeight()/2);
		}			
	};
	
	window['CCMessage'] = CCMessage;
	$.CCMessage = function (config){
		return new CCMessage(config);
	};
})($);



// Test...

// $.CCMessage();
// $.CCMessage({delay:200000, message:'添加成功'});