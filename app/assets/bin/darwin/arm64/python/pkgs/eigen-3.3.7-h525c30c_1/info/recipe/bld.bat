md build
cd build

cmake .. -LAH -GNinja                                 ^
 -DCMAKE_BUILD_TYPE=Release                           ^
 -DINCLUDE_INSTALL_DIR=%LIBRARY_PREFIX%/include       ^
 -DCMAKE_INSTALL_PREFIX=%LIBRARY_PREFIX%
if errorlevel 1 exit 1

cmake --build .
if errorlevel 1 exit 1
cmake --install .
if errorlevel 1 exit 1

rem Just make the basic tests as all the tests take too long to run.
cmake --build .  --target basicstuff
if errorlevel 1 exit 1
ctest -R basicstuff*
if errorlevel 1 exit 1
goto :eof

:TRIM
  SetLocal EnableDelayedExpansion
  Call :TRIMSUB %%%1%%
  EndLocal & set %1=%tempvar%
  GOTO :eof

  :TRIMSUB
  set tempvar=%*
  GOTO :eof
