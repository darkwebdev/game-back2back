import { init } from 'kontra';

const { canvas } = init();
const dpr = window.devicePixelRatio || 1;
const width = 200;
const height = 200;
canvas.width = width * dpr;
canvas.height = height * dpr;
// canvas.style.width = `${width/dpr}px`;
// canvas.style.height = "375px";
canvas.getContext('2d').scale(dpr, dpr);

export { canvas, dpr }
