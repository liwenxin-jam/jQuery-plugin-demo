;(function($){
	//默认参数
    var defaults = {color: 'blue', size: '30px'};

	//扩展jQuery对象本身，实质是浅复制或深复制
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

	//扩展jQuery实例对象，也就是原型prototype，它有两种方式，建议
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