/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import process from 'process';
import { promisify } from 'util';
import { exec as childProcessExec, execSync } from 'child_process';
import { Options, PythonShell } from 'python-shell';
import ffmpeg from 'fluent-ffmpeg';
import { path as ffmpegPath } from '@ffmpeg-installer/ffmpeg';
import { createReadStream, readFileSync, unlinkSync } from 'fs';

const exec = promisify(childProcessExec);

export function resolveHtmlPath(htmlFileName: string) {
  if (process.env.NODE_ENV === 'development') {
    const port = process.env.PORT || 1212;
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  }
  return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
}

export const isDev: boolean = process.env.NODE_ENV === 'development';
export const isWin = process.platform === 'win32';
export const isMac = process.platform === 'darwin';

export const getAssetsDirPath = (): string =>
  isDev
    ? path.join(__dirname, '../../assets')
    : path.join(__dirname, '../../../assets');

export const resolveBinPath = (pathName: string): string => {
  const appDirPath = getAssetsDirPath();
  const binPath = path.join(appDirPath, 'bin');
  const resolvedPath = path.join(binPath, pathName);
  return resolvedPath;
};

export const execCommand = async (
  command: string,
  args?: string[]
): Promise<{ stdout: string; stderr: string }> => {
  const argsStr = args ? args.join(' ') : '';
  const s = `${command} ${argsStr}`;
  return exec(s);
};

// TODO: 実際のアーキテクチャを取得できるようにする
export const getArchitecture = () => {
  return 'arm64';
};

export const getPythonScriptDir = () => {
  const appDir = getAssetsDirPath();
  const pythonScriptDir = path.join(appDir, 'scripts');
  return pythonScriptDir;
};

export const getPythonBinaryPath = (): string => {
  const osName = isMac ? 'darwin' : 'win32';
  const arch = getArchitecture();
  const pythonBinaryPath = resolveBinPath(
    `./${osName}/python/${arch}/python.app/Contents/MacOS/python`
  );
  return pythonBinaryPath;
};

export type StdResult = { stdout: string | null; stderr: string | null };

export const callPython = async (
  scriptPath: string,
  args?: string
): Promise<StdResult> => {
  const pythonPath = getPythonBinaryPath();
  const options: Options = { pythonPath };
  const pythonShell = new PythonShell(scriptPath, options);
  if (args) pythonShell.send(args);
  return new Promise((resolve, reject) => {
    pythonShell.on('message', (stdout) => {
      // if (isDev) console.log(stdout);
      resolve({ stdout, stderr: null });
    });
    pythonShell.on('stderr', (stderr) => {
      if (isDev) console.error(stderr);
      resolve({ stdout: null, stderr });
    });
  });
};

export type Base64 = string;

export type PythonSendData = {
  command: string;
  images?: Base64[];
  meta?: any;
};

const PYTHON_ENTRY_SCRIPT_NAME = 'main.py' as const;

const getPythonEntryScriptPath = () => {
  const pythonScriptDir = getPythonScriptDir();
  const pythonEntryScriptPath = path.join(
    pythonScriptDir,
    PYTHON_ENTRY_SCRIPT_NAME
  );
  return pythonEntryScriptPath;
};

export const sendPython = async (data: PythonSendData): Promise<StdResult> => {
  const sendData = `${JSON.stringify(data)}`;
  const entryPath = getPythonEntryScriptPath();
  const { stdout, stderr } = await callPython(entryPath, sendData);
  return { stdout, stderr };
};

export const isImageFile = (filePath: string): boolean => {
  return /\.(jpg|jpeg|png|gif|bmp)$/i.test(filePath);
};

export const isVideoFile = (filePath: string): boolean => {
  return /\.(mp4|mov|avi|wmv|flv|mkv)$/i.test(filePath);
};

export const convertFilePathToFileProtocol = (filePath: string): string => {
  return `file://${filePath}`;
};

export const getVideoAspectRatio = (
  inputFilePath: string
): Promise<number | undefined> => {
  return new Promise<number | undefined>((resolve, reject) => {
    ffmpeg.ffprobe(inputFilePath, (err, metadata) => {
      if (err) {
        console.error(`FFmpeg error: ${err.message}`);
        reject(err);
        return;
      }

      if (metadata && metadata.streams) {
        const videoStream = metadata.streams.find(
          (stream: any) => stream.codec_type === 'video'
        );
        if (videoStream && videoStream.display_aspect_ratio) {
          const aspectRatioArray = videoStream.display_aspect_ratio.split(':');
          if (aspectRatioArray.length === 2) {
            const numerator = parseInt(aspectRatioArray[0], 10);
            const denominator = parseInt(aspectRatioArray[1], 10);
            const aspectRatio = numerator / denominator;
            resolve(aspectRatio);
          }
          return;
        }
      }
      resolve(undefined);
    });
  });
};

ffmpeg.setFfmpegPath(ffmpegPath);

// TODO: 要リファクタリング
const getVideoThumbnailAsBase64 = async (
  videoFilePath: string,
  outputWidth = 300
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const now = Date.now();
    const tempOutputPath = path.join('/tmp', `temp_thumbnail_${now}.png`);
    execSync(`touch ${tempOutputPath}`);
    const videoFileReadStream = createReadStream(videoFilePath);

    ffmpeg(videoFileReadStream)
      .on('error', (err) => {
        reject(err);
      })
      .outputOptions([
        `-vf scale=${outputWidth}:-1`,
        '-vframes 1',
        '-q:v 2',
        '-f image2',
      ])
      .save(tempOutputPath)
      .on('end', () => {
        const thumbnailBuffer = readFileSync(tempOutputPath);
        const thumbnailBase64 = thumbnailBuffer.toString('base64');
        unlinkSync(tempOutputPath); // 一時ファイルを削除
        resolve(thumbnailBase64);
      });
  });
};

export const getThumbnailURI = async (filePath: string): Promise<string> => {
  if (isImageFile(filePath)) {
    const imageFileUri = convertFilePathToFileProtocol(filePath);
    return imageFileUri;
  }

  if (isVideoFile(filePath)) {
    const videoThumbnail = await getVideoThumbnailAsBase64(filePath);
    if (!videoThumbnail) throw new Error('Failed to get video thumbnail');
    const dataUri = convertBase64ToDataUri(videoThumbnail);
    return dataUri;
  }
  throw new Error('not supported file type');
};

export const convertDataUriToBase64 = (dataUri: string): Base64 => {
  const base64 = dataUri.split(',')[1];
  return base64;
};

export const convertBase64ToDataUri = (base64: string): string => {
  const mimeType = 'image/png';
  return `data:${mimeType};base64,${base64}`;
};
