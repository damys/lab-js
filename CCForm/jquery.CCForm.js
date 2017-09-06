/*
* jQuery Form Plugin:jquery.CCForm.js 
* 提交框架
*
* author:  damys
* version: 1.1
* url:        https://github.com/damys/lab-js/tree/master/CCForm
* Date:    2017/2
*/

;(function($){
    var CCForm = function(config){
        var _this = this;
        
        // 默认配置参数
        this.config = {
            form:".CCForm",                      // 表单选择器默认class = form
            url:"http://www.xxx.com/post",    // 提交url
            jumpUrl:null,                      // 提交成功后跳转的url
            delay:0,                           // 自定义延迟时间
            successMsg:null,                   // 自定义成功提示信息
            errorMsg:null                      // 自定义失败提示信息
        };
        
        // 判断参数是否已设置
        if(config && $.isPlainObject(config)){
            $.extend(this.config, config);
        } else {
            this.isConfig = true;
        }
        
        // 调用验证
        this.validate();    
    };
    
    CCForm.prototype = {
        validate:function(){
            var self = this,
            config = this.config;
			
			$(config.form).validate({
				onFocus: function() {
					this.parent().addClass('active');
					return false;
				},
				onBlur: function() {
					var $parent = this.parent();
					var _status = parseInt(this.attr('data-status'));
					$parent.removeClass('active');
					
					if (!_status) {
						$parent.addClass('error');
					}
					return false;
				}
			});
            
            $(config.form).on('submit', function(event) {
                if(event && event.preventDefault){
                    event.preventDefault();
                }else{
                    window.event.returnValue = false;//注意加window
                }
                
                var v = $(this).validate('submitValidate'); //return boolean;
                
                // 为真提交表单
                if(v){
                    
                    var d = $.CCMessage();
                                        
                    // 自定义url
                    var url = config.url ? config.url : self.url;
                    
                    var fm = $(this);
                                    
                    $.ajax({
                        url: url,                              // 服务器地址要注意是ipv4的，ipv6测试暂时没成功。
                        data:fm.serialize(),
                        type: "POST",                          // get/post都可以的请求方式
                        async: false,                          // 是否同步，false为异步加载       
                        dataType: "jsonp",                     // 设置返回数据类型jsonp     
                        jsonp: "jsoncallback",                 // jsonp的字段，服务器返回的前缀要和这个一样
                        success: function (data) {
                            
                            d.close();
                           // console.log(data);
                            
                            // 根据参数：设置提示信息
                            if(data.code == 1){ 
                                // 自定义提示信息
                                self.message(1, data);
                                
                                // 提交成功后重置表单
                                self.clearForm(fm); 
                                
                            } else {
                                // 自定义提示信息
                                self.message(0, data);                              
                            }                             
                        },
                        error: function () {
                            d.close();
                            $.CCMessage({'message':'提交失败'});
                        }
                    });
                }
            });
        },
        
        /*
          提示信息: 
          parm: f: bool 根据自定义设置信息，显示信息
          data: 数据对象
        */
        message:function(f, data){
            var self = this,
            config = this.config;
            
            if(f){
                // 提交成功后可根据设置参数转换页面
                if(config.successMsg){                  
                    // 自定义延迟时间
                    if(config.delay){
                        $.CCMessage({'message':config.successMsg, 'delay':config.delay, 
                            delayCallback:function(){ 
                                if(config.jumpUrl) window.location.href = config.jumpUrl
                            }
                        });
                    } else { 
                        $.CCMessage({'message':config.successMsg, 
                            delayCallback:function(){ 
                                if(config.jumpUrl) window.location.href = config.jumpUrl
                            }
                        });
                    }
                        
                } else {
                    // 自定义延迟时间
                    if(config.delay){
                        $.CCMessage({'message':data.message, 'delay':config.delay,
                            delayCallback:function(){ 
                                if(config.jumpUrl) window.location.href = config.jumpUrl
                            }
                        });
                    } else { 
                        $.CCMessage({'message':data.message, 
                            delayCallback:function(){ 
                                if(config.jumpUrl) window.location.href = config.jumpUrl
                            }
                        });
                    }
                }
            } else {
                // 自定义提示信息
                if(config.errorMsg){                    
                    // 自定义延迟时间
                    if(config.delay){
                        $.CCMessage({'message':config.errorMsg, 'delay':config.delay});
                    } else { 
                        $.CCMessage({'message':config.errorMsg});
                    }
                        
                } else {
                    // 自定义延迟时间
                    if(config.delay){
                        $.CCMessage({'message':data.message, 'delay':config.delay});
                    } else {
                        $.CCMessage({'message':data.message});
                    }
                }
            }
        },
    
        clearForm:function(fm) {
			if(!fm.find('[type="reset"]').size()){
				fm.append('<input type="reset" value="" style="display:none"/>')
			}
			
			fm.find('[type="reset"]').trigger("click")

        }   
    };

    window['CCForm'] = CCForm;
    $.CCForm = function (config){
        return new CCForm(config);
    };
})($);


