let synth1, rev, polySynth, noise1, ampEnv1, filt1;

let activeKey = null;

let keyNotes = {
  'a': 'A4',
  's': 'B4',
  'd': 'C5',
  'f': 'D5',
  'g': 'E5',  
  'h': 'F5'   
}

let keyNotes1 = {
  'q': 'D4',
  'w': 'F4',
  'e': 'A4',
  'r': 'B4',  
  't': 'C5'   
}

let oscSlider, envSlider;

function setup() {
  createCanvas(600, 600);
  rev = new Tone.Reverb(2).toDestination();
  synth1 = new Tone.Synth({
    oscillator: {
      type: 'square' 
    },
    envelope: {
      attack: 0.05, 
      decay: 0.3,
      sustain: 0.7,
      release: 0.5
    }
  }).connect(rev);
  synth1.portamento.value = 0.5;
  polySynth = new Tone.PolySynth(Tone.Synth).connect(rev);
  polySynth.set({
    envelope: {
      attack: 0.1,
      decay: 0.1,
      sustain: 1,
      release: 0.1
    },
    oscillator: {
      type: 'sawtooth'
    }
  });
  polySynth.volume.value = -6;
  ampEnv1 = new Tone.AmplitudeEnvelope({
    attack: 0.1,
    decay: 0.5,
    sustain: 0,
    release: 0.1
  }).toDestination();
  filt1 = new Tone.Filter(1500, "highpass").connect(ampEnv1);
  noise1 = new Tone.Noise('pink').start().connect(filt1);
  
  oscSlider = createSlider(0, 3, 0, 1); 
  oscSlider.position(20, 380);
  envSlider = createSlider(0.01, 1, 0.05, 0.01); 
  envSlider.position(220, 380);
}

function draw() {
  background(220);
  textSize(16); 
  text("keys a-h are the monophonic synth,  \nkeys q-t are the polyphonic synth, \nkey z is the noise.", 20, 20);
  text("Oscillator Type", 80, 360);
  text("Envelope Attack", 280, 360);
  
  let oscTypes = ['sine', 'square', 'triangle', 'sawtooth'];
  let selectedOsc = oscTypes[oscSlider.value()];
  synth1.oscillator.set({ type: selectedOsc });
  polySynth.set({ oscillator: { type: selectedOsc } });
  
  let selectedAttack = envSlider.value();
  synth1.envelope.set({ attack: selectedAttack });
  polySynth.set({ envelope: { attack: selectedAttack } });
}

function keyPressed() {
  let pitch = keyNotes[key];
  let pitch1 = keyNotes1[key];
  if (pitch && key !== activeKey) {
    synth1.triggerRelease();
    activeKey = key;
    synth1.triggerAttack(pitch);
  } else if (pitch1) {
    polySynth.triggerAttack(pitch1);
  } else if (key === "z") {
    ampEnv1.triggerAttackRelease(0.1);
  }
}

function keyReleased() {
  let pitch1 = keyNotes1[key];
  if (key === activeKey) {
    synth1.triggerRelease();
    activeKey = null;
  } else if (pitch1) {
    polySynth.triggerRelease(pitch1);
  }
}