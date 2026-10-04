const {test}=require('node:test')
const assert=require('node:assert/strict')
const fs=require('node:fs')
const vm=require('node:vm')
const ts=require('typescript')
const {renderToStaticMarkup}=require('react-dom/server')
const component={}
vm.runInNewContext(ts.transpileModule(fs.readFileSync('components/narration-feedback.tsx','utf8'),{
  compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,target:ts.ScriptTarget.ES2020},
}).outputText,{exports:component,require})
const render=props=>renderToStaticMarkup(component.NarrationFeedback({language:'ar',status:'idle',error:null,isMuted:false,onPlay(){},...props}))
test('a missing Arabic voice is explained visibly with a manual playback action',()=>{
  const html=render({status:'unavailable',error:'no-matching-voice'})
  assert.match(html,/لم يتوفر صوت عربي/);assert.match(html,/role="status"/);assert.match(html,/<button/);assert.match(html,/تشغيل الصوت/)
})
test('blocked speech offers a gesture, while loading, speaking and mute hide playback',()=>{
  assert.match(render({language:'en',status:'blocked'}),/Autoplay was blocked/)
  assert.match(render({language:'en',status:'blocked'}),/Play audio/)
  for(const state of [{status:'loading'},{status:'speaking'},{isMuted:true}])assert.doesNotMatch(render(state),/<button/)
  assert.match(render({isMuted:true}),/الصوت مكتوم/)
})
