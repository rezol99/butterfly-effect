#!/bin/bash

set -ex

# ppc64le cdt need to be rebuilt with files in powerpc64le-conda-linux-gnu instead of powerpc64le-conda_cos7-linux-gnu. In the meantime:
if [ "$(uname -m)" = "ppc64le" ]; then
  cp --force --archive --update --link $BUILD_PREFIX/powerpc64le-conda_cos7-linux-gnu/. $BUILD_PREFIX/powerpc64le-conda-linux-gnu
fi

# Cf. https://github.com/conda-forge/staged-recipes/issues/673, we're in the
# process of excising Libtool files from our packages. Existing ones can break
# the build while this happens.
find $PREFIX -name '*.la' -delete

# necessary to ensure the gobject-introspection-1.0 pkg-config file gets found
# meson needs this to determine where the g-ir-scanner script is located
export PKG_CONFIG_PATH=${PKG_CONFIG_PATH:-}:${PREFIX}/lib/pkgconfig:$BUILD_PREFIX/$BUILD/sysroot/usr/lib64/pkgconfig:$BUILD_PREFIX/$BUILD/sysroot/usr/share/pkgconfig
export PKG_CONFIG=$PREFIX/bin/pkg-config
declare -a meson_extra_opts

# conda-forge disables introspection when cross-compiling, but that isn't a
# concern for defaults.
meson_extra_opts=(-Dintrospection=enabled)

case "${target_platform}" in
    linux-*)
        # Needed for libxcb when using CDT X11 packages
        #export LDFLAGS="${LDFLAGS} -Wl,-rpath-link,${PREFIX}/lib"
        ;;
    osx-*)
        meson_extra_opts+=(-Dcoretext=auto)
        ;;
esac

# see https://github.com/harfbuzz/harfbuzz/blob/4.3.0/meson_options.txt
meson setup builddir \
    --buildtype=release \
    --default-library=both \
    --prefix="${PREFIX}" \
    --wrap-mode=nofallback \
    --libdir="${PREFIX}/lib" \
    --includedir=${PREFIX}/include \
    --pkg-config-path="${PKG_CONFIG_PATH}" \
    -Dglib=enabled \
    -Dgobject=enabled \
    -Dcairo=enabled \
    -Dchafa=disabled \
    -Dicu=enabled \
    -Dgraphite=enabled \
    -Dgraphite2=enabled \
    -Dfreetype=enabled \
    -Dgdi=disabled \
    -Ddirectwrite=disabled \
    -Ddocs=disabled \
    -Dtests=enabled \
    ${meson_extra_opts[@]}

ninja -v -C builddir -j ${CPU_COUNT}
ninja -v -C builddir test
ninja -C builddir install -j ${CPU_COUNT}

pushd "${PREFIX}"
  rm -rf share/gtk-doc
popd
