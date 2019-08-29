import { Sprite, Vector, emit } from 'kontra';
import { ACTIONS, SPRITES, WEAPONS } from './const';
import { closestCollisionToPoint, cos, gunEnd, lineCircleIntersection, sin } from './helpers';
import { weapons as config } from './config';

export const Laser = ({ owner, rayLength, enemies }) => {
    const { damage, ttl, color } = config[WEAPONS.LASER];
    const laserStart = gunEnd(owner);
    const endX = owner.x + cos(owner) * rayLength;
    const endY = owner.y + sin(owner) * rayLength;
    const collisions = enemies
        .filter(e => !e.nonColliding)
        .map(enemy => {
            const point = lineCircleIntersection(
                {
                    p1: laserStart,
                    p2: Vector(endX, endY)
                },
                {
                    center: Vector(enemy.x + enemy.radius, enemy.y + enemy.radius),
                    radius: enemy.radius
                });
            // console.debug('lineCircleIntersection', intersection, enemy.x, enemy.y, enemy.radius, x, y, endX, endY)
            return point && { enemy, point }
        })
        .filter(Boolean);

    // console.log('collisions', collisions, closestCollisionToPoint(laserStart, collisions))
    const { enemy, point: laserEnd } = collisions.length ?
        closestCollisionToPoint(laserStart, collisions) :
        { point: Vector(endX, endY) };
    if (enemy) {
        console.log('HIT', enemy.hp, damage)
        emit(ACTIONS.HIT_ENEMY, enemy, damage);
    }

    return Sprite({
        type: SPRITES.LASER,
        damage,
        ttl,
        render() {
            this.context.beginPath();
            this.context.moveTo(laserStart.x, laserStart.y);
            this.context.lineTo(laserEnd.x, laserEnd.y);
            this.context.strokeStyle = color;
            this.context.stroke();
        }
    });
};

export const findLaser = sprites => sprites.ofType(SPRITES.LASER)[0];
