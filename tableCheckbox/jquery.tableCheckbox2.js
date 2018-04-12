/**
 * 表格行全选，反选
 * @param table
 * @param clickTrAddBg
 */
function tableCheckbox(table, clickTrAddBg) {
    // 指定默认
    table = table ? table : '.table';

    // 点击tr加样式, 默认添加
    if (!clickTrAddBg) {
        $('.table tr').on('click', function() {
            $(this).addClass('success').siblings().removeClass('success')
        });
    }

    // 处理表格行全选，反选
    $('table').on("click", function() {
        var _this = $(this);
        var allCheck = _this.find("th").find(':checkbox');
        var checks = _this.find('td:first-child').find(':checkbox');

        allCheck.on("click", function() {
            var set = _this.find('td .form-checkbox').find(':checkbox');
            if ($(this).prop("checked")) {
                $.each(set, function(i, v) {
                    $(v).prop("checked", true);
                    //                    $(this).parents('tr').addClass('warning')
                });
            } else {
                $.each(set, function(i, v) {
                    $(v).prop("checked", false);
                    //                    $(this).parents('tr').removeClass('warning')
                });
            }
        });

        checks.on("click", function(e) {
            e.stopPropagation(); // 阻止冒泡

            var leng = _this.find('td .form-checkbox').find(':checkbox:checked').length;
            if (leng === checks.length) {
                allCheck.prop('checked', true);
            } else {
                allCheck.prop("checked", false);
            }

            //            console.log('总个数：'+ checks.length +'--已选择个数：'+leng);
        });
    });
}
