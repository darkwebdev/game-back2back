import { emit, Sprite, load, imageAssets } from 'kontra';
import { range, normalized, stopSprite } from './helpers'
import { ACTIONS, SPRITES } from './const'

const images = load('assets/enemy.png', 'assets/enemy-dead.png');

export const Enemy = async ({ id, targetPosition }) => {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const dx = targetPosition.x - x;
    const dy = targetPosition.y - y;
    const distance = normalized(dx, dy);
    const speed = 0.1;

    const [enemyImg] = await images;

    return Sprite({
        id,
        type: SPRITES.ENEMY,
        x,
        y,
        dx: dx / distance * speed,
        dy: dy / distance * speed,
        speed,
        radius: 10,
        width: 32,
        height: 32,
        anchor: { x: 0.5, y: 0.5 },
        image: enemyImg,
        damage: 1,
        hp: 10,
        lastHit: 0,
        nonColliding: false
    })
};

export const spawnEnemies = ({ number, targetPosition }) =>
    range(number).map(n => {
        const id = `enemy-${n}`;
        console.log(`Creating new enemy ${id}...`);
        return Enemy({ id, targetPosition });
    });

export const findEnemies = sprites => sprites.ofType(SPRITES.ENEMY);

export const killEnemy = enemy => {
    enemy.image = imageAssets['assets/enemy-dead'];
    enemy.nonColliding = true;
    stopSprite(enemy);
};

export const hitEnemy = (enemy, damage) => {
    enemy.hp -= damage;
    if (enemy.hp <= 0) {
        emit(ACTIONS.KILL_ENEMY, enemy)
    }
};
