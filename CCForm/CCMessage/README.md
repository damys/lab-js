## CCMessage
提示信息框架(文字提示)

<pre>
// 加载中。。。
$.CCMessage();


// 自定义参数：
$.CCMessage({
    message:'这是一个测试对话框',
    effect:1,
    delay:3000
});
</pre>

### 更多参数
<pre>
width:"auto",
height:"auto",
message:null,         // 提示信息
maskOpacity:null,    // 遮罩背景
delayCallback:null,  // 延时关闭的回调孙数
maskShow:0,          // 显示遮罩，默认隐藏
maskClose:!0,        // 点击遮罩层是否可以关闭，默认点击可关闭
delay:2000,            // 弹出框多久关闭，默认2s
effect:!0                // 动画效果
</pre>
