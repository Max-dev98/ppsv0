import '../style.css';
import { Game } from './core/game';
import { Input } from './core/inputSytem';
const canvas = document.getElementById('game');
canvas.width = 800;
canvas.height = 400;
Input.init(); // inicia leitura de teclado
// Apenas o canvas e passado 
const game = new Game(canvas);
game.start();
