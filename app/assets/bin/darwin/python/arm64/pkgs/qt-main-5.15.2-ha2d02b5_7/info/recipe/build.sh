set -exou

export NINJAFLAGS="-j3"

pushd qt

# Compile
# -------
chmod +x configure

# Clean config for dirty builds
# -----------------------------
rm -rf qt-build

mkdir -p qt-build
pushd qt-build

echo PREFIX=${PREFIX}
echo BUILD_PREFIX=${BUILD_PREFIX}
USED_BUILD_PREFIX=${BUILD_PREFIX:-${PREFIX}}
echo USED_BUILD_PREFIX=${BUILD_PREFIX}

MAKE_JOBS=$CPU_COUNT

# For QDoc
export LLVM_INSTALL_DIR=${PREFIX}

# Remove the full path from CXX etc. If we don't do this
# then the full path at build time gets put into
# mkspecs/qmodule.pri and qmake attempts to use this.
export AR=$(basename ${AR})
export RANLIB=$(basename ${RANLIB})
export STRIP=$(basename ${STRIP})
export OBJDUMP=$(basename ${OBJDUMP})
export CC=$(basename ${CC})
export AS=$(basename ${AS})
export CXX=$(basename ${CXX})
export OBJC=$(basename ${OBJC})
export OBJCXX=$(basename ${OBJCXX})
export CC_FOR_BUILD=$(basename ${CC_FOR_BUILD})
export CXX_FOR_BUILD=$(basename ${CXX_FOR_BUILD})
export OBJC_FOR_BUILD=$(basename ${OBJC_FOR_BUILD})

# Let Qt set its own flags and vars
for x in OSX_ARCH CFLAGS CXXFLAGS LDFLAGS
do
    unset $x
done

# You can use this to cut down on the number of modules built. Of course the Qt package will not be of
# much use, but it is useful if you are iterating on e.g. figuring out compiler flags to reduce the
# size of the libraries.
MINIMAL_BUILD=no

# Remove protobuf which is pulled in indirectly
# rm -rf $PREFIX/include/google/protobuf
# rm -rf $PREFIX/bin/protoc

if [[ $(uname) == "Linux" ]]; then
    ln -s ${GXX} g++ || true
    ln -s ${GCC} gcc || true
    # Needed for -ltcg, it we merge build and host again, change to ${PREFIX}
    ln -s ${USED_BUILD_PREFIX}/bin/${HOST}-gcc-ar gcc-ar || true

    export LD=${GXX}
    export CC=${GCC}
    export CXX=${GXX}
    export PKG_CONFIG_PATH="$PKG_CONFIG_PATH:/usr/lib64/pkgconfig/"
    chmod +x g++ gcc gcc-ar
    export PATH=${PWD}:${PATH}

    if [ ${target_platform} == "linux-64" ]; then
      # make sure we link not libxbc_aux, libcbx_atom, nor libcbx_event
      echo "${BUILD_PREFIX}/${HOST} ..."
      cp -f ${BUILD_PREFIX}/${HOST}/sysroot/usr/lib64/libxcb-aux.so.0.0.0 ${PREFIX}/lib/libxcb-aux.so.0
      cp -f ${BUILD_PREFIX}/${HOST}/sysroot/usr/lib64/libxcb-atom.so.1.0.0 ${PREFIX}/lib/libxcb-atom.so.1
      cp -f ${BUILD_PREFIX}/${HOST}/sysroot/usr/lib64/libxcb-event.so.1.0.0 ${PREFIX}/lib/libxcb-event.so.1
    fi

    declare -a SKIPS
    if [[ ${MINIMAL_BUILD} == yes ]]; then
      SKIPS+=(-skip); SKIPS+=(qtwebsockets)
      SKIPS+=(-skip); SKIPS+=(qtwebchannel)
      SKIPS+=(-skip); SKIPS+=(qtsvg)
      SKIPS+=(-skip); SKIPS+=(qtsensors)
      SKIPS+=(-skip); SKIPS+=(qtcanvas3d)
      SKIPS+=(-skip); SKIPS+=(qtconnectivity)
      SKIPS+=(-skip); SKIPS+=(declarative)
      SKIPS+=(-skip); SKIPS+=(multimedia)
      SKIPS+=(-skip); SKIPS+=(qttools)
      SKIPS+=(-skip); SKIPS+=(qtlocation)
      SKIPS+=(-skip); SKIPS+=(qt3d)
    fi
    CONFIG_EXTRA_DEFINES=
    if [ ${target_platform} == "linux-aarch64" ] || [ ${target_platform} == "linux-ppc64le" ]; then
        # The -reduce-relations option doesn't seem to pass for aarch64 and ppc64le
        REDUCE_RELOCATIONS=
    else
        REDUCE_RELOCATIONS=-reduce-relocations
        CONFIG_EXTRA_DEFINES="-D _X_INLINE=inline -D XK_dead_currency=0xfe6f -D _FORTIFY_SOURCE=2 -D FC_WEIGHT_EXTRABLACK=215 -D FC_WEIGHT_ULTRABLACK=FC_WEIGHT_EXTRABLACK -D GLX_GLXEXT_PROTOTYPES"
    fi

    ../configure -prefix ${PREFIX} \
                -libdir ${PREFIX}/lib \
                -bindir ${PREFIX}/bin \
                -headerdir ${PREFIX}/include/qt \
                -archdatadir ${PREFIX} \
                -datadir ${PREFIX} \
                "${CONFIG_EXTRA_DEFINES}" \
                -I ${PREFIX}/include \
                -L ${PREFIX}/lib \
                -L ${BUILD_PREFIX}/${HOST}/sysroot/usr/lib64 \
                -L ${BUILD_PREFIX}/${HOST}/sysroot/usr/lib \
                QMAKE_LFLAGS+="-Wl,-rpath,$PREFIX/lib -Wl,-rpath-link,$PREFIX/lib -L$PREFIX/lib" \
                -release \
                -opensource \
                -confirm-license \
                -shared \
                -nomake examples \
                -nomake tests \
                -verbose \
                -skip wayland \
                -skip qtwebengine \
                -gstreamer 1.0 \
                -system-libjpeg \
                -system-libpng \
                -system-zlib \
                -system-sqlite \
                -plugin-sql-sqlite \
                -plugin-sql-mysql \
                -plugin-sql-psql \
                -qt-pcre \
                -xkbcommon \
                -xcb -xcb-xlib \
                -dbus \
                -no-linuxfb \
                -no-libudev \
                -no-avx \
                -no-avx2 \
                -optimize-size \
                ${REDUCE_RELOCATIONS} \
                -cups \
                -openssl-linked \
                -openssl \
                -Wno-expansion-to-defined \
                -D _X_INLINE=inline \
                -D XK_dead_currency=0xfe6f \
                -D _FORTIFY_SOURCE=2 \
                -D XK_ISO_Level5_Lock=0xfe13 \
                -D FC_WEIGHT_EXTRABLACK=215 \
                -D FC_WEIGHT_ULTRABLACK=FC_WEIGHT_EXTRABLACK \
                -D GLX_GLXEXT_PROTOTYPES \
                "${SKIPS[@]+"${SKIPS[@]}"}"

