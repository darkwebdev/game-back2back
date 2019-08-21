import {
    GameLoop, init,
    emit,
    initPointer, onPointerDown, pointer
} from 'kontra';
import { Player, Base, findPlayer } from './player.js';
import { dealDamage, findMultiColliding, stopSprite } from './helpers.js';
import { findEnemies, spawnEnemies } from './enemy.js';
import initEvents from './events.js';
import { findBullets } from './bullet.js';
import { ACTIONS } from './const.js'
import sprites from './sprites.js';

(async () => {
    console.log('Initializing game engine...');

    const { canvas } = init();
    initPointer();
    initEvents();

    let waveSize = 5;

    // Player

    emit(ACTIONS.ADD_SPRITES, await Base({
        id: 'base-1',
        x: canvas.width / 2,
        y: canvas.height / 2
    }));

    const player = await Player({
        id: 'player-1',
        x: canvas.width / 2,
        y: canvas.height / 2,
        pointer
    });
    emit(ACTIONS.ADD_SPRITES, player);
    emit(ACTIONS.NEW_WAVE, waveSize++, player);

    onPointerDown((e, object) => {
        emit(ACTIONS.FIRE);
    });

    const loop = GameLoop({
        update() {
            sprites.update();

            // Colliding bullets & enemies & player
            const bullets = findBullets(sprites);
            const enemies = findEnemies(sprites);
            const player = findPlayer(sprites);

            if (enemies.length && bullets.length) {
                bullets.forEach(bullet => {
                    const enemiesHit = findMultiColliding(bullet, enemies);
                    enemiesHit.forEach(enemy => {
                        emit(ACTIONS.HIT_ENEMY, enemy, bullet.damage);
                        emit(ACTIONS.REMOVE_BULLET, bullet)
                    })
                })
            }

            // Player being hit
            if (player) {
                const collidingEnemies = findMultiColliding(player, enemies);

                if (collidingEnemies) {
                    collidingEnemies.forEach(enemy => {
                        emit(ACTIONS.STOP_ENEMY, enemy);
                        emit(ACTIONS.HIT_PLAYER, enemy)
                    })
                }
            }

            // No more enemies?
            if (!enemies.filter(e => !e.nonColliding).length) {
                emit(ACTIONS.NEW_WAVE, waveSize++, player)
            }

            sprites.dropUnused();

            console.debug('SPRITES', sprites.toString(), 'ENEMIES', enemies.filter(e => e.ttl).length);
        },
        render() {
            sprites.render()
        }
    });

    loop.start()
})();
