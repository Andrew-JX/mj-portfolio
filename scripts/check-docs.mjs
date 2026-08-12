#!/usr/bin/env node
// Machine gate for the rules AGENTS.md states as absolute.
//
// A rule without a gate is a suggestion, so every check here guards an
// invariant that has already drifted in this repository or that fails only in
// production. Run with --self-test to prove each check can still fail; a gate
// that cannot fail protects nothing.

import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("..", import.meta.url));

const SOURCE_FILES = [
  "AGENTS.md",
  "package.json",
  "index.html",
  "src/App.tsx",
  ".github/workflows/deploy-tencent.yml",
  "ops/deploy-mj-portfolio.sh",
  "ops/install-mj-deploy-key.sh",
];

// Enumerate what Git tracks, not what happens to sit on this disk. A manifest
// built from the local filesystem describes one working copy: `docs/` is fully
// gitignored here, so it exists locally and is absent from a fresh checkout.
// Tracked paths are the same on every machine and in CI.
function realDirectories() {
  const tracked = execFileSync("git", ["ls-files"], { cwd: root, encoding: "utf8" }).split("\n").filter(Boolean);
  const directories = new Set();

  for (const file of tracked) {
    const parts = file.split("/");
    if (parts.length < 2 || parts[0].startsWith(".")) continue;
    // `src` is described by its children, not as one entry.
    if (parts[0] === "src") {
      if (parts.length > 2) directories.add(`src/${parts[1]}`);
    } else {
      directories.add(parts[0]);
    }
  }
  return [...directories].sort();
}

function loadContext() {
  const files = {};
  for (const path of SOURCE_FILES) files[path] = readFileSync(join(root, path), "utf8");
  return { files, directories: realDirectories() };
}

// --- checks -----------------------------------------------------------------

