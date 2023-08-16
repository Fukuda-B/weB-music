// https://developer.mozilla.org/ja/docs/Web/API/Web_Audio_API

let keyArr = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B']
const sound = function (key, oct) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();

    let freqType = document.getElementById('freq_type').value;
    oscillator.type = freqType;

    let frequency = parseInt(440*Math.pow(2,((keyArr.indexOf(key)-9)/12)+(oct-4)));
    oscillator.frequency.value = frequency;

    // let gainNode = audioContext.createGain();
    // gainNode.gain.setValueAtTime(0, play.count);
    // gainNode.gain.linearRampToValueAtTime(1.0, play.count + 0.01);
    // gainNode.gain.linearRampToValueAtTime(0.7, play.count + 0.20);
    // gainNode.gain.linearRampToValueAtTime(0.4, play.count + 0.40);
    // gainNode.gain.linearRampToValueAtTime(0.0, play.count + 0.80);

    // oscillator.connect(gainNode);
    // gainNode.connect(audioContext.destination);
    oscillator.start();
    // oscillator.start(play.count || 0);
    // return play;
}

document.getElementById('start').addEventListener('click', () => {
    sound('A', 4);
})
