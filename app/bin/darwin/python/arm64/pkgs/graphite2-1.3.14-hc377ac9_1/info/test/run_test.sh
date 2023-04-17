

set -ex



test -f $PREFIX/lib/libgraphite2.dylib
test -f $PREFIX/include/graphite2/Segment.h
test -f $PREFIX/include/graphite2/Font.h
test -f $PREFIX/include/graphite2/Types.h
test -f $PREFIX/include/graphite2/Log.h
exit 0
