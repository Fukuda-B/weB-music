// https://developer.mozilla.org/ja/docs/Web/API/Web_Audio_API
// https://weblike-curtaincall.ssl-lolipop.jp/portfolio-web-sounder/webaudioapi-effectors/delay-reverb
// https://www.g200kg.com/jp/docs/webaudio/index.html
// https://sleepygamersmemo.blogspot.com/2020/02/virtual-piano-memo.html
// https://tomhazledine.com/web-audio-delay/

/*
    https://www.w3.org/TR/uievents-code/#table-key-code-alphanumeric-writing-system

    keyMap1のキー配置に近いもの: https://mike3.net/piano/1-piano.html
    keyMap2のキー配置に近いもの: https://onlinepiano.app/ja/#, https://onlinepiano1.com/ja/
    keyMap3のキー配置に近いもの (未実装): http://gakusyu.jp/musictheory/kenban.php?timbre=piano
*/
let keyMap1 = {
    'KeyA'  : ['Ab', 2, 'A'],
    'KeyZ'  : ['A' , 2, 'Z'],
    'KeyS'  : ['Bb', 2, 'S'],
    'KeyX'  : ['B' , 2, 'X'],
    'KeyC'  : ['C' , 3, 'C'],
    'KeyF'  : ['Db', 3, 'X'],
    'KeyV'  : ['D' , 3, 'V'],
    'KeyG'  : ['Eb', 3, 'G'],
    'KeyB'  : ['E' , 3, 'B'],
    'KeyN'  : ['F' , 3, 'N'],
    'KeyJ'  : ['Gb', 3, 'J'],
    'KeyM'  : ['G' , 3, 'M'],
    'KeyK'  : ['Ab', 3, 'K'],
    'Comma' : ['A' , 3, ','],
    'KeyL'  : ['Bb', 3, 'L'],
    'Period': ['B' , 3, '.'],
    'Slash' : ['C' , 4, '/'],
    'Quote' : ['Db', 4, ':'],
    'IntlRo': ['D' , 4, '\\'],
    'Backslash': ['Eb', 4, ']'],

    'Digit1': ['Ab', 3, '1'],
    'KeyQ'  : ['A' , 3, 'Q'],
    'Digit2': ['Bb', 3, '2'],
    'KeyW'  : ['B' , 3, 'W'],
    'KeyE'  : ['C' , 4, 'E'],
    'Digit4': ['Db', 4, '4'],
    'KeyR'  : ['D' , 4, 'R'],
    'Digit5': ['Eb', 4, '5'],
    'KeyT'  : ['E' , 4, 'T'],
    'KeyY'  : ['F' , 4, 'Y'],
    'Digit7': ['Gb', 4, '7'],
    'KeyU'  : ['G' , 4, 'U'],
    'Digit8': ['Ab', 4, '8'],
    'KeyI'  : ['A' , 4, 'I'],
    'Digit9': ['Bb', 4, '9'],
    'KeyO'  : ['B' , 4, 'O'],
    'KeyP'  : ['C' , 5, 'P'],
    'Minus' : ['Db' , 5, '-'],
    'BracketLeft': ['D', 5, '@'],
    'Equal' : ['Eb', 5, '^'],
    'BracketRight': ['E', 5, '['],
}
let keyMap2 = {
    'KeyZ'  : ['C' , 3, 'Z'],
    'KeyS'  : ['Db', 3, 'S'],
    'KeyX'  : ['D' , 3, 'X'],
    'KeyD'  : ['Eb', 3, 'D'],
    'KeyC'  : ['E' , 3, 'C'],
    'KeyV'  : ['F' , 3, 'V'],
    'KeyG'  : ['Gb', 3, 'G'],
    'KeyB'  : ['G' , 3, 'B'],
    'KeyH'  : ['Ab', 3, 'H'],
    'KeyN'  : ['A' , 3, 'N'],
    'KeyJ'  : ['Bb', 3, 'J'],
    'KeyM'  : ['B' , 3, 'M'],
    'Comma' : ['C' , 4, ','],
    'KeyL'  : ['Db', 4, 'L'],
    'Period': ['D' , 4, '.'],
    'Semicolon': ['Eb', 4, ';'],
    'IntlRo': ['A' , 5, '\\'],
    'Backslash': ['G', 5, ']'],

    'KeyQ'  : ['C' , 4, 'Q'],
    'Digit2': ['Db', 4, '2'],
    'KeyW'  : ['D' , 4, 'W'],
    'Digit3': ['Eb', 4, '3'],
    'KeyE'  : ['E' , 4, 'E'],
    'KeyR'  : ['F' , 4, 'R'],
    'Digit5': ['Gb', 4, '5'],
    'KeyT'  : ['G' , 4, 'T'],
    'Digit6': ['Ab', 4, '6'],
    'KeyY'  : ['A' , 4, 'Y'],
    'Digit7': ['Bb', 4, '7'],
    'KeyU'  : ['B' , 4, 'U'],
    'KeyI'  : ['C' , 5, 'I'],
    'Digit9': ['Db', 5, '9'],
    'KeyO'  : ['D' , 5, 'O'],
    'Digit0': ['Eb', 5, '0'],
    'KeyP'  : ['E' , 5, 'P'],
    'BracketRight': ['F', 5, '['],
    // 'Equal': ['Gb', 5, '='],
    'IntlYen': ['A', 5, '￥']
}

