import { GameLoop, emit, initPointer, onPointerDown, pointer } from 'kontra';
import { Player, Base, findPlayer } from './player'
import { findAllColliding, findColliding } from './helpers';
import { findEnemies } from './enemy'
import initEvents from './events'
import { findBullets } from './bullet'
import { ACTIONS } from './const'
import sprites from './sprites'
import { canvas, dpr } from './canvas'

(async () => {
    console.log('Initializing game engine...');

    initPointer();
    initEvents();

    let waveSize = 1;

    // Player

    const base = await Base({
        id: 'base-1',
        x: canvas.width / 2 / dpr,
        y: canvas.height / 2 / dpr
    });
    emit(ACTIONS.ADD_SPRITES, base);

    const player = await Player({
        id: 'player-1',
        x: canvas.width / 2 / dpr,
        y: canvas.height / 2 / dpr,
        pointer,
        base
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
                    const enemy = findColliding(bullet, enemies);

                    if (enemy) {
                        emit(ACTIONS.HIT_ENEMY, enemy, bullet.damage);
                        emit(ACTIONS.REMOVE_BULLET, bullet)
                    }
                })
            }

            // Player being hit
            if (player) {
                const collidingEnemies = findAllColliding(player.base, enemies);

                collidingEnemies.forEach(enemy => {
                    emit(ACTIONS.STOP_ENEMY, enemy);
                    emit(ACTIONS.HIT_PLAYER, enemy)
                })
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
