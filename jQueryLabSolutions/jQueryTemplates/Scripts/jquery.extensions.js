(function ($) {
    $.fn.convertNullToEmptyString = function () {
        if (this.val() == null || this.val() == "null") this.val("");
    };

    $.fn.clearForm = function () {
        return this.each(function () {
            var type = this.type, tag = this.tagName.toLowerCase();
            if (tag == 'form')
                return $(':input', this).clearForm();
            if (type == 'text' || type == 'password' || tag == 'textarea')
                this.value = '';
            else if (type == 'checkbox' || type == 'radio')
                this.checked = false;
            else if (tag == 'select')
                this.selectedIndex = 0;
        });
    };

    $.fn.parseTemplate = function (data) {
        var str = (this).html();
        var _tmplCache = {}
        var err = "";
        try {
            var func = _tmplCache[str];
            if (!func) {
                var strFunc =
                "var p=[],print=function(){p.push.apply(p,arguments);};" +
                    "with(obj){p.push('" +
                        str.replace(/[\r\t\n]/g, " ")
                            .replace(/'(?=[^#]*#>)/g, "\t")
                            .split("'").join("\\'")
                            .split("\t").join("'")
                            .replace(/<#=(.+?)#>/g, "',$1,'")
                            .split("<#").join("');")
                            .split("#>").join("p.push('")
                                + "');}return p.join('');";

                //alert(strFunc);
                func = new Function("obj", strFunc);
                _tmplCache[str] = func;
            }
            return func(data);
        } catch (e) { err = e.message; }
        return "< # ERROR: " + err.toString() + " # >";
    };


    $.fn.callJsonService = function (url, data, callback) {
        $.ajax({
            url: url,
            cache: false,
            dataType: "json",
            data: data,
            success: callback
        });
    };

    $.fn.postDataToService = function(url, data, callback, failureCallback) {
        $.ajax({
                type: 'POST',
                url: url,
                cache: false,
                dataType: "json",
                data: data,
                success: callback,
                error: failureCallback
            });
    };

})(jQuery);