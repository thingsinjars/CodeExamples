// Step 1 - Initialise the Audio Context
// There can be only one!
function init() {
    if (typeof AudioContext == "function") {
        sound.context = new AudioContext();
    } else if (typeof webkitAudioContext == "function") {
        sound.context = new webkitAudioContext();
    } else {
        throw new Error('AudioContext not supported. :(');
    }
}

// Step 2: Prepare to load our Sound
function loadOurSound(url) {
	// Note: this loads asynchronously
    var request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.responseType = "arraybuffer";

    // Our asynchronous callback
    request.onload = function() {
		var audioData = request.response;

		chooseGraph(audioData);

    };
	
    request.send();
}

function chooseGraph(audioData) {
	switch(selectValue()) {
		// Each of these is a different Audio Graph
		case "soundOnly" :
						soundOnly(audioData);
						break;
		case "soundAndVolume" :
						soundAndVolume(audioData, 1);
						break;
		case "soundAndVolumeAndFilter" :
						soundAndVolumeAndFilter(audioData);
						break;
		case "soundAndPosition" :
						soundAndPosition(audioData, {x:0, y: 0, z:0});
						break;
		case "soundAndPositionAndListenerPosition" :
						soundAndPositionAndListenerPosition(audioData, {x:0, y: 0, z:0}, {x:0, y: 0, z:0});
						break;
		case "soundAndImpulseResponse" :
						soundAndImpulseResponse(audioData);
						break;
	}
}

function selectValue() {
	return document.querySelectorAll('option')[document.querySelector('#steps').selectedIndex].value;
}

// Finally: tell the source when to start
function playSound() {
    // play the source now
    sound.soundSource.noteOn(sound.context.currentTime);
}

function stopSound() {
    // stop the source now
    sound.soundSource.noteOff(sound.context.currentTime);
}
