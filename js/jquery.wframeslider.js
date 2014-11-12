/*
 *  jQuery WFrameSlider - v0.1.0
 *  A slider to frames without transitions
 *  
 *
 *  Made by Webbers
 *  Under MIT License
 */

;(function ($, window, document, undefined) {

    var pluginName = "wframeslider",
        defaults = {
            'shift': 300,
            'interval': 5000
        };
    var self;
    //var elements = [];

    function Plugin(element, options) {
        if (typeof options === "string") {
            this.methods[options](this, element, options);
            return;
        }

        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init(element);
    }

    Plugin.prototype = {
        init: function (element) {
            self = this;
            var $target = $(element);
            var $items = $target.find('.wframeslider-items').children();
            var data = {
                options: self.options,
                index: 0,
                timer: null,
                stopped: false
            };
            $target.data('wframeslider-data', data);

            //elements[$(element).attr('id')] = data;
            self._startSlider($target, $items);
            self._listenerButtons($target, $items);
        },
        _startSlider: function ($target, $items) {
            var targetData = $target.data('wframeslider-data');
            targetData.timer = setInterval(function () {
                var $actualItem = $($items[targetData.index]);
                $actualItem.css({ visibility: 'hidden' });

                var orderActual = $actualItem.attr('slider-order');
                var $actualButton = $target.find('.wframeslider-button[slider-order="' + orderActual + '"]');
                $actualButton.removeClass('wframeslider-button-active');

                targetData.index++;
                if (targetData.index >= $items.length) {
                    targetData.index = 0;
                }

                var $nextItem = $($items[targetData.index]);
                $nextItem.parent().css({ top: -(targetData.index * targetData.options.shift) + 'px' });
                $nextItem.css({ visibility: 'visible' });
                var orderNext = $nextItem.attr('slider-order');
                var $nextButton = $target.find('.wframeslider-button[slider-order="' + orderNext + '"]');
                $nextButton.addClass('wframeslider-button-active');
            }, targetData.options.interval);
        },
        _listenerButtons: function ($target, $items) {
            var targetData = $target.data('wframeslider-data');
            $target.find('.wframeslider-button').live('click', function () {
                clearInterval(targetData.timer);
                $target.find('.wframeslider-buttons').children().removeClass('wframeslider-button-active');

                var $actualButton = $(this);
                $actualButton.addClass('wframeslider-button-active');
                var order = $actualButton.attr('slider-order');
                targetData.index = order;

                var $sliderItems = $target.find('.wframeslider-items');
                $sliderItems.css({ top: -(order * targetData.options.shift) + 'px' });
                $sliderItems.children().css({ visibility: 'hidden' });
                $sliderItems.find('[slider-order="' + order + '"]').css({ visibility: 'visible' });

                if (!targetData.stopped) {
                    self._startSlider($target, $items);
                }
            });
        },
        methods: {
            stopSlider: function (t, element) {
                var elementData = $(element).data('wframeslider-data');
                clearInterval(elementData.timer);
                elementData.stopped = true;
            },
            startSlider: function (t, element) {
                self._startSlider($(element), $(element).find('.wframeslider-items').children());
                $(element).data('wframeslider-data').stopped = false;
            }
        }
    };

    $.fn[pluginName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName) && (typeof options !== "string")) {
                $.data(this, "plugin_" + pluginName, new Plugin(this, options));
            } else if ($.data(this, "plugin_" + pluginName) && typeof options === "string") {
                new Plugin(this, options);
            }
        });
    };

})(jQuery, window, document);