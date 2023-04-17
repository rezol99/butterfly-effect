#!/bin/bash

# Get an updated config.sub and config.guess
cp -r ${BUILD_PREFIX}/share/libtool/build-aux/config.* .

# See: https://gitlab.com/gnutls/gnutls/issues/665
export CPPFLAGS="${CPPFLAGS//-DNDEBUG/}"
export CFLAGS="${CFLAGS//-DNDEBUG/}"

declare -a configure_opts

# What to build
configure_opts+=(--enable-shared)
configure_opts+=(--disable-static)
configure_opts+=(--disable-documentation)

# Building with conda-forge gmp causes a strange segfault.
# Using mini-gmp seems to solve the issue and gnutls still works.
#configure_opts+=(--enable-mini-gmp)

if [[ "$target_platform" == "osx-arm64" ]]; then
  configure_opts+=(--disable-assembler)
fi

# --disable-openssl: do not include OpenSSL glue in demo program; especially
# important on macOS to avoid picking up older versions in Apple's SDK.
configure_opts+=(--disable-openssl)

./configure --prefix="${PREFIX}"              \
            --libdir="${PREFIX}/lib/"         \
            --with-lib-path="${PREFIX}/lib/"  \
            ${configure_opts[@]}              \
             || { cat config.log; exit 1; }
make -j${CPU_COUNT} ${VERBOSE_AT}
make install ${VERBOSE_AT}
make check
