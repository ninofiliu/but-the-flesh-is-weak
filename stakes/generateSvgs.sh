#!/bin/sh
for file in ./out/*.png
do
  if [ -f $file.bmp ]; then continue; fi
done
