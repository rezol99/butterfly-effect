

set -ex



pushd test-cmake
cmake . -GNinja -DCMAKE_BUILD_TYPE=Release
cmake --build . --verbose
popd
test -f ${CONDA_PREFIX}/lib/libopencv_aruco.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_bgsegm.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_calib3d.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_ccalib.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_core.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_datasets.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_features2d.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_flann.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_fuzzy.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_highgui.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_imgcodecs.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_imgproc.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_line_descriptor.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_ml.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_optflow.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_phase_unwrapping.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_photo.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_plot.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_reg.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_rgbd.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_saliency.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_shape.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_stereo.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_stitching.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_structured_light.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_superres.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_surface_matching.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_tracking.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_video.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_videoio.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_videostab.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_xfeatures2d.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_ximgproc.dylib
test -f ${CONDA_PREFIX}/lib/libopencv_xphoto.dylib
exit 0
