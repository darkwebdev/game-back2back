import {
    GameLoop, init,
    emit,
    initPointer, onPointerDown, pointer
} from './node_modules/kontra/kontra.mjs';
import { Player, Base, findPlayer } from './player.js';
import { findAllColliding, findMultiColliding, stopSprite } from './helpers.js';
import { findEnemies, spawnEnemies } from './enemy.js';
import initReducer from './reducer.js';
import { findBullets } from './bullet.js';
import { ACTIONS } from './const.js'

(async () => {
    console.log('Initializing game engine...');

    const { canvas } = init();
    initPointer();

    let sprites = [];
    let waveSize = 5;

    initReducer(sprites);

    // Player

    const base = await Base({
        id: 'base-1',
        x: canvas.width / 2,
        y: canvas.height / 2
    });
    sprites.push(base);

    const player = await Player({
        id: 'player-1',
        x: canvas.width / 2,
        y: canvas.height / 2,
        pointer
    });
    sprites.push(player);
    sprites.push(...spawnEnemies({ number: waveSize, player }));

    onPointerDown((e, object) => {
        emit(ACTIONS.FIRE);
    });

    GameLoop({
        update() {
            sprites.forEach(s => { s.update() });

            // Colliding bullets & enemies
            const bullets = findBullets(sprites);
            const enemies = findEnemies(sprites);
            const player = findPlayer(sprites);

            if (enemies.length) {
                findAllColliding(bullets, enemies).forEach(s => {
                    s.ttl = 0;
                });
            } else {
                // sprites.push(...spawnEnemies({ number: waveSize++ , player }));
                console.log('NEW WAVE', waveSize);
            }

            // Player being hit
            if (player) {
                const collidingEnemies = findMultiColliding(player, enemies);

                if (collidingEnemies) {
                    collidingEnemies.forEach(enemy => {
                        stopSprite(enemy);
                        if (enemy.lastHit > 1) {
                            enemy.lastHit = 0;
                            player.hp -= enemy.damage;
                            console.log('HP:', player.hp);

                            if (player.hp <= 0) {
                                emit(ACTIONS.GAME_OVER);
                            }
                        } else {
                            enemy.lastHit += 1 / 60;
                        }
                    })
                }
            }

            // Remove unused sprites
            sprites = sprites.filter(s => s.isAlive());

            console.debug('SPRITES', sprites.length, 'ENEMIES', enemies.filter(e => e.ttl).length);
        },
        render() {
            sprites.forEach(s => { s.render() })
        }
    }).start()
})();
