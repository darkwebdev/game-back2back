const sprites = [];

const Sprites = () => ({
    map: sprites.map,
    filter: sprites.filter,
    reduce: sprites.reduce,
    find: sprites.find,
    some: sprites.some,

    toString: () => sprites.map(sprite => sprite.id),

    total: () => sprites.length,

    ofType: type => sprites.filter(sprite => sprite.type === type),
    // findOfType: type => sprites.find(sprite => sprite.type === type),

    replace: newSprites => {
        sprites.length = 0;
        sprites.push(...newSprites)
        console.debug('->SPRITES REPLACE', s.total())
    },

    add: newSprites => {
        // One or more sprites
        const spritesArray = [].concat(newSprites);
        sprites.push(...spritesArray);
        console.debug('->SPRITES ADD', s.total())
    },

    dropUnused: () => {
        const aliveSprites = sprites.filter(sprite => sprite.isAlive());

        if (aliveSprites.length < s.total()) {
            s.replace(aliveSprites)
        }
    },

    update: () => {
        sprites.forEach(sprite => {
            sprite.update()
        })
    },

    render: () => {
        sprites.forEach(sprite => {
            sprite.render()
        })
    }
});

const s = Sprites();

export default s;
