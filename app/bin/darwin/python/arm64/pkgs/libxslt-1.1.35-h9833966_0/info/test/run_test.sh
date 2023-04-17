

set -ex



xsltproc --version
conda inspect linkages -p $PREFIX libxslt
conda inspect objects -p $PREFIX libxslt
exit 0
