#!/bin/bash

# unset the SUBDIR variable since it changes the behavior of make here
unset SUBDIR

USE_NONFREE=no

declare -a _CONFIG_OPTS=()

# We do not care what the defaults are as they could change. Be explicit
# about every flag.
if [[ ${USE_NONFREE} == yes ]]; then
  _CONFIG_OPTS+=("--enable-nonfree")
  _CONFIG_OPTS+=("--disable-gpl")
  _CONFIG_OPTS+=("--disable-gnutls")
  _CONFIG_OPTS+=("--enable-openssl")
  # The Cisco GPL-compliant wrapper (you need to get your own binaries for this)
  _CONFIG_OPTS+=("--enable-libopenh264")
  # GPL-3.0
  _CONFIG_OPTS+=("--enable-libx264")
else
  _CONFIG_OPTS+=("--disable-nonfree")
  _CONFIG_OPTS+=("--enable-gpl")
  _CONFIG_OPTS+=("--enable-gnutls")
  # OpenSSL 3 will be Apache-licensed so we can revisit this later:
  # https://github.com/openssl/openssl/commit/151333164ece49fdba3fe5c4bbdc3333cd9ae66d
  _CONFIG_OPTS+=("--disable-openssl")
  # The Cisco GPL-compliant wrapper (you need to get your own binaries for this)
  _CONFIG_OPTS+=("--enable-libopenh264")
  # GPL-3.0
  _CONFIG_OPTS+=("--enable-libx264")
fi

./configure \
        --prefix="${PREFIX}" \
        --cc=${CC} \
        --disable-doc \
        --enable-avresample \
        --enable-gmp \
        --enable-hardcoded-tables \
        --enable-libfreetype \
        --enable-libvpx \
        --enable-pthreads \
        --enable-libopus \
        --enable-postproc \
        --enable-pic \
        --enable-pthreads \
        --enable-shared \
        --enable-static \
        --enable-version3 \
        --enable-zlib \
      	--enable-libmp3lame \
        "${_CONFIG_OPTS[@]}"

make -j${CPU_COUNT} ${VERBOSE_AT}
make install -j${CPU_COUNT} ${VERBOSE_AT}
