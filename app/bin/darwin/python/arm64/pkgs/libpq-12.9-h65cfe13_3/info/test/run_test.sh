

set -ex



pg_config
test -f $PREFIX/lib/libpq.5.12.dylib
test -f $PREFIX/lib/libpq.5.dylib
test -f $PREFIX/lib/libpq.dylib
exit 0
