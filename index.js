import { init,
    initPointer, pointer, onPointerDown, keyPressed,
    Sprite, GameLoop
} from './node_modules/kontra/kontra.mjs'
import Player from './player.js';
import Enemy from './enemy.js';
import Bullet from './bullet.js';
import { range } from './helpers.js';

console.log('Initializing game engine...');

const { canvas } = init();
initPointer();

let sprites = [];
let lastFired = 0;

const player1 = Player({ id: 'player-1', canvas, pointer });
sprites.push(player1);

onPointerDown((e, object) => {
    console.log('FIRE');
    lastFired += 1/60;
    if (lastFired > 1/60) {
        lastFired = 0;
        console.log('BULLET')
        sprites.push(Bullet(player1));
    }
});

const enemies = range(5).map(n => {
    const id = `enemy-${n}`;
    console.log(`Creating new enemy ${id}...`);
    const enemy = Enemy(id);
    sprites.push(enemy);

    return enemy;
});

GameLoop({
    update() {
        sprites
            .map(s => {
                s.update();
                return s;
            })
            .filter(s => s.isAlive());
    },
    render() {
        sprites.forEach(s => {
            s.render();
        });
    }
}).start();
