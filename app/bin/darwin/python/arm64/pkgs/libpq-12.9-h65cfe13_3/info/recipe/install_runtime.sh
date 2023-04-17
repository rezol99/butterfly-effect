make install
mkdir backup
mv $PREFIX/bin/pg_config backup
rm -rf $PREFIX/bin/*
mv backup/pg_config $PREFIX/bin
