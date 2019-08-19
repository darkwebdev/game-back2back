import { Sprite } from './node_modules/kontra/kontra.mjs';
import { range } from './helpers.js';

export const Enemy = id => Sprite({
    id,
    type: 'enemy',
    x: Math.random()*100,
    y: Math.random()*100,
    dx: Math.random(),
    dy: Math.random(),
    radius: 10,
    damage: 1,
    hp: 10,
    lastHit: 0,
    render() {
        this.context.strokeStyle = 'red';
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        this.context.stroke();
    }
});

export const spawnEnemies = n =>
    range(n).map(n => {
        const id = `enemy-${n}`;
        console.log(`Creating new enemy ${id}...`);
        return Enemy(id);
    });
