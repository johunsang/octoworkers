import fs from 'node:fs'
import path from 'node:path'
import { execSync, spawnSync } from 'node:child_process'
import { createInterface } from 'node:readline'

// ━━━ Prompt ━━━

function createPrompt() {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  return {
    ask(q: string, fallback = ''): Promise<string> {
      const h = fallback ? ` (${fallback})` : ''
      return new Promise((r) => rl.question(`  ${q}${h}: `, (a) => r(a.trim() || fallback)))
    },
    confirm(q: string, fb = true): Promise<boolean> {
      return new Promise((r) => {
        rl.question(`  ${q} ${fb ? '(Y/n)' : '(y/N)'}: `, (a) => {
          const v = a.trim().toLowerCase()
          r(v ? v === 'y' || v === 'yes' : fb)
        })
      })
    },
    enter(msg: string): Promise<void> {
      return new Promise((r) => rl.question(`\n  ⏎ ${msg} (Enter) `, () => r()))
    },
    close() { rl.close() },
  }
}

function sh(cmd: string, cwd: string, silent = false): string {
  try {
    return execSync(cmd, { cwd, stdio: silent ? 'pipe' : 'inherit', encoding: 'utf-8', timeout: 120_000 }) as string
  } catch (e) { if (silent) return (e as { stdout?: string }).stdout ?? ''; throw e }
}

function shSafe(cmd: string, cwd: string): { ok: boolean; out: string } {
  const r = spawnSync(cmd, { cwd, shell: true, encoding: 'utf-8', stdio: 'pipe', timeout: 30_000 })
  return { ok: r.status === 0, out: (r.stdout ?? '') + (r.stderr ?? '') }
}

function step(n: number, total: number, title: string) {
  console.log(`\n  ━━━ [${n}/${total}] ${title} ━━━\n`)
}

function ok(msg: string) { console.log(`  ✅ ${msg}`) }
function warn(msg: string) { console.log(`  ⚠️  ${msg}`) }
function info(msg: string) { console.log(`  ℹ️  ${msg}`) }

// ━━━ File Engine ━━━

const SKIP_DIRS = new Set(['node_modules', '.wrangler', '.wrangler-dry', '.wrangler-dry-staging', '.git', 'dist', 'coverage', 'cli'])
const SKIP_FILES = new Set(['pnpm-lock.yaml', 'worker/pnpm-lock.yaml', 'CLAUDE.local.md', '.claude/settings.local.json'])

function walk(dir: string, base: string): string[] {
  const out: string[] = []
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(base, e.name)
    if (rel.split(path.sep).some((p) => SKIP_DIRS.has(p))) continue
    if (SKIP_FILES.has(rel) || rel.startsWith(path.join('worker', 'public'))) continue
    if (e.isDirectory()) out.push(...walk(path.join(dir, e.name), rel))
    else out.push(rel)
  }
  return out
}

function isBin(p: string) {
  return ['.png', '.jpg', '.jpeg', '.gif', '.ico', '.woff', '.woff2', '.ttf', '.webp'].includes(path.extname(p).toLowerCase())
}

interface Cfg {
  name: string; slug: string; scope: string
  appDomain: string; adminDomain: string; email: string
  accountId: string; d1Id: string; d1StagingId: string; imagesHash: string
  ext: boolean; agt: boolean; vec: boolean; aid: boolean
}

