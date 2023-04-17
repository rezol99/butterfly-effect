

set -ex



test -f $PREFIX/lib/libtasn1${SHLIB_EXT}
conda inspect linkages -p $PREFIX $PKG_NAME
conda inspect objects -p $PREFIX $PKG_NAME
exit 0
