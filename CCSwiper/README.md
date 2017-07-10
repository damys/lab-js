## CCSwiper 
常用于移动端网站的内容点击，触摸滑动，可用于焦点图等

### 在原框架上修改：
<pre>
1. 封装左右按钮点击切换，按钮图标
2. hover 暂停滚动
3. 修改默认参数
4. 切换效果：默认wap 端以滑动 slide 效果，pc 端 fade 效果
5. 支持ie7+
</pre>

### html
<pre>
&lt;div class="swiper-container"&gt;
	&lt;div class="swiper-wrapper"&gt;
		&lt;div class="swiper-slide" style=" background-image: url(./slideshow/1.jpg)"&gt;&lt;/div&gt;
		&lt;div class="swiper-slide" style=" background-image: url(./slideshow/2.jpg)"&gt;&lt;/div&gt;
		&lt;div class="swiper-slide" style=" background-image: url(./slideshow/3.jpg)"&gt;&lt;/div&gt;
	&lt;/div&gt;
	
	&lt;div class="pagination"&gt;&lt;/div&gt;
	
	&lt;div class="swiper-button swiper-button-next"&gt;&lt;a href="javascript:;"&gt;&lt;span class="icon-wrap"&gt;&lt;/span&gt;&lt;/a&gt;&lt;/div&gt;
	&lt;div class="swiper-button swiper-button-prev"&gt;&lt;a href="javascript:;"&gt;&lt;span class="icon-wrap"&gt;&lt;/span&gt;&lt;/a&gt;&lt;/div&gt;
&lt;/div&gt;
</pre>

### js
<pre>
window.onload = function() {
  new Swiper('.swiper-container'); 
}
</pre>