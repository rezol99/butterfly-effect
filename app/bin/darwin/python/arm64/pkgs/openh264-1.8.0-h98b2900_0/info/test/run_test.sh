

set -ex



h264enc -h
test -f $PREFIX/bin/h264dec
test -f $PREFIX/lib/libopenh264.dylib
conda inspect linkages -p $PREFIX openh264
conda inspect objects -p $PREFIX openh264
exit 0
