/*global PIXI*/

'use strict';
(function() {
    var width = window.innerWidth*2/3;
    var height = window.innerHeight*2/3;
    var pxRatio = window.devicePixelRatio || 1;
    var renderer = PIXI.autoDetectRenderer(width*pxRatio, height*pxRatio);
    var stage = new PIXI.Stage(0xeeeeee, true);

    var animate = function() {
        renderer.render(stage);
        requestAnimationFrame(animate);
    };

    document.body.appendChild(renderer.view);
    animate();

})();
