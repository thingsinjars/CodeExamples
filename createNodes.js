// Step 3: Attach the given buffer to a source
function createSoundSource(buffer) {


    return source;
}

// Step 4: 
function createVolumeNode(volume) {

    var gainNode = context.createGainNode();

    //Set the volume
    gainNode.gain.value = volume;

    return gainNode;
}

// Step 5: 
function createLowPassFilterNode() {

    var filter = context.createBiquadFilter();

    // Create and specify parameters for the low-pass filter.
    filter.type = 0; // Low-pass filter. See BiquadFilterNode docs
    filter.frequency.value = 440; // Set cutoff to 440 HZ
    // filter.Q.value = 20;
    return filter;
}

// Step 6: 
function createPanner() {

    var panner = context.createPanner();
	
	panner.setPosition(0,0,0);

    return panner;
}

// Step 7: 
function createConvolver() {

    var convolver = context.createConvolver();
	
    return convolver;
}

function setReverbImpulseResponse(url, convolver, callback) {
    // Load impulse response asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = function () {
        convolver.buffer = context.createBuffer(request.response, false);
		callback();
    }
	request.send();
};

