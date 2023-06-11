#!/bin/sh
set -e
mkdir build
cd build

cmake -LAH -GNinja ..                            \
    -DCMAKE_INSTALL_PREFIX=${PREFIX}             \
    -DCMAKE_BUILD_TYPE=Release

cmake --build .

cmake --install .

# Build and run some basic tests
cmake  --build .  --target basicstuff
ctest -R basicstuff*
