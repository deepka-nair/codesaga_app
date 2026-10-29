import React, {useEffect,useRef,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {ArrowLeft, ArrowRight, ArrowUp, Flag, Coins, Heart, Flame, Volume2, VolumeX, Settings, X, RotateCcw, MessageCircle, BookOpen} from 'lucide-react';
import useStore from '../../store/useStore';
import {getCharacterById} from '../../data/characterSprites';
import Hero from './Hero';
import {PLATFORMS,spawn,step,isTyping} from './physics';
import './platform.css';

export default function PlatformWorld({mission,chapter,solved,children,onNext,chapters,onChapter,unlocked,guest}) {
 const navigate=useNavigate();const state=useStore(); const character=getCharacterById(state.character||'m1');
 const [player,setPlayer]=useState(spawn);const keys=useRef(new Set());const [dialogue,setDialogue]=useState(0);const [panel,setPanel]=useState(false);const [settings,setSettings]=useState(false);const [reached,setReached]=useState(false); const [found,setFound]=useState([]);
 const lines=[`Welcome to the sky district, ${character.name}. I'm Aria, your guide. A new case is waiting beyond the islands.`, 'Use ← and → to explore. Press ↑ or Space to jump. The golden markers are trail tokens; your mission earns the real XP and coins.',mission.story];
 const paused=dialogue!==null||panel||settings;
 useEffect(()=>{setPlayer(spawn());setDialogue(0);setPanel(false);setReached(false);setFound([]);keys.current.clear();},[mission.id]);
 useEffect(()=>{keys.current.clear();},[paused]);
 useEffect(()=>{
   if(reached)return;
   const down=e=>{
    if(isTyping(e.target))return;
    if(dialogue!==null){if(e.key.startsWith('Arrow'))e.preventDefault();if(['Enter',' '].includes(e.key)){e.preventDefault();if(!e.repeat)setDialogue(d=>d===lines.length-1?null:d+1);}return;}
    if(panel||settings)return;
    if(e.target.closest?.('button') && [' ','Enter'].includes(e.key))return;
    if(['ArrowLeft','ArrowRight','ArrowUp',' '].includes(e.key)){e.preventDefault();if(e.key==='ArrowUp'||e.key===' '){if(!e.repeat)keys.current.add('jump');}else keys.current.add(e.key);}
    if(e.key.toLowerCase()==='e')setPanel(true);
   };
   const up=e=>{keys.current.delete(e.key);}; const clear=()=>keys.current.clear();
   window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',clear);document.addEventListener('visibilitychange',clear);
   return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',clear);document.removeEventListener('visibilitychange',clear);clear();};
 },[dialogue,panel,settings,reached,lines.length]);
 useEffect(()=>{
  if(paused||reached)return;
  let frame,last;const tick=time=>{const dt=Math.min((time-(last??time))/1000,.025);last=time;const input=new Set(keys.current);keys.current.delete('jump');setPlayer(p=>step(p,input,dt));frame=requestAnimationFrame(tick);};frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);
 },[paused,reached]);
 useEffect(()=>{
  if(player.x>1350){if(solved)setReached(true);else setPanel(true);}
  const markers=[{x:285,y:365},{x:530,y:280},{x:790,y:355},{x:1050,y:300}];
  markers.forEach((c,i)=>{if(Math.abs(player.x-c.x)<48&&Math.abs(player.y+30-c.y)<60)setFound(f=>f.includes(i)?f:[...f,i]);});
 },[player,solved]);
 const touch=(key)=>({onPointerDown:e=>{e.preventDefault();e.currentTarget.setPointerCapture(e.pointerId);keys.current.add(key);},onPointerUp:()=>keys.current.delete(key),onPointerCancel:()=>keys.current.delete(key),onLostPointerCapture:()=>keys.current.delete(key)});
 return <main className="saga-game" aria-label="SQL platform adventure">
  <header className="saga-hud"><button className="saga-profile" onClick={()=>navigate('/profile')}><Hero accent={character.accentColor} hair={character.hairColor} portrait/><span><b>{character.name}</b><small>LV {state.level} · {state.xp} XP</small><progress value={state.xp%500} max="500"/></span></button><div className="saga-stats"><span><Coins/> {state.coins}</span><span><Heart/> {state.hearts}</span><span><Flame/> {state.streak}<small> day streak</small></span></div><div className="saga-tools"><button aria-label="Toggle sound" onClick={state.toggleMute}>{state.isMuted?<VolumeX/>:<Volume2/>}</button><button aria-label="Settings and chapters" onClick={()=>setSettings(true)}><Settings/></button></div></header>
  <div className="saga-location"><span>WORLD 01 / SQL</span><h1>The Sky District</h1><p>Chapter {chapter.id} · {chapter.title}{guest?' · Guest preview':''}</p></div>
  <div className="saga-cloud cloud-one"/><div className="saga-cloud cloud-two"/><div className="saga-cloud cloud-three"/>
  <div className="saga-distant">{[0,1,2,3,4].map(i=><div className="saga-island" key={i} style={{left:`${i*24-4}%`,top:`${(i%2)*75}px`,transform:`scale(${.6+i*.09})`}}><div className="saga-city">{[0,1,2,3,4].map(j=><i key={j} style={{height:35+((i+j)*37)%110}}/>)}</div></div>)}</div>
  <div className="saga-viewport"><div className="saga-stage" style={{transform:`translateX(clamp(min(0px, calc(100vw - 1500px)), calc(35vw - ${player.x}px), 0px))`}}>
   {PLATFORMS.map((p,i)=><div key={i} className={`saga-platform ${i===0?'saga-ground':i===5?'saga-obstacle':''}`} style={{left:p.x,top:p.y,width:p.w,height:p.h}}/>)}
   {[{x:285,y:365},{x:530,y:280},{x:790,y:355},{x:1050,y:300}].map((c,i)=>!found.includes(i)&&<div key={i} className="saga-token" style={{left:c.x,top:c.y}}>✦</div>)}
   <button className="saga-terminal" style={{left:610,top:446}} onClick={()=>setPanel(true)} aria-label="Open mission terminal"><BookOpen/><span>SQL<br/>TERMINAL</span></button>
   <div className="saga-flower" style={{left:180}}>✿</div><div className="saga-flower" style={{left:950}}>✿</div>
   <div className="saga-player" data-testid="player" data-x={player.x.toFixed(1)} data-y={player.y.toFixed(1)} style={{left:player.x,top:player.y,transform:`scaleX(${player.facing})`}}><Hero accent={character.accentColor} hair={character.hairColor}/></div>
   <div className={`saga-flag ${solved?'unlocked':''}`}><Flag size={66}/><span>{solved?'CASE SOLVED':'SOLVE TO UNLOCK'}</span></div>
  </div></div>
  <button className="saga-quest" onClick={()=>setPanel(true)}><span>YOUR QUEST · {found.length}/4 TRAIL TOKENS</span><strong>{mission.title}</strong><small>{solved?'✓ Solved! Reach the flag to continue.':'Open mission ↗'}</small></button>
  <footer className="saga-bottom"><button onClick={()=>navigate('/worlds')}>← Worlds</button><span>← → Move <kbd>↑ / Space</kbd> Jump <kbd>E</kbd> Mission</span><button aria-label="Restart platform run" onClick={()=>{setPlayer(spawn());setReached(false);setFound([]);keys.current.clear();}}><RotateCcw size={16}/> Restart</button><button onClick={()=>setDialogue(0)}><MessageCircle size={16}/> Guide</button></footer>
  {!paused&&!reached&&<div className="saga-touch"><div><button aria-label="Move left" {...touch('ArrowLeft')}><ArrowLeft/></button><button aria-label="Move right" {...touch('ArrowRight')}><ArrowRight/></button></div><button aria-label="Jump" {...touch('jump')}><ArrowUp/></button></div>}
  {dialogue!==null&&<section className="saga-dialogue" aria-label="Character conversation"><div className="saga-guide"><Hero accent="#f4be54" hair="#d9e1f3"/></div><div><span className="saga-speaker">DETECTIVE ARIA</span><p aria-live="polite">{lines[dialogue]}</p><div className="saga-dialogue-actions"><button onClick={()=>setDialogue(null)}>Skip conversation</button><button onClick={()=>setDialogue(d=>d===lines.length-1?null:d+1)}>{dialogue===lines.length-1?'Let’s explore':'Continue'} <span className="saga-indicator">▼</span></button></div></div></section>}
  {panel&&<div className="saga-shade"><section className="saga-mission" role="dialog" aria-modal="true" aria-label="Mission terminal"><button className="saga-close" aria-label="Close mission" onClick={()=>{setPanel(false);setPlayer(p=>p.x>1350?{...p,x:1280}:p);}}><X/></button><span className="saga-eyebrow">DATABASE DETECTIVE / CHAPTER {chapter.id}</span><h2>{mission.title}</h2><p>{mission.story}</p>{children}</section></div>}
  {settings&&<div className="saga-shade"><section className="saga-mission" role="dialog" aria-label="Settings"><button className="saga-close" aria-label="Close settings" onClick={()=>setSettings(false)}><X/></button><h2>Your journey</h2><p>Select an unlocked chapter. Progress and rewards use your CodeSaga profile.</p><div className="saga-chapters">{chapters.map(c=><button key={c.id} disabled={!unlocked(c.id)} onClick={()=>{onChapter(c.id);setSettings(false);}}>Chapter {c.id}<small>{c.title}</small></button>)}</div></section></div>}
  {reached&&<div className="saga-shade"><section className="saga-mission saga-victory"><Flag size={56}/><h2>Case closed. Sky ahead.</h2><p>Your answer was validated by CodeSaga.{guest?' Sign in to save your rewards.':` Mission rewards: ${mission.xp||50} XP · ${mission.coins||20} coins.`}</p><button onClick={onNext}>Continue journey →</button><button onClick={()=>{setReached(false);setPlayer(spawn());}}>Explore again</button></section></div>}
 </main>;
}
