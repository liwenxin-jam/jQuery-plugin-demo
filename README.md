如今做web开发，jquery几乎是必不可少的，同时jquery插件也是不断的被大家所熟知，以及运用。写插件的方式有两种，下边我会举栗子说明。

- dom结构，后面的例子都以这个结构做演示。
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Document</title>
    <script src="jquery-3.1.1.js"></script>
    <script src="index.js"></script>
</head>
<body>
    <p class="formatFont">Hello World!</p>
    <p class="changeFont1">Weclome to Javascript!</p>
    <p class="changeFont2">Weclome to Javascript!</p>
    <p class="changeFont3">Weclome to Javascript!</p>
</body>
</html>
```

- 方式一，扩展jQuery对象本身，相当于添加一个静态方法，实质是浅复制
```js
;(function($){
    //默认参数
    var defaults = {color: 'blue', size: '30px'};

    //重载版本：jQuery.extend([deep], target, object1, [objectN])
    //注意参数不同，调用方式区别，建议jQuery.fn.extend绑定
    //调用方式:$.color($(".formatFont"), {color: 'red', size: '16px'});
    $.extend({
        "color": function (targetArr, options) {
            if (!isValid(options)){
                return this;
            }
            options = $.extend({}, defaults, options);
            //return jQuery对象，让我们的插件也支持链式调用
            return targetArr.each(function(){ //这里的this就是jQuery对象，它是一个数组
                //获取当前dom 的 jQuery对象，这里的this是当前循环的dom
                $(this).css({'color': options.color, 'font-size': options.size});
            })
        },
        "color2": function (targetArr, options) {
            if (!isValid(options)){
                return this;
            }
            options = $.extend({}, defaults, options);
            //return jQuery对象，让我们的插件也支持链式调用
            return targetArr.each(function(){ //这里的this就是jQuery对象，它是一个数组
                //获取当前dom 的 jQuery对象，这里的this是当前循环的dom
                $(this).css({'color': options.color, 'font-size': options.size});
            })
        }
    }); 

    //私有方法，检测参数是否合法
    function isValid(options) {
        return !options || (options && typeof options === "object") ? true : false;
    }
})(jQuery);
```

- 调用测试
```js
//第一种插件写法调用
$.color($(".formatFont1"), {color: 'red', size: '16px'});
$.color($(".changeFont2"), {color: 'pink', size: '24px'});
//对于链式操作不太友好
$.color($.color($(".changeFont3"), {color: 'pink', size: '24px'}), {color: 'red', size: '16px'});
```

- 方式二，扩展jQuery实例对象，添加实例方法。也就是原型prototype，jQuery给prototype定义一个别名叫fn。在$.fn上拓展有两种方式，看你个人业务需求和习惯。
```js
;(function($){
    //默认参数
    var defaults = {color: 'blue', size: '30px'}; 

    //调用方式:$(".formatFont").color();  
    //方式一，一次只能写一种方法
    $.fn.color = function(options){
        if (!isValid(options)){
            return this;
        }
        options = $.extend({}, defaults, options);
        //return jQuery对象，让我们的插件也支持链式调用
        return this.each(function(){  //这里的this就是jQuery对象，它是一个数组
            //获取当前dom 的 jQuery对象，这里的this是当前循环的dom
            $(this).css({'color': options.color, 'font-size': options.size});
        })
            
    }
    $.fn.color2 = function(options){
        if (!isValid(options)){
            return this;
        }
        options = $.extend({}, defaults, options);
        //return jQuery对象，让我们的插件也支持链式调用
        return this.each(function(){ //这里的this就是jQuery对象，它是一个数组
            //获取当前dom 的 jQuery对象，这里的this是当前循环的dom
            $(this).css({'color': options.color, 'font-size': options.size});
        })
    }

    // 方式二，可以写多种方法在一起
    $.fn.extend({
        color: function(options){
            if (!isValid(options)){
                return this;
            }
            options = $.extend({}, defaults, options);
            //return jQuery对象，让我们的插件也支持链式调用
            return this.each(function(){ //这里的this就是jQuery对象，它是一个数组
                //获取当前dom 的 jQuery对象，这里的this是当前循环的dom
                $(this).css({'color': options.color, 'font-size': options.size});
                //格式化加粗文本
                var markup = $(this).html();
                markup = $.fn.color.format(markup);
                $(this).html(markup);
            })
        },
        color2: function(options){
            if (!isValid(options)){
                return this;
            }
            options = $.extend({}, defaults, options);
            //return jQuery对象，让我们的插件也支持链式调用
            return this.each(function(){ //这里的this就是jQuery对象，它是一个数组
                //获取当前dom 的 jQuery对象，这里的this是当前循环的dom
                $(this).css({'color': options.color, 'font-size': options.size});
            })
        }
    });

    // 公共的格式化 方法. 默认是加粗，用户可以通过覆盖该方法达到不同的格式化效果。
    // 个人感觉意义不太大，如果又需要默认又需要自定义，这个就变成鸡肋
    $.fn.color.format = function (str) {
        return "<strong>" + str + "</strong>";
    }

    $.fn.color2.format = function (str) {
        return "<em>" + str + "</em>";
    }

    //私有方法，检测参数是否合法
    function isValid(options) {
        return !options || (options && typeof options === "object") ? true : false;
    }
})(jQuery);
```

- 调用测试
```js
//第二种插件写法调用
$(".formatFont").color();  //$(".formatFont").color({}); 也可以
$(".changeFont1").color({color: 'red', size: '16px'});
$(".changeFont2").color2({color: 'pink', size: '24px'});
//调用者覆盖插件暴露的共公方法
$.fn.color.format = function (txt) {
    return "<em>" + txt + "</em>"
}
$(".changeFont3").color2({color: 'pink', size: '24px'}).color({color: 'red', size: '16px'});

