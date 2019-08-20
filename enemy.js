import { Sprite } from './node_modules/kontra/kontra.mjs';
import { range, normalized } from './helpers.js';
import { SPRITES } from './const.js';

export const Enemy = ({ id, targetX, targetY }) => {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const dx = targetX - x;
    const dy = targetY - y;
    const distance = normalized(dx, dy);
    const speed = 0.1;

    return Sprite({
        id,
        type: SPRITES.ENEMY,
        x,
        y,
        dx: dx / distance * speed,
        dy: dy / distance * speed,
        rotation: 0,
        speed,
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
};

export const spawnEnemies = ({ number, player }) =>
    range(number).map(n => {
        const id = `enemy-${n}`;
        console.log(`Creating new enemy ${id}...`);
        return Enemy({
            id,
            targetX: player.x,
            targetY: player.y
        });
    });

export const findEnemies = sprites => sprites.filter(s => s.type === SPRITES.ENEMY);
