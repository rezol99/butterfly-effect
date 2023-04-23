#!/bin/bash

set -e

ls
cd test/qt
ln -s ${GXX} g++
cp ../../xcrun .
cp ../../xcodebuild .
export PATH=${PWD}:${PATH}
qmake hello.pro
make
# we might have missing shared objects on aarch64
./hello || true
# Only test that this builds
make clean
