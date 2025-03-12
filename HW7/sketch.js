let basicSynth, filt, LFOfilt, panner, fmSynth, values, noise1, noiseEnv, filt1, values1;
let img;
let RevEngine = false;  

function preload() {
  img = loadImage("media/hellcat.png"); 
}

function setup() {
  createCanvas(400, 400);
  
  panner = new Tone.AutoPanner({
    frequency: 0.2,
    depth: 0.5
  }).toDestination().start();

  filt = new Tone.Filter(300, "lowpass", -12).connect(panner);
  basicSynth = new Tone.Synth().connect(filt);

  LFOfilt = new Tone.LFO(0.2, 200, 2000).start();
  LFOfilt.connect(filt.frequency);

  fmSynth = new Tone.FMSynth({
    harmonicity: 1.2,
    modulationIndex: 6,
    envelope: {
      attack: 0.1,
      decay: 0.3,
      sustain: 0.1,
      release: 0.2
    }
  }).toDestination();

  filt1 = new Tone.AutoFilter({
    frequency: 0.3,
    depth: 0.6,
    baseFrequency: 300,
    octaves: 2
  }).toDestination().start();

  noiseEnv = new Tone.AmplitudeEnvelope({
    attack: 0.1,
    decay: 0.3,
    sustain: 0.2,
    release: 0.3
  }).connect(filt1);

  noise1 = new Tone.Noise("pink").connect(noiseEnv).start();

  values1 = new Float32Array([-96, -30, -30, -12, 0, -12, 0, 0, -6, -12, -30, -96]);
}

function draw() {
  background(220);
  
  if (!RevEngine) {
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Rev the engine", width / 2, height / 2);
  } else {
    image(img, 100, 100, 300, 300);
  }
}

function mouseClicked() {
  RevEngine = !RevEngine;
  fmSynth.triggerAttackRelease(300, 0.3); 
  fmSynth.frequency.rampTo(600, 0.6);  
  noiseEnv.triggerAttackRelease(0.4);  
  LFOfilt.frequency.value = random(3, 7);  
}

function keyPressed() {
  if (key === "a") {
    noiseEnv.triggerAttackRelease(30);
    noise1.volume.setValueCurveAtTime(values1, Tone.now(), 30);
    console.log('testing');
  }
}
