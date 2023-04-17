echo Outputting versions: ctl, config, client
pg_ctl --version
if %ERRORLEVEL% NEQ 0 exit 1
pg_config --version
if %ERRORLEVEL% NEQ 0 exit 1
psql --version
if %ERRORLEVEL% NEQ 0 exit 1
