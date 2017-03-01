##jquery.downCount
倒计时插件

   
    var date = new Date();    
    var day = date.getDate()+1;    
    var month = date.getMonth()+1;    
    var year = date.getFullYear();
    
     
    // start
    $('.countdown').downCount({
        date: month+'/'+day+'/'+year,
        milliShow:1
    }, function () {
        console.log('倒计时结束!');
    });
    