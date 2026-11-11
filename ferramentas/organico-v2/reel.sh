#!/usr/bin/env bash
# Uso: bash reel.sh saida.mp4 id:segundos id:segundos ...  (artes em out/<id>.jpg)
set -e
out=$1; shift
X=0.4
ins=(); i=0; durs=()
for it in "$@"; do id=${it%%:*}; d=${it##*:}; ins+=(-loop 1 -framerate 30 -t "$d" -i "out/$id.jpg"); durs+=("$d"); i=$((i+1)); done
n=$i
f=""; for j in $(seq 0 $((n-1))); do f="$f[$j:v]scale=1080:1920,setsar=1,format=yuv420p,fps=30[v$j];"; done
prev="v0"; off=0
for j in $(seq 1 $((n-1))); do
  off=$(node -e "console.log((${off}+${durs[$((j-1))]}-${X}).toFixed(2))")
  f="$f[$prev][v$j]xfade=transition=fade:duration=$X:offset=$off[x$j];"; prev="x$j"
done
total=$(node -e "const d=[$(IFS=,; echo "${durs[*]}")];console.log((d.reduce((a,b)=>a+b,0)-${X}*(d.length-1)).toFixed(2))")
ffmpeg -loglevel error -y "${ins[@]}" -f lavfi -t "$total" -i anullsrc=channel_layout=stereo:sample_rate=44100 \
  -filter_complex "${f%;}" -map "[$prev]" -map "$n:a" -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -r 30 -c:a aac -b:a 64k -shortest -movflags +faststart "$out"
ffprobe -v error -show_entries format=duration,size -of compact "$out"
