/* Audio Graphs */ 


/* 
 Simplest possible setup:
 Connect the sound source to the context's destination (the speakers)
	 
 Source ------> Destination

*/
function soundOnly(audioData) {
	
    // create a sound source
    sound.soundSource = sound.context.createBufferSource();

	// The Audio Context handles creating source buffers from rawy binary
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

    sound.VolumeNode = sound.context.createGainNode();

    //Set the volume
    sound.VolumeNode.gain.value = volume;

	// Wiring
    sound.soundSource.connect(sound.VolumeNode);
    sound.VolumeNode.connect(sound.context.destination);

    // Finally
    playSound(ourSoundSource);
}


/* 
	 Connect the source to the gain node and the gain to the destination
	 
	 Source ------> Volume ------> Filter ------> Destination
*/
function soundAndVolumeAndFilter(audioData) {
    sound.soundBuffer = sound.context.createBuffer(audioData, true);
    sound.soundSource = createSoundSource(sound.soundBuffer);
    sound.VolumeNode = createVolumeNode();


    sound.LowPassFilter = createLowPassFilterNode();

    sound.soundSource.connect(sound.VolumeNode);
    sound.VolumeNode.connect(sound.LowPassFilter);
    sound.LowPassFilter.connect(sound.context.destination);

    // Finally
    playSound(sound.soundSource);
}

/* 
 Connect the source to the gain node
 and the gain to the destination
	 
 Source ------> Volume ------> Destination
	 
*/
function soundAndPosition(audioData, position) {
    sound.soundBuffer = sound.context.createBuffer(audioData, true);
    sound.soundSource = createSoundSource(sound.soundBuffer);

    sound.Panner = createPanner();

    sound.soundSource.connect(sound.Panner);
    sound.Panner.connect(sound.context.destination);
	
	sound.Panner.setPosition(position.x,position.y,position.z);

    // Finally
    playSound(sound.soundSource);
}

/* 
 Connect the source to the gain node
 and the gain to the destination
	 
 Source ------> Volume ------> Destination
	 
*/
function soundAndPositionAndListenerPosition(audioData, sourcePosition, listenerPosition) {
    sound.soundBuffer = sound.context.createBuffer(audioData, true);
    sound.soundSource = createSoundSource(sound.soundBuffer);
    sound.Panner = createPanner();
    sound.soundSource.connect(ourPanner);
    sound.Panner.connect(sound.context.destination);
	sound.Panner.setPosition(sourcePosition.x,sourcePosition.y,sourcePosition.z);

	sound.context.listener.setPosition(listenerPosition.x,listenerPosition.y,listenerPosition.z);

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
    sound.soundBuffer = sound.context.createBuffer(audioData, true);
    sound.soundSource = createSoundSource(sound.soundBuffer);
	
    sound.Convolver = createConvolver();
	
    sound.soundSource.connect(sound.Convolver);
	
    sound.Convolver.connect(sound.context.destination);

	setReverbImpulseResponse('http://thelab.thingsinjars.com/web-audio-tutorial/ir-chorus.wav', sound.Convolver, function() {playSound(sound.soundSource)});
	// setReverbImpulseResponse('http://thelab.thingsinjars.com/web-audio-tutorial/ir-backwards.wav', ourConvolver, function() {playSound(ourSoundSource);});

}