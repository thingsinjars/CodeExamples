/* Audio Graphs */ 


/* 
 Simplest possible setup:
 Connect the sound source to the context's destination (the speakers)
	 
 Source ------> Destination

*/
function soundOnly(audioData) {
	
    // create a sound source
    sound.soundSource = sound.context.createBufferSource();

	// The Audio Context handles creating source buffers from raw binary
    sound.soundBuffer = sound.context.createBuffer(audioData, true); // true = "mix to Mono"

    // Add the buffered data to our object
    sound.soundSource.buffer = sound.soundBuffer;
	
	// Plug the cable from one thing to the other
    sound.soundSource.connect(sound.context.destination);

    // Finally
    playSound(sound.soundSource);
}

/* 
 Connect the source to the gain node
 and the gain to the destination
	 
 Source ------> Volume ------> Destination
	 
*/
function soundAndVolume(audioData, volume) {
    sound.soundSource = sound.context.createBufferSource();
    sound.soundBuffer = sound.context.createBuffer(audioData, true); // true = "mix to Mono"
    sound.soundSource.buffer = sound.soundBuffer;

    sound.volumeNode = sound.context.createGainNode();

    //Set the volume
    sound.volumeNode.gain.value = volume;

	// Wiring
    sound.soundSource.connect(sound.volumeNode);
    sound.volumeNode.connect(sound.context.destination);

    // Finally
    playSound(sound.soundSource);
}


/* 
	 Connect the source to the gain node and the gain to the destination
	 
	 Source ------> Volume ------> Filter ------> Destination
*/
function soundAndVolumeAndFilter(volume, audioData) {
    sound.soundSource = sound.context.createBufferSource();
    sound.soundBuffer = sound.context.createBuffer(audioData, true);
    sound.soundSource.buffer = sound.soundBuffer;
    sound.volumeNode = sound.context.createGainNode();
    sound.volumeNode.gain.value = volume;

    sound.lowPassFilter = sound.context.createBiquadFilter();

    // Create and specify parameters for the low-pass filter.
    sound.lowPassFilter.type = 0; // Low-pass filter
	
    sound.lowPassFilter.frequency.value = 440; // Set cutoff to 440 HZ
    
	// sound.lowPassFilter.Q.value = 20;
	
	// Wiring
    sound.soundSource.connect(sound.volumeNode);
    sound.volumeNode.connect(sound.lowPassFilter);
    sound.lowPassFilter.connect(sound.context.destination);

    // Finally
    playSound(sound.soundSource);
}

/* 
 Connect the source to the gain node
 and the gain to the destination
	 
 Source ------> Panner ------> Destination
	 
*/
function soundAndPosition(audioData, position) {
    sound.soundSource = sound.context.createBufferSource();
    sound.soundBuffer = sound.context.createBuffer(audioData, true);
    sound.soundSource.buffer = sound.soundBuffer;

    sound.panner = sound.context.createPanner();
	sound.panner.setPosition(position.x,position.y,position.z);

	// Wiring
    sound.soundSource.connect(sound.panner);
    sound.panner.connect(sound.context.destination);
	
    // Finally
    playSound(sound.soundSource);
}

/* 
 Connect the source to the gain node
 and the gain to the destination
	 
 Source ------> Panner ------> [ Listener Panner ------> Destination ]
	 
*/
function soundAndPositionAndListenerPosition(audioData, sourcePosition, listenerPosition) {
    sound.soundSource = sound.context.createBufferSource();
    sound.soundBuffer = sound.context.createBuffer(audioData, true);
    sound.soundSource.buffer = sound.soundBuffer;
    sound.panner = sound.context.createPanner();
	sound.panner.setPosition(sourcePosition.x, sourcePosition.y, sourcePosition.z);
    sound.soundSource.connect(sound.panner);
    sound.panner.connect(sound.context.destination);

	// Each context has a single 'Listener' 
	sound.context.listener.setPosition(listenerPosition.x, listenerPosition.y, listenerPosition.z);

    // Finally
    playSound(sound.soundSource);
}

/*
 Connect the source to a convolver, 
 add an impulse response to the convolver and 
 attach it to the destination
 
 Source ------> Convolver ------> Destination
 
 */
function soundAndImpulseResponse(audioData) {
    sound.soundSource = sound.context.createBufferSource();
    sound.soundBuffer = sound.context.createBuffer(audioData, true);
    sound.soundSource.buffer = sound.soundBuffer;
	
    // Again, the context handles the difficult bits
	sound.convolver = sound.context.createConvolver();
	
    // Wiring
	sound.soundSource.connect(sound.convolver);
    sound.convolver.connect(sound.context.destination);

	// Loading the 'Sound Snapshot' to apply to our audio
	setReverbImpulseResponse('http://thelab.thingsinjars.com/web-audio-tutorial/ir-chorus.wav', sound.convolver, function() {playSound()});
	// setReverbImpulseResponse('http://thelab.thingsinjars.com/web-audio-tutorial/ir-backwards.wav', sound.convolver, function() {playSound();});

}

/*
 Connect the source to a convolver, 
 and to a parallel volume
 attach them both to the destination to demonstrate parallel graphs
 
            |-> Convolver --|
 Source ----|               |---> Destination
            |---> Volume ---|
 
 */
function soundAndImpulseResponseTwoChannels(audioData) {
    sound.soundSource = sound.context.createBufferSource();
    sound.soundBuffer = sound.context.createBuffer(audioData, true);
    sound.soundSource.buffer = sound.soundBuffer;
    sound.volumeNode = sound.context.createGainNode();
    sound.volumeNode.gain.value = 1;
	
    // Again, the context handles the difficult bits
	sound.convolver = sound.context.createConvolver();
	
    // Wiring
	sound.soundSource.connect(sound.convolver);
	sound.convolver.connect(sound.context.destination);

	// More Wiring!
    sound.soundSource.connect(sound.volumeNode);
    sound.volumeNode.connect(sound.context.destination);

	// Loading the 'Sound Snapshot' to apply to our audio
	setReverbImpulseResponse('http://thelab.thingsinjars.com/web-audio-tutorial/ir-backwards.wav', sound.convolver, function() {playSound();});

}

function setReverbImpulseResponse(url, convolver, callback) {
    // As with the main sound source, 
	// the Impulse Response loads asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    request.onload = function () {
        convolver.buffer = sound.context.createBuffer(request.response, false);
		callback();
    }
	request.send();
}