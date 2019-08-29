import { Sprite } from 'kontra';
import { SPRITES, WEAPONS } from './const';
import { cos, gunEnd, sin } from './helpers';
import { weapons as config } from './config';

export const Laser = ({ owner, rayLength }) => {
    const { damage, ttl, color } = config[WEAPONS.LASER];
    const { x, y } = gunEnd(owner);
    const endX = owner.x + cos(owner) * rayLength;
    const endY = owner.y + sin(owner) * rayLength;

    return Sprite({
        type: SPRITES.LASER,
        damage,
        ttl,
        render() {
            this.context.beginPath();
            this.context.moveTo(x, y);
            this.context.lineTo(endX, endY);
            this.context.strokeStyle = color;
            this.context.stroke();
        }
    });
};

export const findLaser = sprites => sprites.ofType(SPRITES.LASER)[0];
