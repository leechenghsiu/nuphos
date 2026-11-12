import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, statSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// Node-API is ABI stable across Node and Electron; no V8/Electron headers needed.
export async function buildSidebarGestures() {
  if (process.platform !== 'darwin') return
  const root = fileURLToPath(new URL('../', import.meta.url))
  const source = path.join(root, 'native/sidebar-gestures.mm')
  const output = path.join(root, 'build/native/sidebar-gestures.node')

  if (
    existsSync(output) &&
    statSync(output).mtimeMs >=
      Math.max(statSync(source).mtimeMs, statSync(fileURLToPath(import.meta.url)).mtimeMs)
  )
    return
  const headers = path.join(tmpdir(), 'nuphos-node-api-v22.16.0')

  mkdirSync(headers, { recursive: true })
  for (const name of [
    'node_api.h',
    'node_api_types.h',
    'js_native_api.h',
    'js_native_api_types.h',
  ]) {
    const target = path.join(headers, name)

    if (existsSync(target)) continue
    const response = await fetch(
      `https://raw.githubusercontent.com/nodejs/node/v22.16.0/src/${name}`,
    )

    if (!response.ok) throw new Error(`Node-API header ${name}: HTTP ${response.status}`)
    writeFileSync(target, await response.text())
  }
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

if (process.argv[1] === fileURLToPath(import.meta.url)) await buildSidebarGestures()
