// Pythagorean law
import { Vector } from 'kontra';

export const normalized = (x, y) => Math.sqrt((x * x) + (y * y));

export const degreesToRadians = degrees => degrees * Math.PI / 180;

export const closestCollisionToPoint = ({ x, y }, collisions) => {
    const initialCollision = {
        point: Vector(Infinity, Infinity)
    };

    return collisions.reduce((closestCollision, collision) => {
            const { point } = collision;
            const { point: closestPoint } = closestCollision;
            const { x: closestX, y: closestY } = closestPoint;
            const { x: x1, y: y1 } = point;

            return Math.abs(x - x1) < closestX && Math.abs(y - y1) < closestY ? collision : closestCollision;
        }, initialCollision);
};

export const lineCircleIntersection = ({ p1, p2 }, { center, radius }) => {
    const v1 = Vector(p2.x - p1.x, p2.y - p1.y);
    const v2 = Vector(p1.x - center.x, p1.y - center.y);
    const b = -2 * (v1.x * v2.x + v1.y * v2.y);
    const c = 2 * (v1.x * v1.x + v1.y * v1.y);
    const d = Math.sqrt(b*b - 2*c * (v2.x*v2.x + v2.y*v2.y - radius*radius));

    if (isNaN(d)) { // no intercept
        return null;
    }

    // these represent the unit distance of a point on the line
    const u = (b - d) / c;

    // add point if on the line segment
    return u > 1 || u < 0 ? null : {
        x: p1.x + v1.x * u,
        y: p1.y + v1.y * u
    }
};

export const cos = sprite => Math.cos(sprite.rotation);
export const sin = sprite => Math.sin(sprite.rotation);
export const gunEnd = player => {
    const gunLength = 12;
    const x = player.x + cos(player) * gunLength;
    const y = player.y + sin(player) * gunLength;

    return Vector(x, y)
};

export const range = n => [...Array(n).keys()];

export const isColliding = (sprite1, sprite2) => {
    if (sprite1.nonColliding || sprite2.nonColliding) return false;

    return sprite1.collidesWith(sprite2);
};

export const findColliding = (sprite1, sprites2) =>
    sprites2.find(sprite2 => isColliding(sprite1, sprite2));

export const findAllColliding = (sprite1, sprites2) =>
    sprites2.filter(sprite2 => isColliding(sprite1, sprite2));

export const stopSprite = sprite => {
    sprite.dx = 0;
    sprite.dy = 0;
};

export const dealDamage = (dealer, receiver) => {
    if (dealer.lastHit > 1) {
        dealer.lastHit = 0;
        receiver.hp -= dealer.damage;
        console.log('HP:', receiver.hp);
    } else {
        dealer.lastHit += 1 / 60;
    }
};
