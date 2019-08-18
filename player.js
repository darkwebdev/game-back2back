import { Sprite } from './node_modules/kontra/kontra.mjs';
import { degreesToRadians } from './helpers.js';

export default ({ id, canvas, pointer }) => Sprite({
    id,
    type: 'player',
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 5,
    rotation: 0,
    update() {
        this.rotation = Math.atan2(pointer.y - this.y, pointer.x - this.x) * 180 / Math.PI;
    },
    render() {
        this.context.save();
        this.context.strokeStyle = 'blue';
        this.context.translate(this.x, this.y);
        this.context.rotate(degreesToRadians(this.rotation));

        this.context.beginPath();
        this.context.moveTo(-3, -5);
        this.context.lineTo(12, 0);
        this.context.lineTo(-3, 5);
        this.context.closePath();
        this.context.stroke();
        this.context.restore();
    }
});
