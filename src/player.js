import { Sprite } from 'kontra';
import { SPRITES, WEAPONS } from './const'
import { dpr } from './canvas';
import { weapons } from './config';

export const Player = ({ id, x, y, pointer, base }) => new Promise((resolve, reject) => {
    const image = new Image();
    image.src = 'assets/gun-32.png';
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
            weapon: weapons.default,
            hp: 20,
            base,
            update() {
                this.rotation = Math.atan2(pointer.y/dpr - this.y, pointer.x/dpr - this.x);
            }
        }))
    }
});

export const Base = ({ id, x, y }) => new Promise((resolve, reject) => {
    const image = new Image();
    image.src = 'assets/base-32.png';
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

export const useGun = player => {
    player.weapon = WEAPONS.GUN
};
export const useLaser = player => {
    player.weapon = WEAPONS.LASER
};
