// Pythagorean law
export const normalized = (x, y) => Math.sqrt((x * x) + (y * y));

export const degreesToRadians = degrees => degrees * Math.PI / 180;

export const range = n => [...Array(n).keys()];

export const isColliding = (sprite1, sprite2) => {
    if (sprite1.nonColliding || sprite2.nonColliding) return false;

    const dx = sprite1.x - sprite2.x;
    const dy = sprite1.y - sprite2.y;
    const width1 = sprite1.width || sprite1.radius * 2;
    const width2 = sprite2.width || sprite2.radius * 2;

    return Math.sqrt(dx * dx + dy * dy) < width1 / 2 + width2;
};

export const findFirstColliding = (sprite1, sprites2) =>
    sprites2.find(sprite2 => isColliding(sprite1, sprite2));

export const findMultiColliding = (sprite1, sprites2) =>
    sprites2.filter(sprite2 => isColliding(sprite1, sprite2));

export const findAllColliding = (sprites1, sprites2) =>
    sprites1.reduce((allColliding, sprite1) => {
        const multiColliding = findMultiColliding(sprite1, sprites2);

        if (multiColliding) {
            allColliding.push(sprite1);
            allColliding.push(...multiColliding);
        }

        return allColliding;
    }, []);

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