const keyArr = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
const freq_type = document.getElementById('freq_type');
const volume = document.getElementById('volume');
const tone_attack = document.getElementById('tone_attack');
const tone_hold = document.getElementById('tone_hold');
const tone_decay = document.getElementById('tone_decay');
const tone_sustain = document.getElementById('tone_sustain');
const tone_release = document.getElementById('tone_release');
let audioContext = null;
const key_map = document.getElementById('key_map');
let keyMap = keyMap2;
const custom_ax = 7;

const waveform_canvas = document.getElementById('waveform');
const waveform_ctx = waveform_canvas.getContext('2d');
const waveform_size = [744, 100];
let analyser = null;
let buf = new Float32Array(waveform_size[0]);

// Delay
const dry = document.getElementById('dry');
const wet = document.getElementById('wet');
const feedback = document.getElementById('feedback');
const delay_delay = document.getElementById('delay_delay');

// Chorus
const chorus_delay = document.getElementById('chorus_delay');
const depth = document.getElementById('depth');
const rate = document.getElementById('rate');
const level = document.getElementById('level');

const sound = function (key, oct) {
    let oscillator = audioContext.createOscillator();
    oscillator.setPeriodicWave = oscillator.setPeriodicWave || oscillator.setWaveTable;
    oscillator.stop = oscillator.stop || oscillator.noteOff;
    oscillator.start = oscillator.start || oscillator.noteOn;

    // Chorus
    let delayCh = audioContext.createDelay(1);
    let lfo = audioContext.createOscillator();
    let depthGain = audioContext.createGain();
    let mixGain = audioContext.createGain();
    lfo.frequency.value = rate.value;
    lfo.type = 'sine';
    delayCh.delayTime.value = chorus_delay.value/1000;
    depthGain.gain.value = delayCh.delayTime.value*depth.value;
    mixGain.gain.value = level.value;

    // Delay
    let delayDe = audioContext.createDelay(2);
    let dryGain = audioContext.createGain();
    let wetGain = audioContext.createGain();
    let feedbackGain = audioContext.createGain();
    delayDe.delayTime.value = delay_delay.value/1000;
    dryGain.gain.value = dry.value;
    wetGain.gain.value = wet.value;
    feedbackGain.gain.value = feedback.value;

    if (freq_type.value==='custom') {
        const realArr = new Float32Array(custom_ax+1);
        const imagArr = new Float32Array(custom_ax+1);
        for(let i=1; i<=custom_ax; i++) {
            realArr[i] = document.getElementById('real'+i).value;
            imagArr[i] = document.getElementById('imag'+i).value;
        }
        const customWave = audioContext.createPeriodicWave(realArr, imagArr);
        oscillator.setPeriodicWave(customWave);
    } else {
        oscillator.type = freq_type.value;
    }

    let frequency = 440*Math.pow(2,((keyArr.indexOf(key)-9)/12)+(oct-4));
    oscillator.frequency.value = frequency;
    // console.log(freq_type.value+' '+frequency+'Hz');
    document.getElementById('k_'+key+oct).classList.add('pressed');

    let gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.0, audioContext.currentTime);
    gainNode.gain.setTargetAtTime(volume.value/100, audioContext.currentTime, tone_attack.value/1000);
    gainNode.gain.setTargetAtTime(
        tone_sustain.value*volume.value/10000,
        audioContext.currentTime+((tone_attack.value/1000+tone_hold.value/1000)),
        (tone_decay.value/1000)
    );

    // メイン
    oscillator.connect(gainNode);

    // Chorus
    lfo.connect(depthGain);
    depthGain.connect(delayCh.delayTime);
    gainNode.connect(delayCh);
    delayCh.connect(mixGain);

    // Delay
    // wet側にはoscillatorから直接つなぐとプツプツするノイズで大変なことになるので注意
    mixGain.connect(delayDe);
    gainNode.connect(delayDe);
    mixGain.connect(dryGain);
    gainNode.connect(dryGain);
    delayDe.connect(wetGain);

    // Delayのフィードバック
    delayDe.connect(feedbackGain);
    feedbackGain.connect(delayDe);

    // Analyser --> 出力
    dryGain.connect(analyser);
    wetGain.connect(analyser);
    analyser.connect(audioContext.destination);

    lfo.start();
    oscillator.start();

    return {
        audioContext: audioContext,
        gainNode: gainNode,
        oscillator: oscillator,
        key: key,
        oct: oct,
    }
}

