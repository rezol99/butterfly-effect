/* eslint import/prefer-default-export: off */
import { URL } from 'url';
import path from 'path';
import process from 'process';
import { promisify } from 'util';
import { exec as childProcessExec } from 'child_process';
import { Options, PythonShell } from 'python-shell';

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

export const getAppDirPath = (): string =>
  isDev ? path.join(__dirname, '../../') : path.join(__dirname, '../../../');

export const resolveBinPath = (pathName: string): string => {
  const appDirPath = getAppDirPath();
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
  const appDir = getAppDirPath();
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

export const callPython = async (
  scriptPath: string,
  args?: string
): Promise<{ stdout: string; stderr: string }> => {
  const pythonPath = getPythonBinaryPath();
  const options: Options = { pythonPath };
  const pythonShell = new PythonShell(scriptPath, options);
  if (args) pythonShell.send(args);
  return new Promise((resolve, reject) => {
    pythonShell.on('message', (stdout) => {
      console.log(stdout);
      resolve({ stdout, stderr: '' });
    });
    pythonShell.on('stderr', (stderr) => {
      console.log(stderr);
      resolve({ stdout: '', stderr });
    });
  });
};

export type Base64 = string;

export type PythonSendData = {
  command: string;
  image?: Base64;
  meta?: any;
};

const PYTHON_ENTRY_SCRIPT_NAME = 'handler.py' as const;

const getPythonEntryScriptPath = () => {
  const pythonScriptDir = getPythonScriptDir();
  const pythonEntryScriptPath = path.join(
    pythonScriptDir,
    PYTHON_ENTRY_SCRIPT_NAME
  );
  return pythonEntryScriptPath;
};

export const sendPython = async (data: PythonSendData) => {
  const sendData = `${JSON.stringify(data)}`;
  const entryPath = getPythonEntryScriptPath();
  const { stdout, stderr } = await callPython(entryPath, sendData);
  return { stdout, stderr };
};
