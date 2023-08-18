# weB-music
ブラウザで動作するシンセ的な何かを作りたかった

Web Audio API で波形を作り，再生する．
基準周波数A4は440Hz，他の音は $440 \times 2^{\frac{x}{12}}$ で計算している（平均律）．
エンベロープの調節では指数関数的に音量が変化し，指定した時間でおおよそ63.2%になる．（指定した時間*2で86.5%，*3で95.0%，*5で99.3%）  
<!-- Customでは（正規化された）波形 $\tilde{x}(n) = \sum^{L-1}_{k=1}(a[k]\cos\frac{2\pi kn}{N} + b[k]\sin\frac{2\pi kn}{N})$ により音を作る機能です．このときの $a$（Real）, $b$（Imag）がスライダーで調節できる係数となっています．   -->

-----

デモ Preset1 (音が出ます)

<div><video controls src="https://github.com/Fukuda-B/weB-music/assets/60131202/a4c9f15f-f42e-4acc-93b6-5523a1e90281" muted="false"></video></div>

デモ2 Custom (音が出ます)

<div><video controls src="https://github.com/Fukuda-B/weB-music/assets/60131202/11147082-0c74-46b0-8a80-2dd7e8d1ccb9" muted="false"></video></div>

演奏にはまだ練習が必要..
