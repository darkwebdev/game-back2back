import { Sprite } from './node_modules/kontra/kontra.mjs';
import { SPRITES } from './const.js';

export const Bullet = ({ position, velocity }) => Sprite({
    type: SPRITES.BULLET,
    x: position.x,
    y: position.y,
    dx: velocity.x,
    dy: velocity.y,
    ttl: 50,
    width: 2,
    height: 2,
    color: 'red',
    damage: 10
});

export const findBullets = sprites => sprites.filter(s => s.type === SPRITES.BULLET);