// 読み込み時
window.addEventListener('load', () => {
    updateValue();
    updateKeyMap();
});

// 値変更イベント
volume.addEventListener('input', () => {
    document.getElementById('current_volume').innerText = volume.value;});
tone_attack.addEventListener('input', () => {
    document.getElementById('current_tone_attack').innerText = tone_attack.value;});
tone_hold.addEventListener('input', () => {
    document.getElementById('current_tone_hold').innerText = tone_hold.value;});
tone_decay.addEventListener('input', () => {
    document.getElementById('current_tone_decay').innerText = tone_decay.value;});
tone_sustain.addEventListener('input', () => {
    document.getElementById('current_tone_sustain').innerText = tone_sustain.value;});
tone_release.addEventListener('input', () => {
    document.getElementById('current_tone_release').innerText = tone_release.value;});

delay_delay.addEventListener('input', () => {
    document.getElementById('current_delay_delay').innerText = delay_delay.value;});
dry.addEventListener('input', () => {
    document.getElementById('current_dry').innerText = dry.value;});
wet.addEventListener('input', () => {
    document.getElementById('current_wet').innerText = wet.value;});
feedback.addEventListener('input', () => {
    document.getElementById('current_feedback').innerText = feedback.value;});

chorus_delay.addEventListener('input', () => {
    document.getElementById('current_chorus_delay').innerText = chorus_delay.value;});
depth.addEventListener('input', () => {
    document.getElementById('current_depth').innerText = depth.value;});
rate.addEventListener('input', () => {
    document.getElementById('current_rate').innerText = rate.value;});
level.addEventListener('input', () => {
    document.getElementById('current_level').innerText = level.value;});

