## Jquery searchableSelect
## 带搜索的下拉框

## css
<pre>
<link rel="stylesheet" href="./jquery.searchableSelect.css">
</pre>

## html
<pre>
<select class="searchableSelect" name="searchableSelect">
    <option>请选择</option>
    <option value="" selected>searchableSelect</option>
    <option value="a" disabled>aaaa</option>
    <option value="b">bbb</option>
    <option value="c">ccc</option>
    <option value="d">dddd</option>
    <option value="e">eeee</option>
    <option value="f">ffff</option>
</select>
</pre>

## js
<pre>
<script type="text/javascript" src="https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js"></script>
<script src="./jquery.searchableSelect.js"></script>
<script>
$('.searchableSelect').searchableSelect();
</script>
</pre>
