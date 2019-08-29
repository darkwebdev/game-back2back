import sprites from './sprites'
import { STEPS } from './const';
import { waves } from './config';

const state = {
    step: STEPS.REST,
    timeTillWave: waves.interval,
    waveSize: waves.size,
    waveSizeMultiplier: waves.multiplier,
    lastFired: Infinity,
    sprites
};

export default state
