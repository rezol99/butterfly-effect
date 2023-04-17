

set -ex



test -f $PREFIX/lib/libharfbuzz-icu.dylib
test -f $PREFIX/lib/libharfbuzz.dylib
test -f $PREFIX/include/harfbuzz/hb-ft.h
test -f $PREFIX/share/gir-1.0/HarfBuzz-0.0.gir
exit 0
