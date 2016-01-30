(function ($) {
    $.fn.minMaxHighlighter = function (opt) {
        var prefix = '_minMaxHighlighter';
        
        //default values for plugin
        var def = {
            min: 1,
            max: 10,
            minMsg: 'Value must be greater than 0',
            maxMsg: 'Value must be less than 11'
        };
        $.extend(def, opt); //apply any custom options to defaults

        function highlight(ctl, msg) {
            ctl.css('border', '2px solid red')
                .parent()
                .append('<span id="' + ctl.attr('id') + prefix + '" style="color:red;">' + msg + '</span>');
        }

        //selector may return multiple objects 
        //in set so loop through them and return for chaining
        return this.each(function () {

            //capture keyup event
            $(this).keyup(function () {
                var ctl = $(this);
                $('#' + ctl.attr('id') + prefix).remove(); //remove any error span if exists
                ctl.css('border', ''); //clear border
                
                //grab value of control
                var val = ctl.val();
                if (parseInt(val) < def.min) {
                    highlight(ctl, def.minMsg);
                }
                if (parseInt(val) > def.max) {
                    highlight(ctl, def.maxMsg);
                }
            }); //keyup

        }); //each
    };
})(jQuery);
