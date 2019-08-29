import { emit, on, Vector } from 'kontra';
import { Bullet, removeBullet } from './bullet';
import {  Laser } from './laser';
import { findPlayer } from './player';
import { ACTIONS, STEPS, WEAPONS } from './const';
import { dealDamage, stopSprite } from './helpers';
import { findEnemies, hitEnemy, killEnemy, spawnEnemies } from './enemy';
import state from './state';
import { canvas, dpr } from './canvas';

const canvasMaxRadius = Math.max(canvas.width, canvas.height) / 2;
const canvasMinRadius = Math.min(canvas.width, canvas.height) / 2;

export default () => {
    on(ACTIONS.ADD_SPRITES, state.sprites.add);

    on(ACTIONS.FIRE, () => {
        const player = findPlayer(state.sprites);
        if (!player) return;

        switch(player.weapon) {
            case WEAPONS.GUN:
                console.log('POP!');
                emit(ACTIONS.ADD_SPRITES, Bullet({ owner: player }));
                break;

            case WEAPONS.LASER: {
                console.log('zzzzzz!')
                emit(ACTIONS.ADD_SPRITES, Laser({
                    owner: player,
                    rayLength: canvasMaxRadius,
                    enemies: findEnemies(state.sprites)
                }));
                break;
            }

            case WEAPONS.ROCKET:
                console.log('bam!')
                break
        }
    });

    on(ACTIONS.REMOVE_BULLET, removeBullet);

    on(ACTIONS.HIT_ENEMY, hitEnemy);
    on(ACTIONS.KILL_ENEMY, killEnemy);
    on(ACTIONS.STOP_ENEMY, stopSprite);

    on(ACTIONS.HIT_PLAYER, dealer => {
        const player = findPlayer(state.sprites);

        dealDamage(dealer, player);
        if (player.hp <= 0) {
            emit(ACTIONS.SET_STEP, STEPS.GAME_OVER);
        }
    });

    on(ACTIONS.CLEAN_WORLD, () => {
        // emit(ACTIONS.UPDATE_STATE, )
        state.sprites.dropUnused();
    });

    on(ACTIONS.UPDATE_STATE, newState => {
        // state = { ...state, ...newState }
    });

    on(ACTIONS.SET_STEP, step => {
        console.log('NEW STEP:', step);
        state.step = step;
        switch(step) {
            case STEPS.WAVE: {
                const player = findPlayer(state.sprites);
                const waveSize = state.waveSize * state.waveSizeMultiplier;
                const spawnRadius = canvasMinRadius / dpr;

                emit(ACTIONS.NEW_WAVE, waveSize, spawnRadius, player);
                state.waveSize = waveSize;

                break
            }
            case STEPS.REST: {
                state.timeTillWave = 2000;

                break
            }
            case STEPS.GAME_OVER: {
                console.log('==== GAME OVER! ====')
                const player = findPlayer(state.sprites);
                player.ttl = 0; //todo: change sprite to dead
                break
            }
        }
    });

    on(ACTIONS.NEW_WAVE, async (waveSize, spawnRadius, target) => {
        console.log('NEW WAVE...', waveSize);
        emit(ACTIONS.ADD_SPRITES, await Promise.all(spawnEnemies({
            number: waveSize,
            spawnRadius,
            targetPosition: Vector(target.x, target.y)
        })))
    });
}
