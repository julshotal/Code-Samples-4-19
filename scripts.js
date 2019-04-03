"use strict"
var app = app || {};
window.onload = init;

//link to the three songs being used
const SOUND_PATH = Object.freeze({
    sound1: "MEDIA/freaking_out.mp3",
    sound2: "MEDIA/mr_fear.mp3",
    sound3: "MEDIA/whats_up_danger.mp3"
});

//global variables
let audioElement, canvas, audioHTML;

//visualizer variables
let circle, line, rect, bezier, strokeColor, fillColor, shadow, vector, ctrlX, ctrlY, speed;

//audio change variables
let audioVal, reverb, biquad, playBack, biNode;

//canvas context
let ctx;

//WebAudio context
let audioCtx;
let playButton;

//nodes that are part of our WebAudio audio routing graph
let sourceNode, analyserNode, gainNode, delayNode;

//a typed array to hold the audio frequency data
const NUM_SAMPLES = 256;

// create a new array of 8-bit integers (0-255)
let audioData = new Uint8Array(NUM_SAMPLES/2); 
let audioDataWave = new Uint8Array(NUM_SAMPLES/2); 

//set up the canvas, UI, and audion on page load
//call the update function
function init() {
    app.setUp.setCanvas();
    app.setUp.setWebaudio();
    app.setUp.myUI();
    app.setUp.update();
}