key_map.addEventListener('change', () => {
    if (key_map.value==='keymap3') {
        keyMap = keyMap3;
        updateKeyMap();
    } else if (key_map.value==='keymap2') {
        keyMap = keyMap2;
        updateKeyMap();
    } else {
        keyMap = keyMap1;
        updateKeyMap();
    }
});
for (let i=1; i<=custom_ax; i++) {
    let rElem = document.getElementById('real'+i);
    let iElem = document.getElementById('imag'+i);
    rElem.addEventListener('input', () => {
        document.getElementById('current_real'+i).innerText = parseFloat(rElem.value).toFixed(2);});
    iElem.addEventListener('input', () => {
        document.getElementById('current_imag'+i).innerText = parseFloat(iElem.value).toFixed(2);});
}

const updateValue = () => {
    document.getElementById('current_volume').innerText = volume.value;
    document.getElementById('current_tone_attack').innerText = tone_attack.value;
    document.getElementById('current_tone_hold').innerText = tone_hold.value;
    document.getElementById('current_tone_decay').innerText = tone_decay.value;
    document.getElementById('current_tone_sustain').innerText = tone_sustain.value;
    document.getElementById('current_tone_release').innerText = tone_release.value;
    document.getElementById('current_delay_delay').innerText = delay_delay.value;
    document.getElementById('current_dry').innerText = dry.value;
    document.getElementById('current_wet').innerText = wet.value;
    document.getElementById('current_feedback').innerText = feedback.value;
    document.getElementById('current_chorus_delay').innerText = chorus_delay.value;
    document.getElementById('current_depth').innerText = depth.value;
    document.getElementById('current_rate').innerText = rate.value;
    document.getElementById('current_level').innerText = level.value;
    for (let i=1; i<=custom_ax; i++) {
        document.getElementById('current_real'+i).innerText = parseFloat(document.getElementById('real'+i).value).toFixed(2);
        document.getElementById('current_imag'+i).innerText = parseFloat(document.getElementById('imag'+i).value).toFixed(2);
    }
}
const updateKeyMap = () => {
    let keyls = document.querySelectorAll('.klabel');
    for (let i=0; i<keyls.length; i++) {
        keyls[i].innerHTML = '';
    }
    for (let key in keyMap) {
        document.getElementById('l_'+keyMap[key][0]+keyMap[key][1]).innerHTML += '<br>'+keyMap[key][2];
    }
}
const updateWaveform = () => {
    waveform_ctx.fillStyle = "#fff";
    waveform_ctx.fillRect(0,0,waveform_size[0],waveform_size[1]);

    waveform_ctx.lineWidth = 1;
    waveform_ctx.strokeStyle = '#BBB';
    waveform_ctx.beginPath();
    waveform_ctx.setLineDash([]);
    waveform_ctx.moveTo(0,waveform_size[1]/2);
    waveform_ctx.lineTo(waveform_size[0],waveform_size[1]/2);
    waveform_ctx.stroke();

    waveform_ctx.beginPath();
    waveform_ctx.setLineDash([5,5]);
    waveform_ctx.moveTo(0,waveform_size[1]/4);
    waveform_ctx.lineTo(waveform_size[0],waveform_size[1]/4);
    waveform_ctx.moveTo(0,waveform_size[1]*3/4);
    waveform_ctx.lineTo(waveform_size[0],waveform_size[1]*3/4);
    waveform_ctx.stroke();

    if (analyser===null) return;
    analyser.getFloatTimeDomainData(buf);
    for (let i=0; i<waveform_size[0]; i++) {
        let b = waveform_size[1]/2-buf[i]*waveform_size[1]/2;
        waveform_ctx.fillStyle = "#222";
        waveform_ctx.fillRect(i,b,1,2);
    }
}
setInterval(updateWaveform, 1000/10);

