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

export const callPython = (scriptPath: string) => {
  const arch = getArchitecture();
  const pythonPath = isMac ? resolveBinPath(`./darwin/${arch}/python.exe`) : '';
  const options: Options = { pythonPath };
  return PythonShell.run(scriptPath, options);
};
