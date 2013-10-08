/*
combined files : 

gallery/imagezoom/1.0/index

*/
/**
 * @ignore
 * ImageZoom.
 * @author yiminghe@gmail.com, qiaohua@taobao.com, qiaofu@taobao.com
 */
KISSY.add('gallery/imagezoom/1.0/index',function (S, Node, Overlay, Base, undefined) {
    var $ = Node.all,
        doc = $(S.Env.host.document),
        IMAGEZOOM_ICON_TMPL = "<span class='{iconClass}'></span>",
        undefinedNode = /**
         @ignore
         @type Node
         */undefined,
        IMAGEZOOM_WRAP_TMPL = "<span class='{wrapClass}'></span>",
        STANDARD = 'standard',
        groupEventForInnerAnim = '.ks-imagezoom-img-mouse',
        INNER = 'inner',
        ABSOLUTE_STYLE = ' style="position:absolute;top:-9999px;left:-9999px;" ',
        BIG_IMG_TPL = '<img src=' + '{src} {style} />';

    function constrain(v, l, r) {
        return Math.min(Math.max(v, l), r);
    }

    var defaultConfig = {
        prefixCls:"ks-",
        hasZoom:true,
        width:"auto",
        height:"auto",
        type:STANDARD   // STANDARD  or INNER
    };

    // 重构关键, 只使用一个放大器
    var Zoomer = null;

    function Zoom(config) {
        // 每一个图片放大有自己的一个overlay,叫zoomer
        this.Zoomer = null;
        // 先从配置中获取config,imageNode的属性必须配置在config中
        this.config = S.merge(defaultConfig,config);
        // 然后从DOM中合并config
        this._getConfigFromDom();
        this._init();
    }

    S.extend(Zoom, Base, {
        /*
         * 内部初始化方法
         */
        _init: function() {
            var self = this;

            if (!self.config["bigImageWidth"] || !self.config["bigImageHeight"]) {
                S.error("bigImageWidth/bigImageHeight in ImageZoom must be set!");
            }
            // 渲染UI
            self._renderUI();
            // 绑定事件
            self._bindEvents();
        },
        /**
         * 从dom上面获取Zoom的配置信息,初始化时要调用
         * @private
         */
        _getConfigFromDom: function() {
            var img,
                domConfig = {},
                self = this;
            img = $(self.config["imageNode"]);

            // 有几个附加配置可以写在dom上面
            if (img.hasAttr('data-has-zoom')) {
                domConfig.hasZoom = img.attr('data-has-zoom');
            }
            if (img.hasAttr('data-bigImageWidth')) {
                domConfig.bigImageWidth = img.attr('data-bigImageWidth');
            }
            if (img.hasAttr('data-bigImageHeight')) {
                domConfig.bigImageHeight = img.attr('data-bigImageHeight');
            }

            if (img.hasAttr('data-ks-imagezoom')) {
                domConfig.bigImageSrc = img.attr('data-ks-imagezoom');
            }

            S.mix(self.config,domConfig);
            // 把配置的json写成Attribute
            self.set(self.config);
        },
        /*
         * 渲染对应的UI
         */
        _renderUI: function() {
            var self = this;
            imageZoomRenderUI(self);
            imageZoomBindUI(self);
        },
        /*
         * 绑定事件
         */
        _bindEvents: function() {
            var self = this;
            // 绑定事件
            self.on('currentMouseChange', function(currentMouse) {
                var lensLeft,
                    lensTop,
                    pageX = currentMouse.pageX,
                    pageY = currentMouse.pageY,
                    lens = self.lens,
                    bigImageOffset;

                // inner 动画中
                if (self.bigImage.isRunning()) {
                    return;
                }

                // 更新 lens 位置
                if (lens) {
                    lensLeft = pageX - self.lensWidth / 2;
                    lensTop = pageY - self.lensHeight / 2;
                    lens.offset({
                        left: self.lensLeft = constrain(lensLeft, self.minLensLeft, self.maxLensLeft),
                        top: self.lensTop = constrain(lensTop, self.minLensTop, self.maxLensTop)
                    });
                }

                // note: 鼠标点对应放大点在中心位置
                bigImageOffset = getBigImageOffsetFromMouse(self, currentMouse);

                self.bigImageCopy.css(bigImageOffset);
                self.bigImage.css(bigImageOffset);
            });



            self.on('afterBigImageWidthChange', function(v) {
                var self = this;
                self.bigImage.width(v.newVal);
                self.bigImageCopy.width(v.newVal);
            });

            self.on('afterBigImageHeightChange', function(v) {
                var self = this;
                self.bigImage.height(v.newVal);
                self.bigImageCopy.height(v.newVal);
            });

            self.on('afterBigImageSrcChange', function(v) {
                self.bigImage.attr('src', v.newVal);
            });
        },
        /**
         * 销毁组件
         */
        destroy: function() {
            var self = this,
                img = self.get('imageNode'),
                imageWrap;

            onZoomerHide.call(self);

            if (imageWrap = self.imageWrap) {
                img.insertBefore(imageWrap, undefinedNode);
                imageWrap.remove();
            }

            img.detach('mouseenter', self.__onImgEnter);
        }
    },{
        ATTRS:{
            /**
             * existing image node needed to be zoomed.
             * @cfg {HTMLElement|String} imageNode
             */
            /**
             * @ignore
             */
            imageNode: {
                setter: function (el) {
                    return Node.one(el);
                }
            },

            /**
             * existing image node's src.
             * @type {String}
             * @property imageSrc
             */
            /**
             * @ignore
             */
            imageSrc: {
                valueFn: function () {
                    return this.get('imageNode').attr('src');
                }
            },

            /**
             * zoomed overlay width
             * Defaults to imageNode's width.
             * @cfg {Number} width
             */
            /**
             * @ignore
             */
            width: {
                valueFn: function () {
                    return this.get("imageNode").width();
                }
            },
            /**
             * zoomed overlay height
             * Defaults to imageNode's height.
             * @cfg {Number} height
             */
            /**
             * @ignore
             */
            height: {
                valueFn: function () {
                    return this.get("imageNode").height();
                }
            },
            /**
             * whether to allow imageNode zoom
             * @cfg {Boolean} hasZoom
             */
            /**
             * whether to allow imageNode zoom
             * @type {Boolean}
             * @property hasZoom
             */
            /**
             * @ignore
             */
            hasZoom: {
                value: true,
                setter: function (v) {
                    return !!v;
                }
            },


            /**
             * type of zooming effect
             * @cfg {KISSY.ImageZoom.ZoomType} type
             */
            /**
             * @ignore
             */
            type: {
                value: STANDARD   // STANDARD  or INNER
            },


            /**
             * big image src.
             * Default to: value of imageNode's **data-ks-imagezoom** attribute value
             * @cfg {string} bigImageSrc
             */
            /**
             * big image src.
             * @type {string}
             * @property bigImageSrc
             */
            /**
             * @ignore
             */
            bigImageSrc: {
                valueFn: function () {
                    return  this.get('imageNode').attr('data-ks-imagezoom');
                }
            },


            /**
             * width of big image
             * @cfg {Number} bigImageWidth
             */
            /**
             * width of big image
             * @type {Number}
             * @property bigImageWidth
             */
            /**
             * @ignore
             */
            bigImageWidth: {},


            /**
             * height of big image
             * @cfg {Number} bigImageHeight
             */
            /**
             * height of big image
             * @type {Number}
             * @property bigImageHeight
             */
            /**
             * @ignore
             */
            bigImageHeight: {},

            /**
             * current mouse position
             * @private
             * @property currentMouse
             */
            /**
             * @ignore
             */
            currentMouse: {}
        }
    },{
        xclass: 'imagezoom-viewer'
    });

    // # -------------------------- private start

    function setZoomerPreShowSession(self) {
        var img = $(self.get('imageNode')),
            imageOffset = img.offset(),
            imageLeft,
            imageWidth,
            imageHeight,
            zoomMultipleH,
            zoomMultipleW,
            lensWidth,
            lensHeight,
            bigImageWidth = self.get('bigImageWidth'),
            bigImageHeight = self.get('bigImageHeight'),
            width = self.get('width'),
            height = self.get('height'),
            align,
            originNode,
            imageTop;

        imageLeft = self.imageLeft = imageOffset.left;

        imageTop = self.imageTop = imageOffset.top;
        imageWidth = self.imageWidth = img.width();
        imageHeight = self.imageHeight = img.height();
        zoomMultipleH = self.zoomMultipleH = bigImageHeight / imageHeight;
        zoomMultipleW = self.zoomMultipleW = bigImageWidth / imageWidth;

        // 考虑放大可视区域，大图，与实际小图
        // 镜片大小和小图的关系相当于放大可视区域与大图的关系
        // 计算镜片宽高, vH / bigImageH = lensH / imageH
        lensWidth = self.lensWidth = width / zoomMultipleW;
        lensHeight = self.lensHeight = height / zoomMultipleH;
        self.minLensLeft = imageLeft;
        self.minLensTop = imageTop;
        self.maxLensTop = imageTop + imageHeight - lensHeight;
        self.maxLensLeft = imageLeft + imageWidth - lensWidth;
        self.maxBigImageLeft = 0;
        self.maxBigImageTop = 0;
        self.minBigImageLeft = -(bigImageWidth - width);
        self.minBigImageTop = -(bigImageHeight - height);

        if (self.get('type') === INNER) {
            // inner 位置强制修改
            self.Zoomer.set('align', {
                node: img,
                points: ['cc', 'cc']
            });
        } else {
            align = self.Zoomer.get("align") || {};
            originNode = align.node;
            delete align.node;
            align = S.clone(align);
            align.node = originNode || img;
            self.Zoomer.set("align", align);
        }
        self.icon.hide();

        doc.on('mousemove mouseleave', onMouseMove, self);
    }

    function onZoomerHide() {
        var self = this,
            lens = self.lens;
        doc.detach('mousemove mouseleave', onMouseMove, self);
        self.icon.show();
        if (lens) {
            lens.hide();
        }
    }

    function imageZoomRenderUI(self) {
        var imageWrap,
            icon,
            image = $(self.get('imageNode'));

        imageWrap = self.imageWrap = $(S.substitute(IMAGEZOOM_WRAP_TMPL, {
            wrapClass: self.get('prefixCls') + 'imagezoom-wrap'
        })).insertBefore(image, undefinedNode);

        imageWrap.prepend(image);
        icon = self.icon = $(S.substitute(IMAGEZOOM_ICON_TMPL, {
            iconClass: self.get('prefixCls') + 'imagezoom-icon'
        }));
        imageWrap.append(icon);

        renderImageLens(self);

    }

    function renderImageLens(self) {
        if (self.get('type') != INNER) {
            self.lens = $('<span ' +
                ABSOLUTE_STYLE +
                ' class="' + self.get('prefixCls') + 'imagezoom-lens' + '"></span>')
                .appendTo(self.imageWrap, undefined);
        }
    }

    function renderImageZoomer(self) {
        var image = $(self.get("imageNode"));

        if (self.get('width') == 'auto') {
            self.set('width', image.width());
        }

        if (self.get('height') == 'auto') {
            self.set('height', image.height());
        }

        var width = self.get('width'),
            height = self.get('height');

        self.Zoomer = new Overlay({
            elCls:"ks-imagezoom-viewer",
            align:self.get('align'),
            width:width,
            height:height
        });

        // 渲染对应的浮层
        self.Zoomer.render();

        // 放大镜的隐藏功能
        self.Zoomer.on('hide', onZoomerHide, self);

        // 渲染对应的大图
        var contentEl = self.Zoomer.get("contentEl");

        self.bigImage = $(S.substitute(BIG_IMG_TPL, {
            src: self.get("bigImageSrc"),
            style: ABSOLUTE_STYLE
        })).appendTo(contentEl, undefined);

        self.bigImageCopy = $(S.substitute(BIG_IMG_TPL, {
            src: image.attr('src'),
            style: ABSOLUTE_STYLE
        })).prependTo(contentEl, undefined);
    }

    function imageZoomBindUI(self) {
        var img = $(self.get('imageNode')),
            currentMouse,
            type = self.get('type'),
            commonFn = (function () {
                var buffer;

                function t() {
                    if (buffer) {
                        return;
                    }
                    buffer = S.later(function () {
                        buffer = 0;
                        detachImg(img);
                        setZoomerPreShowSession(self);
                        self.Zoomer.show();
                        // after create lens
                        self.lens.show()
                            .css({
                                width: self.lensWidth,
                                height: self.lensHeight
                            });
                        self.fire('currentMouseChange',currentMouse);
                    }, 50);
                }

                t.stop = function () {
                    buffer.cancel();
                    buffer = 0;
                };
                return t;
            })(),
        // prevent flash of content for inner anim
            innerFn = S.buffer(function () {
                detachImg(img);
                setZoomerPreShowSession(self);
                self.Zoomer.show();
                animForInner(self, 0.4, currentMouse);
            }, 50),
            fn = type == 'inner' ? innerFn : commonFn;

        img.on('mouseenter', self.__onImgEnter = function (ev) {
            // 在此刻初始化overlay
            if (!self.Zoomer) {
                renderImageZoomer(self);
            }

            if (self.get('hasZoom')) {
                currentMouse = ev;
                img.on('mousemove' + groupEventForInnerAnim,function (ev) {
                    currentMouse = ev;
                    fn();
                }).on('mouseleave' + groupEventForInnerAnim, function () {
                        fn.stop();
                        detachImg(img);
                    });
                fn();
            }
        });

        self.on('afterImageSrcChange', onImageZoomSetImageSrc, self);
        self.on('afterHasZoomChange', onImageZoomSetHasZoom, self);

        onImageZoomSetHasZoom.call(self, {newVal: self.get("hasZoom")});
    }

    function detachImg(img) {
        img.detach('mouseleave' + groupEventForInnerAnim);
        img.detach('mousemove' + groupEventForInnerAnim);
    }

    function onMouseMove(ev){
        var self = this,
            rl = self.imageLeft,
            rt = self.imageTop,
            rw = self.imageWidth,
            pageX = ev.pageX,
            pageY = ev.pageY,
            rh = self.imageHeight;
        if (String(ev.type) == 'mouseleave') {
            self.Zoomer.hide();
            return;
        }
        if (pageX > rl && pageX < rl + rw &&
            pageY > rt && pageY < rt + rh) {
            self.fire("currentMouseChange", {
                pageX: pageX,
                pageY: pageY
            });
        } else {
            self.Zoomer.hide();
        }
    }

    // Inner 效果中的放大动画
    function animForInner(self, seconds, currentMouse) {
        var bigImages = self.bigImage;

        bigImages.add(self.bigImageCopy);

        bigImages.stop();

        // set min width and height
        bigImages.css({
            width: self.imageWidth,
            height: self.imageHeight,
            left: 0,
            top: 0
        });

        bigImages.animate(S.mix({
            width: self.get('bigImageWidth'),
            height: self.get('bigImageHeight')
        }, getBigImageOffsetFromMouse(self, currentMouse)), seconds);
    }

    function onImageZoomSetHasZoom(e) {
        this.icon[e.newVal ? 'show' : 'hide']();
    }

    function onImageZoomSetImageSrc(e) {
        var src = e.newVal,
            self = this,
            bigImageCopy;
        $(self.get('imageNode')).attr('src', src);
        if (bigImageCopy = self.bigImageCopy) {
            bigImageCopy.attr('src', src);
        }
    }

    function getBigImageOffsetFromMouse(self, currentMouse) {
        var width = self.get('width'),
            height = self.get('height');

        return {
            left: constrain(-(currentMouse.pageX - self.imageLeft)
                * self.zoomMultipleW + width / 2, self.minBigImageLeft, self.maxBigImageLeft),
            top: constrain(-(currentMouse.pageY - self.imageTop)
                * self.zoomMultipleH + height / 2, self.minBigImageTop, self.maxBigImageTop)
        };
    }


    // # -------------------------- private end

    /**
     * zoom mode for imagezoom
     * @enum {String} KISSY.ImageZoom.ZoomType
     */
    Zoom.ZoomType = {
        /**
         * zoom overlay is beside imageNode
         */
        STANDARD: 'standard',
        /**
         * zoom overlay covers imageNode
         */
        INNER: 'inner'
    };

    return Zoom;

}, {
    requires: ['node', 'overlay', 'base']
});


/**
 * @ignore
 * NOTES:
 * 2013-10-08 qiaofu@taobao.com
 *  - 重构, 去掉了对Overlay的继承
 *
 * 2012-12-17 yiminghe@gmail.com
 *  - refactor and document
 *  - TODO extend overlay ?? confused
 *
 * 20120504 by yiminghe@gmail.com
 *  - refactor
 *  - fix bug: show 前 hasZoom 设了无效
 *
 * 201101 by qiaohua@taobao.com
 *  - 重构代码, 基于 UIBase
 */
