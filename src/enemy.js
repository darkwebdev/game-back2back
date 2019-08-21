import { emit, Sprite, Vector } from 'kontra';
import { range, normalized, stopSprite } from './helpers.js';
import { ACTIONS, SPRITES } from './const.js';

export const Enemy = ({ id, targetPosition }) => {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const dx = targetPosition.x - x;
    const dy = targetPosition.y - y;
    const distance = normalized(dx, dy);
    const speed = 0.1;

    return Sprite({
        id,
        type: SPRITES.ENEMY,
        x,
        y,
        dx: dx / distance * speed,
        dy: dy / distance * speed,
        rotation: 0,
        speed,
        radius: 10,
        damage: 1,
        hp: 10,
        lastHit: 0,
        color: 'red',
        nonColliding: false,
        render() {
            this.context.strokeStyle = this.color;
            this.context.beginPath();
            this.context.arc(this.x, this.y, this.radius, 0, Math.PI*2);
            this.context.stroke();
        }
    });
};

export const spawnEnemies = ({ number, targetPosition }) =>
    range(number).map(n => {
        const id = `enemy-${n}`;
        console.log(`Creating new enemy ${id}...`);
        return Enemy({ id, targetPosition });
    });

export const findEnemies = sprites => sprites.ofType(SPRITES.ENEMY);

export const killEnemy = enemy => {
    enemy.color = 'black';
    stopSprite(enemy);
    enemy.nonColliding = true
};

export const hitEnemy = (enemy, damage) => {
    enemy.hp -= damage;
    if (enemy.hp <= 0) {
        emit(ACTIONS.KILL_ENEMY, enemy)
    }
};
