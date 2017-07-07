## CCSwiper 
常用于移动端网站的内容点击，触摸滑动，可用于焦点图等



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