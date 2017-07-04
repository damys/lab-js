
## Rating 
星级评分：支持一颗，半颗，1/4颗，也可以自定义


    $('#rating').rating( {
        mode:'quarter',
        total:6,
        num:4,
        readOnly:false,
        select:function(count, total){
            console.log(count + '/' + total);
        },
        chosen:function(count, total){
           // $('#rating').rating('unbindEvent');
        }
    });


## 效果图
![](./rating-demo.png)