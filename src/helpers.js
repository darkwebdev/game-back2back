// Pythagorean law
import { Vector } from 'kontra';

export const normalized = (x, y) => Math.sqrt((x * x) + (y * y));

export const degreesToRadians = degrees => degrees * Math.PI / 180;

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
