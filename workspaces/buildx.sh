#!/bin/bash
OFF='\033[0m'       # Text Reset
GREEN='\033[0;32m'  # GREEN
BLUE='\033[0;34m'   # BLUE
BGREEN='\033[1;32m' # GREEN

BANNER="$GREEN✨ Stardust$OFF:"

images=("chromium" "debian")
x64Only=("pinball")

for t in ${images[@]}; do
  printf "$BANNER$BGREEN Building$OFF $BLUE$t$OFF\n"
  if [[ " ${x64Only[@]} " =~ " ${t} " ]]; then
    docker buildx build . -f $t/Dockerfile --quiet --push --platform linux/amd64 --tag ghcr.io/spaceness/$t
    continue
  fi
  docker buildx build . -f $t/Dockerfile --quiet --push --platform linux/amd64,linux/arm64 --tag ghcr.io/spaceness/$t
done
