import { AssetType } from 'renderer/types/asset';

export const isVideo = (file: string): boolean => {
  const videoExtensions = ['mp4', 'mov', 'avi', 'mkv', 'webm'];
  const extension = file.split('.').pop();
  if (extension) {
    return videoExtensions.includes(extension);
  }
  return false;
};

export const isAudio = (file: string): boolean => {
  const audioExtensions = ['mp3', 'wav', 'ogg', 'flac'];
  const extension = file.split('.').pop();
  if (extension) {
    return audioExtensions.includes(extension);
  }
  return false;
};

export const isImage = (file: string) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'bmp', 'gif'];
  const extension = file.split('.').pop();
  if (extension) {
    return imageExtensions.includes(extension);
  }
  return false;
};

export const parseFileType = (file: string): AssetType | null => {
  if (isImage(file)) return 'image';
  if (isVideo(file)) return 'video';
  if (isAudio(file)) return 'audio';
  return null;
};
