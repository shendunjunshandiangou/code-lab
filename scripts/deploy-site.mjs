#!/usr/bin/env node
/**
 * 从 code-lab 源码目录同步到独立 GitHub Pages 部署仓库并 push。
 *
 * 用法:
 *   npm run deploy -- bili-knowledge
 *   npm run deploy -- bili-knowledge -m "feat: 更新返回按钮"
 *   npm run deploy -- --list
 *   npm run deploy -- bili-knowledge --dry-run
 *
 * 新增站点: 编辑 deploy.config.json，添加 sites 条目即可。
 */

import { execSync } from 'node:child_process'
import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
} from 'node:fs'
import { dirname, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = resolve(__dirname, '..')
const CONFIG_PATH = join(ROOT, 'deploy.config.json')
const CLONE_ROOT = join(ROOT, '.deploy')

function usage() {
  console.log(`
用法:
  npm run deploy -- <站点名> [-m "提交说明"] [--dry-run] [--no-push]

选项:
  --list       列出 deploy.config.json 中已配置的站点
  --dry-run    只同步到 .deploy/，不 commit / push
  --no-push    commit 但不 push（便于本地检查）
  -m, --message  自定义 git commit message

示例:
  npm run deploy -- bili-knowledge
  npm run deploy -- bili-knowledge -m "feat: 更新首页"
`)
}

function loadConfig() {
  if (!existsSync(CONFIG_PATH)) {
    throw new Error(`找不到配置文件: ${CONFIG_PATH}`)
  }
  const config = JSON.parse(readFileSync(CONFIG_PATH, 'utf8'))
  if (!config.sites || typeof config.sites !== 'object') {
    throw new Error('deploy.config.json 缺少 sites 字段')
  }
  return config
}

function parseArgs(argv) {
  const args = { site: null, message: null, dryRun: false, noPush: false, list: false }
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i]
    if (arg === '--list') args.list = true
    else if (arg === '--dry-run') args.dryRun = true
    else if (arg === '--no-push') args.noPush = true
    else if (arg === '-m' || arg === '--message') {
      args.message = argv[++i]
      if (!args.message) throw new Error('缺少 commit message')
    } else if (arg === '-h' || arg === '--help') {
      usage()
      process.exit(0)
    } else if (!arg.startsWith('-') && !args.site) {
      args.site = arg
    } else {
      throw new Error(`未知参数: ${arg}`)
    }
  }
  return args
}

function run(cmd, cwd, inherit = false) {
  const result = execSync(cmd, {
    cwd,
    stdio: inherit ? 'inherit' : 'pipe',
    encoding: inherit ? undefined : 'utf8',
  })
  if (inherit || result == null) return ''
  return result.trim()
}

function normalizeRelPath(relPath) {
  return relPath.split(sep).join('/')
}

function shouldExclude(relPath, excludePatterns) {
  const normalized = normalizeRelPath(relPath)
  return excludePatterns.some((pattern) => {
    if (pattern.endsWith('/')) {
      return normalized.startsWith(pattern.slice(0, -1) + '/') || normalized === pattern.slice(0, -1)
    }
    return normalized === pattern || normalized.startsWith(`${pattern}/`)
  })
}

function listFiles(dir, base = dir, excludePatterns = []) {
  const files = []
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name)
    const rel = normalizeRelPath(relative(base, full))
    if (shouldExclude(rel, excludePatterns)) continue
    if (entry.isDirectory()) {
      files.push(...listFiles(full, base, excludePatterns))
    } else if (entry.isFile()) {
      files.push(rel)
    }
  }
  return files
}

function syncDirectory(sourceDir, targetDir, excludePatterns) {
  if (!existsSync(sourceDir)) {
    throw new Error(`源码目录不存在: ${sourceDir}`)
  }

  mkdirSync(targetDir, { recursive: true })

  const sourceFiles = new Set(listFiles(sourceDir, sourceDir, excludePatterns))

  if (existsSync(targetDir)) {
    for (const rel of listFiles(targetDir, targetDir, ['.git', '.git/'])) {
      if (!sourceFiles.has(rel)) {
        rmSync(join(targetDir, ...rel.split('/')), { recursive: true, force: true })
      }
    }
  }

  for (const rel of sourceFiles) {
    const src = join(sourceDir, ...rel.split('/'))
    const dest = join(targetDir, ...rel.split('/'))
    mkdirSync(dirname(dest), { recursive: true })
    cpSync(src, dest)
  }
}

function ensureClone(siteKey, siteConfig) {
  const cloneDir = join(CLONE_ROOT, siteKey)
  mkdirSync(CLONE_ROOT, { recursive: true })

  if (!existsSync(join(cloneDir, '.git'))) {
    console.log(`→ 首次部署，克隆 ${siteConfig.repo}`)
    run(`git clone --branch ${siteConfig.branch} ${siteConfig.repo} "${cloneDir}"`, ROOT, true)
    return cloneDir
  }

  console.log(`→ 更新部署仓库 ${siteKey}`)
  run('git fetch origin', cloneDir)
  run(`git checkout ${siteConfig.branch}`, cloneDir)
  run(`git pull --ff-only origin ${siteConfig.branch}`, cloneDir, true)
  return cloneDir
}

function deploySite(siteKey, siteConfig, options) {
  const sourceDir = resolve(ROOT, siteConfig.source)
  const exclude = siteConfig.exclude ?? []
  const cloneDir = ensureClone(siteKey, siteConfig)

  console.log(`→ 同步 ${siteConfig.source} → .deploy/${siteKey}/`)
  syncDirectory(sourceDir, cloneDir, exclude)

  const status = run('git status --porcelain', cloneDir)
  if (!status) {
    console.log('✓ 无变更，跳过 commit / push')
    return
  }

  console.log('→ 变更文件:')
  console.log(status)

  if (options.dryRun) {
    console.log('✓ dry-run 模式：已同步到 .deploy/，未 commit / push')
    return
  }

  run('git add -A', cloneDir)
  const message = options.message ?? `deploy: sync ${siteKey} from code-lab`
  execSync(`git commit -m ${JSON.stringify(message)}`, { cwd: cloneDir, stdio: 'inherit', shell: true })

  if (options.noPush) {
    console.log('✓ 已 commit，--no-push 模式未 push')
    return
  }

  run(`git push origin ${siteConfig.branch}`, cloneDir, true)
  console.log(`✓ 已推送到 ${siteConfig.repo}`)
  if (siteConfig.url) {
    console.log(`  线上地址: ${siteConfig.url}`)
    console.log('  GitHub Actions 构建通常需要 2～4 分钟')
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const config = loadConfig()

  if (args.list || !args.site) {
    console.log('已配置站点:')
    for (const [key, site] of Object.entries(config.sites)) {
      console.log(`  ${key}`)
      console.log(`    source: ${site.source}`)
      console.log(`    repo:   ${site.repo}`)
      console.log(`    url:    ${site.url ?? '(未设置)'}`)
    }
    if (!args.site) {
      console.log('\n部署: npm run deploy -- <站点名>')
    }
    return
  }

  const siteConfig = config.sites[args.site]
  if (!siteConfig) {
    throw new Error(`未知站点 "${args.site}"，可用: ${Object.keys(config.sites).join(', ')}`)
  }
  for (const field of ['source', 'repo', 'branch']) {
    if (!siteConfig[field]) {
      throw new Error(`站点 ${args.site} 缺少必填字段: ${field}`)
    }
  }

  deploySite(args.site, siteConfig, args)
}

try {
  main()
} catch (err) {
  console.error(`✗ ${err.message}`)
  process.exit(1)
}
