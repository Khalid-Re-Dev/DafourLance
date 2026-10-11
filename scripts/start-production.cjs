const {spawnSync,spawn}=require('node:child_process')
const {existsSync}=require('node:fs')
const path=require('node:path')
function fail(message){console.error(message);process.exit(1)}
if (!/^postgres(ql)?:\/\//.test(process.env.DATABASE_URL||'')) fail('Set DATABASE_URL to a PostgreSQL connection string.')
if (Buffer.byteLength(process.env.AUTH_SECRET||'')<32) fail('Set AUTH_SECRET to at least 32 random bytes.')
const port=process.env.PORT||'3000'
if (!/^\d+$/.test(port)||+port<1||+port>65535) fail('PORT must be between 1 and 65535.')
const migration=spawnSync(process.execPath,[require.resolve('prisma/build/index.js'),'migrate','deploy'],{stdio:'inherit'})
if(migration.status!==0)fail('Migration failed. Review the documented baseline for existing databases; no automatic reset is performed.')
if(process.env.BOOTSTRAP_DATABASE==='true'){
 const seed=spawnSync(process.execPath,[path.join(__dirname,'seed.js')],{stdio:'inherit'})
 if(seed.status!==0)fail('Initial database setup failed.')
}
const standalone=path.resolve('.next/standalone/server.js')
const server=existsSync(standalone)?spawn(process.execPath,[standalone],{stdio:'inherit',env:{...process.env,HOSTNAME:'0.0.0.0',PORT:port}}):spawn(process.execPath,[require.resolve('next/dist/bin/next'),'start','-H','0.0.0.0','-p',port],{stdio:'inherit'})
for(const signal of ['SIGTERM','SIGINT'])process.on(signal,()=>server.kill(signal))
server.on('exit',code=>process.exit(code??1))
