#!/bin/bash

# Get an updated config.sub and config.guess
cp -r ${BUILD_PREFIX}/share/libtool/build-aux/config.* .

# remove libtool files
find $PREFIX -name '*.la' -delete

./configure --prefix=$PREFIX \
	    --disable-dependency-tracking \
	    --disable-debug \
	    --enable-shared \
	    --enable-static \
	    --enable-nasm

make -j$CPU_COUNT
make install -j$CPU_COUNT

# test
$PREFIX/bin/lame --genre-list testcase.mp3

# remove libtool files
find $PREFIX -name '*.la' -delete
