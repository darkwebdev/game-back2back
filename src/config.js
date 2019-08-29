import { WEAPONS } from './const';

export const waves = {
    interval: 2000,
    size: 1,
    multiplier: 2
};

export const enemies = {
    radius: 14,
    damage: 1,
    hp: 10,
    speed: 0.1,
    image: 'assets/enemy.png'
};

export const weapons = {
    default: WEAPONS.LASER,
    [WEAPONS.GUN]: {
        shootingSpeed: 100,
        damage: 10,
        ttl: 50,
        color: 'red',
        width: 2,
        height: 2
    },
    [WEAPONS.LASER]: {
        shootingSpeed: 10,
        damage: 2,
        ttl: 1,
        color: 'green',
    },
    [WEAPONS.ROCKET]: {
      shootingSpeed: 1000
    }
};
