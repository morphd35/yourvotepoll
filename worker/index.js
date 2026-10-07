const PAGE=/*PAGE*/;
const json=(data,status=200,extra={})=>new Response(JSON.stringify(data),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store',...extra}});
const db=env=>{if(!env.DB)throw Error('Traffic storage unavailable');return env.DB};
const dayNow=()=>new Intl.DateTimeFormat('en-CA',{timeZone:'America/Chicago',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
async function total(env){return (await db(env).prepare('SELECT COALESCE(SUM(visitors),0) AS total FROM traffic_daily').first()).total;}
export default {async fetch(request,env){const url=new URL(request.url);try{
 if(url.pathname==='/api/visit'&&request.method==='POST'){
  if(request.headers.get('Origin')!==url.origin)return json({error:'Invalid origin'},403);
  const today=dayNow(),seen=request.headers.get('Cookie')?.split(';').some(c=>c.trim()==='vp_day='+today);
  if(!seen)await db(env).prepare('INSERT INTO traffic_daily(day,visitors) VALUES (?,1) ON CONFLICT(day) DO UPDATE SET visitors=visitors+1').bind(today).run();
  return json({total:await total(env)},200,{'Set-Cookie':`vp_day=${today}; Max-Age=172800; Path=/; HttpOnly; Secure; SameSite=Lax`});
 }
 if(url.pathname==='/api/traffic'&&request.method==='GET')return json({total:await total(env)});
 if(url.pathname==='/stats'){
  const email=request.headers.get('oai-authenticated-user-email'),id=request.headers.get('oai-authenticated-user-id');
  if(!email||!id)return new Response(null,{status:302,headers:{Location:'/signin-with-chatgpt?return_to=%2Fstats','Cache-Control':'no-store'}});
  if(!env.OWNER_EMAIL||email.toLowerCase()!==env.OWNER_EMAIL.toLowerCase())return new Response('This traffic view is private.',{status:403});
  const rows=(await db(env).prepare('SELECT day,visitors FROM traffic_daily ORDER BY day DESC LIMIT 60').all()).results;
  const n=await total(env),today=dayNow();
  return new Response(`<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>YourVotePoll traffic</title><style>body{font:18px system-ui;max-width:760px;margin:50px auto;padding:24px;background:#0b1323;color:#edf3ff}a{color:#80b1ff}table{width:100%;border-collapse:collapse}td,th{padding:16px;text-align:left;border-bottom:1px solid #32405a}h1{font-size:36px}strong{font-size:32px}</style><h1>YourVotePoll traffic</h1><p><strong>${n.toLocaleString()}</strong> visitor-days since tracking began</p><p>Today: ${rows.find(r=>r.day===today)?.visitors||0}. Days use Central time.</p><table><tr><th>Date</th><th>Visitors</th></tr>${rows.map(r=>`<tr><td>${r.day}</td><td>${r.visitors}</td></tr>`).join('')}</table><p>Approximate browser counts: one per browser per day. Returning on another day counts again. No party choices, IP addresses, or personal visitor records are saved.</p><a href="/">Back to the poll</a></html>`,{headers:{'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store'}});
 }
 if(url.pathname==='/'&&request.method==='GET')return new Response(PAGE,{headers:{'Content-Type':'text/html; charset=utf-8'}});
 return new Response('Not found',{status:404});
 }catch(error){console.error('Traffic request failed',error.message);return json({error:'Traffic count temporarily unavailable'},503)}}};
