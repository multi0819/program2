const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
const code=html.match(/function chillerRunStatus\([^]*?\n}/)?.[0];
assert.ok(code,'냉동기 가동시간 판정 함수 필요');
const ctx={};vm.createContext(ctx);vm.runInContext(code,ctx);
for(const [time,expected] of [['10:01','가동 예정'],['10:00','정상 가동'],['09:59','정상 가동']]) assert.equal(ctx.chillerRunStatus(time,new Date(2026,9,13,10,0,50)),expected);
assert.ok(html.includes('${chillerRunStatus(st)}'),'보고 메시지에 시간 판정 적용 필요');
console.log('미래/현재/과거 설정시간 판정 통과');