// 提示信息
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
            }, 100);
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
                winBody.html('提交中...');
                win.append(winBody);
                mask.append(win);
                body.append(mask);  
                
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

(function(factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);  // AMD
    } else if (typeof exports === 'object') {
        factory(require('jquery'));   // CommonJS
    } else {
        factory(jQuery, window, document); // Browser globals
    }
}(function($, window, document, undefined) {

    var RULES = {
        //不能为空
        isNonEmpty: function(value, errorMsg) {
            if (!value.replace(/(^\s*)/g, "").length) return errorMsg;
        },
        
        //是否为手机号码
        isMobile: function(value, errorMsg) {
            if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(value)) return errorMsg;
        },
        
        //是否为邮箱
        isEmail: function(value, errorMsg) {
            if (!/(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.test(value)) return errorMsg;
        },
        
        //要大于
        minLength: function(value, length, errorMsg) {
            if (value.length > length) return errorMsg;
        },
        
        //要小于
        maxLength: function(value, length, errorMsg) {
            if (value.length < length) return errorMsg;
        },
        
        //大于小于
        between: function(value, range, errorMsg) {
            var min = parseInt(range.split('-')[0]);
            var max = parseInt(range.split('-')[1]);
            
            if (value.length < min || value.length > max) return errorMsg;
        },
        
        //纯英文
        onlyEn: function(value, errorMsg) {
            if (!/^[A-Za-z]+$/.test(value)) return errorMsg;
        },
        
        //纯中文
        onlyZh: function(value, errorMsg) {  
            if (!/^[\u4e00-\u9fa5]+$/.test(value)) return errorMsg;
        },
        
        //数字包含小数
        onlyNum: function(value, errorMsg) {
            if (!/^[0-9]+([.][0-9]+){0,1}$/.test(value)) return errorMsg;
        },
        
        //整数
        onlyInt: function(value, errorMsg) {
            if (!/^[0-9]*$/.test(value)) return errorMsg;
        },
        
        // 选择：单选，多选
        isChecked: function(value, errorMsg, el) {
            var i = 0;
            var $collection = $(el).find('input:checked');
            
            if(!$collection.length) return errorMsg;
        }
    };

    var setting = {
        type: null,
        onBlur: null,
        onFocus: null,
        onChange: null,
        successTip: true
    };

    var Validator = function() { this.cache = []; };

    Validator.prototype.add = function(dom, rules) {
        var self = this;
        for (var i = 0, rule; rule = rules[i++];) {
            (function(rule) {
                var strategyAry = rule.strategy.split(':');
                var errorMsg = rule.errorMsg;
                self.cache.push(function() {
                    var strategy = strategyAry.shift(); // 前删匹配方式并赋值
                    strategyAry.unshift(dom.value); // 前插value值
                    strategyAry.push(errorMsg); // 后插出错提示
                    strategyAry.push(dom); // 后插dom
                    
                    if (!RULES[strategy]) {
                        $.error('没有' + strategy + '规则，请检查命名或自行定义');
                    }
                    return {
                        errorMsg: RULES[strategy].apply(dom, strategyAry),
                        el: dom
                    };
                });
            }(rule));
        }
    };

    Validator.prototype.start = function() {
        var result;
        for (var i = 0, validatorFunc; validatorFunc = this.cache[i++];) {
            var result = validatorFunc();
            if (setting.successTip) { new Validator().showMsg($(result.el), '', 1); }
            if (result.errorMsg) { return result; }
        }
        return true;
    };

    Validator.prototype.showMsg = function(target, msg, status, callback) {
        //status
        // 0 : tip
        // 1 : success
        // 2 : error
        var _current = status ? (status > 1 ? 'error' : 'success') : 'tip';
        var $context = target.parent();
        var $msg = $context.find('.valid_message');
        var _other = target.attr('data-type') || '';
        $msg.remove();
        $context.removeClass('success tip error').addClass(_current+' '+_other).append('<span class="valid_message">' + msg + '</span>');
    };

    var plugin = {
        init: function(options) {
            var $form = this;
            var $body = $('body');
            var $required = $form.find('.required');
            setting = $.extend(setting, options);

            if (setting.type) { $.extend(RULES, setting.type); }

            var validator = new Validator();

            $body.on({
                focus: function(event) {
                    var $this = $(this);
                    var _tipMsg = $this.attr('data-tip') || '';
                    var _status = $this.attr('data-status');
                    if (_status === undefined ||!parseInt(_status)) {
                        validator.showMsg($this, _tipMsg);
                    }
                    setting.onFocus ? setting.onFocus.call($this, arguments) : '';
                },
                blur: function(event) {
                    var $this = $(this);
                    var dataValid = $this.attr('data-valid');
                    var validLen = dataValid.split('||');
                    var errCollection = $this.attr('data-error');
                    var errMsgAry = errCollection.split("||");
                    var strategyAry, strategy, errMsg;

                    for (var i = 0; i < validLen.length; i++) {
                        strategyAry = validLen[i].split(':');
                        strategy = strategyAry.shift();
                        strategyAry.unshift(this.value);
                        strategyAry.push(errMsgAry[i]);
                        strategyAry.push(this);
                        errMsg = RULES[strategy].apply(this, strategyAry);
                        if (errMsg) {
                            $this.attr('data-status', 0);
                            validator.showMsg($this, errMsg, 2);
                            break;
                        }
                    };

                    if (!errMsg) {
                        $this.attr('data-status', 1);
                        setting.successTip ? validator.showMsg($this, '', 1) : $this.parent().find('.valid_message').remove();
                    }

                    setting.onBlur ? setting.onBlur.call($this, arguments) : '';
                },
                change: function(event) {
                    setting.onChange ? setting.onChange.call($this, arguments) : '';
                }
            }, '.required');


        },
        submitValidate: function(options) {
            var $form = options || this;    
            var $body = $('body');
            var $required = $form.find('.required');
            var validator = new Validator();
            var $target;
            

            $.each($required, function(index, el) {
                var $el = $(el);
                var dataValid = $el.attr('data-valid');     
                var validLen = dataValid.split('||');
                var errCollection = $el.attr('data-error');
                var errMsgAry = errCollection.split("||");
                var ruleAry = [];               
                
                for (var i = 0; i < validLen.length; i++) {                 
                    ruleAry.push({
                        strategy: validLen[i],
                        errorMsg: errMsgAry[i]
                    });                 
                };

                validator.add(el, ruleAry);

            });

            var result = validator.start();

            if (result.errorMsg) {
                $target = $(result.el);
                validator.showMsg($target, result.errorMsg, 2);
                return false;
            }

            return true;
        }
    };

    $.fn.validate = function() {
        var method = arguments[0];
        if (plugin[method]) {
            method = plugin[method];
            arguments = Array.prototype.slice.call(arguments, 1);
        } else if (typeof(method) == 'object' || !method) {
            method = plugin.init;
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.validate Plugin');
            return this;
        }
        return method.apply(this, arguments);
    }
}));