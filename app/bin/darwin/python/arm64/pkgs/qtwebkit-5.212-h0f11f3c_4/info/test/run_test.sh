

set -ex



test -f $PREFIX/lib/libQt5WebKit${SHLIB_EXT}
test -f $PREFIX/lib/libQt5WebKitWidgets${SHLIB_EXT}
exit 0
