## Jquery CCSlider


## html
<pre>
&lt;ul class="ccSlider"&gt;
    &lt;li class="ccSlider-item"&gt;&lt;a href="http://www.baidu.com" style="background-color:#333"&gt;&lt;/a&gt;&lt;/li&gt;
    &lt;li class="ccSlider-item"&gt;&lt;a href="http://www.qq.com" style="background-color: blue"&gt;&lt;/a&gt;&lt;/li&gt;
    &lt;li class="ccSlider-item"&gt;&lt;a href="http://www.ifeng.com" style="background-color: green"&gt;&lt;/a&gt;&lt;/li&gt;
&lt;/ul&gt;
</pre>

## js
<pre>
$('.ccSlider').ccSlider();
</pre>

## 参数
<pre>
startSlide: 0,                     //开始索引 0开始
item: '.ccSlider-item',            //子元素选择器
isFullScreen: false,               //是否全屏
isFlexible: false,                 //是否自适应
isSupportTouch: '__proto__' in {}, //是否支持触摸 html5 transform:
isShowPage: true,                  //是否显示分页按钮
isShowTitle: false,                //是否显示标题栏
titleAttr: 'data-title',           //标题文本存放的属性 或者回调函数(需要返回值)
isShowControls: true,              //是否显示左右控制按钮
isAuto: true,                      //是否自动播放
intervalTime: 5000,                //自动播放间隔时间
affectTime: 300,                   //特效时间 
mode: 'move',                      //特效类型 string : fade || move
direction: 'left',                 //方向 string: left || top
onSwipeStart: $.noop,              //开始滑动回调
onSwipeMove: $.noop,               //滑动中回调
minSwipeLength: 30,                //正常滑动的最小值
onSwipeCancel: $.noop,             //滑动取消回调 和 minSwipeLength值有关
onSwipeEnd: $.noop,                //触摸结束回调 (正常触摸) 
onSwipeLeft: $.noop,               //向左滑动回调
onSwipeRight: $.noop,              //向右滑动回调
onSwipeTop: $.noop,                //向上滑动回调
onSwipeBottom: $.noop,             //向下滑动回调
onInited:  $.noop,                 //初始化后回调
onMoveBefore: $.noop,              //运动前回调
onMoveAfter: $.noop,               //运动后回调
onSelected: $.noop                 //分页选中回调
</pre>