

set -ex



test -f ${PREFIX}/lib/libvpx.a
test -f ${PREFIX}/lib/libvpx.dylib
conda inspect linkages -p $PREFIX libvpx
conda inspect objects -p $PREFIX libvpx
exit 0
