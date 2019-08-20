import { on, off, emit, Vector } from './node_modules/kontra/kontra.mjs';
import { Bullet } from './bullet.js';
import { findPlayer } from './player.js';
import { ACTIONS } from './const.js';
import { stopSprite } from './helpers.js';
import { findEnemies } from './enemy.js';

export default function(sprites) {
    on(ACTIONS.ADD_SPRITES, newSprites => {
        console.log('ADD_SPRITES')
        sprites.push(...(Array.isArray(newSprites) ? newSprites : [newSprites]));
    });

    on(ACTIONS.FIRE, () => {
        console.log('POP!');

        const player = findPlayer(sprites);
        const cos = Math.cos(player.rotation);
        const sin = Math.sin(player.rotation);
        const x = player.x + cos * 12;
        const y = player.y + sin * 12;

        emit('ADD_SPRITES', Bullet({
            position: Vector(x, y),
            velocity: Vector(cos * 5, sin * 5)
        }));
    });

    on(ACTIONS.GAME_OVER, () => {
        const player = findPlayer(sprites);
        const enemies = findEnemies(sprites);
        enemies.forEach(stopSprite);
        player.ttl = 0;
    })
}