// Preset関係
let presets = {
    1: {
        'type': 'triangle',
        'volume': 30,
        'tone_attack': 5,
        'tone_hold': 5,
        'tone_decay': 30,
        'tone_sustain': 80,
        'tone_release': 200,
        'rArr': [0.0, 0.0 ,0.0 ,0.0 ,0.0 ,0.0 ,0.0],
        'iArr': [0.0, 0.0 ,0.0 ,0.0 ,0.0 ,0.0 ,0.0],
    },
    2: {
        'type': 'sawtooth',
        'volume': 18,
        'tone_attack': 1,
        'tone_hold': 5,
        'tone_decay': 40,
        'tone_sustain': 100,
        'tone_release': 50,
        'rArr': [0.0, 0.0 ,0.0 ,0.0 ,0.0 ,0.0 ,0.0],
        'iArr': [0.0, 0.0 ,0.0 ,0.0 ,0.0 ,0.0 ,0.0],
    },
    3: {
        'type': 'custom',
        'volume': 25,
        'tone_attack': 10,
        'tone_hold': 1,
        'tone_decay': 30,
        'tone_sustain': 80,
        'tone_release': 110,
        'rArr': [0.03, 0.21, 0.0, 0.0, 0.0, 0.0, 0.0],
        'iArr': [1.0, 0.03, 0.48, 0.05, 0.11, 0.15, 0.23],
    },
    4: {
        'type': 'square',
        'volume': 27,
        'tone_attack': 1,
        'tone_hold': 5,
        'tone_decay': 10,
        'tone_sustain': 35,
        'tone_release': 80,
        'rArr': [0.0, 0.0 ,0.0 ,0.0 ,0.0 ,0.0 ,0.0],
        'iArr': [0.0, 0.0 ,0.0 ,0.0 ,0.0 ,0.0 ,0.0],
    },
    5: {
        'type': 'custom',
        'volume': 30,
        'tone_attack': 3,
        'tone_hold':30,
        'tone_decay': 30,
        'tone_sustain': 75,
        'tone_release': 250,
        'rArr': [0.0, 0.0 ,0.0 ,0.0 ,0.0 ,0.0 ,0.0],
        'iArr': [1.0, 0.0 ,0.0 ,0.75 ,0.10 ,0.05 ,0.50],
    },
}
for (let i=1; i<=3; i++) {
    document.getElementById('pre'+i).addEventListener('click', () => {
        updatePreset(i);
    });
}
const updatePreset = (i) => {
    let pv = presets[i]
    freq_type.value = pv['type'];
    volume.value = pv['volume'];
    tone_attack.value = pv['tone_attack'];
    tone_hold.value = pv['tone_hold'];
    tone_decay.value = pv['tone_decay'];
    tone_sustain.value = pv['tone_sustain'];
    tone_release.value = pv['tone_release'];
    for (let j=1; j<=custom_ax; j++) {
        document.getElementById('real'+j).value = pv['rArr'][j-1];
        document.getElementById('imag'+j).value = pv['iArr'][j-1];
    }
    updateValue();
}
keyMapPreset = {
    'Numpad1': 1,
    'Numpad2': 2,
    'Numpad3': 3,
    'Numpad4': 4,
    'Numpad5': 5,
}

document.addEventListener('keydown', function keyUp(e) {
    if (audioContext === null) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
    }
    if (e.repeat) {return;}

    // 演奏用キー
    if (e.code in keyMap) {
        let tone = sound(keyMap[e.code][0], keyMap[e.code][1])
        document.addEventListener('keyup', (re) => {
            if (e.code === re.code) {
                tone.gainNode.gain.setValueAtTime(tone.gainNode.gain.value, tone.audioContext.currentTime);
                tone.gainNode.gain.linearRampToValueAtTime(0.0, tone.audioContext.currentTime + (tone_release.value/1000));
                tone.oscillator.stop(tone.audioContext.currentTime + (tone_release.value/1000));
                removeEventListener('keyup', keyUp);

                document.getElementById('k_'+tone.key+tone.oct).classList.remove('pressed');
            }
        })
    // Preset変更キー
    } else if (e.code in keyMapPreset) {
        updatePreset(keyMapPreset[e.code]);
    }
})
