function init() {
     addSliders();

     var canvas = document.getElementById('canvasID');
     var canvas2 = document.getElementById('canvasElevationID');

     var ctx = canvas.getContext('2d');
     var ctx2 = canvas2.getContext('2d');
     
     gTopProjection = new Projection('canvasID', 0);
     gFrontProjection = new Projection('canvasElevationID', 1);

     // draw center
     var width = canvas.width;
     var height = canvas.height;

     ctx.fillStyle = "rgb(0,200,0)";
     ctx.beginPath();
     ctx.arc(width/2, height/2 , 10, 0,Math.PI*2,true)
     ctx.fill();

     ctx2.fillStyle = "rgb(0,200,0)";
     ctx2.beginPath();
     ctx2.arc(width/2, height/2 , 10, 0,Math.PI*2,true)
     ctx2.fill();

     canvas.addEventListener("mousedown", handleMouseDown, true);
     canvas.addEventListener("mousemove", handleAzimuthMouseMove, true);
     canvas.addEventListener("mouseup", handleMouseUp, true);

     canvas2.addEventListener("mousedown", handleMouseDown, true);
     canvas2.addEventListener("mousemove", handleElevationMouseMove, true);
     canvas2.addEventListener("mouseup", handleMouseUp, true);

     // Initialize audio
     context = new webkitAudioContext();

     source = context.createBufferSource();
     dryGainNode = context.createGain();
     wetGainNode = context.createGain();
     panner = context.createPanner();

     lowFilter = context.createBiquadFilter();
     lowFilter.frequency.value = 22050.0;
     lowFilter.Q.value = 5.0;

     convolver = context.createConvolver();

     // Connect audio processing graph
     source.connect(lowFilter);
     lowFilter.connect(panner);

     // Connect dry mix
     panner.connect(dryGainNode);
     dryGainNode.connect(context.destination);
     
     // Connect wet mix
     panner.connect(convolver);
     convolver.connect(wetGainNode);
     wetGainNode.connect(context.destination);
     wetGainNode.gain.value = kInitialReverbLevel;
     
     bufferList = new Array(fileCount);
     for (var i = 0; i < fileCount; ++i) {
         bufferList[i] = 0;
     }

     setReverbImpulseResponse('impulse-responses/spatialized3.wav');

     source.playbackRate.value = 1.0;

     panner.setPosition(0, 0, -4.0);
     source.loop = true;

     // Load up initial sound
     setAudioSource(0);

     var cn = {x: 0.0, y: -0.5};
     gTopProjection.drawDotNormalized(cn);
     
     cn.y = 0.0;
     gFrontProjection.drawDotNormalized(cn);

     var currentTime = context.currentTime;
     source.start(currentTime + 0.020);
 }