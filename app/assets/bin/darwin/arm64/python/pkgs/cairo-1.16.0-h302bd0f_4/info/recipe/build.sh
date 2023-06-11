#!/bin/bash
set -u
declare -a CONFIGURE_OTHER_ARGS

# Get an updated config.sub and config.guess
cp -r ${BUILD_PREFIX}/share/libtool/build-aux/config.* ./build

mkdir -p $SRC_DIR/cyclictool
echo "#!/bin/bash" >$SRC_DIR/cyclictool/gtkdocize
echo "" >>$SRC_DIR/cyclictool/gtkdocize
echo "exit 0" >>$SRC_DIR/cyclictool/gtkdocize
chmod +x $SRC_DIR/cyclictool/gtkdocize

export PATH=$SRC_DIR/cyclictool:$PATH

if [[ ${target_platform} == osx-* ]]; then
  rm -rf "${PREFIX}"/lib/libuuid.la "${PREFIX}"/lib/libuuid.a
  CONFIGURE_OTHER_ARGS=(--without-x)
else
  CONFIGURE_OTHER_ARGS=(--with-x)
  CONFIGURE_OTHER_ARGS+=(--enable-xcb)

  # Needed to find .pc files from CDTs
  : ${CONDA_BUILD_SYSROOT:=`"$CC" -print-sysroot`}
  export PKG_CONFIG_PATH="${CONDA_BUILD_SYSROOT}/usr/lib64/pkgconfig"
  if [[ ${target_platform} == linux-ppc64le ]]; then
    # there are issues with CDTs and there HOST name ...
    pushd "${BUILD_PREFIX}"
    cp -Rn powerpc64le-conda_cos7-linux-gnu/* powerpc64le-conda-linux-gnu/.
    popd
    export CFLAGS="${CFLAGS} -Wno-enum-conversion"
  fi
fi
if [ $(uname -m) == x86_64 ] || [ $(uname -m) == aarch64 ]; then
    export ax_cv_c_float_words_bigendian="no"
fi
bash autogen.sh

find $PREFIX -name '*.la' -delete
./configure \
    --prefix="${PREFIX}" \
    --enable-warnings \
    --enable-ft \
    --enable-ps \
    --enable-pdf \
    --enable-svg \
    --disable-gtk-doc \
    ${CONFIGURE_OTHER_ARGS[@]}

make -j${CPU_COUNT}
# FAIL: check-link on OS X
# Hangs for > 10 minutes on Linux
#make check -j${CPU_COUNT}
make install -j${CPU_COUNT}
find $PREFIX -name '*.la' -delete
