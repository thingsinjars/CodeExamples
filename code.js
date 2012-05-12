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
function startSound() {
	var url = sound.url;
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
						soundAndVolume(audioData, 0.1);
						break;
		case "soundAndVolumeAndFilter" :
						soundAndVolumeAndFilter(2, audioData);
						break;
		case "soundAndPosition" :
						soundAndPosition(audioData, {x:10, y:5, z:0});
						break;
		case "soundAndPositionAndListenerPosition" :
						soundAndPositionAndListenerPosition(audioData, {x:10, y: 5, z:0}, {x:20, y: -5, z:0});
						break;
		case "soundAndImpulseResponse" :
						soundAndImpulseResponse(audioData);
						break;
		case "soundAndImpulseResponseTwoChannels" :
						soundAndImpulseResponseTwoChannels(audioData);
						break;
	}
}

function selectValue() {
	return document.querySelector('.current').dataset['example'];
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

// Events for the play/stop bottons
var playButtons = document.querySelectorAll('.play');
for(var i=0;i<playButtons.length;i++) {
	playButtons[i].addEventListener('click', function() {startSound()});	
}
var stopButtons = document.querySelectorAll('.stop');
for(var i=0;i<stopButtons.length;i++) {
	stopButtons[i].addEventListener('click', function() {stopSound()});	
}
