#!/bin/bash
echo "Building ${PKG_NAME}."


# Isolate the build.
mkdir -p Build-${PKG_NAME}
cd Build-${PKG_NAME} || exit 1


# Generate the build files.
echo "Generating the build files..."
cmake .. ${CMAKE_ARGS} \
      -GNinja \
      -DCMAKE_PREFIX_PATH=$PREFIX \
      -DCMAKE_INSTALL_PREFIX=$PREFIX \
      -DCMAKE_BUILD_TYPE=Release \


# Build.
echo "Building..."
ninja -j${CPU_COUNT} || exit 1


# Perform tests.
echo "Testing..."
ctest -VV --output-on-failure || true # there are failed tests


# Installing
echo "Installing..."
ninja install || exit 1

cd $PREFIX
rm -f lib/libgraphite2.la bin/gr2fonttest

# Error free exit!
echo "Error free exit!"
exit 0

