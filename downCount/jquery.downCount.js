/*
* jQuery Form Plugin:jquery.downCount.js 
* 倒计时插件
*
* author:  damys
* version: 1.1
* url:     https://github.com/damys/lab-js
* Date:    2016/12
*/

(function ($) {
    $.fn.downCount = function (options, callback) {
        var configs = $.extend({
                date: null,
                offset:8,     // 时区+8
				milliShow:0   // 是否显示毫秒 ， 注：较消耗内存， 不建议使用
            }, options);

        if (!configs.date) {
            $.error('Date is not defined.');
        }

        // 如果日期格式设置错误，抛出错误
        if (!Date.parse(configs.date)) {
            $.error('Incorrect date format, it should look like this, 12/24/2012 12:00:00.');
        }

        var currentDate = function () {
            var date = new Date();

            // turn date to utc
             var utc = date.getTime() + (date.getTimezoneOffset() * 60000);
             var new_date = new Date(utc + (3600000*configs.offset))
			
			 return new_date;
			
			// 更新：location time
            // return new Date(date.getTime());
        };
		
		// 保存容器对象
        var container = this;
		
        // 倒计时
        function countdown () {
            var target_date = new Date(configs.date), // 设置目标日期
                current_date = currentDate();         // 获取静态当前日期

            // 计算不同日期
            var difference = target_date - current_date;

            // 当日期差小于0时，清除
            if (difference < 0) {
                // stop timer
                clearInterval(interval);

                if (callback && typeof callback === 'function') {
					callback();
				}
                return;
            }


            var _second = 1000,
                _minute = _second * 60,
                _hour = _minute * 60,
                _day = _hour * 24;

            // 日期数据
            var days = Math.floor(difference / _day),
                hours = Math.floor((difference % _day) / _hour),
                minutes = Math.floor((difference % _hour) / _minute),
                seconds = Math.floor((difference % _minute) / _second);

                // fix dates so that it will show two digets
                days = (String(days).length >= 2) ? days : '0' + days;
                hours = (String(hours).length >= 2) ? hours : '0' + hours;
                minutes = (String(minutes).length >= 2) ? minutes : '0' + minutes;
                seconds = (String(seconds).length >= 2) ? seconds : '0' + seconds;

            // 当前时间类型
            var ref_days = (days === 1) ? 'day' : 'days',
                ref_hours = (hours === 1) ? 'hour' : 'hours',
                ref_minutes = (minutes === 1) ? 'minute' : 'minutes',
                ref_seconds = (seconds === 1) ? 'second' : 'seconds';

            // 设置DOM 时间数据
            container.find('.days').text(days);
            container.find('.hours').text(hours);
            container.find('.minutes').text(minutes);
            container.find('.seconds').text(seconds);
			
			// 设置DOM 时间类型数据
            container.find('.days_ref').text(ref_days);
            container.find('.hours_ref').text(ref_hours);
            container.find('.minutes_ref').text(ref_minutes);
            container.find('.seconds_ref').text(ref_seconds);
        }
		
		// 开始设置计数器：1秒调用1次
        var interval = setInterval(countdown, 1000);
		
		
		// 是否显示毫秒， 注：较消耗内存， 不建议使用
		if(configs.milliShow){
			
			var ref_Milliseconds = 0;
			
			function Millisecond() {
				ref_Milliseconds++;
				
				// 只显示两位
				if(ref_Milliseconds > 100){
					ref_Milliseconds = 0;
					return;
				}				
				container.find('.Milliseconds').text(ref_Milliseconds);
			}
			
			// 开始设置计数器， 1000分之1秒调用一次
			setInterval(Millisecond, 1);
		}
    };
})(jQuery);