# weB-music
ブラウザで動作するシンセ的な何かを作りたかった

Web Audio API で波形を作り，再生する．  
基準周波数A4は440Hz，他の音は $440 \times 2^{\frac{x}{12}}$ で計算している．  
エンベロープの調節では，指数関数的に音量が変化し，指定した時間でおおよそ63.2%になる．(指定した時間*2で86.5%，*3で95.0%，*5で99.3%になる．)  

-----
デモ Preset1 (音が出ます)

<div><video controls src="./src/2023-08-17 16-44-41_c.mp4" muted="false"></video></div>

デモ2 Custom (音が出ます)

<div><video controls src="./src/2023-08-17 17-12-56_c.mp4" muted="false"></video></div>
