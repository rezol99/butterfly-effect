
fc-list --help

REM Test for libraries.
echo "Testing for presence of libfontconfig in build output"
if not exist %PREFIX%/Library\lib\fontconfig.lib exit /b 1 
if not exist %PREFIX%\Library\bin\fontconfig-1.dll exit /b 1

rem check for pkgconfig file ...
if not exist %PREFIX%\Library\lib\pkgconfig\fontconfig.pc exit /b 1

exit /b 0

