import {
    GameLoop,
    init,
    initPointer,
    onPointerDown,
    pointer
} from './node_modules/kontra/kontra.mjs';
import { Player, Base } from './player.js';
import Bullet from './bullet.js';
import { findAllColliding, findColliding } from './helpers.js';
import { spawnEnemies } from './enemy.js';

(async () => {
    console.log('Initializing game engine...');

    const { canvas } = init();
    initPointer();

    let sprites = [];
    let waveSize = 5;

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
    sprites.push(...(spawnEnemies(waveSize)));

    onPointerDown((e, object) => {
        console.log('FIRE');
        const player = sprites.find(s => s.type === 'player');

        sprites.push(Bullet(player));
    });

    GameLoop({
        update() {
            const updatedSprites = sprites.map(s => {
                s.update();
                return s;
            });

            // Colliding bullets & enemies
            const bullets = updatedSprites.filter(s => s.type === 'bullet');
            const enemies = updatedSprites.filter(s => s.type === 'enemy');

            if (enemies.length) {
                findAllColliding(bullets, enemies).forEach(s => {
                    s.ttl = 0;
                });
            } else {
                sprites.push(...(spawnEnemies(waveSize++)));
                console.log('NEW WAVE', waveSize);
            }

            // Player being hit
            const player = updatedSprites.find(s => s.type === 'player');
            const collidingEnemy = findColliding(player, enemies);

            if (player && collidingEnemy) {
                collidingEnemy.dx = 0;
                collidingEnemy.dy = 0;
                if (collidingEnemy.lastHit > 1) {
                    collidingEnemy.lastHit = 0;
                    player.hp -= collidingEnemy.damage;
                    console.log('HP:', player.hp);

                    if (player.hp <=0) {
                        console.log('GAME OVER');
                        player.ttl = 0;
                    }
                } else {
                    collidingEnemy.lastHit += 1/60;
                }
            }

            // Remove unused sprites
            sprites = updatedSprites.filter(s => s.isAlive());

            console.debug('SPRITES', sprites.length, 'ENEMIES', enemies.filter(e => e.ttl).length);
        },
        render() {
            sprites.forEach(s => {
                s.render();
            });
        }
    }).start();
})();
