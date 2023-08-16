// https://developer.mozilla.org/ja/docs/Web/API/Web_Audio_API
// https://qiita.com/tomoya_ozawa/items/bfd09b436075af916833
// https://sleepygamersmemo.blogspot.com/2020/02/virtual-piano-memo.html

let keyArr = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
let volume = document.getElementById('volume');
let tone_length = document.getElementById('tone_length');

const sound = function (key, oct) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();

    let freqType = document.getElementById('freq_type').value;
    oscillator.type = freqType;

    let frequency = 440*Math.pow(2,((keyArr.indexOf(key)-9)/12)+(oct-4));
    oscillator.frequency.value = frequency;
    console.log(freqType+' '+frequency+'Hz');

    let gainNode = audioContext.createGain();
    let gainValue = document.getElementById('volume').value;
    gainNode.gain.setValueAtTime(gainValue/100, audioContext.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start = oscillator.start || oscillator.noteOn;
    oscillator.start();
    // oscillator.start(play.count || 0);
    // return play;

    setTimeout(() => {
        // プツプツ音がするので，ちょっと伸ばす
        gainNode.gain.setValueAtTime(gainNode.gain.value, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.0, audioContext.currentTime + 0.4);
    }, tone_length.value);
    setTimeout(() => {
        oscillator.stop();
    }, tone_length.value+400);
}

// 読み込み時
window.addEventListener('load', () => {
    document.getElementById('current_volume').innerText = volume.value;
    document.getElementById('current_tone_length').innerText = tone_length.value;
});

volume.addEventListener('input', () => {
    document.getElementById('current_volume').innerText = volume.value;
});

tone_length.addEventListener('input', () => {
    document.getElementById('current_tone_length').innerText = tone_length.value;
});

/*
    キー配置は下と同じにしてある
    https://mike3.net/piano/1-piano.html

    こっちに合わせようか悩んだが
    https://onlinepiano.app/ja/#
*/
let keyMap = {
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
window.addEventListener('keydown', (e) => {
    if (e.repeat) {return;}
    if (e.code in keyMap) {
        sound(keyMap[e.code][0], keyMap[e.code][1])
    }
})
