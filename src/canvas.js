import { init } from 'kontra';

const { canvas } = init();
const { innerWidth, innerHeight, devicePixelRatio: dpr = 1 } = window;
canvas.width = innerWidth;
canvas.height = innerHeight;
// canvas.style.width = `${width/dpr}px`;
// canvas.style.height = "375px";
canvas.getContext('2d').scale(dpr, dpr);

export { canvas, dpr }
