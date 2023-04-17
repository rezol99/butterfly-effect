

set -ex



test -f "$PREFIX/lib/libclang.dylib"
test -f "$PREFIX/lib/libclang.12.dylib"
exit 0
