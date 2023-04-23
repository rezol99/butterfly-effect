

set -ex



test -f ${PREFIX}/lib/libgnutls${SHLIB_EXT}
test -f ${PREFIX}/lib/libgnutlsxx${SHLIB_EXT}
certtool --version
gnutls-cli --version
ocsptool --version
psktool --version
srptool --version
exit 0
