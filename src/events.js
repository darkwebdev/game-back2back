import { emit, on, Vector } from 'kontra';
import { Bullet, removeBullet } from './bullet';
import { findPlayer } from './player';
import { ACTIONS, STEPS } from './const';
import { dealDamage, stopSprite } from './helpers';
import { hitEnemy, killEnemy, spawnEnemies } from './enemy';
import state from './state';

export default () => {
    on(ACTIONS.ADD_SPRITES, state.sprites.add);

    on(ACTIONS.FIRE, () => {
        const player = findPlayer(state.sprites);
        if (!player) return;

        console.log('POP!');
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
                const waveSize = state.waveSize + 1;

                emit(ACTIONS.NEW_WAVE, waveSize, player);
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

    on(ACTIONS.NEW_WAVE, async (waveSize, target) => {
        console.log('NEW WAVE...', waveSize);
        emit(ACTIONS.ADD_SPRITES, await Promise.all(spawnEnemies({
            number: waveSize,
            targetPosition: Vector(target.x, target.y)
        })))
    });
}
