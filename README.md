# weB-music
ブラウザで動作するシンセ的な何かを作りたかった

Web Audio API で波形を作り，再生する．
基準周波数A4は440Hz，他の音は $440 \times 2^{\frac{x}{12}}$ で計算している．
エンベロープの調節では指数関数的に音量が変化し，指定した時間でおおよそ63.2%になる．(指定した時間*2で86.5%，*3で95.0%，*5で99.3%)  

-----

デモ Preset1 (音が出ます)

<div><video controls src="https://github.com/Fukuda-B/weB-music/assets/60131202/edeb82af-1fd5-4638-8855-77ffe3358250" muted="false"></video></div>

デモ2 Custom (音が出ます)

<div><video controls src="https://github.com/Fukuda-B/weB-music/assets/60131202/e83ef22d-b8fc-4de6-b009-b8d5c4c2518b" muted="false"></video></div>

デモのために少しタイピングの練習をしました．
