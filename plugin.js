/**
 * Created by Administrator on 2016/3/20.
 */
$.fn.plugin=function(){
    this.each(function(){
        var obj=$(this);
        obj.click(function(){
            obj.css({
                'width':300,
               'height':300,
                'margin-left':100
            });
        });
    });
};