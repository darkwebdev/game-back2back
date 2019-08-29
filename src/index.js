import {
    emit,
    GameLoop,
    bindKeys, initKeys,
    initPointer, pointer, pointerPressed
} from 'kontra';
import { Base, findPlayer, Player, useGun, useLaser } from './player';
import { findAllColliding, findColliding } from './helpers';
import { findEnemies } from './enemy';
import initEvents from './events';
import { findBullets } from './bullet';
import { ACTIONS, POINTERS, STEPS } from './const';
import state from './state';
import { canvas, dpr } from './canvas';
import { weapons } from './config';

(async () => {
    console.log('Initializing game engine...');

    initKeys();
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

    const loop = GameLoop({
        update() {
            if (state.step === STEPS.GAME_OVER) return;

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
            if (!enemies.filter(e => !e.nonColliding).length && state.step === STEPS.WAVE) {
                emit(ACTIONS.SET_STEP, STEPS.REST)
            }

            if (state.step === STEPS.REST) {
                if (state.timeTillWave) {
                    state.timeTillWave -= 10;
                } else {
                    // emit(ACTIONS.SET_STEP, STEPS.WAVE)
                }
            }

            // Input
            if (player.isAlive() && pointerPressed(POINTERS.LEFT)) {
                const weapon = weapons[player.weapon];

                if (state.lastFired > weapon.shootingSpeed) {
                    console.log('FIRE!!!!!')
                    emit(ACTIONS.FIRE);
                    state.lastFired = 0
                } else {
                    state.lastFired += 10
                }
            }

            emit(ACTIONS.CLEAN_WORLD);

            // console.debug('SPRITES', sprites.toString(), 'ENEMIES', enemies.filter(e => e.ttl).length);
        },
        render() {
            state.sprites.render()
        }
    });

    // Input
    bindKeys('p', () => {
        console.log('PAUSE');
        loop.isStopped ? loop.start() : loop.stop();
    });

    bindKeys('l', () => {
        console.log('WEAPON IS LASER');
        useLaser(player)
    });
    bindKeys('g', () => {
        console.log('WEAPON IS GUN');
        useGun(player)
    });
    bindKeys('w', () => {
        emit(ACTIONS.SET_STEP, STEPS.WAVE)
    });
    bindKeys('m', () => {
        findEnemies(state.sprites).forEach(e => {
            e.speed += 0.1
            console.log('SPEED', e.speed)
        })
    });

    // Go-go-go!!
    loop.start()
})();
