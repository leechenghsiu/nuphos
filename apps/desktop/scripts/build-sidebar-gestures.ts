import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, statSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Node-API is ABI stable across Node and Electron; no V8/Electron headers needed.
export function buildSidebarGestures() {
  if (process.platform !== 'darwin') return
  const root = fileURLToPath(new URL('../', import.meta.url))
  const source = path.join(root, 'native/sidebar-gestures.mm')
  const output = path.join(root, 'build/native/sidebar-gestures.node')
  const manifest = createRequire(import.meta.url).resolve('node-api-headers/package.json')
  const headers = path.join(path.dirname(manifest), 'include')

  if (
    existsSync(output) &&
    statSync(output).mtimeMs >=
      Math.max(
        statSync(source).mtimeMs,
        statSync(fileURLToPath(import.meta.url)).mtimeMs,
        statSync(manifest).mtimeMs,
      )
  )
    return
  mkdirSync(path.dirname(output), { recursive: true })
  execFileSync(
    '/usr/bin/xcrun',
    [
      'clang++',
      '-std=c++17',
      '-arch',
      'arm64',
      '-arch',
      'x86_64',
      '-bundle',
      '-undefined',
      'dynamic_lookup',
      '-fobjc-arc',
      '-fblocks',
      '-framework',
      'AppKit',
      '-I',
      headers,
      source,
      '-o',
      output,
    ],
    { stdio: 'inherit' },
  )
}

if (process.argv[1] === fileURLToPath(import.meta.url)) buildSidebarGestures()
