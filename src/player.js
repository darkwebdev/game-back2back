import { Sprite } from 'kontra';
import { SPRITES, WEAPONS } from './const.js';

export const Player = ({ id, x, y, pointer }) => new Promise((resolve, reject) => {
    const image = new Image();
    image.src = 'assets/gun.png';
    image.onload = () => {
        resolve(Sprite({
            id,
            type: SPRITES.PLAYER,
            x,
            y,
            radius: 8,
            rotation: 0,
            anchor: { x: 0.5, y: 0.5 },
            image,
            weapon: WEAPONS.GUN,
            hp: 20,
            update() {
                this.rotation = Math.atan2(pointer.y - this.y, pointer.x - this.x);
            }
        }))
    }
});

export const Base = ({ id, x, y }) => new Promise((resolve, reject) => {
    const image = new Image();
    image.src = 'assets/base.png';
    image.onload = () => {
        resolve(Sprite({
            id,
            type: 'base',
            x,
            y,
            radius: 10,
            anchor: { x: 0.5, y: 0.5 },
            image
        }))
    }
});

export const findPlayer = sprites => sprites.ofType(SPRITES.PLAYER)[0];