app.setUp = (function(){  
    //set up the canvas and initialize the canvas context
    function setCanvas() {
        canvas = document.querySelector('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        ctx = canvas.getContext("2d");
    }

    //function to fetch UI 
    function myUI() {
        //play or pause the song when the play button is clicked
        //from webAudio exercises
        playButton = document.querySelector("#playButton");
        playButton.onclick = e => {
            // check if context is in suspended state (autoplay policy)
            if (audioCtx.state == "suspended") {
                audioCtx.resume();
            }

            if (e.target.dataset.playing == "no") {
                audioElement.play();
                e.target.dataset.playing = "yes";

            // if track is playing pause it
            } else if (e.target.dataset.playing == "yes") {
                audioElement.pause();
                e.target.dataset.playing = "no";
            }
        };

        //on song change, the h1 element is changed to the correct song name
        document.querySelector("#songs").onchange = e =>{
            //pause audio on new song selection
            playButton.dispatchEvent(new MouseEvent("click"));

            if(e.target.value == "freaking_out") {
                audioElement.src = "MEDIA/freaking_out.mp3";
                document.querySelector('#songName').innerHTML = "freaking out"
            } else if (e.target.value == "mr_fear") {
                audioElement.src = "MEDIA/mr_fear.mp3";
                document.querySelector('#songName').innerHTML = "mr fear";
            } else if (e.target.value == "whats_up_danger"){
                audioElement.src = "MEDIA/whats_up_danger.mp3";
                document.querySelector('#songName').innerHTML = "Whats Up Danger"
            }
        };
        
        //grabbing the checkboxes and audio controls
        circle = document.querySelector("#circle");
        line = document.querySelector("#lines");
        bezier = document.querySelector("#bezier");
        rect = document.querySelector("#rects");
        reverb = document.querySelector("#playReb");
        biquad = document.querySelector("#playBi");
        playBack = document.querySelector("#playBack");
        audioHTML = document.querySelector("audio");

        //get reference to the gradient speed slider
        let gradBG = document.querySelector("#gradientSpd");
        //when the input changes, let the new speed equal the value between 10-50
        //use this  new speed to set the animation speed of the background on the canvas and body
        gradBG.oninput = e => {
            let newSpeed = e.target.value;
            document.querySelector("canvas").style.animation = "Gradient " + newSpeed + "s ease infinite";
            document.querySelector("canvas").style.WebkitAnimation = "Gradient " + newSpeed + "s ease infinite";

            document.querySelector("body").style.animation = "Gradient " + newSpeed + "s ease infinite";
            document.querySelector("body").style.WebkitAnimation = "Gradient " + newSpeed + "s ease infinite";
        };

        //reference the volume slider
        //parts taken from webAduio exercises
        let volumeSlider = document.querySelector("#volume");
        volumeSlider.oninput = e => {
            //use the gain node to get the volume
            gainNode.gain.value = e.target.value;
            //set the volume bar on the progress bar to the same volume so the volumes don't conflict
            audioHTML.volume = gainNode.gain.value;
            document.querySelector("#volumeVal").innerHTML = Math.round((audioHTML.volume * 100));
        };

        volumeSlider.dispatchEvent(new InputEvent("input"));

        //when the fullscreen button is clicked call the requestFullScreen function
        //parts taken from webAduio exercises
        document.querySelector("#fullScrn").onclick = _ =>{
            app.factory.requestFullscreen(canvas);
        };
    }    


    function setWebaudio(){
        // 1 - The || is because WebAudio has not been standardized across browsers yet
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioCtx = new AudioContext();
        
        // 2 - get a reference to the <audio> element on the page
        audioElement = document.querySelector("audio");
        audioElement.src = SOUND_PATH.sound1;
        
        // 3 - create an a source node that points at the <audio> element
        sourceNode = audioCtx.createMediaElementSource(audioElement);
        
        // 4 - create an analyser node
        analyserNode = audioCtx.createAnalyser();

        //create delay node for reverb
        delayNode = audioCtx.createDelay();
        delayNode.delayTime.value = 0;
        
        //create node for biquad filter
        biNode = audioCtx.createBiquadFilter();

        /*
        We will request NUM_SAMPLES number of samples or "bins" spaced equally 
        across the sound spectrum.
        
        If NUM_SAMPLES (fftSize) is 256, then the first bin is 0 Hz, the second is 172 Hz, 
        the third is 344Hz. Each bin contains a number between 0-255 representing 
        the amplitude of that frequency.
        */ 
        
        // fft stands for Fast Fourier Transform
        analyserNode.fftSize = NUM_SAMPLES;
        
        // 5 - create a gain (volume) node
        gainNode = audioCtx.createGain();
        gainNode.gain.value = 1;
        
        // 6 - connect the nodes - we now have an audio graph
        sourceNode.connect(audioCtx.destination);

        //connect the delay node
        //this allows control over reverb
        sourceNode.connect(delayNode);
        delayNode.connect(analyserNode);
        analyserNode.connect(audioCtx.destination);

        //connect the gain node
        //used for volume control
        analyserNode.connect(gainNode);
        gainNode.connect(audioCtx.destination);

        //connect the biquad node
        //used for the lowshelf biquad filter
        analyserNode.connect(biNode);
        biNode.connect(audioCtx.destination);
    }

    function update() {
        // this schedules a call to the update() method in 1/60 seconds
        requestAnimationFrame(update);

        //get the frequency audio data and the waveform audio data
        analyserNode.getByteFrequencyData(audioData);
        analyserNode.getByteTimeDomainData(audioDataWave);

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        //grab the h2 element
        let audioVal = document.querySelector('#audioData');

        //set line width, stroke and fill color
        ctx.lineWidth = 2;
        ctx.strokeStyle = strokeColor;
        ctx.fillStyle = fillColor;
        let x = canvas.width;
        let y = -canvas.height;

        //change the stroke and fill color between white and a gradient
        //controlled by two radio buttons
        let white = document.querySelector("#white");
        let grad = document.querySelector("#grad");
        if(white.checked){
            strokeColor = 'white';
            fillColor = 'white';
            shadow = 'white';
        }  else if (grad.checked) {
            let grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            grad.addColorStop(0, "#20E2D7");
            grad.addColorStop(1, "#F9FEA5");

            fillColor = grad;   
            strokeColor = grad;
            shadow = "#F9FEA5";
            ctx.globalAlpha = 1;
        }
               
        //drawing the visualizer 
        for(let i = 0; i < audioData.length; i++) {
            
            //change html of h2 element to reflect the waveform data
            audioVal.innerHTML = audioDataWave[i];

            //create a line of rectangles with height controlled by waveform audio data
            if(rect.checked) {
                ctx.save();
                ctx.beginPath();
                ctx.fillRect(x, audioDataWave[i] + 500, 5, 5);
                ctx.fill();
                x -= 10;
                ctx.closePath();
                ctx.restore();
            }

            //create the line visualization, starts at the top of the screen
            //height controlled by frequenc y audio data
            if(line.checked) {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x, audioData[i] * 2);
                ctx.stroke();
                x -= 10;
                ctx.closePath();
                ctx.restore();
            }

            //create the circle at the center
            //shadow blur controlled by frequency audio data
            //creates pulsing effect over the drawn circle in beat
            if(circle.checked) {
                ctx.save();
                ctx.beginPath();
                ctx.lineWidth = 5;
                ctx.arc(canvas.width/2, canvas.height/2, 50, Math.PI * 2, false);
                ctx.shadowBlur = audioData[i]/2;
                ctx.shadowColor = shadow;
                ctx.stroke();
                ctx.closePath();
                ctx.restore();            
            }

            //creates bezier curves across the screen using frequency audio data
            //ctrl x and ctrl y are modified with frequency audio data
            //translate is used to spread the endpoints out a bit so they don't all converge at one point
            if(bezier.checked) {
                ctx.save();
                ctx.translate(0, audioData[i]);
                ctx.lineWidth = .5;
                let ctrlX = canvas.width;
                let ctrlY = canvas.height/2;

                vector = app.factory.getRandomUnitVector();
                speed = 2;

                ctrlX += speed * vector.x + audioData[i] * 2;
                ctrlY += speed * vector.y + audioData[i] * 2;

                let ctrlXa = 0;
                let ctrlYa = 0;
            
                ctx.strokeStyle = strokeColor;
                ctx.beginPath();
                ctx.moveTo(0, canvas.height/2);
                ctx.bezierCurveTo(ctrlX, ctrlY, ctrlXa, ctrlYa, canvas.width, 0);
                ctx.translate(0, -audioData[i]);
                ctx.stroke();
                
                ctx.restore();
            }
        }

        //call the manipulate pixels function from the factory module
        app.factory.manipulatePixels(ctx);

        //if the reverb slider is checked it's value can be changed
        //if unchecked, the value resets to no reverb
        let reverbSlider = document.querySelector("#reverb");
        if(reverb.checked) {
            reverbSlider.oninput = e => {
                delayNode.delayTime.value = e.target.value;
            };
        } else {
            delayNode.delayTime.value = 0;
            reverbSlider.value = 0;
        }

        //if biquad is checked, the filter is applied
        //if unchecked, it resets the audio to normal
        if(biquad.checked){
            biNode.type = "lowshelf";
            biNode.frequency.setValueAtTime(1000, audioCtx.currentTime);
            biNode.gain.setValueAtTime(20, audioCtx.currentTime);
        }  else {
            biNode.type ="allpass";
        }

        //if playback speed is checked, the user can use the slider
        //to speed up to slow down the song
        //when unchecked the playback speed returns to normal
        let playSpeed = document.querySelector("#speed");
        if(playBack.checked) {
            playSpeed.oninput = e => {
                audioHTML.playbackRate = e.target.value;
            };
        } else {
            audioHTML.playbackRate = 1;
            playSpeed.value = 1;
        }
    }

    //return the functions to be able to call them outside of the module
    return {
        setCanvas: setCanvas,
        myUI: myUI,
        setWebaudio: setWebaudio,
        update: update
    }
})();

