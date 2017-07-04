/*
* jQuery Form Plugin:jquery.rating.js 
* 星级评分：支持一颗，半颗，1/4颗，也可以自定义
*
* author:  damys
* version: 1.1
* url:     https://github.com/damys/lab-js
* Date:    2017/7/4

example:
    $('#rating').rating( {
        mode:'quarter',
        total:6,
        num:4,
        readOnly:false
    });
*/

var rating = (function(){
        // 策略: 1处
        var strategies = {
            entire:function(){   return 1; },
            half:function(){      return 2; },
            quarter:function(){ return 4; }
        };


        // 评分
        var Rating = function(el, options){
                this.$el               = $(el);   // 转为jquery 对象
                this.opts             = $.extend({}, Rating.DEFAULTS, options);  // 提取自定义参数

                 // 策略:2处
                 if(!strategies[this.opts.mode])  this.opts.mode = 'entire'   // 非合法参数处理，指定为默认

                this.ratio = strategies[this.opts.mode]();     //  读取默认,执行后，返回策略中的数字
                this.opts.total *= this.ratio;
                this.opts.num *= this.ratio;

                this.itemWidth    = 26 / this.ratio;     // 默认宽度
                this.displayWidth = this.opts.num * this.itemWidth;  // 设置点亮个数宽度

                console.log(this.opts)
        };


        // 默认参数
        Rating.DEFAULTS = {
            mode:'entire',            // 策略:3处， 指定默认
            total:5,
            num:2,
            readOnly:false,
            select:function(){},
            chosen:function(){}
        };

        Rating.prototype.init = function(){
                this.buildHTML();           // 创建HTML
                this.setCSS();                  // 设置样式

                if(!this.opts.readOnly){   // 绑定事件
                    this.bindEvent();
                }
        };

        // 创建HTML
        Rating.prototype.buildHTML = function(){
            var html = '';
            html += '<div class="rating-display"></div>';
            html +='<ul class="rating-mask">';
            for(var i = 0; i < this.opts.total; i++){
                html += '<li class="rating-item"></li>';
            }
            html += '</ul>';

            this.$el.html(html);
        };

        // 设置样式
        Rating.prototype.setCSS = function(){
               this.$el.width(this.opts.total * this.itemWidth);  // 总宽度
               this.$display = this.$el.find('.rating-display');
               this.$display.width(this.displayWidth);

               this.$el.find('.rating-item').width(this.itemWidth);
        };

        // 绑定事件
        Rating.prototype.bindEvent = function(){
                var self = this;
                this.$el.on("mouseover", '.rating-item', function()
                {
                    var count = $(this).index() + 1;
                    self.$display.width(count * self.itemWidth);

                    // 参数1：指定到当前对象; 参数2：当前每几个星星; 参数3：星星个数
                    (typeof self.opts.select === 'function') && self.opts.select.call(this, count, self.opts.total);
                    
                    self.$el.trigger('select', [count, self.opts.total]);

                }).on('click', '.rating-item', function()
                {
                     var count = $(this).index() + 1;

                     self.displayWidth = count * self.itemWidth;

                    // 第1参数：指定到当前对象，第2参数：当前每几个星星, 第3个参数：星星个数
                    (typeof self.opts.chosen === 'function') && self.opts.chosen.call(this,count, self.opts.total);
                    
                    self.$el.trigger('chosen', [count, self.opts.total]);
                }).on('mouseout', function()
                {
                    self.$display.width(self.displayWidth);
                })
        };

        // 解绑定事件
        Rating.prototype.unbindEvent = function(){
             this.$el.off();
        }

        var init = function(el, option){
                // 防止重复提交调用多次
                var $el = $(el),
                      rating = $el.data('rating');

                if(!rating){
                    $el.data('rating', (rating = new Rating(el, typeof option === 'object' && option)));
                    rating.init();
                } 

                // 如果是字符串    
                if(typeof option === 'string') rating[option]();      
        };

        // 使用jQuery 插件
        $.fn.extend({
            rating:function(option){
                return this.each( function(){
                    init(this, option)
                })
            }
        })

        return {
            init:init
        };

    })();