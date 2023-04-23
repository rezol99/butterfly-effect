#!/bin/bash

# Get an updated config.sub and config.guess
cp $BUILD_PREFIX/share/gnuconfig/config.* .

# Avoid overlinking. zlib and liblzma are private to libxml2
find "${PREFIX}/lib" -name "*.la" -delete -print
sed -i.bak -e 's/-llzma //g' -e 's/-lz //g' $PREFIX/bin/xml2-config

# It looks like an missing symbol of libxml2 on osx-arm64
if [[ ${target_platform} =~ .*arm64.* ]]; then
    LDFLAGS="${LDFLAGS} -lxml2"
fi

./configure --prefix=$PREFIX --with-libxml-prefix=$PREFIX --without-python

make -j${CPU_COUNT} ${VERBOSE_AT}
make check
make install
