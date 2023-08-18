// https://developer.mozilla.org/ja/docs/Web/API/Web_Audio_API
// https://sleepygamersmemo.blogspot.com/2020/02/virtual-piano-memo.html

/*
    keyMap1のキー配置に近いもの: https://mike3.net/piano/1-piano.html
    keyMap2のキー配置に近いもの: https://onlinepiano.app/ja/#, https://onlinepiano1.com/ja/
    keyMap3のキー配置に近いもの (未実装): http://gakusyu.jp/musictheory/kenban.php?timbre=piano
*/
let keyMap1 = {
    'KeyA'  : ['Ab', 2],
    'KeyZ'  : ['A' , 2],
    'KeyS'  : ['Bb', 2],
    'KeyX'  : ['B' , 2],
    'KeyC'  : ['C' , 3],
    'KeyF'  : ['Db', 3],
    'KeyV'  : ['D' , 3],
    'KeyG'  : ['Eb', 3],
    'KeyB'  : ['E' , 3],
    'KeyN'  : ['F' , 3],
    'KeyJ'  : ['Gb', 3],
    'KeyM'  : ['G' , 3],
    'KeyK'  : ['Ab', 3],
    'Comma' : ['A' , 3],
    'KeyL'  : ['Bb', 3],
    'Period': ['B' , 3],
    'Slash' : ['C' , 4],
    'Quote' : ['Db', 4],
    'IntlRo': ['D' , 4],
    'Backslash': ['Eb', 4],

    'Digit1': ['Ab', 3],
    'KeyQ'  : ['A' , 3],
    'Digit2': ['Bb', 3],
    'KeyW'  : ['B' , 3],
    'KeyE'  : ['C' , 4],
    'Digit4': ['Db', 4],
    'KeyR'  : ['D' , 4],
    'Digit5': ['Eb', 4],
    'KeyT'  : ['E' , 4],
    'KeyY'  : ['F' , 4],
    'Digit7': ['Gb', 4],
    'KeyU'  : ['G' , 4],
    'Digit8': ['Ab', 4],
    'KeyI'  : ['A' , 4],
    'Digit9': ['Bb', 4],
    'KeyO'  : ['B' , 4],
    'KeyP'  : ['C' , 5],
    'Minus' : ['Db' , 5],
    'BracketLeft': ['D', 5],
    'Equal' : ['Eb', 5],
    'BracketRight': ['E', 5],
}
let keyMap2 = {
    'KeyZ'  : ['C' , 3],
    'KeyS'  : ['Db', 3],
    'KeyX'  : ['D' , 3],
    'KeyD'  : ['Eb' , 3],
    'KeyC'  : ['E' , 3],
    'KeyV'  : ['F' , 3],
    'KeyG'  : ['Gb', 3],
    'KeyB'  : ['G' , 3],
    'KeyH'  : ['Ab', 3],
    'KeyN'  : ['A' , 3],
    'KeyJ'  : ['Bb', 3],
    'KeyM'  : ['B' , 3],
    'Comma' : ['C' , 4],
    'KeyL'  : ['Db', 4],
    'Period': ['D' , 4],
    'Semicolon': ['Eb', 4],
    'IntlRo': ['A' , 5],
    'Backslash': ['G', 5],

    'KeyQ'  : ['C' , 4],
    'Digit2': ['Db', 4],
    'KeyW'  : ['D' , 4],
    'Digit3': ['Eb', 4],
    'KeyE'  : ['E' , 4],
    'KeyR'  : ['F' , 4],
    'Digit5': ['Gb', 4],
    'KeyT'  : ['G' , 4],
    'Digit6': ['Ab', 4],
    'KeyY'  : ['A' , 4],
    'Digit7': ['Bb', 4],
    'KeyU'  : ['B' , 4],
    'KeyI'  : ['C' , 5],
    'Digit9': ['Db', 5],
    'KeyO'  : ['D' , 5],
    'Digit0': ['Eb', 5],
    'KeyP'  : ['E' , 5],
    'BracketRight': ['F', 5],
    'IntlYen': ['A', 5]
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

const sound = function (key, oct) {
    let oscillator = audioContext.createOscillator();

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
    console.log(freq_type.value+' '+frequency+'Hz');

    let gainNode = audioContext.createGain();

    gainNode.gain.setValueAtTime(0.0, audioContext.currentTime);
    gainNode.gain.setTargetAtTime(volume.value/100, audioContext.currentTime, tone_attack.value/1000);
    gainNode.gain.setTargetAtTime(
        tone_sustain.value*volume.value/10000,
        audioContext.currentTime+((tone_attack.value/1000+tone_hold.value/1000)),
        (tone_decay.value/1000)
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start = oscillator.start || oscillator.noteOn;
    oscillator.start();

    return {
        audioContext: audioContext,
        gainNode: gainNode,
        oscillator: oscillator,
    }
}

// 読み込み時
window.addEventListener('load', () => {
    updateValue();
});

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
key_map.addEventListener('change', () => {
    if (key_map.value==='keymap3') {
        keyMap = keyMap3;
    } else if (key_map.value==='keymap2') {
        keyMap = keyMap2;
    } else {
        keyMap = keyMap1;
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
    for (let i=1; i<=custom_ax; i++) {
        document.getElementById('current_real'+i).innerText = parseFloat(document.getElementById('real'+i).value).toFixed(2);
        document.getElementById('current_imag'+i).innerText = parseFloat(document.getElementById('imag'+i).value).toFixed(2);
    }
}

document.getElementById('pre1').addEventListener('click', () => {
    freq_type.value = 'triangle';
    volume.value = 30;
    tone_attack.value = 5;
    tone_hold.value = 5;
    tone_decay.value = 30;
    tone_sustain.value = 80;
    tone_release.value = 200;
    for (let i=1; i<=custom_ax; i++) {
        document.getElementById('real'+i).value = 0.0;
        document.getElementById('imag'+i).value = 0.0;
    }
    updateValue();
});
document.getElementById('pre2').addEventListener('click', () => {
    freq_type.value = 'square';
    volume.value = 12;
    tone_attack.value = 1;
    tone_hold.value = 5;
    tone_decay.value = 40;
    tone_sustain.value = 100;
    tone_release.value = 50;
    for (let i=1; i<=custom_ax; i++) {
        document.getElementById('real'+i).value = 0.0;
        document.getElementById('imag'+i).value = 0.0;
    }
    updateValue();
});
document.getElementById('pre3').addEventListener('click', () => {
    freq_type.value = 'custom';
    volume.value = 25;
    tone_attack.value = 10;
    tone_hold.value = 1;
    tone_decay.value = 30;
    tone_sustain.value = 80;
    tone_release.value = 110;
    let rArr = [0.03, 0.21, 0.0, 0.0, 0.0, 0.0, 0.0];
    let iArr = [1.0, 0.03, 0.48, 0.05, 0.11, 0.15, 0.23];
    for (let i=1; i<=custom_ax; i++) {
        document.getElementById('real'+i).value = rArr[i-1];
        document.getElementById('imag'+i).value = iArr[i-1];
    }
    updateValue();
});

document.addEventListener('keydown', function keyUp(e) {
    if (audioContext === null) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (e.repeat) {return;}
    if (e.code in keyMap) {
        let tone = sound(keyMap[e.code][0], keyMap[e.code][1])
        document.addEventListener('keyup', (re) => {
            if (e.code === re.code) {
                tone.gainNode.gain.setValueAtTime(tone.gainNode.gain.value, tone.audioContext.currentTime);
                tone.gainNode.gain.linearRampToValueAtTime(0.0, tone.audioContext.currentTime + (tone_release.value/1000));
                tone.oscillator.stop(tone.audioContext.currentTime + (tone_release.value/1000));
                removeEventListener('keyup', keyUp);
            }
        })
    }
})
