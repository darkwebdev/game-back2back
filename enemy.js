import { Sprite } from './node_modules/kontra/kontra.mjs';

export default id => Sprite({
    id,
    type: 'enemy',
    x: Math.random()*100,
    y: Math.random()*100,
    dx: Math.random(),
    dy: Math.random(),
    radius: 10,
    damage: 1,
    hp: 10,
    lastHit: 0,
    render() {
        this.context.strokeStyle = 'red';
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI*2);
        this.context.stroke();
    }
});
