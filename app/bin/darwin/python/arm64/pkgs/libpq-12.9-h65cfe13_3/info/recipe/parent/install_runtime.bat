set PERL_USE_UNSAFE_INC=1

pushd src\tools\msvc
call install.bat %LIBRARY_PREFIX%
mkdir backup
MOVE %LIBRARY_BIN%\libpq.dll backup
MOVE %LIBRARY_BIN%\pg_config.exe backup
RD /s /q %LIBRARY_BIN%
mkdir %LIBRARY_BIN%
MOVE backup\* %LIBRARY_BIN%

rd /s /q %LIBRARY_PREFIX%\symbols
