##CCForm
提交框架


<pre>
调用 方式1：无参数
$.CCForm();


调用 方式2：有参数
$.CCForm({
    form:'.CCForm',                                         // 可选。表单类名(class 要带点)，默认为CCFrom
    url:'http://www.xxx.com/post',                          // 可选。要提交的url
    jumpUrl:'http://www.xxx.com',                           // 可选。提交成功后跳转置页面
    successMsg:'提交成功<br>我们的工作人员会尽快与您联系',  // 可选。提交成功后，提示的信息
    errorMsg:'提交失败',                                     // 可选。提交失败后，提示的信息
    delay:10000                                             // 可选。提交后提示信息框的延时显示时间
});
</pre>
