const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8'),values={f1_temp:'10.3',h1_temp:'50',h1_time:'06:30',h1_exclude:'D동 존밸브 (6F~11F) 제외임',h1_ahu:'E,F동 - 06:30 가동\nD동 07:30 가동 예정임',f2_temp:'14',h2_temp:'50',h2_time:'19:00',h2_zoneTime:'19:00',h2_ahu:'F동(2,3F 제외) 16:30-OFF\nD,E,F(2,3F)동 19:00-OFF'};
const ctx={document:{body:{classList:{contains:()=>true}},getElementById:id=>({value:values[id]||''})},getBlock:()=>2,reportNote:()=>'이상없음'};
vm.runInNewContext(html.slice(html.indexOf('function heatingReport'),html.indexOf('function updatePreview')),ctx);
const a=ctx.buildMsg(1),b=ctx.buildMsg(2);
for(const line of ['10.3℃','50℃(06:30 기준) - 운전','Open','D동 존밸브 (6F~11F) 제외임','D동 07:30 가동 예정임','동파방지 운전 : 해당없음'])assert.ok(a.includes(line));
for(const line of ['14℃','50℃ 19:00 - OFF','Zone V/V : 19:00 - OFF','16:30-OFF','D,E,F(2,3F)동 19:00-OFF'])assert.ok(b.includes(line));
assert.ok(!/냉동기|냉 동 기/.test(a+b));console.log('Heating start and completion reports passed');
