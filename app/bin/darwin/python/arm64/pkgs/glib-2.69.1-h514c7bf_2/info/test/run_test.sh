

set -ex



test -f ${PREFIX}/lib/libglib-2.0.dylib
test ! -f ${PREFIX}/lib/libgobject-2.0.la
gdbus help
gio version
gio-querymodules .
glib-compile-resources --help
glib-compile-schemas --help
gobject-query --help
gresource help
gtester --help
exit 0
