let startContext, playButton, stopButton, samples, sampler, button1, button2, button3, button4, delTimeSlider, feedbackSlider, distSlider, wetSlider;

let rev = new Tone.Reverb(5).toDestination();
let dist = new Tone.Distortion(0).connect(rev);
let del = new Tone.FeedbackDelay(0, 0).connect(dist);
del.wet.value = 0.5;

function preload() {
  samples = new Tone.Players({
    ISO: "media/ISO.mp3",
    Knock2: "media/Knock2.mp3",
    Timmy: "media/Timmy.mp3",
    SevenLions: "media/SevenLions.mp3",
  }).connect(del);
}

function setup() {
  createCanvas(400, 400);

  startContext = createButton("Start Audio Context");
  startContext.position(0, 0);
  startContext.mousePressed(startAudioContext);

  button1 = createButton("ISO Sample");
  button1.position(10, 30);
  button2 = createButton("Knock2 Sample");
  button2.position(200, 30);
  button3 = createButton("Timmy Sample");
  button3.position(10, 60);
  button4 = createButton("Seven Lions Sample");
  button4.position(200, 60);

  button1.mousePressed(() => playSample("ISO"));
  button2.mousePressed(() => playSample("Knock2"));
  button3.mousePressed(() => playSample("Timmy"));
  button4.mousePressed(() => playSample("SevenLions"));

  playButton = createButton("Play Last Sample");
  playButton.position(10, 100);
  playButton.mousePressed(playLastSample);

  stopButton = createButton("Stop All Samples");
  stopButton.position(200, 100);
  stopButton.mousePressed(stopAllSamples);

  delTimeSlider = createSlider(0, 1, 0, 0.01);
  delTimeSlider.position(10, 150);
  delTimeSlider.input(() => { del.delayTime.value = delTimeSlider.value(); });

  feedbackSlider = createSlider(0, 0.99, 0, 0.01);
  feedbackSlider.position(200, 150);
  feedbackSlider.input(() => { del.feedback.value = feedbackSlider.value(); });

  distSlider = createSlider(0, 10, 0, 0.01);
  distSlider.position(10, 250);
  distSlider.input(() => { dist.distortion = distSlider.value(); });

  wetSlider = createSlider(0, 1, 0, 0.01);
  wetSlider.position(200, 250);
  wetSlider.input(() => { rev.wet.value = wetSlider.value(); });
}

function draw() {
  background(220);
  text("Delay Time: " + delTimeSlider.value(), 15, 140);
  text("Feedback Amount: " + feedbackSlider.value(), 205, 140);
  text("Distortion Amount: " + distSlider.value(), 15, 240);
  text("Reverb Wet Amount: " + wetSlider.value(), 205, 240);
}

let lastSample = null;
let activePlayers = new Map(); 

function playSample(sampleName) {
  let player = samples.player(sampleName);
  lastSample = player;
  player.start();
  activePlayers.set(sampleName, player);
}

function playLastSample() {
  if (lastSample) {
    lastSample.start();
  }
}
function stopAllSamples() {
  samples.stopAll(); 
  activePlayers.clear();
}

function startAudioContext() {
  if (Tone.context.state !== 'running') {
    Tone.start();
    console.log("Audio Context Started");
  } else {
    console.log("Audio Context is already running");
  }
}
