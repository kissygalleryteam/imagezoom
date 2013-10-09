/*! imagezoom - v1.0 - 2013-10-09 11:39:24 AM
* Copyright (c) 2013 乔福; Licensed  */
KISSY.add("gallery/imagezoom/1.0/index",function(a,b,c,d,e){function f(a,b,c){return Math.min(Math.max(a,b),c)}function g(b){this.Zoomer=null,this.config=a.merge(D,b),this._getConfigFromDom(),this._init()}function h(b){var c,d,e,f,g,h,i,j,k,l,m=t(b.get("imageNode")),n=m.offset(),p=b.get("bigImageWidth"),q=b.get("bigImageHeight"),r=b.get("width"),s=b.get("height");c=b.imageLeft=n.left,l=b.imageTop=n.top,d=b.imageWidth=m.width(),e=b.imageHeight=m.height(),f=b.zoomMultipleH=q/e,g=b.zoomMultipleW=p/d,h=b.lensWidth=r/g,i=b.lensHeight=s/f,b.minLensLeft=c,b.minLensTop=l,b.maxLensTop=l+e-i,b.maxLensLeft=c+d-h,b.maxBigImageLeft=0,b.maxBigImageTop=0,b.minBigImageLeft=-(p-r),b.minBigImageTop=-(q-s),b.get("type")===A?b.Zoomer.set("align",{node:m,points:["cc","cc"]}):(j=b.Zoomer.get("align")||{},k=j.node,delete j.node,j=a.clone(j),j.node=k||m,b.Zoomer.set("align",j)),b.icon.hide(),u.on("mousemove mouseleave",o,b)}function i(){var a=this,b=a.lens;u.detach("mousemove mouseleave",o,a),a.icon.show(),b&&b.hide()}function j(b){var c,d,e=t(b.get("imageNode"));c=b.imageWrap=t(a.substitute(x,{wrapClass:b.get("prefixCls")+"imagezoom-wrap"})).insertBefore(e,w),c.prepend(e),d=b.icon=t(a.substitute(v,{iconClass:b.get("prefixCls")+"imagezoom-icon"})),c.append(d),k(b)}function k(a){a.get("type")!=A&&(a.lens=t("<span "+B+' class="'+a.get("prefixCls")+"imagezoom-lens"+'"></span>').appendTo(a.imageWrap,e))}function l(b){var d=t(b.get("imageNode"));"auto"==b.get("width")&&b.set("width",d.width()),"auto"==b.get("height")&&b.set("height",d.height());var f=b.get("width"),g=b.get("height");b.Zoomer=new c({elCls:"ks-imagezoom-viewer",align:b.get("align"),width:f,height:g}),b.Zoomer.render(),b.Zoomer.on("hide",i,b);var h=b.Zoomer.get("contentEl");b.bigImage=t(a.substitute(C,{src:b.get("bigImageSrc"),style:B})).appendTo(h,e),b.bigImageCopy=t(a.substitute(C,{src:d.attr("src"),style:B})).prependTo(h,e)}function m(b){var c,d=t(b.get("imageNode")),e=b.get("type"),f=function(){function e(){f||(f=a.later(function(){f=0,n(d),h(b),b.Zoomer.show(),b.lens.show().css({width:b.lensWidth,height:b.lensHeight}),b.fire("currentMouseChange",c)},50))}var f;return e.stop=function(){f.cancel(),f=0},e}(),g=a.buffer(function(){n(d),h(b),b.Zoomer.show(),p(b,.4,c)},50),i="inner"==e?g:f;d.on("mouseenter",b.__onImgEnter=function(a){b.Zoomer||l(b),b.get("hasZoom")&&(c=a,d.on("mousemove"+z,function(a){c=a,i()}).on("mouseleave"+z,function(){i.stop(),n(d)}),i())}),b.on("afterImageSrcChange",r,b),b.on("afterHasZoomChange",q,b),q.call(b,{newVal:b.get("hasZoom")})}function n(a){a.detach("mouseleave"+z),a.detach("mousemove"+z)}function o(a){var b=this,c=b.imageLeft,d=b.imageTop,e=b.imageWidth,f=a.pageX,g=a.pageY,h=b.imageHeight;return"mouseleave"==String(a.type)?(b.Zoomer.hide(),void 0):(f>c&&c+e>f&&g>d&&d+h>g?b.fire("currentMouseChange",{pageX:f,pageY:g}):b.Zoomer.hide(),void 0)}function p(b,c,d){var e=b.bigImage;e.add(b.bigImageCopy),e.stop(),e.css({width:b.imageWidth,height:b.imageHeight,left:0,top:0}),e.animate(a.mix({width:b.get("bigImageWidth"),height:b.get("bigImageHeight")},s(b,d)),c)}function q(a){this.icon[a.newVal?"show":"hide"]()}function r(a){var b,c=a.newVal,d=this;t(d.get("imageNode")).attr("src",c),(b=d.bigImageCopy)&&b.attr("src",c)}function s(a,b){var c=a.get("width"),d=a.get("height");return{left:f(-(b.pageX-a.imageLeft)*a.zoomMultipleW+c/2,a.minBigImageLeft,a.maxBigImageLeft),top:f(-(b.pageY-a.imageTop)*a.zoomMultipleH+d/2,a.minBigImageTop,a.maxBigImageTop)}}var t=b.all,u=t(a.Env.host.document),v="<span class='{iconClass}'></span>",w=e,x="<span class='{wrapClass}'></span>",y="standard",z=".ks-imagezoom-img-mouse",A="inner",B=' style="position:absolute;top:-9999px;left:-9999px;" ',C="<img src={src} {style} />",D={prefixCls:"ks-",hasZoom:!0,width:"auto",height:"auto",type:y};return a.extend(g,d,{_init:function(){var b=this;b.config.bigImageWidth&&b.config.bigImageHeight||a.error("bigImageWidth/bigImageHeight in ImageZoom must be set!"),b._renderUI(),b._bindEvents()},_getConfigFromDom:function(){var b,c={},d=this;b=t(d.config.imageNode),b.hasAttr("data-has-zoom")&&(c.hasZoom=b.attr("data-has-zoom")),b.hasAttr("data-bigImageWidth")&&(c.bigImageWidth=b.attr("data-bigImageWidth")),b.hasAttr("data-bigImageHeight")&&(c.bigImageHeight=b.attr("data-bigImageHeight")),b.hasAttr("data-ks-imagezoom")&&(c.bigImageSrc=b.attr("data-ks-imagezoom")),a.mix(d.config,c),d.set(d.config)},_renderUI:function(){var a=this;j(a),m(a)},_bindEvents:function(){var a=this;a.on("currentMouseChange",function(b){var c,d,e,g=b.pageX,h=b.pageY,i=a.lens;a.bigImage.isRunning()||(i&&(c=g-a.lensWidth/2,d=h-a.lensHeight/2,i.offset({left:a.lensLeft=f(c,a.minLensLeft,a.maxLensLeft),top:a.lensTop=f(d,a.minLensTop,a.maxLensTop)})),e=s(a,b),a.bigImageCopy.css(e),a.bigImage.css(e))}),a.on("afterBigImageWidthChange",function(a){var b=this;b.bigImage.width(a.newVal),b.bigImageCopy.width(a.newVal)}),a.on("afterBigImageHeightChange",function(a){var b=this;b.bigImage.height(a.newVal),b.bigImageCopy.height(a.newVal)}),a.on("afterBigImageSrcChange",function(b){a.bigImage.attr("src",b.newVal)})},destroy:function(){var a,b=this,c=b.get("imageNode");i.call(b),(a=b.imageWrap)&&(c.insertBefore(a,w),a.remove()),c.detach("mouseenter",b.__onImgEnter)}},{ATTRS:{imageNode:{setter:function(a){return b.one(a)}},imageSrc:{valueFn:function(){return this.get("imageNode").attr("src")}},width:{valueFn:function(){return this.get("imageNode").width()}},height:{valueFn:function(){return this.get("imageNode").height()}},hasZoom:{value:!0,setter:function(a){return!!a}},type:{value:y},bigImageSrc:{valueFn:function(){return this.get("imageNode").attr("data-ks-imagezoom")}},bigImageWidth:{},bigImageHeight:{},currentMouse:{}}},{xclass:"imagezoom-viewer"}),g.ZoomType={STANDARD:"standard",INNER:"inner"},g},{requires:["node","overlay","base"]});