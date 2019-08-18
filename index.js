import {
    GameLoop,
    init,
    initPointer,
    onPointerDown,
    pointer
} from './node_modules/kontra/kontra.mjs';
import Player from './player.js';
import Enemy from './enemy.js';
import Bullet from './bullet.js';
import { range, findAllColliding } from './helpers.js';

console.log('Initializing game engine...');

const { canvas } = init();
initPointer();

let sprites = [];

createSprites();

onPointerDown((e, object) => {
    console.log('FIRE');
    const player = sprites.find(s => s.type === 'player');

    sprites.push(Bullet(player));
});

GameLoop({
    update() {
        const updatedSprites = sprites.map(s => {
            s.update();
            return s;
        });

        const bullets = updatedSprites.filter(s => s.type === 'bullet');
        const enemies = updatedSprites.filter(s => s.type === 'enemy');

        findAllColliding(bullets, enemies).forEach(s => {
            s.ttl = 0;
        });

        sprites = updatedSprites.filter(s => s.isAlive());

        console.log('SPRITES', sprites.length);
    },
    render() {
        sprites.forEach(s => {
            s.render();
        });
    }
}).start();

function createSprites() {
    const player1 = Player({ id: 'player-1', canvas, pointer });
    sprites.push(player1);

    const enemies = range(5).map(n => {
        const id = `enemy-${n}`;
        console.log(`Creating new enemy ${id}...`);
        return Enemy(id);
    });

    sprites.push(...enemies);
}
