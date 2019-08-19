import { Sprite } from './node_modules/kontra/kontra.mjs';
import { degreesToRadians } from './helpers.js';

export default player => {
    const cos = Math.cos(player.rotation);
    const sin = Math.sin(player.rotation);

    return Sprite({
        type: 'bullet',
        x: player.x + cos * 12,
        y: player.y + sin * 12,
        dx: cos * 5,
        dy: sin * 5,
        ttl: 50,
        width: 2,
        height: 2,
        color: 'red',
        damage: 10
    });
}
