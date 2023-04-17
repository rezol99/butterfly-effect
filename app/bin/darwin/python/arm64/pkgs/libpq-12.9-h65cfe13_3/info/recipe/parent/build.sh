#!/bin/bash

# Get an updated config.sub and config.guess
cp -r ${BUILD_PREFIX}/share/libtool/build-aux/config.* ./config

# avoid absolute-paths in compilers
# ... this is required that pg_config provides more sane
# configuration in different environment
export CC=$(basename "$CC")
export CXX=$(basename "$CXX")
export FC=$(basename "$FC")

./configure \
    --prefix=$PREFIX \
    --with-readline \
    --with-libraries=$PREFIX/lib \
    --with-includes=$PREFIX/include \
    --with-openssl \
    --with-gssapi  \
    PG_SYSROOT="undefined"

make -j $CPU_COUNT
# make check # Failing with 'initdb: cannot be run as root'.
