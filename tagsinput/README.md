##jquery.tagsinput
插件描述：一个jquery开发的标签功能加强插件，可以生成或删除标签，还能对输入重复标签进行检查，和JQuery autocomplete插件配合实现自动完成功能


###使用：
<pre>
input type="text" class="input-text" id="tagsinput"

$('#tagsinput').tagsInput({
    width:'auto', 
    height:'auto', 
    defaultText:'添加标签',  
    placeholderColor:'#b4b4b4'
 });
</pre>


###参数
<pre>
$(selector).tagsInput({
   'autocomplete_url': url_to_autocomplete_api,        //自动完成插件的文件地址，demo里有说明
   'autocomplete': { option: value, option: value},    //自动完成插件的参数，demo有说明
   'height':'100px',                                   //设置高度
   'width':'300px',                                    //设置宽度
   'interactive':true,                                 //是否允许添加标签，false为阻止
   'defaultText':'add a tag',           //默认文字
   'onAddTag':callback_function,        //增加标签的回调函数
   'onRemoveTag':callback_function,     //删除标签的回调函数
   'onChange' : callback_function,      //改变一个标签时的回调函数
   'removeWithBackspace' : true,        //是否允许使用退格键删除前面的标签，false为阻止
   'minChars' : 0,                      //每个标签的小最字符
   'maxChars' : 0                       //每个标签的最大字符，如果不设置或者为0，就是无限大
   'placeholderColor' : '#666666'       //设置defaultText的颜色
});
</pre>

