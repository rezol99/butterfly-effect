#!/bin/bash
set -xe

# Get an updated config.sub and config.guess
cp -r ${BUILD_PREFIX}/share/libtool/build-aux/config.* .

mkdir -vp ${PREFIX}/bin

# Set the assembler to `nasm`
if [[ ${target_platform} == "linux-64" || ${target_platform} == "osx-64" ]]; then
    export AS="${BUILD_PREFIX}/bin/nasm"
elif [[ "${target_platform}" == *-aarch64 || "${target_platform}" == *-arm64 ]]; then
    unset AS
fi

chmod +x configure
./configure \
        --enable-pic \
        --enable-shared \
        --enable-static \
        --prefix=${PREFIX}
make -j${CPU_COUNT}
make install
