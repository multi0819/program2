const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
const code=html.match(/function buildMsg\(idx\) \{[^]*?\n\}/)[0];
const values={f1_temp:'20',f1_startTime:'08:00',f1_endTime:'19:00',f1_fcuStartTime:'09:30'};
const ctx={document:{getElementById:id=>({value:values[id]||''})},getBlock:()=>2,getSelected:g=>g==='chiller1'?['터보']:['C'],buildAhuScheduleLine:()=>'-',fmtTime:t=>t,reportNote:()=>'-',chillerRunStatus:()=> '정상 가동'};
vm.createContext(ctx);vm.runInContext(code,ctx);
assert.ok(ctx.buildMsg(1).includes('■ FCU : C동 09:30~19:00 가동'),'FCU가 냉동기 시간 대신 자체 시간을 써야 함');
values.f1_fcuStartTime='';assert.ok(!ctx.buildMsg(1).includes('■ FCU : C동 08:00'),'빈 FCU 시간을 냉동기 시간으로 대체하면 안 됨');
console.log('FCU 독립 시간 / 미입력 처리 통과');
