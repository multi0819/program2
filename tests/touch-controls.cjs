const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const html=fs.readFileSync('index.html','utf8');
const code=html.match(/<script id="touch-controls">([\s\S]*?)<\/script>/)?.[1];
assert.ok(code,'시간 칸과 온도 터치 처리 필요');
function element(){return {listeners:{},dataset:{},setAttribute(){},addEventListener(n,f){this.listeners[n]=f}}}
const time=element(),row=element(),temp=element(),tempRow=element();
time.id='f1_startTime';time.value='08:00';time.closest=()=>row;temp.closest=()=>tempRow;
let picker,refresh=0;const window={ReportAndroid:{pickTime:(id,val)=>picker=[id,val]},autoFillKmaTemp:()=>{refresh++}};
vm.runInNewContext(code,{window,document:{querySelectorAll:q=>q.includes('time')?[time]:[temp]}});
row.listeners.click({target:{}});assert.deepEqual(picker,['f1_startTime','08:00']);
tempRow.listeners.click({preventDefault(){}});assert.equal(refresh,1);
console.log('시간 칸 전체 탭 / 온도 갱신 탭 통과');
