/*global PIXI*/

'use strict';
(function() {

    /**
     * http://gizma.com/easing/
     * t: current time
     * b: start value
     * c: change in value
     * d: duration
     */
    var _easing = {
        linear: function(t, b, c, d) { return c*t/d + b; },
        easeInQuad: function (t, b, c, d) { t /= d; return c*t*t + b; },
        easeOutQuad: function (t, b, c, d) { t /= d; return -c * t*(t-2) + b; },
        easeInOutQuad: function (t, b, c, d) {
            t /= d/2;
            if (t < 1) {
                return c/2*t*t + b;
            }
            t--;
            return -c/2 * (t*(t-2) - 1) + b;
        },
        easeInCubic: function (t, b, c, d) { t /= d; return c*t*t*t + b; },
        easeOutCubic: function (t, b, c, d) { t /= d; t--; return c*(t*t*t + 1) + b; },
        easeInOutCubic: function (t, b, c, d) {
            t /= d/2;
            if (t < 1) {
                return c/2*t*t*t + b;
            }
            t -= 2;
            return c/2*(t*t*t + 2) + b;
        },
        easeInQuart: function (t, b, c, d) { t /= d; return c*t*t*t*t + b; },
        easeOutQuart: function (t, b, c, d) { t /= d; t--; return -c * (t*t*t*t - 1) + b; },
        easeInOutQuart: function (t, b, c, d) {
            t /= d/2;
            if (t < 1) {
                return c/2*t*t*t*t + b;
            }
            t -= 2;
            return -c/2 * (t*t*t*t - 2) + b;
        }
    };


    /**
     * object iterator
     */
    var _forEachProperty = function(object, iterrator, ctx) {
        if(typeof iterrator !== 'function') {
            return;
        }
        for(var key in object) {
            if(object.hasOwnProperty(key)) {
                iterrator.call(ctx, object[key], key);
            }
        }
    };


    /**
     * @param {object} element
     * @param {string} key
     * @param {number|object} endValue
     */
    function TweenableProps(parent, key, endValue, startValue) {
        if(typeof startValue === 'undefined') {
            startValue = parent;
        }
        this.parent          = parent;
        this.key             = key;
        this.endValue        = endValue;
        this.startValue      = startValue;
        this.props           = null;
        this._tweenableProps = null;

        if(typeof endValue === 'object') {
            this.props = endValue;
            this._createChildrenTweenableObjects();
        }
    }

    /**
     * creates tweenable instances out of each property
     */
    TweenableProps.prototype._createChildrenTweenableObjects = function() {
        this._tweenableProps = {};
        if(typeof this.props !== 'object') {
            return;
        }
        _forEachProperty(this.props, function(value, key) {
            this._tweenableProps[key] = new TweenableProps(this.props, key, value, this.startValue[key]);
        }, this);
    };

    /**
     * compute tween
     * @param {number} time
     * @param {duration} number
     * @param {string='linear'} easing
     */
    TweenableProps.prototype.compute = function(time, duration, easing) {
        if(typeof this.endValue === 'number') {
            var start = this.startValue, change = this.endValue - start;
            var val = _easing[easing || 'linear'](time, start, change, duration);
            return val;
        } else if(typeof this.props === 'object') {
            var props = {};
            _forEachProperty(this._tweenableProps, function(tweenableProp, key) {
                props[key] = tweenableProp.compute(time, duration, easing);
            });
            return props;
        }
    };


    /**
     * kicks off animation
     */
    function Animation(elem, properties, duration, easing, callback) {
        var startTime = Date.now();
        easing = easing || 'linear';

        var rootAnimatableProperty = new TweenableProps(elem, 'root', properties);

        var animate = function() {
            var now = Date.now(), time = Math.min(Date.now() - startTime, duration);
            var props = rootAnimatableProperty.compute(time, duration, easing);
            _forEachProperty(props, function(value, key) { elem[key] = value; });

            if(time < duration) {
                requestAnimationFrame(animate);
            } else if(typeof callback === 'function'){
                callback();
            }
        };
        animate();
    }

    PIXI.DisplayObjectContainer.prototype.animate = function(prop, time, easing, callback) {

        if(typeof easing === 'function') {
            callback = easing;
            easing = undefined;
        }
        Animation(this, prop, time, easing, callback);

        return this;
    };
})();
