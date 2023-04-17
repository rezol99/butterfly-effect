#!/bin/bash

# Get an updated config.sub and config.guess
cp -r ${BUILD_PREFIX}/share/libtool/build-aux/config.* .

OPTS=""
if [[ $(uname) == Darwin ]]; then
  OPTS="--disable-openmp"
fi

./configure --prefix=${PREFIX}  \
            --host=${HOST}      \
            $OPTS

make -j${CPU_COUNT} ${VERBOSE_AT}
make check
make install
