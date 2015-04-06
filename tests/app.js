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

    var graphic = new PIXI.Graphics();
    var size = 64;
    graphic.position = {x: 100, y: 100};
    graphic.anchor = {x: 0.5, y: 0.5};
    graphic.width = size;
    graphic.height = size;
    graphic.beginFill(0xff0000, 1);
    graphic.drawRect(0, 0, size, size);
    graphic.endFill();
    stage.addChild(graphic);


    var loggerEl = document.createElement('pre');
    document.body.appendChild(loggerEl);

    renderer.view.addEventListener('click', function() {
        var x = size/2 + (width-size)*Math.random();
        var y = size/2 + (height-size)*Math.random();
        graphic.animate({
            position: {x: x, y: y},
            alpha: Math.random(),
            rotation: Math.random()*Math.PI*8
        }, 1000, 'easeInOutCubic', function() {
            var out = {
                position: graphic.position,
                alpha: graphic.alpha,
                rotation: graphic.rotation
            };
            loggerEl.innerHTML = JSON.stringify(out, null, 2);
        });
    });

})();
