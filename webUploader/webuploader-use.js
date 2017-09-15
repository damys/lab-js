 $(function() { 
    // 定义全局变量
    var $               = jQuery,           // just in case. Make sure it's not an other libaray.
        $wrap           = $('#uploader'),
        $queue          = $('<ul class="filelist"></ul>').appendTo( $wrap.find('.queueList') ),    // 图片容器
        $statusBar      = $wrap.find('.statusBar'),    // 状态栏，包括进度和控制按钮
        $info           = $statusBar.find('.info'),    // 文件总体选择信息。
        $upload         = $wrap.find('.uploadBtn'),    // 上传按钮
        $placeHolder    = $wrap.find('.placeholder'),   // 没选择文件之前的内容
        $progress       = $statusBar.find('.progress').hide(),   // 总体进度条
        fileCount       = 0,                  // 添加的文件数量
        fileSize        = 0,                  // 添加的文件总大小
        ratio           = window.devicePixelRatio || 1,    // 优化retina, 在retina下这个值是2
        thumbnailWidth  = 110 * ratio,        // 缩略图大小: width
        thumbnailHeight = 110 * ratio,        // 缩略图大小:height
        state           = 'pedding',          // 可能有pedding, ready, uploading, confirm, done.
        percentages     = {},                 // 所有文件的进度信息，key为file id

        // 图片旋转
        supportTransition = (function(){
            var s = document.createElement('p').style,
                r = 'transition' in s ||
                      'WebkitTransition' in s ||
                      'MozTransition' in s ||
                      'msTransition' in s ||
                      'OTransition' in s;
            s = null;
            return r;
        })();
     
    if ( !WebUploader.Uploader.support() ) {
        alert( 'Web Uploader 不支持您的浏览器！如果你使用的是IE浏览器，请尝试升级 flash 播放器');
        throw new Error( 'WebUploader does not support the browser you are using.' );
    }

    // 插件开始： 实例化: 参数可见：http://fex.baidu.com/webuploader/doc/
    var uploader = WebUploader.create({
        server: 'webUploader.php',
        method:'POST',                           // 上传方式GET（默认POST）,强烈推荐使用POST 方式
        formData:{'fid':111},                    // 自定义上传参数。 注意：id参数插件已占用
        paste: document.body,                    // 通过粘贴来添加截屏的图片
        pick: {id: '#filePicker',label: '点击选择图片'},  // 文件的按钮容器
        dnd: '#uploader .queueList',             // 指定Drag And Drop拖拽的容器
        disableGlobalDnd: true,                  // 是否禁掉整个页面的拖拽功能
        accept: {                                // 接受哪些类型的文件
            title: 'File',
            extensions: 'gif,jpg,jpeg,bmp,png,mp4,zip,dox,docx,xls,xlsx',
//            mimeTypes: 'image/*'               // chrome 浏览器点击上传响应慢的问题
        },
        swf :'./dist/Uploader.swf',              // swf文件路径
        auto:false,                              // 自动上传，不需要手动调用上传，有文件选择即开始上传
        chunked: true,                           // 开启切片
        chunkSize:2*1024*1024,                   // 切片大小
        threads: 3,                               //上传并发数（默认值：3）。允许同时最大上传进程数。
        fileNumLimit: 10,                        // 验证文件总数量, 超出则不允许加入队列
        fileSizeLimit: 200 * 1024 * 1024,        // 200 M
        fileSingleSizeLimit: 100 * 1024 * 1024,  // 100 M
        compress:{width:1000, height:1000}       // 可选：压缩图片大小
    });

    // 添加【添加文件】的按钮，
    uploader.addButton({ id: '#filePicker2', label: '继续添加'});

    // 当有文件添加进来时执行，负责view的创建
    function addFile( file ) {
        var $li = $( '<li id="' + file.id + '">' +
                '<p class="title">' + file.name + '</p>' +
                '<p class="imgWrap"></p>'+
                '<p class="progress"><span></span></p>' +
                '</li>' ),

            $btns = $('<div class="file-panel">' +
                '<span class="cancel">删除</span>' +
                '<span class="rotateRight">向右旋转</span>' +
                '<span class="rotateLeft">向左旋转</span></div>').appendTo( $li ),
            $prgress = $li.find('p.progress span'),
            $wrap = $li.find( 'p.imgWrap' ),
            $info = $('<p class="error"></p>'),

            showError = function( code ) {
                switch( code ) {
                    case 'exceed_size':
                        text = '文件大小超出';
                        break;

                    case 'interrupt':
                        text = '上传暂停';
                        break;

                    default:
                        text = '上传失败，请重试';
                        break;
                }

                $info.text( text ).appendTo( $li );
            };

        if ( file.getStatus() === 'invalid' ) {
            showError( file.statusText );
        } else {
            // @todo lazyload
            $wrap.text( '预览中' );
            uploader.makeThumb( file, function( error, src ) {
                if ( error ) {
                    $wrap.text( '不能预览' );
                    return;
                }

                var img = $('<img src="'+src+'">');
                $wrap.empty().append( img );
            }, thumbnailWidth, thumbnailHeight );

            percentages[ file.id ] = [ file.size, 0 ];
            file.rotation = 0;
        }

        file.on('statuschange', function( cur, prev ) {
            if ( prev === 'progress' ) {
                $prgress.hide().width(0);
            } else if ( prev === 'queued' ) {
                $li.off( 'mouseenter mouseleave' );
                $btns.remove();
            }

            // 成功
            if ( cur === 'error' || cur === 'invalid' ) {
                console.log( file.statusText );
                showError( file.statusText );
                percentages[ file.id ][ 1 ] = 1;
            } else if ( cur === 'interrupt' ) {
                showError( 'interrupt' );
            } else if ( cur === 'queued' ) {
                percentages[ file.id ][ 1 ] = 0;
            } else if ( cur === 'progress' ) {
                $info.remove();
                $prgress.css('display', 'block');
            } else if ( cur === 'complete' ) {
                $li.append( '<span class="success"></span>' );
            }

            $li.removeClass( 'state-' + prev ).addClass( 'state-' + cur );
        });

        $li.on( 'mouseenter', function() {
            $btns.stop().animate({height: 30});
        });

        $li.on( 'mouseleave', function() {
            $btns.stop().animate({height: 0});
        });

        $btns.on( 'click', 'span', function() {
            var index = $(this).index(),
                deg;

            switch ( index ) {
                case 0:
                    uploader.removeFile( file );
                    return;

                case 1:
                    file.rotation += 90;
                    break;

                case 2:
                    file.rotation -= 90;
                    break;
            }

            if ( supportTransition ) {
                deg = 'rotate(' + file.rotation + 'deg)';
                $wrap.css({
                    '-webkit-transform': deg,
                    '-mos-transform': deg,
                    '-o-transform': deg,
                    'transform': deg
                });
            } else {
                $wrap.css( 'filter', 'progid:DXImageTransform.Microsoft.BasicImage(rotation='+ (((file.rotation/90)%4 + 4)%4) +')');
            }
        });

        $li.appendTo( $queue );
    }

    // 负责view的销毁
    function removeFile( file ) {
        delete percentages[ file.id ];
        
        // 更新进度 
        updateTotalProgress();
//        var $li = $('#'+file.id);
//        $li.off().find('.file-panel').off().end().remove();
    }
    
    // 方法：更新进度 
    function updateTotalProgress() {
        var loaded = 0,
            total = 0,
            spans = $progress.children(),
            percent;

        $.each( percentages, function( k, v ) {
            total += v[ 0 ];
            loaded += v[ 0 ] * v[ 1 ];
        } );

        percent = total ? loaded / total : 0;

        spans.eq( 0 ).text( Math.round( percent * 100 ) + '%' );
        spans.eq( 1 ).css( 'width', Math.round( percent * 100 ) + '%' );
        updateStatus();
    }
     
    // 方法：根据状态设置相关内容
    function updateStatus() {
        var text = '', stats;

        if ( state === 'ready' ) {
            text = '选中' + fileCount + '张图片，共' +
                    WebUploader.formatSize( fileSize ) + '。';
        } else if ( state === 'confirm' ) {
            stats = uploader.getStats();
            if ( stats.uploadFailNum ) {
                text = '已成功上传' + stats.successNum+ '张照片至XX相册，'+
                    stats.uploadFailNum + '张照片上传失败，<a class="retry" href="#">重新上传</a>失败图片或<a class="ignore" href="#">忽略</a>';
            }

        } else {
            stats = uploader.getStats();
            text = '共' + fileCount + '张（' +
                    WebUploader.formatSize( fileSize )  +
                    '），已上传' + stats.successNum + '张';

            if ( stats.uploadFailNum ) {
                text += '，失败' + stats.uploadFailNum + '张';
            }
        }

        $info.html( text );
    }
     
    // 方法： 设置状态 
    function setState( val ) {
        var stats;

        if ( val === state ) { return; }

        $upload.removeClass( 'state-' + state );
        $upload.addClass( 'state-' + val );
        state = val;

        switch ( state ) {
            case 'pedding':
                $placeHolder.removeClass( 'element-invisible' );
                $queue.parent().removeClass('filled');
                $queue.hide();
                $statusBar.addClass( 'element-invisible' );
                uploader.refresh();
                break;

            case 'ready':
                $placeHolder.addClass( 'element-invisible' );
                $( '#filePicker2' ).removeClass( 'element-invisible');
                $queue.parent().addClass('filled');
                $queue.show();
                $statusBar.removeClass('element-invisible');
                uploader.refresh();
                break;

            case 'uploading':
                $( '#filePicker2' ).addClass( 'element-invisible' );
                $progress.show();
                $upload.text( '暂停上传' );
                break;

            case 'paused':
                $progress.show();
                $upload.text( '继续上传' );
                break;

            case 'confirm':
                $progress.hide();
                $upload.text( '开始上传' ).addClass( 'disabled' );

                stats = uploader.getStats();
                if ( stats.successNum && !stats.uploadFailNum ) {
                    setState( 'finish' );
                    return;
                }
                break;
            case 'finish':
                stats = uploader.getStats();
                if ( stats.successNum ) {
                    console.log('上传成功');
                } else {
                    // 没有成功的图片，重设
                    state = 'done';
                    location.reload();
                }
                break;
        }

        updateStatus();
    }
    
    // 上传过程中触发，携带上传进度
    uploader.onUploadProgress = function( file, percentage ) {
        var $li = $('#'+file.id),
            $percent = $li.find('.progress span');

        $percent.css( 'width', percentage * 100 + '%' );
        percentages[ file.id ][ 1 ] = percentage;
        updateTotalProgress();
    };
     
    // 当文件被加入队列之前触发 
    uploader.onFileQueued = function( file ) {
        fileCount++;
        fileSize += file.size;

        if ( fileCount === 1 ) {
            $placeHolder.addClass( 'element-invisible' );
            $statusBar.show();
        }

        addFile( file );
        setState( 'ready' );
        updateTotalProgress();
    };
     
    // 当文件被移除队列后触发
    uploader.onFileDequeued = function( file ) {
        fileCount--;
        fileSize -= file.size;

        if ( !fileCount ) { setState( 'pedding' ); }

        removeFile( file );
        updateTotalProgress();

    };

    uploader.on( 'all', function( type ) {
        // var stats;
        switch( type ) {
            case 'uploadFinished':
                setState( 'confirm' );
                break;

            case 'startUpload':
                setState( 'uploading' );
                break;

            case 'stopUpload':
                setState( 'paused' );
                break;
        }
    });
     
    // 出错时，触发 
    uploader.onError = function( code ) { alert( 'Eroor: ' + code ); };
    
    // 上点开始上传
    $upload.on('click', function() {
        if ( $(this).hasClass( 'disabled' )){ return false; }

        if ( state === 'ready' ) {          uploader.upload();
        } else if ( state === 'paused' ) {  uploader.upload();
        } else if ( state === 'uploading' ) { uploader.stop();}
    });

    $info.on( 'click', '.retry', function(){ uploader.retry(); });
    $info.on( 'click', '.ignore', function(){alert('todo'); });

    $upload.addClass( 'state-' + state );
    
    // 更新进度 
    updateTotalProgress();
});