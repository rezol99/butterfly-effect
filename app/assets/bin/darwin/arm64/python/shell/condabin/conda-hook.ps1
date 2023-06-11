$Env:CONDA_EXE = "/Users/ezryow/Git/butterfly-effect/app/bin/darwin/python/arm64/bin/conda"
$Env:_CE_M = ""
$Env:_CE_CONDA = ""
$Env:_CONDA_ROOT = "/Users/ezryow/Git/butterfly-effect/app/bin/darwin/python/arm64"
$Env:_CONDA_EXE = "/Users/ezryow/Git/butterfly-effect/app/bin/darwin/python/arm64/bin/conda"
$CondaModuleArgs = @{ChangePs1 = $False}
Import-Module "$Env:_CONDA_ROOT\shell\condabin\Conda.psm1" -ArgumentList $CondaModuleArgs

Remove-Variable CondaModuleArgs