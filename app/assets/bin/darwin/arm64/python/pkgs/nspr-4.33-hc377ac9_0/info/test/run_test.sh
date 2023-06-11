

set -ex



test -f ${PREFIX}/lib/libnspr4${SHLIB_EXT}
test -f ${PREFIX}/lib/libplc4${SHLIB_EXT}
test -f ${PREFIX}/lib/libplds4${SHLIB_EXT}
test -d ${PREFIX}/include/nspr
test -f ${PREFIX}/bin/nspr-config
exit 0
