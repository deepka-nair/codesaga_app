export const PLATFORMS = [{x:0,y:510,w:1500,h:90},{x:240,y:405,w:150,h:24},{x:480,y:320,w:155,h:24},{x:735,y:395,w:155,h:24},{x:1000,y:340,w:170,h:24},{x:1190,y:474,w:60,h:36}];
export const spawn = () => ({x:75,y:434,vx:0,vy:0,grounded:false,facing:1});
export function step(p, keys, dt) {
  const next={...p};
  next.vx=((keys.has('ArrowRight')?1:0)-(keys.has('ArrowLeft')?1:0))*260;
  if(next.vx) next.facing=Math.sign(next.vx);
  next.x=Math.max(0,Math.min(1448,next.x+next.vx*dt));
  // Resolve horizontal walls before applying vertical movement.
  for(const b of PLATFORMS) if(next.x+42>b.x && next.x<b.x+b.w && p.y+76>b.y+1 && p.y<b.y+b.h) next.x=next.vx>0?b.x-42:b.x+b.w;
  if(keys.has('jump')&&p.grounded) {next.vy=-570;next.grounded=false;}
  next.vy+=1450*dt;next.y+=next.vy*dt;next.grounded=false;
  for(const b of PLATFORMS) if(next.x+38>b.x&&next.x+4<b.x+b.w){
    if(next.vy>=0&&p.y+76<=b.y+1&&next.y+76>=b.y){next.y=b.y-76;next.vy=0;next.grounded=true;}
    else if(next.vy<0&&p.y>=b.y+b.h&&next.y<b.y+b.h){next.y=b.y+b.h;next.vy=0;}
  }
  return next.y>650?spawn():next;
}
export const isTyping = target => !!target?.closest?.('input,textarea,select,[contenteditable="true"],[role="textbox"],.monaco-editor,.cm-editor');
