#!/usr/bin/env bash

set -e

if [[ 1 == 1 ]]; then

cp ${BUILD_PREFIX}/share/aclocal/pkg.m4 m4/pkg.m4
[[ -d release-tarball-src ]] && cp release-tarball-src/configure .
[[ -f configure ]] && cp -f configure configure.orig.1

./autogen.sh --skip-gnulib 

if [[ $(uname -o) == "Msys" ]] ; then
    export PREFIX="$LIBRARY_PREFIX_U"
    export PATH="$PATH_OVERRIDE"
    export BUILD=x86_64-pc-mingw64
    export HOST=x86_64-pc-mingw64

    # Setup needed for autoreconf. Keep am_version sync'ed with meta.yaml.

    am_version=1.15
    export ACLOCAL=aclocal-$am_version
    export AUTOMAKE=automake-$am_version

    # So, some autoconf checks depend on the C compiler name starting with
    # "cl" to detect that it's using MSVC. Inside `configure`, the CC variable
    # gets the path to the "compile" script prepended; this script translates
    # arguments. But the variable CXX does *not* get changed the same way, and
    # due to some flags added in gettext, the tests for a working C++ compiler
    # fail. So we have to manually specify that it should go through the
    # compile wrapper. Cf:
    # https://lists.gnu.org/archive/html/autoconf/2009-11/msg00016.html

    export CC="cl"
    export CXX="$(pwd)/build-aux/compile cl"
    export LD="link"
    export CPP="cl -nologo -E"
    export CXXCPP="cl -nologo -E"

    # Buuut we also need a custom wrapper for `cl -nologo -E` because the
    # invocation of the "windres"/"rc" tool can't handle preprocessor names
    # containing spaces. Windres also breaks if we don't use `--use-temp-file`
    # -- looks like the Cygwin popen() call might not work on Windows.

    export RC="windres --use-temp-file --preprocessor $RECIPE_DIR/msvcpp.sh"
    export WINDRES="windres --use-temp-file --preprocessor $RECIPE_DIR/msvcpp.sh"

    # We need to get the mingw stub libraries that let us link with system
    # DLLs. Stock gettext gets built on Windows so I'm not sure why it doesn't
    # have any needed Windows OS libraries specified anywhere, but it doesn't,
    # so we add them here too.

    export LDFLAGS="$LDFLAGS -L/mingw-w64/x86_64-w64-mingw32/lib -L$PREFIX/lib -ladvapi32"

    # /GL messes up Libtool's identification of how the linker works;
    # it parses dumpbin output and: https://stackoverflow.com/a/11850034/3760486

    export CFLAGS=$(echo " $CFLAGS " |sed -e "s, [-/]GL ,,")
    export CXXFLAGS=$(echo " $CXXFLAGS " |sed -e "s, [-/]GL ,,")

    autoreconf -vfi
else
    autoreconf -vfi
    automake --add-missing
fi

[[ -f configure ]] && cp -f configure configure.orig.2
autoreconf -vfi
[[ -f configure ]] && cp -f configure configure.orig.3
diff -urN configure.orig.1 configure | tee configure.diff
./configure --help | rg curses -C2 | tee configure-help-curses.txt
fi

bash -x ./configure  \
  --prefix=$PREFIX \
  --build=$BUILD  \
  --host=$HOST  \
  --with-libncurses-prefix=${PREFIX}  \
  --with-libtermcap-prefix=${PREFIX} 2>&1 | tee config-x.log
./configure  \
  --prefix=$PREFIX \
  --build=$BUILD  \
  --host=$HOST  \
  --with-libncurses-prefix=${PREFIX}  \
  --with-libtermcap-prefix=${PREFIX} 2>&1 | tee config-nox.log

make -j${CPU_COUNT} ${VERBOSE_AT} 2>&1 | tee compile.log
make install 2>&1 | tee install.log

# This overlaps with readline:
rm -rf ${PREFIX}/share/info/dir

# Reduced 0.20.2 package from 3924438 bytes (in 1916 files) to 3574052 bytes (in 306 files)
rm -rf ${PREFIX}/share/doc/gettext/examples

find $PREFIX -name '*.la' -delete
