## 综述

imagezoom是对之前KISSY1.3中的imagezoom进行了重构，去掉了对Overlay的继承，使用Overlay实例来管理放大镜

## 快速使用

### 初始化组件

    S.use('gallery/imagezoom/1.0/index', function (S, Imagezoom) {
         var imagezoom = new Imagezoom(Configs);//Configs为配置
    })

## API说明

### Class

ImageZoom (config)

参数: config (Object) – 配置项, 详细见下方 Configs .

### Configs

**imageNode**

  {String|HTMLElement} - 必填！小图元素选择器或小图元素.

**bigImageWidth**

  {Number} - 必填！ 大图宽度

**bigImageHeight**

  {Number} - 必填！ 大图高度

**type**

  {String} - 可选, 缩放显示类型, 默认是标准模式 ‘standard’, 或者内嵌模式 ‘inner’.

**bigImageSrc**

  {String} - 可选, 大图路径, 为 ‘’ 时, 取触点上的 data-ks-imagezoom 属性值. 默认为 ‘’.

**hasZoom**

  {Boolean} - 可选, 初始时是否显示放大效果. 默认为 true, 显示放大. 在多图切换时, 可重设该值来开启或关闭显示放大功能. 如果多个图都不需要放大显示, ImageZoom 不会生成任何东西.

**width**

  {Number|String} - 可选, 放大区域宽度. 默认为 ‘auto’, 当取 ‘auto’ 时, 宽度取小图的宽度.

**height**

  {Number|String} - 可选, 放大区域高度. 默认为 ‘auto’, 当取 ‘auto’ 时, 高度取小图的高度.

### Attributes Detail（组件属性）

**bigImageHeight**

  {Number} - 修改此属性改变大图大小

**bigImageWidth**

  {Number} - 修改此属性改变大图大小

**hasZoom**

  {Boolean} - 修改此属性禁用或启用放大功能

**bigImageSrc**

  {String} - 修改此属性改变大图地址

**imageSrc**

  {String} - 修改此属性改变小图地址
