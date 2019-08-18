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
import { range, findColliding, findAllColliding } from './helpers.js';

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

        // Colliding bullets & enemies
        const bullets = updatedSprites.filter(s => s.type === 'bullet');
        const enemies = updatedSprites.filter(s => s.type === 'enemy');

        findAllColliding(bullets, enemies).forEach(s => {
            s.ttl = 0;
        });

        // Player being hit
        const player = updatedSprites.find(s => s.type === 'player');
        const collidingEnemy = findColliding(player, enemies);

        if (player && collidingEnemy) {
            collidingEnemy.dx = 0;
            collidingEnemy.dy = 0;
            if (collidingEnemy.lastHit > 1) {
                collidingEnemy.lastHit = 0;
                player.hp -= collidingEnemy.damage;
                console.log('HP:', player.hp);

                if (player.hp <=0) {
                    console.log('GAME OVER');
                    player.ttl = 0;
                }
            } else {
                collidingEnemy.lastHit += 1/60;
            }
        }

        // Remove unused sprites
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
