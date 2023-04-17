

set -ex



ffmpeg --help
ffmpeg -loglevel panic -codecs
ffmpeg -loglevel panic -protocols | grep "https"
ffmpeg -loglevel panic -codecs | grep "libmp3lame"
ffmpeg -loglevel panic -codecs | grep "DEVI.S zlib"
test -f $PREFIX/lib/libavcodec.dylib
test -f $PREFIX/lib/libavdevice.dylib
test -f $PREFIX/lib/libswresample.dylib
test -f $PREFIX/lib/libpostproc.dylib
test -f $PREFIX/lib/libavfilter.dylib
test -f $PREFIX/lib/libswresample.dylib
test -f $PREFIX/lib/libavcodec.dylib
test -f $PREFIX/lib/libavformat.dylib
test -f $PREFIX/lib/libswscale.dylib
test -f $PREFIX/lib/libavresample.dylib
exit 0