$("*").color({color: 'red', size: '16px'});  //通配符循环
```

综上所述个人建议使用方式去拓展jQuery插件，要使用上会方便比较好。如果需要上面栗子源码可以从本人github[jQuery-plugin-demo](https://github.com/liwenxin-jam/jQuery-plugin-demo "jQuery-plugin-demo")上下载。

- 最后附上jQuery源码extend，目的是实现浅复制或深复制。
```js
jQuery.extend = jQuery.fn.extend = function() {
    var options, name, src, copy, copyIsArray, clone,
        target = arguments[ 0 ] || {},
        i = 1,
        length = arguments.length,
        deep = false;
    if ( typeof target === "boolean" ) {
        deep = target;
        target = arguments[ i ] || {};
        i++;
    }
    if ( typeof target !== "object" && !jQuery.isFunction( target ) ) {
        target = {};
    }
    if ( i === length ) {
        target = this;
        i--;
    }
    for ( ; i < length; i++ ) {
        if ( ( options = arguments[ i ] ) != null ) {
            for ( name in options ) {
                src = target[ name ];
                copy = options[ name ];
                if ( target === copy ) {
                    continue;
                }
                if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
                    ( copyIsArray = jQuery.isArray( copy ) ) ) ) {
                    if ( copyIsArray ) {
                        copyIsArray = false;
                        clone = src && jQuery.isArray( src ) ? src : [];
                    } else {
                        clone = src && jQuery.isPlainObject( src ) ? src : {};
                    }
                    target[ name ] = jQuery.extend( deep, clone, copy );
                } else if ( copy !== undefined ) {
                    target[ name ] = copy;
                }
            }
        }
    }
    return target;
};
```

- 参考文献
1、[jQuery插件的写法以及使用](http://blog.csdn.net/qq_18661257/article/details/50434475")
2、[什么？你还不会写JQuery 插件](https://www.cnblogs.com/joey0210/p/3408349.html)