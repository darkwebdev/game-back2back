import sprites from './sprites'
import { STEPS } from './const';

const state = {
    current: STEPS.REST,
    timeTillWave: 2000,
    waveSize: 1,
    sprites
};

export default state