function replace(s: string, c: Cfg): string {
  let r = s
  r = r.replace(/octoworkers/g, c.slug)
  r = r.replace(/@octoworkers\//g, `@${c.scope}/`)
  r = r.replace(/"octoworkers"/g, `"${c.slug}"`)
  r = r.replace(/"octoworkers-staging"/g, `"${c.slug}-staging"`)
  r = r.replace(/octoworkers-doc-index/g, `${c.slug}-doc-index`)
  r = r.replace(/octoworkers-staging-doc-index/g, `${c.slug}-staging-doc-index`)
  r = r.replace(/octoworkers-media/g, `${c.slug}-media`)
  r = r.replace(/octoworkers-staging-media/g, `${c.slug}-staging-media`)
  r = r.replace(/example\.com/g, c.appDomain)
  r = r.replace(/admin\.example\.com/g, c.adminDomain)
  if (c.accountId) r = r.replace(/REPLACE_WITH_ACCOUNT_ID/g, c.accountId)
  if (c.d1Id) r = r.replace(/REPLACE_WITH_D1_DATABASE_ID/g, c.d1Id)
  if (c.d1StagingId) r = r.replace(/REPLACE_WITH_STAGING_D1_DATABASE_ID/g, c.d1StagingId)
  if (c.imagesHash) {
    r = r.replace(/REPLACE_WITH_IMAGES_DELIVERY_HASH/g, c.imagesHash)
    r = r.replace(/REPLACE_WITH_STAGING_IMAGES_DELIVERY_HASH/g, c.imagesHash)
  }
  if (c.email) r = r.replace(/founder@example\.com/g, c.email)
  r = r.replace(/옥토워커스/g, c.name)
  r = r.replace(/octoworkers/g, c.slug)
  return r
}

function patchIndex(s: string, c: Cfg): string {
  let r = s
  if (!c.ext) { r = r.replace(/import { extRoutes }.*\n/g, ''); r = r.replace(/.*extRoutes.*\n/g, '') }
  if (!c.agt) {
    r = r.replace(/import { agentsMiddleware }.*\n/g, '')
    r = r.replace(/import { OpsAgent }.*\n/g, '')
    r = r.replace(/import { agentRoutes }.*\n/g, '')
    r = r.replace(/.*agentsMiddleware.*\n/g, '')
    r = r.replace(/.*agentRoutes.*\n/g, '')
    r = r.replace(/export { OpsAgent }\n/g, '')
  }
  if (!c.vec) { r = r.replace(/import { vectorRoutes }.*\n/g, ''); r = r.replace(/.*vectorRoutes.*\n/g, '') }
  if (!c.aid) { r = r.replace(/import { aiRoutes }.*\n/g, ''); r = r.replace(/.*aiRoutes.*\n/g, '') }
  return r
}

function shouldSkip(rel: string, c: Cfg): boolean {
  if (!c.ext && rel.includes(path.join('biz', 'ext'))) return true
  if (!c.agt && rel.includes(path.join('biz', 'agt'))) return true
  if (!c.vec && rel.includes(path.join('biz', 'vec'))) return true
  if (!c.aid && rel.includes(path.join('biz', 'aid'))) return true
  return false
}

function secret(len = 48) {
  const c = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const b = new Uint8Array(len); crypto.getRandomValues(b)
  return Array.from(b, (v) => c[v % c.length]).join('')
}

// ━━━ Main ━━━

const TOTAL = 10

async function main() {
  console.log()
  console.log('  🚀 create-octoworkers')
  console.log('  Cloudflare Workers SaaS — 서버 세팅부터 배포까지')
  console.log()

  const p = createPrompt()

  try {
    // ━━━ 1. 사전 요구사항 확인 ━━━

    step(1, TOTAL, '사전 요구사항 확인')

    // Node.js
    const nodeVer = shSafe('node --version', '.')
    if (!nodeVer.ok) { console.error('  ❌ Node.js가 설치되어 있지 않습니다.'); process.exit(1) }
    ok(`Node.js ${nodeVer.out.trim()}`)

    // pnpm
    const pnpmVer = shSafe('pnpm --version', '.')
    if (!pnpmVer.ok) {
      warn('pnpm이 설치되어 있지 않습니다. 설치합니다...')
      sh('npm install -g pnpm', '.')
    }
    ok(`pnpm ${shSafe('pnpm --version', '.').out.trim()}`)

    // wrangler (npx로 사용 가능 — 별도 전역 설치 불필요)
    ok('wrangler는 npx로 실행')

    // git
    const gitVer = shSafe('git --version', '.')
    if (!gitVer.ok) { console.error('  ❌ Git이 설치되어 있지 않습니다.'); process.exit(1) }
    ok(`${gitVer.out.trim()}`)

    // ━━━ 2. Cloudflare 로그인 ━━━

    step(2, TOTAL, 'Cloudflare 로그인')

    const whoami = shSafe('npx wrangler whoami 2>&1', '.')
    if (!whoami.ok || whoami.out.includes('not authenticated') || whoami.out.includes('No OAuth')) {
      warn('Cloudflare에 로그인되어 있지 않습니다.')
      await p.enter('wrangler login을 실행합니다 (브라우저가 열립니다)')
      sh('npx wrangler login', '.')
    }

    // Account ID 추출
    const whoami2 = shSafe('npx wrangler whoami 2>&1', '.')
    const accMatch = whoami2.out.match(/([a-f0-9]{32})/)
    let accountId = accMatch?.[1] ?? ''

    if (accountId) {
      ok(`Cloudflare Account: ${accountId}`)
    } else {
      accountId = await p.ask('Cloudflare Account ID를 입력하세요')
    }

    // ━━━ 3. 프로젝트 정보 ━━━

    step(3, TOTAL, '프로젝트 정보')

    const name = await p.ask('프로젝트 이름 (표시용)', 'My SaaS')
    const slug = await p.ask('프로젝트 슬러그 (패키지명/워커명)', name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
    const scope = await p.ask('패키지 스코프 (@scope/)', slug)
    const appDomain = await p.ask('앱 도메인', `${slug}.com`)
    const adminDomain = await p.ask('어드민 도메인', `admin.${appDomain}`)
    const email = await p.ask('관리자 이메일', `founder@${appDomain}`)

    // ━━━ 4. 모듈 선택 ━━━

    step(4, TOTAL, '포함할 모듈')

    const aid = await p.confirm('AI 카피 생성 (aid)?')
    const vec = await p.confirm('시맨틱 검색 (vec)?')
    const agt = await p.confirm('Durable Object 에이전트 (agt)?')
    const ext = await p.confirm('KV/R2/WebSocket 예제 (ext)?')

    const outDir = await p.ask('출력 디렉토리', `./${slug}`)
    const target = path.resolve(outDir)

    if (fs.existsSync(target) && fs.readdirSync(target).length > 0) {
      if (!(await p.confirm(`${target} 존재합니다. 덮어쓰시겠습니까?`, false))) { p.close(); process.exit(0) }
    }

    // ━━━ 5. 파일 복사 ━━━

    step(5, TOTAL, '파일 복사 + 커스터마이징')

    const cfg: Cfg = { name, slug, scope, appDomain, adminDomain, email, accountId, d1Id: '', d1StagingId: '', imagesHash: '', ext, agt, vec, aid }
    const src = path.resolve(import.meta.dirname, '..')
    const files = walk(src, '')
    let cnt = 0

    for (const rel of files) {
      if (shouldSkip(rel, cfg)) continue
      const s = path.join(src, rel), d = path.join(target, rel)
      fs.mkdirSync(path.dirname(d), { recursive: true })
      if (isBin(rel)) { fs.copyFileSync(s, d) }
      else {
        let c = fs.readFileSync(s, 'utf-8')
        c = replace(c, cfg)
        if (rel === path.join('worker', 'src', 'index.ts')) c = patchIndex(c, cfg)
        fs.writeFileSync(d, c)
      }
      cnt++
    }

    fs.writeFileSync(path.join(target, 'worker', '.dev.vars'),
      `ADMIN_LOGIN_PASSWORD=replace-me\nADMIN_JWT_SECRET=${secret()}\nAI_PROVIDER_API_KEY=replace-me\nCLOUDFLARE_IMAGES_API_TOKEN=replace-me\n`)

    ok(`${cnt}개 파일 생성`)

    // ━━━ 6. 의존성 설치 ━━━

    step(6, TOTAL, '의존성 설치')
    await p.enter('pnpm install')
    sh('pnpm install', target)
    ok('pnpm install 완료')

    // ━━━ 7. Cloudflare 리소스 생성 ━━━

    step(7, TOTAL, 'Cloudflare 리소스 생성')

    const wDir = path.join(target, 'worker')

    // D1
    console.log(`\n  📦 D1 데이터베이스`)
    if (await p.confirm(`"${slug}" D1 생성?`)) {
      const out = sh(`npx wrangler d1 create ${slug}`, wDir, true)
      const m = out.match(/database_id\s*=\s*"([^"]+)"/) ?? out.match(/([a-f0-9-]{36})/)
      cfg.d1Id = m?.[1] ?? ''
      if (cfg.d1Id) ok(`D1 prod: ${cfg.d1Id}`)
      else warn('D1 ID를 파싱하지 못했습니다. wrangler.jsonc에서 직접 설정하세요.')
    }

    if (await p.confirm(`"${slug}-staging" D1 생성?`)) {
      const out = sh(`npx wrangler d1 create ${slug}-staging`, wDir, true)
      const m = out.match(/database_id\s*=\s*"([^"]+)"/) ?? out.match(/([a-f0-9-]{36})/)
      cfg.d1StagingId = m?.[1] ?? ''
      if (cfg.d1StagingId) ok(`D1 staging: ${cfg.d1StagingId}`)
    }

    // KV
    console.log(`\n  📦 KV 네임스페이스`)
    if (await p.confirm('KV 네임스페이스 생성?')) {
      const out = sh(`npx wrangler kv namespace create APP_KV`, wDir, true)
      info('KV 생성 결과:')
      const kvMatch = out.match(/id\s*=\s*"([^"]+)"/)
      if (kvMatch) info(`KV ID: ${kvMatch[1]} — wrangler.jsonc kv_namespaces에 반영하세요`)
    }

    // Vectorize
    if (vec) {
      console.log(`\n  📦 Vectorize 인덱스`)
      if (await p.confirm(`"${slug}-doc-index" Vectorize 생성?`)) {
        shSafe(`npx wrangler vectorize create ${slug}-doc-index --dimensions 384 --metric cosine`, wDir)
        ok('Vectorize 인덱스 생성')
      }
    }

    // R2
    if (ext) {
      console.log(`\n  📦 R2 버킷`)
      if (await p.confirm(`"${slug}-media" R2 버킷 생성?`, false)) {
        shSafe(`npx wrangler r2 bucket create ${slug}-media`, wDir)
        ok('R2 버킷 생성')
      }
    }

    // wrangler.jsonc 업데이트
    const wPath = path.join(wDir, 'wrangler.jsonc')
    let wContent = fs.readFileSync(wPath, 'utf-8')
    if (cfg.accountId) wContent = wContent.replace(/REPLACE_WITH_ACCOUNT_ID/g, cfg.accountId)
    if (cfg.d1Id) wContent = wContent.replace(/REPLACE_WITH_D1_DATABASE_ID/g, cfg.d1Id)
    if (cfg.d1StagingId) wContent = wContent.replace(/REPLACE_WITH_STAGING_D1_DATABASE_ID/g, cfg.d1StagingId)
    fs.writeFileSync(wPath, wContent)
    ok('wrangler.jsonc 업데이트')

    // ━━━ 8. D1 마이그레이션 ━━━

    step(8, TOTAL, 'D1 마이그레이션')

    console.log('  로컬 마이그레이션...')
    const ml = shSafe(`pnpm --filter @${scope}/worker db:migrate:local`, target)
    ml.ok ? ok('로컬 완료') : warn('로컬 실패 — 나중에 실행하세요')

    if (cfg.d1Id && await p.confirm('원격 D1(prod) 마이그레이션?')) {
      sh(`pnpm --filter @${scope}/worker db:migrate:remote`, target)
      ok('prod 마이그레이션 완료')
    }
    if (cfg.d1StagingId && await p.confirm('원격 D1(staging) 마이그레이션?')) {
      sh(`pnpm --filter @${scope}/worker db:migrate:remote:staging`, target)
      ok('staging 마이그레이션 완료')
    }

    // ━━━ 9. 시크릿 설정 ━━━

    step(9, TOTAL, 'Workers 시크릿')

    if (await p.confirm('Workers 시크릿을 설정하시겠습니까?')) {
      const pw = await p.ask('ADMIN_LOGIN_PASSWORD')
      const jwt = secret()
      if (pw) {
        execSync(`printf '%s' '${pw}' | npx wrangler secret put ADMIN_LOGIN_PASSWORD`, { cwd: wDir, stdio: 'inherit' })
        execSync(`printf '%s' '${jwt}' | npx wrangler secret put ADMIN_JWT_SECRET`, { cwd: wDir, stdio: 'inherit' })
        ok('ADMIN_LOGIN_PASSWORD + ADMIN_JWT_SECRET 설정')
      }
      if (aid && await p.confirm('AI_PROVIDER_API_KEY?', false)) {
        const k = await p.ask('AI_PROVIDER_API_KEY')
        if (k) execSync(`printf '%s' '${k}' | npx wrangler secret put AI_PROVIDER_API_KEY`, { cwd: wDir, stdio: 'inherit' })
      }
      if (await p.confirm('CLOUDFLARE_IMAGES_API_TOKEN?', false)) {
        const k = await p.ask('CLOUDFLARE_IMAGES_API_TOKEN')
        if (k) execSync(`printf '%s' '${k}' | npx wrangler secret put CLOUDFLARE_IMAGES_API_TOKEN`, { cwd: wDir, stdio: 'inherit' })
      }
    }

    // ━━━ 10. 빌드 & 배포 ━━━

    step(10, TOTAL, '빌드 & 배포')

    // 빌드
    await p.enter('프로덕션 빌드')
    sh('pnpm build', target)
    ok('빌드 완료')

    // 타입 체크
    console.log('  타입 체크...')
    const chk = shSafe('pnpm check', target)
    chk.ok ? ok('타입 체크 통과') : warn('타입 에러 있음 — 나중에 확인하세요')

    // 테스트
    console.log('  테스트...')
    const tst = shSafe('pnpm test', target)
    tst.ok ? ok('테스트 통과') : warn('테스트 실패 — 나중에 확인하세요')

    // 배포
    const deployTo = await p.ask('배포 대상 (staging / prod / skip)', 'staging')

    if (deployTo === 'staging') {
      sh(`pnpm --filter @${scope}/worker deploy:staging`, target)
      ok(`staging 배포 완료 → https://${slug}-staging.workers.dev`)
    } else if (deployTo === 'prod') {
      if (await p.confirm('⚠️  프로덕션 배포. 진행?', false)) {
        sh(`pnpm --filter @${scope}/worker deploy`, target)
        ok(`production 배포 완료 → https://${slug}.workers.dev`)
      }
    } else {
      info('배포 건너뜀')
    }

    // 헬스 체크
    if (deployTo !== 'skip') {
      const url = deployTo === 'staging' ? `https://${slug}-staging.workers.dev` : `https://${slug}.workers.dev`
      console.log(`\n  🏥 헬스 체크: ${url}/api/health`)
      const hc = shSafe(`curl -sf ${url}/api/health`, '.')
      hc.ok ? ok(`응답: ${hc.out.trim()}`) : warn('헬스 체크 실패 — DNS 전파를 기다려주세요')
    }

    // Git 초기 커밋
    sh('git init', target, true)
    if (await p.confirm('초기 커밋 생성?')) {
      sh('git add -A', target, true)
      sh('git commit -m "Initial scaffold from 옥토워커스 boilerplate"', target, true)
      ok('초기 커밋')
    }

    // GitHub 리포
    if (await p.confirm('GitHub 리포지토리를 생성하시겠습니까?', false)) {
      const ghCheck = shSafe('gh auth status', '.')
      if (!ghCheck.ok) {
        warn('gh CLI 로그인이 필요합니다')
        sh('gh auth login', target)
      }
      const vis = await p.ask('공개 여부 (public / private)', 'private')
      sh(`gh repo create ${slug} --${vis} --source=${target} --push`, target)
      ok(`GitHub 리포 생성 + push 완료`)
    }

    p.close()

    // ━━━ 완료 ━━━

    console.log()
    console.log('  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`  🎉 ${cfg.name} — 세팅 + 배포 완료!`)
    console.log('  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log()
    console.log(`  cd ${outDir}`)
    console.log('  pnpm dev')
    console.log()
    console.log('  Landing  → http://localhost:5173')
    console.log('  Admin    → http://localhost:5174')
    console.log('  Worker   → http://localhost:8787')
    console.log()
  } catch (err) {
    p.close()
    if ((err as NodeJS.ErrnoException).code === 'ERR_USE_AFTER_CLOSE') {
      console.log('\n  취소되었습니다.')
      process.exit(0)
    }
    throw err
  }
}

main().catch((err) => { console.error(err); process.exit(1) })