# ltcg bloats a test tar.bz2 from 24524263 to 43257121 (built with the following skips)
#                -ltcg \
#                --disable-new-dtags \

  make -j${MAKE_JOBS}
  make install
fi

if [[ ${HOST} =~ .*darwin.* ]]; then
    # Avoid Xcode
    cp "${RECIPE_DIR}"/xcrun .
    cp "${RECIPE_DIR}"/xcodebuild .
    # Some test runs 'clang -v', but I do not want to add it as a requirement just for that.
    # ln -s "${CXX}" ${HOST}-clang || true
    # For ltcg we cannot use libtool (or at least not the macOS 10.9 system one) due to lack of LLVM bitcode support.
    #  ln -s "${LIBTOOL}" libtool || true
    # Just in-case our strip is better than the system one.
    # ln -s "${STRIP}" strip || true
    # chmod +x ${HOST}-clang libtool strip
    # Qt passes clang flags to LD (e.g. -stdlib=c++)
    export LD=${CXX}
    export AS=${CXX}
    PATH=${PWD}:${PATH}

    PLATFORM="-sdk macosx${MACOSX_SDK_VERSION:-10.14}"
    EXTRA_FLAGS="-gstreamer 1.0"
    if [[ "${target_platform}" == "osx-arm64" ]]; then
      PLATFORM="-device-option QMAKE_APPLE_DEVICE_ARCHS=arm64 -sdk macosx${MACOSX_SDK_VERSION:-11.0}"
      EXTRA_FLAGS=""
    fi

    # Make sure config.guess is up to date, if required
    list_config_to_patch=$(find . -name config.guess | sed -E 's/config.guess//')
    for config_folder in $list_config_to_patch; do
        echo "copying config to $config_folder ...\n"
        cp -v $BUILD_PREFIX/share/libtool/build-aux/config.* $config_folder
    done
    # create a matching 'strip' tool in prefix/bin
    mkdir -p $PREFIX/bin
    where=$(which "llvm-strip" 2>/dev/null || true)
    if [ -n "${where}" ]; then
        printf "#!/bin/bash\nexec '${where}' \"\${@}\"\n" >"${PREFIX}/bin/strip"
        chmod 700 "${PREFIX}/bin/strip"
    fi
    if [ ! -f "${BUILD_PREFIX}/bin/clang++" ]; then
    if [ -n "${CXX}" ]; then
        printf "#!/bin/bash\nexec '${CXX}' \"\${@}\"\n" >"${BUILD_PREFIX}/bin/clang++"
        chmod 700 "${BUILD_PREFIX}/bin/clang++"
    fi
    fi
    if [ ! -f "${BUILD_PREFIX}/bin/clang" ]; then
    if [ -n "${CC}" ]; then
        printf "#!/bin/bash\nexec '${CC}' \"\${@}\"\n" >"${BUILD_PREFIX}/bin/clang"
        chmod 700 "${BUILD_PREFIX}/bin/clang"
    fi
    fi

    ../configure -prefix ${PREFIX} \
                -libdir ${PREFIX}/lib \
                -bindir ${PREFIX}/bin \
                -headerdir ${PREFIX}/include/qt \
                -archdatadir ${PREFIX} \
                -datadir ${PREFIX} \
                $PLATFORM \
                -I ${PREFIX}/include \
                -I ${PREFIX}/include/mysql \
                -I ${PREFIX}/include/gstreamer-1.0 \
                -I ${PREFIX}/include/glib-2.0 \
                -I ${PREFIX}/lib/glib-2.0/include \
                -L ${PREFIX}/lib \
                -R $PREFIX/lib \
                -release \
                -opensource \
                -confirm-license \
                -shared \
                -nomake examples \
                -nomake tests \
                -verbose \
                -skip wayland \
                -skip qtwebengine \
                $EXTRA_FLAGS \
                -system-libjpeg \
                -system-libpng \
                -system-zlib \
                -system-sqlite \
                -plugin-sql-sqlite \
                -plugin-sql-psql \
                -qt-freetype \
                -qt-pcre \
                -no-framework \
                -dbus \
                -no-mtdev \
                -no-harfbuzz \
                -no-libudev \
                -no-egl \
                -no-openssl \
                -optimize-size

