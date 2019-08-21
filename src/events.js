import { on, off, emit, Vector } from 'kontra';
import { Bullet, removeBullet } from './bullet.js';
import { findPlayer } from './player.js';
import { ACTIONS } from './const.js';
import { stopSprite } from './helpers.js';
import { findEnemies, hitEnemy, killEnemy, spawnEnemies } from './enemy.js';
import sprites from './sprites.js';

export default () => {
    on(ACTIONS.ADD_SPRITES, sprites.add);

    on(ACTIONS.FIRE, () => {
        console.log('POP!');

        const player = findPlayer(sprites);
        const cos = Math.cos(player.rotation);
        const sin = Math.sin(player.rotation);
        const x = player.x + cos * 12;
        const y = player.y + sin * 12;

        emit(ACTIONS.ADD_SPRITES, Bullet({
            position: Vector(x, y),
            velocity: Vector(cos * 5, sin * 5)
        }));
    });

    on(ACTIONS.REMOVE_BULLET, removeBullet);

    on(ACTIONS.HIT_ENEMY, hitEnemy);

    on(ACTIONS.KILL_ENEMY, killEnemy);

    on(ACTIONS.NEW_WAVE, (waveSize, target) => {
        console.log('NEW WAVE', waveSize);
        emit(ACTIONS.ADD_SPRITES, spawnEnemies({
            number: waveSize,
            targetPosition: Vector(target.x, target.y)
        }))
    });

    on(ACTIONS.GAME_OVER, () => {
        const player = findPlayer(sprites);
        const enemies = findEnemies(sprites);
        enemies.forEach(stopSprite);
        player.ttl = 0;
    })
}
