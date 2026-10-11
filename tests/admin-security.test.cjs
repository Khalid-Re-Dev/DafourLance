const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript')
function load(file,mocks={},env={AUTH_SECRET:'x'.repeat(40)}){const exports={};vm.runInNewContext(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText,{exports,Buffer,console,process:{env},require:n=>n in mocks?mocks[n]:require(n)});return exports}
test('signed sessions reject forgery, expiry, future issuance and secret rotation',()=>{
 const env={AUTH_SECRET:'x'.repeat(40)},a=load('lib/session-token.ts',{},env),now=Date.now(),token=a.signSession('admin','hash',now)
 assert.equal(a.verifySession(token,now).userId,'admin');assert.equal(a.verifySession(token,now+86400000),null)
 assert.equal(a.verifySession(a.signSession('admin','hash',now+1000),now),null)
 for(const bad of ['garbage',token+'extra',token+'.part',token.slice(0,-5)+'abcde'])assert.equal(a.verifySession(bad,now),null)
 const payload=Buffer.from(JSON.stringify({userId:'admin',createdAt:now})).toString('base64');assert.equal(a.verifySession(require('crypto').createHash('sha256').update(payload).digest('hex')+'.'+payload),null)
 env.AUTH_SECRET='y'.repeat(40);assert.equal(a.verifySession(token,now),null)
 env.AUTH_SECRET='';assert.throws(()=>a.signSession('admin','hash'))
})
test('session requires current admin role and password revision',async()=>{
 const token=load('lib/session-token.ts');let user={id:'1',email:'a@b.c',role:'admin',name:'Admin',password:'hash'},value=token.signSession('1','hash')
 const db={user:{findUnique:async()=>user}},auth=load('lib/auth.ts',{'next/headers':{cookies:async()=>({get:()=>({value})})},'next/navigation':{redirect(){throw Error('redirect')}},'./db':db,'./session-token':token,'./request-limit':{allowRequest:()=>true}})
 assert.equal((await auth.getSession()).userId,'1');user.role='viewer';assert.equal(await auth.getSession(),null);user.role='admin';user.password='changed';assert.equal(await auth.getSession(),null)
})
test('all exported dashboard actions reject unauthenticated access before database access',async()=>{
 let count=0
 for(const dir of fs.readdirSync('app/admin/(protected)')){
  const file=`app/admin/(protected)/${dir}/actions.ts`;if(!fs.existsSync(file))continue
  const db=new Proxy({},{get(_o,key){if(key==='__esModule')return false;throw Error('Database accessed before auth')}})
  const actions=load(file,{'@/lib/db':db,'@/lib/auth':{requireAuth:async()=>{throw Error('auth-required')}},'next/cache':{revalidatePath(){}}})
  for(const action of Object.values(actions)){await assert.rejects(()=>action(),/auth-required/);count++}
 }
 assert.ok(count>=40)
})
test('request limiter enforces and expires a bounded window',()=>{
 const a=load('lib/request-limit.ts');assert.equal(a.allowRequest('x',2,100,0),true);assert.equal(a.allowRequest('x',2,100,1),true);assert.equal(a.allowRequest('x',2,100,2),false);assert.equal(a.allowRequest('x',2,100,100),true)
})