function manifestRows(agents) {
  const section = agents.split("<!-- machine-checked: architecture-manifest -->")[1] ?? "";
  return [...section.split("\n## ")[0].matchAll(/^\|\s*`([^`]+)`\s*\|/gm)].map((m) => m[1]);
}

const checks = [
  {
    id: "architecture-manifest",
    // A manifest nobody verifies is a map of a building that has been remodelled.
    describe: "AGENTS.md 目录清单与真实目录双向一致",
    run({ files, directories }) {
      const declared = manifestRows(files["AGENTS.md"]);
      const problems = [];
      if (declared.length === 0) return ["AGENTS.md 里找不到 architecture-manifest 表格"];

      for (const dir of declared) {
        if (!directories.includes(dir)) problems.push(`清单里有 \`${dir}\`，但 Git 里没有跟踪这个目录下的任何文件`);
      }
      for (const dir of directories) {
        if (!declared.includes(dir)) problems.push(`\`${dir}\` 存在于仓库，但没写进 AGENTS.md 目录清单`);
      }
      return problems;
    },
    breaks: [
      (ctx) => ({ ...ctx, directories: [...ctx.directories, "src/undeclared"] }),
      (ctx) => ({ ...ctx, files: { ...ctx.files, "AGENTS.md": ctx.files["AGENTS.md"].replace("| `ops` |", "| `ops-renamed` |") } }),
    ],
  },
  {
    id: "declared-commands",
    // AGENTS.md naming a command that package.json does not define sends the
    // next window to run something that does not exist.
    describe: "AGENTS.md 提到的 npm 命令在 package.json 里存在",
    run({ files }) {
      const scripts = Object.keys(JSON.parse(files["package.json"]).scripts ?? {});
      const named = new Set([...files["AGENTS.md"].matchAll(/`npm run ([a-z:_-]+)`/g)].map((m) => m[1]));
      return [...named].filter((name) => !scripts.includes(name)).map((name) => `AGENTS.md 写着 \`npm run ${name}\`，package.json 没有这个 script`);
    },
    breaks: [(ctx) => ({ ...ctx, files: { ...ctx.files, "AGENTS.md": `${ctx.files["AGENTS.md"]}\n运行 \`npm run nonexistent\`。\n` } })],
  },
  {
    id: "icp-marker",
    // The ICP number lives in five files. Changing it in four of them leaves a
    // deploy gate grepping for a string the page no longer contains.
    describe: "备案号在页面、构建校验和发布脚本里完全一致",
    run({ files }) {
      const canonical = files["index.html"].match(/(苏ICP备[\d]+号-\d+)/)?.[1];
      if (!canonical) return ["index.html 的 noscript 兜底里找不到备案号"];

      const problems = [];
      for (const path of ["src/App.tsx", ".github/workflows/deploy-tencent.yml", "ops/deploy-mj-portfolio.sh"]) {
        if (!files[path].includes(canonical)) problems.push(`${path} 里没有与 index.html 一致的备案号 ${canonical}`);
      }
      return problems;
    },
    breaks: [
      (ctx) => ({ ...ctx, files: { ...ctx.files, "src/App.tsx": ctx.files["src/App.tsx"].replace(/苏ICP备\d+号-\d+/, "苏ICP备0000000000号-9") } }),
      (ctx) => ({ ...ctx, files: { ...ctx.files, "ops/deploy-mj-portfolio.sh": ctx.files["ops/deploy-mj-portfolio.sh"].replaceAll(/苏ICP备\d+号-\d+/g, "苏ICP备0000000000号-9") } }),
    ],
  },
  {
    id: "release-id-contract",
    // The workflow builds the release id and the server-side forced command
    // parses it. They are edited in different files, and a mismatch is only
    // observable as a rejected production deploy.
    describe: "workflow 生成的 release id 能被 ops 发布脚本的正则接受",
    run({ files }) {
      const workflow = files[".github/workflows/deploy-tencent.yml"];
      const script = files["ops/deploy-mj-portfolio.sh"];

      const template = workflow.match(/RELEASE_ID:\s*(.+)/)?.[1]?.trim();
      const verb = workflow.match(/"(\w+) \$\{RELEASE_ID\}"/)?.[1];
      const pattern = script.match(/=~\s*\^?\^([^"]+?)\$\s*\]\]/)?.[1];
      if (!template || !verb || !pattern) return ["解析不出 RELEASE_ID 模板、ssh 动词或 ops 正则，三者之一的写法变了"];

      const samples = { "github.sha": "a".repeat(40), "github.run_id": "31398012907", "github.run_attempt": "1" };
      let rendered = template;
      for (const [key, value] of Object.entries(samples)) rendered = rendered.replaceAll(`\${{ ${key} }}`, value);
      if (rendered.includes("${{")) return [`RELEASE_ID 模板里有未知的 GitHub 变量：${rendered}`];

      const regex = new RegExp(`^${pattern.replace(/\\ /g, " ")}$`);
      return regex.test(`${verb} ${rendered}`)
        ? []
        : [`workflow 会发送 \`${verb} ${rendered}\`，ops 脚本的正则 /${pattern}/ 不接受它`];
    },
    breaks: [
      (ctx) => ({ ...ctx, files: { ...ctx.files, ".github/workflows/deploy-tencent.yml": ctx.files[".github/workflows/deploy-tencent.yml"].replace("${{ github.sha }}-", "${{ github.sha }}.") } }),
      (ctx) => ({ ...ctx, files: { ...ctx.files, ".github/workflows/deploy-tencent.yml": ctx.files[".github/workflows/deploy-tencent.yml"].replace('"deploy ${RELEASE_ID}"', '"publish ${RELEASE_ID}"') } }),
    ],
  },
  {
    id: "forced-command-target",
    // The installer pins an absolute path on the server. Renaming the script in
    // the repository without noticing leaves the key pointing at nothing.
    describe: "受限密钥的强制命令指向 ops 里真实存在的发布脚本",
    run({ files }) {
      const target = files["ops/install-mj-deploy-key.sh"].match(/command="([^"]+)"/)?.[1];
      if (!target) return ["install-mj-deploy-key.sh 里解析不出 forced command"];

      const expected = `ops/${target.split("/").pop()}.sh`;
      return files[expected] === undefined
        ? [`强制命令指向 ${target}，但仓库里没有 ${expected}`]
        : [];
    },
    breaks: [(ctx) => ({ ...ctx, files: { ...ctx.files, "ops/install-mj-deploy-key.sh": ctx.files["ops/install-mj-deploy-key.sh"].replace("/usr/local/sbin/deploy-mj-portfolio", "/usr/local/sbin/deploy-renamed") } })],
  },
];

// --- runners ----------------------------------------------------------------

function report(context) {
  let failed = 0;
  for (const check of checks) {
    const problems = check.run(context);
    if (problems.length === 0) {
      console.log(`  ok   ${check.id} · ${check.describe}`);
    } else {
      failed += 1;
      console.log(`  FAIL ${check.id} · ${check.describe}`);
      for (const problem of problems) console.log(`         ${problem}`);
    }
  }
  return failed;
}

function selfTest(context) {
  let failed = 0;
  for (const check of checks) {
    check.breaks.forEach((mutate, index) => {
      const problems = check.run(mutate(structuredClone(context)));
      if (problems.length > 0) {
        console.log(`  ok   ${check.id}[${index}] 被破坏时确实报错`);
      } else {
        failed += 1;
        console.log(`  FAIL ${check.id}[${index}] 被破坏后仍然通过，这个检查守不住它声称保护的东西`);
      }
    });
  }
  return failed;
}

const context = loadContext();
const isSelfTest = process.argv.includes("--self-test");
console.log(isSelfTest ? "check:docs 负向控制" : "check:docs");
const failures = isSelfTest ? selfTest(context) : report(context);
console.log(failures === 0 ? "全部通过" : `${failures} 项失败`);
process.exit(failures === 0 ? 0 : 1);
