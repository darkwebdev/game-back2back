import { emit, loadImage, Sprite, SpriteSheet } from 'kontra';
import { normalized, range, stopSprite } from './helpers';
import { ACTIONS, SPRITES } from './const';

export const Enemy = async ({ id, targetPosition }) => {
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const dx = targetPosition.x - x;
    const dy = targetPosition.y - y;
    const distance = normalized(dx, dy);
    const speed = 0.1;

    const spriteSheet = SpriteSheet({
        image: await loadImage('assets/enemy.png'),
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
        x,
        y,
        dx: dx / distance * speed,
        dy: dy / distance * speed,
        speed,
        radius: 10,
        width: 32,
        height: 32,
        animations: spriteSheet.animations,
        damage: 1,
        hp: 10,
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

export const spawnEnemies = ({ number, targetPosition }) =>
    range(number).map(n => {
        const id = `enemy-${n}`;
        console.log(`Creating new enemy ${id}...`);
        return Enemy({ id, targetPosition });
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
