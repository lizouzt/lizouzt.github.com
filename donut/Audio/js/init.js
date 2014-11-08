// Keep track of all loaded buffers.
var BUFFERS = {};

// An object to track the buffers to load {name: path}
var BUFFERS_TO_LOAD = {
    // blueyellow: 'sounds/blueyellow.wav',
    // jam: 'sounds/br-jam-loop.wav',
    // hihat: 'sounds/hihat.wav',
    // crowd: 'sounds/clapping-crowd.wav',
    // kick: 'sounds/kick.wav',
    // moon: 'sounds/moon.mp3',
    // organ: 'sounds/organ-echo-chords.wav',
    techno: 'sounds/techno.mp3',
    // snare: 'sounds/snare.wav',
    // song: 'sounds/song.mp3',
    // atmos: "sounds/atmos.mp3"
};

// Loads all sound samples into the buffers object.
function loadBuffers(context, callback) {
    // Array-ify
    if(BUFFERS['snare']){
        !!callback && callback();
        return true;
    }
    var names = [];
    var paths = [];
    for (var name in BUFFERS_TO_LOAD) {
        var path = BUFFERS_TO_LOAD[name];
        names.push(name);
        paths.push(path);
    }
    bufferLoader = new BufferLoader(context, paths, function(bufferList) {
        for (var i = 0; i < bufferList.length; i++) {
            var buffer = bufferList[i];
            var name = names[i];
            BUFFERS[name] = buffer;
        }
        !!callback && callback();
        return true;
    });
    bufferLoader.load();
}
