import {test} from 'node:test';
import assert from 'node:assert/strict';
import {step,spawn,PLATFORMS,isTyping} from '../src/components/platform/physics.js';
const advance=(p,keys=new Set(),frames=100)=>{for(let i=0;i<frames;i++)p=step(p,keys,1/60);return p;};
test('gravity lands on ground and held direction moves continuously',()=>{const p=advance(spawn());assert.equal(p.y,434);assert(p.grounded);assert(advance(p,new Set(['ArrowRight']),20).x>150);});
test('jump is consumed once and lands without bouncing',()=>{let p=advance(spawn());const keys=new Set(['jump']);p=step(p,keys,1/60);assert(p.vy<0);assert(keys.has('jump'));keys.delete('jump');p=advance(p,keys);assert.equal(p.y,434);assert(p.grounded);});
test('land on raised platforms and collide with underside',()=>{let p=advance({...spawn(),x:270,y:250,vy:100});assert.equal(p.y,PLATFORMS[1].y-76);assert(p.grounded);p=step({...spawn(),x:270,y:432,vy:-500},new Set(),.05);assert.equal(p.vy,0);assert.equal(p.y,429);});
test('world edges, restart and editable targets',()=>{assert.equal(advance(spawn(),new Set(['ArrowLeft'])).x,0);assert.equal(spawn().x,75);assert(isTyping({closest:()=>({})}));assert(!isTyping({}));});