app.factory = (function() {
    //function to edit the imageData of the canvas
    function manipulatePixels(ctx) {
        let imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
                
        let data = imageData.data;
        let length = data.length;
        let width = imageData.width;

        //get the different checkbox values
        let noiseChange = document.querySelector("#noise");
        let invertChange = document.querySelector("#invert");
        let darkChange = document.querySelector("#dark");
        
        //for the length of the image data array
        for(let i = 0; i < length; i += 4) {
            
            //add white noise if noise is checked
            if(noiseChange.checked && Math.random() < .10) {

                //alpha
                data[i + 3] = 255;
                
                //white noise
                data[i] = data[i + 1] = data[i + 2] = 255;
            }

            //invert all the colors if invery is checked
            if(invertChange.checked) {
                let red = data[i], green = data[i+1], blue = data[i+2];
                data[i] = 255 - red;
                data[i + 1] = 255 - green;
                data[i + 2] = 255 - blue;
            }

            //darken/desaturate all the colors if darken is checked
            //https://www.html5rocks.com/en/tutorials/canvas/imagefilters/
            //effect inspired from link above
            if(darkChange.checked) {
                data[i] -= 50;
                data[i+1] -= 50;
                data[i+2] -= 50;
            }
            
        }
        
        //pass the image data back onto the canvas
        ctx.putImageData(imageData, 0, 0);
    }

    //check if fullscreen is possible and if it is, go to fullscreen
    function requestFullscreen(element) {
        if (element.requestFullscreen) {
        element.requestFullscreen();
        } else if (element.mozRequestFullscreen) {
        element.mozRequestFullscreen();
        } else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
        element.mozRequestFullScreen();
        } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
        }
        // .. and do nothing if the method is not supported
    }

    //return a random unit vector
    //used to create the bezier curve
    function getRandomUnitVector(){
        let x = getRandom(-1,1);
        let y = getRandom(-1,1);
        let length = Math.sqrt(x*x + y*y);
        
        if(length == 0){ // very unlikely
            x=1; // point right
            y=0;
            length=1;
        } else{
            x /= length;
            y /= length;
        }
        
        return {x:x, y:y};
    }

    //return a random value generated between two user passed in bounds
    //used to create bezier curve
    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    //return all functions for use outside of the module
    return {
        manipulatePixels: manipulatePixels,
        requestFullscreen: requestFullscreen,
        getRandomUnitVector: getRandomUnitVector,
        getRandom: getRandom
    }
})();

