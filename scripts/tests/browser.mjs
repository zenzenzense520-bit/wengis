// 无新增依赖：真实 Edge 验证筛选、地图源、统计、重置及移动布局。
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const profile = path.join(root, 'logs', `edge-${process.pid}`);
const edge = [process.env['PROGRAMFILES(X86)'], process.env.PROGRAMFILES].filter(Boolean)
  .map(base => path.join(base, 'Microsoft/Edge/Application/msedge.exe')).find(p => fs.existsSync(p));
const bash = process.env.WENGIS_BASH || 'D:\\Git\\bin\\bash.exe';
const url = 'http://127.0.0.1:43210';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
let server, browser, socket;
let requestId = 0;
async function command(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++requestId;
    const listener = event => {
      const message = JSON.parse(event.data);
      if (message.id !== id) return;
      clearTimeout(timer);
      socket.removeEventListener('message', listener);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
    };
    const timer = setTimeout(() => {
      socket.removeEventListener('message', listener);
      reject(new Error(`浏览器命令超时：${method}`));
    }, 10000);
    socket.addEventListener('message', listener);
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const result = await command('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
async function main() {
  assert.ok(edge && fs.existsSync(bash), '需要 Windows Edge 和 Git Bash');
  try {
    await fetch(url);
    throw new Error('测试端口 43210 已占用，请先关闭该端口上的服务');
  } catch (error) {
    if (error.message.includes('已占用')) throw error;
  }
  server = spawn(bash, ['scripts/dev.sh', '--port', '43210'], { cwd: root, windowsHide: true, stdio: 'ignore' });
  try {
  let ready = false;
  for (let i = 0; i < 60; i++) {
    try { ready = (await fetch(url)).ok; } catch { ready = false; }
    if (ready) break;
    await delay(250);
  }
  assert.ok(ready, '开发服务未就绪，查看 logs/dev.log');
  browser = spawn(edge, ['--headless', '--disable-gpu', '--no-first-run', '--remote-debugging-port=0',
    `--user-data-dir=${profile}`, url], { windowsHide: true, stdio: 'ignore' });
  const portFile = path.join(profile, 'DevToolsActivePort');
  for (let i = 0; i < 40 && !fs.existsSync(portFile); i++) await delay(250);
  assert.ok(fs.existsSync(portFile), 'Edge 调试端口未就绪');
  const port = Number(fs.readFileSync(portFile, 'utf8').split('\n')[0]);
  const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
  const target = targets.find(t => t.type === 'page' && t.url.startsWith(url));
  assert.ok(target, 'Edge 页面未找到');
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.onopen = resolve; socket.onerror = reject; });
  for (let i = 0; i < 60; i++) {
    ready = await evaluate('Boolean(window.__viewer && document.querySelector("#filter-summary").textContent.includes("47 / 47"))');
    if (ready) break;
    await delay(250);
  }
  assert.ok(ready, '页面未初始化');
  await command('Runtime.enable');
  const errors = [];
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails);
  });
  const initial = await evaluate(`({legend:document.querySelectorAll('.legend-item').length,
    basemap:document.querySelector('input[name="basemap"]:checked').value,
    count:window.__viewer.spotsHandle.layer.getSource().getSource().getFeatures().length})`);
  assert.equal(initial.legend, 12);
  assert.equal(initial.basemap, 'arcgis-street');
  assert.equal(initial.count, 47);
  await evaluate(`(() => {
    const k=document.querySelector('#filter-keyword');k.value='故宫';k.dispatchEvent(new Event('input',{bubbles:true}));
  })()`);
  const filtered = await evaluate(`({summary:document.querySelector('#filter-summary').textContent,
    count:window.__viewer.spotsHandle.layer.getSource().getSource().getFeatures().length,
    statistics:document.querySelector('#statistics').textContent})`);
  assert.ok(filtered.summary.includes('1 / 47'));
  assert.equal(filtered.count, 1);
  assert.ok(filtered.statistics.includes('宫殿坛庙 1'));
  // 通过真实鼠标事件验证筛选后点位仍能打开原有弹窗。
  await delay(300);
  const point = await evaluate(`(() => {
    const viewer=window.__viewer;
    const f=viewer.spotsHandle.layer.getSource().getSource().getFeatures()[0];
    const pixel=viewer.map.getPixelFromCoordinate(f.getGeometry().getCoordinates());
    const rect=document.querySelector('#map').getBoundingClientRect();
    return {x:rect.left+pixel[0],y:rect.top+pixel[1]};
  })()`);
  await command('Input.dispatchMouseEvent', {type:'mousePressed',button:'left',clickCount:1,...point});
  await command('Input.dispatchMouseEvent', {type:'mouseReleased',button:'left',clickCount:1,...point});
  await delay(400);
  assert.ok((await evaluate("document.querySelector('#popup-content').textContent")).includes('故宫博物院'));
  assert.equal(await evaluate("document.querySelector('#popup').classList.contains('hidden')"), false);
  await evaluate(`(() => {
    const k=document.querySelector('#filter-keyword');k.value='不存在的景区';k.dispatchEvent(new Event('input',{bubbles:true}));
  })()`);
  assert.equal(await evaluate("document.querySelector('#empty-results').classList.contains('hidden')"), false);
  assert.equal(await evaluate('window.__viewer.spotsHandle.layer.getSource().getSource().getFeatures().length'), 0);
  await evaluate("document.querySelector('#filters').reset()");
  assert.ok((await evaluate("document.querySelector('#filter-summary').textContent")).includes('47 / 47'));
  await evaluate(`(() => {
    const cluster=document.querySelector('#layer-cluster');cluster.click();
    const p=document.querySelector('#filter-province');p.value='北京市';p.dispatchEvent(new Event('change',{bubbles:true}));
  })()`);
  assert.equal(await evaluate('window.__viewer.spotsHandle.layer.getSource().getFeatures().length'), 6);
  assert.equal(await evaluate("document.querySelector('#layer-cluster').checked"), false);
  await evaluate("document.querySelector('#filters').reset()");
  await command('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true });
  assert.equal(await evaluate('document.documentElement.scrollWidth <= window.innerWidth'), true);
  const screenshot = await command('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(root, 'logs', 'browser-mobile.png'), Buffer.from(screenshot.data, 'base64'));
  assert.equal(errors.length, 0, '页面交互出现运行时异常');
  console.log('通过：Edge 47 点初始化、底图状态、筛选地图统计联动、空结果、重置、散点筛选与移动布局。');
} finally {
  if (socket) socket.close();
  // 仅结束本测试启动的进程树；临时目录保持在 logs 内。
  for (const child of [browser, server]) if (child?.pid) {
    spawnSync('taskkill', ['/PID', String(child.pid), '/T', '/F'], { windowsHide: true, stdio: 'ignore' });
  }
  // Windows 下 Bash 可能已退出，按项目路径验证并清理遗留测试服务。
  const cleanup = spawnSync('powershell.exe', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-File',
    path.join(root, 'scripts/tests/stop-server.ps1')], { windowsHide: true, encoding: 'utf8' });
  if (cleanup.status !== 0) throw new Error(`测试服务清理失败：${cleanup.stderr || cleanup.error}`);
  await delay(800);
  if (path.resolve(profile).startsWith(path.resolve(root, 'logs') + path.sep)) {
    try { fs.rmSync(profile, { recursive: true, force: true }); }
    catch (error) { console.warn(`临时目录稍后清理：${error.message}`); }
  }
}
}
main().catch(error => { console.error(error); process.exitCode = 1; });
