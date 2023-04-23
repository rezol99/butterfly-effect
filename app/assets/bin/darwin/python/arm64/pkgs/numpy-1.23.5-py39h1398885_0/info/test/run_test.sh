

set -ex



f2py -h
python -c "import numpy; numpy.show_config()"
export OPENBLAS_NUM_THREADS=1
pytest -vvv --pyargs numpy -k "not (_not_a_real_test or test_new_policy or test_limited_api or test_herm_cases or test_generalized_herm_cases or test_partial_iteration_cleanup)" --durations=0
exit 0
