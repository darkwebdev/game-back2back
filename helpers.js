export function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

export function range(n) {
    return [...Array(n).keys()];
}

export function isColliding(sprite1, sprite2) {
    const dx = sprite1.x - sprite2.x;
    const dy = sprite1.y - sprite2.y;
    const width1 = sprite1.width || sprite1.radius * 2;
    const width2 = sprite2.width || sprite2.radius * 2;

    return Math.sqrt(dx * dx + dy * dy) < width1 / 2 + width2;
}

export function findColliding(sprite1, sprites2) {
    return sprites2.find(sprite2 => isColliding(sprite1, sprite2));
}

export function findAllColliding(sprites1, sprites2) {
    return sprites1.reduce((allColliding, sprite1) => {
        const colliding = findColliding(sprite1, sprites2);

        if (colliding) {
            allColliding.push(sprite1);
            allColliding.push(colliding);
        }

        return allColliding;
    }, []);
}
