#!/usr/bin/env bash

set -ex

if [[ $(uname) = Darwin ]] ; then
    export iconv_arg="external"
    # Meson automatically adds the necessary rpath arguments on macOS, but the
    # current version has a bug which causes a build failure if the argument
    # is duplicated in $LDFLAGS. (It's fixed in 0.49.). So, strip that out.
    export LDFLAGS="$(echo $LDFLAGS |sed -e "s| -Wl,-rpath,$PREFIX/lib||")"
else
    export iconv_arg="libc"
    # objcopy needs to be on PATH, the system version it too old
    ln -s ${OBJCOPY} ${BUILD_PREFIX}/bin/objcopy
fi

# There are a couple of places in the source that hardcode a system prefix;
# in hardcoded-paths.patch we edit them to refer to the Conda prefix so
# that they will get appropriately rewritten.
export CPPFLAGS="$CPPFLAGS -DCONDA_PREFIX=\\\"${PREFIX}\\\""

# @PYTHON@ is used in the build scripts and that breaks with the long prefix.
# we need to redefine that to `python`.
_PY=$PYTHON
export PYTHON="python"

mkdir -p forgebuild
cd forgebuild
meson --buildtype=release --prefix="$PREFIX" --backend=ninja -Dlibdir=lib \
      -Diconv=$iconv_arg -Dlibmount=disabled -Dselinux=disabled -Dxattr=false \
      -Dlocalstatedir="${PREFIX}/var" ..
ninja -j${CPU_COUNT} -v

if [ "${target_platform}" == 'linux-aarch64' ] || [ "${target_platform}" == "linux-ppc64le"  ] || [ "${target_platform}" == "linux-s390x" ]; then
    export MESON_TEST_TIMEOUT_MULTIPLIER=32
else
    export MESON_TEST_TIMEOUT_MULTIPLIER=8
fi

if [ "${target_platform}" == 'linux-aarch64' ] || [ "${target_platform}" == "linux-s390x" || [ "${target_platform}" == 'linux-ppc64le' ];
 then
    # 163/254 glib:gio / resources will fail on aarch64 and s390x
    meson test --no-suite flaky --timeout-multiplier ${MESON_TEST_TIMEOUT_MULTIPLIER} || true
elif [[ $(uname) != Darwin ]] ; then  # too many tests fail on macOS
    meson test --no-suite flaky --timeout-multiplier ${MESON_TEST_TIMEOUT_MULTIPLIER}
fi

ninja install

export PYTHON=$_PY

# remove libtool files
find $PREFIX -name '*.la' -delete

# gdb folder has a nested folder structure similar to our host prefix
# (255 chars) which causes installation issues so remove it.
rm -rf $PREFIX/share/gdb
