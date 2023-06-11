#!/usr/bin/env bash
# Get an updated config.sub and config.guess
cp $BUILD_PREFIX/share/gnuconfig/config.* ./nspr/build/autoconf

export HOST_CC=$CC_FOR_BUILD

cd nspr

sed -ri 's#^(RELEASE_BINS =).*#\1#' pr/src/misc/Makefile.in
sed -i 's#$(LIBRARY) ##'            config/rules.mk

./configure --prefix="${PREFIX}" --enable-64bit --disable-debug --enable-optimize --with-pthreads --with-mozilla || (cat config.log; false)

make -j $CPU_COUNT
make install