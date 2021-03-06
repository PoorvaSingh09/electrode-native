import * as fileUtils from './fileUtil'
import fs from 'fs'
import path from 'path'
import shell from './shell'
import spin from './spin'
import createTmpDir from './createTmpDir'
import { execp, spawnp } from './childProcess'
import fetch from 'node-fetch'
import log from './log'

export interface BundlingResult {
  // The root path to the assets
  assetsPath: string
  // The target platform of the bundle
  platform: string
  // Indicates whether this is a dev bundle or a production one
  dev: boolean
  // Full path to the bundle
  bundlePath: string
}

export default class ReactNativeCli {
  public readonly binaryPath: string

  constructor(binaryPath: string = 'react-native') {
    this.binaryPath = binaryPath
  }

  public async init(appName: string, rnVersion: string) {
    const dir = path.join(process.cwd(), appName)

    if (fs.existsSync(dir)) {
      throw new Error(`Path already exists will not override ${dir}`)
    }

    return execp(
      `${
        this.binaryPath
      } init ${appName} --version react-native@${rnVersion} --skip-jest`
    )
  }

  public async bundle({
    entryFile,
    dev,
    bundleOutput,
    assetsDest,
    platform,
  }: {
    entryFile: string
    dev: boolean
    bundleOutput: string
    assetsDest: string
    platform: string
  }): Promise<BundlingResult> {
    const bundleCommand = `${this.binaryPath} bundle \
${entryFile ? `--entry-file=${entryFile}` : ''} \
${dev ? '--dev=true' : '--dev=false'} \
${platform ? `--platform=${platform}` : ''} \
${bundleOutput ? `--bundle-output=${bundleOutput}` : ''} \
${assetsDest ? `--assets-dest=${assetsDest}` : ''}`

    await execp(bundleCommand)
    return {
      assetsPath: assetsDest,
      bundlePath: bundleOutput,
      dev,
      platform,
    }
  }

  public startPackager(cwd: string) {
    spawnp(this.binaryPath, ['start'], { cwd })
  }

  public async startPackagerInNewWindow(cwd: string, args: string[] = []) {
    const isPackagerRunning = await this.isPackagerRunning()

    if (!isPackagerRunning) {
      await spin('Starting React Native packager', Promise.resolve())
      if (process.platform === 'darwin') {
        return this.darwinStartPackagerInNewWindow({ cwd, args })
      } else if (/^win/.test(process.platform)) {
        return this.windowsStartPackagerInNewWindow({ cwd, args })
      } else {
        return this.linuxStartPackageInNewWindow({ cwd, args })
      }
    } else {
      log.warn(
        'A React Native Packager is already running in a different process'
      )
    }
  }

  public async darwinStartPackagerInNewWindow({
    cwd = process.cwd(),
    args = [],
  }: {
    cwd?: string
    args?: string[]
  }) {
    const tmpDir = createTmpDir()
    const tmpScriptPath = path.join(tmpDir, 'packager.sh')
    await fileUtils.writeFile(
      tmpScriptPath,
      `
cd "${cwd}"; 
echo "Running ${this.binaryPath} start ${args.join(' ')}";
${this.binaryPath} start ${args.join(' ')};
`
    )
    shell.chmod('+x', tmpScriptPath)
    spawnp('open', ['-a', 'Terminal', tmpScriptPath])
  }

  public async linuxStartPackageInNewWindow({
    cwd = process.cwd(),
    args = [],
  }: {
    cwd?: string
    args?: string[]
  }) {
    const tmpDir = createTmpDir()
    const tmpScriptPath = path.join(tmpDir, 'packager.sh')
    await fileUtils.writeFile(
      tmpScriptPath,
      `
cd "${cwd}"; 
echo "Running ${this.binaryPath} start ${args.join(' ')}";
${this.binaryPath} start ${args.join(' ')};
`
    )
    shell.chmod('+x', tmpScriptPath)
    spawnp('gnome-terminal', ['--command', tmpScriptPath])
  }

  public async windowsStartPackagerInNewWindow({
    cwd = process.cwd(),
    args = [],
  }: {
    cwd?: string
    args?: string[]
  }) {
    const tmpDir = createTmpDir()
    const tmpScriptPath = path.join(tmpDir, 'packager.bat')
    await fileUtils.writeFile(
      tmpScriptPath,
      `
cd "${cwd}"; 
echo "Running ${this.binaryPath} start ${args.join(' ')}";
${this.binaryPath} start ${args.join(' ')};
`
    )
    shell.chmod('+x', tmpScriptPath)
    spawnp('cmd.exe', ['/C', tmpScriptPath], { detached: true })
  }

  public async isPackagerRunning() {
    return fetch('http://localhost:8081/status').then(
      res => res.text().then(body => body === 'packager-status:running'),
      () => false
    )
  }
}
