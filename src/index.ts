import './style.css';  
import CalculatorHanlder from './ts/utils';

document.addEventListener('DOMContentLoaded', () => {
    const calculationHandler = new CalculatorHanlder;
    calculationHandler.init();
})