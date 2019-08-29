import { Sprite, Vector } from 'kontra';
import { SPRITES, WEAPONS } from './const';
import { cos, gunEnd, sin } from './helpers';
import { weapons as config } from './config';

export const Bullet = ({ owner }) => {
    const { x, y } = gunEnd(owner);
    const { x: dx, y: dy } = Vector(cos(owner) * 5, sin(owner) * 5);
    const { damage, ttl, color, width, height } = config[WEAPONS.GUN];

    return Sprite({
        type: SPRITES.BULLET,
        x, y, dx, dy, width, height,
        ttl, color, damage
    });
};

export const findBullets = sprites => sprites.ofType(SPRITES.BULLET);

export const removeBullet = bullet => {
    bullet.ttl = 0
};