# For quicker turnaround when e.g. checking compilers optimizations
#                -skip qtwebsockets -skip qtwebchannel -skip qtwebengine -skip qtsvg -skip qtsensors -skip qtcanvas3d -skip qtconnectivity -skip declarative -skip multimedia -skip qttools -skip qtlocation -skip qt3d
# lto causes an increase in final tar.bz2 size of about 4% (tested with the above -skip options though, not the whole thing)
#                -ltcg \

    ####
    make -j${MAKE_JOBS} || (echo 'initial make files' && exit 1)
    make install -j${MAKE_JOBS}

    # Avoid Xcode (2)
    mkdir -p "${PREFIX}"/bin/xc-avoidance || true
    cp "${RECIPE_DIR}"/xcrun "${PREFIX}"/bin/xc-avoidance/
    cp "${RECIPE_DIR}"/xcodebuild "${PREFIX}"/bin/xc-avoidance/
fi

popd

# Post build setup
# ----------------
# Remove static libraries that are not part of the Qt SDK.
pushd "${PREFIX}"/lib > /dev/null
    find . -name "*.a" -and -not -name "libQt*" -exec rm -f {} \;
popd > /dev/null

# Add qt.conf file to the package to make it fully relocatable
cp "${RECIPE_DIR}"/qt.conf "${PREFIX}"/bin/

if [[ ${HOST} =~ .*darwin.* ]]; then
  pushd ${PREFIX}
    # We built Qt itself with SDK 10.10, but we shouldn't
    # force users to also build their Qt apps with SDK 10.10
    # https://bugreports.qt.io/browse/QTBUG-41238
    sed -i '' 's/macosx.*$/macosx/g' mkspecs/qdevice.pri
    # We may want to replace these with \$\${QMAKE_MAC_SDK_PATH}/ instead?
    sed -i '' "s|${CONDA_BUILD_SYSROOT}/|/|g" mkspecs/modules/*.pri
    CMAKE_FILES=$(find lib/cmake -name "Qt*.cmake")
    for CMAKE_FILE in ${CMAKE_FILES}; do
      sed -i '' "s|${CONDA_BUILD_SYSROOT}/|\${CMAKE_OSX_SYSROOT}/|g" ${CMAKE_FILE}
    done
  popd
fi

rm -rf "${PREFIX}/bin/strip"

LICENSE_DIR="$PREFIX/share/qt/3rd_party_licenses"
for f in $(find * -iname "*LICENSE*" -or -iname "*COPYING*" -or -iname "*COPYRIGHT*" -or -iname "NOTICE"); do
  mkdir -p "$LICENSE_DIR/$(dirname $f)"
  cp -rf $f "$LICENSE_DIR/$f"
  rm -rf "$LICENSE_DIR/qtbase/examples/widgets/dialogs/licensewizard"
  rm -rf "$LICENSE_DIR/qtwebengine/src/3rdparty/chromium/tools/checklicenses"
  rm -rf "$LICENSE_DIR/qtwebengine/src/3rdparty/chromium/third_party/skia/tools/copyright"
done

