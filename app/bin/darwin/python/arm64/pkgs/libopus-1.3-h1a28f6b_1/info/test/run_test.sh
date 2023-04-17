

set -ex



test -f ${PREFIX}/lib/libopus.a
test -f ${PREFIX}/lib/libopus.dylib
conda inspect linkages -p $PREFIX libopus
conda inspect objects -p $PREFIX libopus
exit 0
