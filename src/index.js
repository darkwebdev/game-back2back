import { GameLoop, emit, initPointer, onPointerDown, pointer } from 'kontra';
import { Player, Base, findPlayer } from './player'
import { findAllColliding, findColliding } from './helpers';
import { findEnemies } from './enemy'
import initEvents from './events'
import { findBullets } from './bullet'
import { ACTIONS, STEPS } from './const';
import state from './state'
import { canvas, dpr } from './canvas'

(async () => {
    console.log('Initializing game engine...');

    initPointer();
    initEvents();

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
    emit(ACTIONS.SET_STEP, STEPS.REST);

    onPointerDown((e, object) => {
        emit(ACTIONS.FIRE);
    });

    const loop = GameLoop({
        update() {
            if (state.current === STEPS.GAME_OVER) return;

            state.sprites.update();

            // Colliding bullets & enemies & player
            const bullets = findBullets(state.sprites);
            const enemies = findEnemies(state.sprites);
            const player = findPlayer(state.sprites);

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
            const collidingEnemies = findAllColliding(player.base, enemies);

            collidingEnemies.forEach(enemy => {
                emit(ACTIONS.STOP_ENEMY, enemy);
                emit(ACTIONS.HIT_PLAYER, enemy)
            });

            // No more enemies?
            if (!enemies.filter(e => !e.nonColliding).length && state.current === STEPS.WAVE) {
                emit(ACTIONS.SET_STEP, STEPS.REST)
            }

            if (state.current === STEPS.REST) {
                if (state.timeTillWave) {
                    state.timeTillWave -= 10;
                } else {
                    emit(ACTIONS.SET_STEP, STEPS.WAVE)
                }
            }

            emit(ACTIONS.CLEAN_WORLD);

            // console.debug('SPRITES', sprites.toString(), 'ENEMIES', enemies.filter(e => e.ttl).length);
        },
        render() {
            state.sprites.render()
        }
    });

    loop.start()
})();
