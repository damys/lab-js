var cc = (function ()
{
    /**
     * 返回顶部
      * @param id
     */
    function backTop(id) {
        var btn = document.getElementById(id);
        var d = document.documentElement;
        var b = document.body;
        window.onscroll = set;
        btn.style.display = "none";
        btn.onclick = function() {
            btn.style.display = "none";
            window.onscroll = null;
            this.timer = setInterval(function() {
                d.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1);
                b.scrollTop -= Math.ceil((d.scrollTop + b.scrollTop) * 0.1);
                if ((d.scrollTop + b.scrollTop) == 0) clearInterval(btn.timer, window.onscroll = set);
            }, 10);
        };
        function set() {
            btn.style.display = (d.scrollTop + b.scrollTop > 400) ? 'block': "none";
        }
    }

    /**
     * 子框架设值父框架站点信息
     */
    function subframeSetParentframeSite() {
        var site = '<a href="/manager/"><i class="iconfont">&#xe6d2;</i></a>';
        site += window.document.title.replace('|','<i class="iconfont">&#xe65f;</i>');
        parent.window.document.getElementById("siteInner").innerHTML=site
    }

    /**
     * 折叠 fold
     * @param title 点击切换
     * @param mode  1:只打开一个，可以关闭; 2:必须有一个打开; 3:可打开多个
     * @param info  切换内容
     * @param speed
     * @param event  click,mouseover
     */
    function fold (title, mode, info, speed, event){
        if(!title) { title = '.fold-item .title';}
        if(!mode)  { mode  = 1;}
        if(!info)  { info  = '.fold-item .info';}
        if(!speed) { speed = 'fast';}
        if(!event) { event = 'click'; }

        if(mode === 2){
            $(title+":first").find("em").html("-");
            $(info+":first").show();
        }

        $(title).bind(event,function(){
            if($(this).next().is(":visible")){
                if(mode === 2){
                    return false;
                }
                else{
                    $(this).next().slideUp(speed).end().removeClass("selected");
                    $(this).find("em").html("+");
                }
            }
            else{
                if(mode === 3){
                    $(this).next().slideDown(speed).end().addClass("selected");
                    $(this).find("em").html("-");
                }else{
                    $(this).parent().parent().find(info).slideUp(speed);
                    $(this).parent().parent().find(title).removeClass("selected");
                    $(this).parent().parent().find("em").html("+");
                    $(this).next().slideDown(speed).end().addClass("selected");
                    $(this).find("em").html("-");
                }
            }
        });
    }

    /**
     * tab 切换
     * @param tabBar    点击切换
     * @param mode      默认显示第0个
     * @param tabCon    内容切换
     * @param tabEvent  click， mouseover
     * @param className 切换的样式名
     */
    function tab( tabBar, mode, tabCon, tabEvent, className){
        if(!tabBar)   { tabBar = '.cc-tab .tabBar';}
        if(!mode)     { mode = 0 }
        if(!tabCon)   { tabCon = '.tabCon .tab-item'}
        if(!tabEvent) { tabEvent = 'click' }
        if(!className){ className = 'current' }

        $tab = $(tabBar).find('li');

        // init
        $tab.eq(mode).addClass(className).siblings().removeClass(className);
        $tab.parent().parent().find(tabCon).eq(mode).addClass('show').siblings().removeClass('show');

        $tab.bind(tabEvent,function(){
            $(this).addClass(className).siblings().removeClass(className);
            $(this).parent().parent().find(tabCon).eq($(this).index()).addClass('show').siblings().removeClass('show');
        })
    }


    /*************************************************
     * set cookie
     * @param name
     * @param value
     * @param Days
     */
    function setCookie(name, value, Days){
        if(Days == null || Days == ''){
            Days = 300;
        }
        var exp  = new Date();
        exp.setTime(exp.getTime() + Days*24*60*60*1000);
        document.cookie = name + "="+ escape (value) + "; path=/;expires=" + exp.toGMTString();
    }

    // get cookie by name
    function getCookie(name) {
        var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
        if(arr=document.cookie.match(reg)){
            return unescape(arr[2]);
        } else{
            return null;
        }

    }

    // get all cookie
    function getAllCookie(){
        return document.cookie;
    }

    // del cookie by name
    function delCookie(name){
        var exp = new Date();
        exp.setTime(exp.getTime() - 1);
        var cval=getCookie(name);
        if(cval!=null){
            document.cookie= name + "="+cval+"; path=/;expires="+exp.toGMTString();
        }
    }

    // clear cookie
    function clearCookie(name){
        setCookie(name, '', -1);
    }


    /**
     * 获取格式化的当前时间
     * @returns
     */
    function getNowFormatDate() {
        var date = new Date();
        var seperator1 = '-';
        var seperator2 = ':';
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = '0' + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = '0' + strDate;
        }
        var currentdate = date.getFullYear() + seperator1 + month + seperator1
            + strDate + ' ' + date.getHours() + seperator2
            + date.getMinutes() + seperator2 + date.getSeconds();
        return currentdate;
    }


    /**
     * 表单验证
     * @param formElement  表单元素
     * @param callback     返回验证结果：false, true
     * @param src          动态增加插件到页面
     * @param jqueryAfter  插件添加的位子， 一般放在（依赖）jquery后
     */
    function validate(formElement, callback, src, jqueryAfter){
        // 1. 加载validate 插件到页面
        var script  = document.createElement('script');
        script.src  = src ? src : '/assets/admin/js/libs/jquery.validate.js';
        jqueryAfter = jqueryAfter ? jqueryAfter : '#minjq';
        $(jqueryAfter).after(script);

        // 2. 对输入框内容进行验证
        $(formElement).validate({
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

        // 3. 提交验证
        $(formElement).on('submit', function(event) {
            if(event && event.preventDefault){
                event.preventDefault();
            }else{
                window.event.returnValue = false; //注意加window
            }

            // return boolean;
            callback($(this).validate('submitValidate'));
        });
    }

    /*************************************************
     * 调用返回
     */
    return {

        /**
         * 返回顶部
         * @param: id
         */
        backTop : backTop,

        /**
         * 折叠 fold
         * @param title 点击切换
         * @param mode  1:只打开一个，可以关闭; 2:必须有一个打开; 3:可打开多个
         * @param info  切换内容
         * @param speed
         * @param event  click,mouseover
         */
        fold : fold,

        /**
         * tab 切换
         * @param tabBar    点击切换
         * @param mode      默认显示第0个
         * @param tabCon    内容切换
         * @param tabEvent  click， mouseover
         * @param className 切换的样式名
         */
        tab : tab,

        /**
         * 子框架设值父框架站点信息
         */
        subframeSetParentframeSite : subframeSetParentframeSite,
        /**
         * 获取格式化的当前时间
         */
        getNowFormatDate : getNowFormatDate,

        /**
         * set cookie
         * @param: name, value, Days
         */
        setCookie : setCookie,
        /**
         * get cookie by name
         * @param: name
         */
        getCookie : getCookie,
        getAllCookie : getAllCookie,
        /**
         * del cookie by name
         * @param: name
         */
        delCookie : delCookie,
        clearCookie : clearCookie,

        /**
         * 表单验证
         * @param formElement  表单元素
         * @param callback     返回验证结果：false, true
         * @param src          动态增加插件到页面
         * @param jqueryAfter  插件添加的位子， 一般放在（依赖）jquery后
         */
        validate : validate

    }
}());
