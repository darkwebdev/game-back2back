import { emit, loadImage, Sprite, SpriteSheet } from 'kontra';
import { normalized, range, stopSprite } from './helpers';
import { ACTIONS, SPRITES } from './const';
import { enemies } from './config';

export const Enemy = async ({ id, spawnRadius, targetPosition }) => {
    const angle = Math.random() * Math.PI*2;
    const x = Math.cos(angle) * spawnRadius + spawnRadius - 16;
    const y = Math.sin(angle) * spawnRadius + spawnRadius - 16;
    // console.log('radius', spawnRadius, 'x', x, 'y', y)
    const dx = targetPosition.x - x;
    const dy = targetPosition.y - y;
    const distance = normalized(dx, dy);
    const { radius, damage, hp, speed, image } = enemies;

    const spriteSheet = SpriteSheet({
        image: await loadImage(image),
        frameWidth: 90,
        frameHeight: 100,
        animations: {
            walk: {
                frames: '0..3',
                frameRate: 10
            },
            die: {
                frames: [0],
                frameRate: 1,
                loop: false
            }
        }
    });


    return Sprite({
        id,
        type: SPRITES.ENEMY,
        x, y,
        dx: dx / distance * speed,
        dy: dy / distance * speed,
        speed, radius,
        damage, hp,
        width: 32,
        height: 32,
        animations: spriteSheet.animations,
        lastHit: 0,
        nonColliding: false,
        render() {
            if (this.hp <= 0) {
                this.context.save();
                this.context.globalAlpha = 0.5;
                this.draw();
                this.context.restore();
            } else {
                this.draw();
            }
        }
    })
};

export const spawnEnemies = ({ number, spawnRadius, targetPosition }) =>
    range(number).map(n => {
        const id = `enemy-${n}`;
        console.log(`Creating new enemy ${id}...`);
        return Enemy({ id, spawnRadius, targetPosition });
    });

export const findEnemies = sprites => sprites.ofType(SPRITES.ENEMY);

export const killEnemy = enemy => {
    enemy.width *= 0.8;
    enemy.height *= 0.8;
    enemy.playAnimation('die');
    enemy.nonColliding = true;
    stopSprite(enemy);
};

export const hitEnemy = (enemy, damage) => {
    enemy.hp -= damage;
    if (enemy.hp <= 0) {
        emit(ACTIONS.KILL_ENEMY, enemy)
    }
};
