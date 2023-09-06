import * as dom from './utils/dom.js';
import { newGame } from './game.js';

export function menu() {
  dom.updateTitle(`
    <div class="blackjack-title">
      Blackjack
    </div>
  `);
  dom.updateCredits();
  dom.updateMain(`
    <div class="menu-buttons">
      <div class="button-container">
        <button class="menu-button betting-game-button js-betting-game-button">
          Betting Game
        </button>
        <div class="menu-button-tooltip js-betting-game-button-tooltip"></div>
      </div>
      <div class="button-container">
        <button class="menu-button exponential-duel-button js-exponential-duel-button">
          Exponential Duel
        </button>
        <div class="menu-button-tooltip js-exponential-duel-button-tooltip"></div>
      </div>
      <div class="button-container">
        <button class="menu-button win-1-get-1-button js-win-1-get-1-button">
          Win 1 Get 1
        </button>
        <div class="menu-button-tooltip js-win-1-get-1-button-tooltip"></div>
      </div>
    </div>
  `);
  for (const gameMode of ['betting-game', 'exponential-duel', 'win-1-get-1']) {
    const buttonClass = `.js-${gameMode}-button`;
    const buttonElement = document.querySelector(buttonClass);
    buttonElement.addEventListener('click', () => {
      newGame(gameMode);
    });
    buttonElement.addEventListener('mouseover', () => {
      dom.displayTooltip(`${buttonClass}-tooltip`);
    });
    buttonElement.addEventListener('mouseout', () => {
      dom.hideTooltip(`${buttonClass}-tooltip`);
    });
  }
}

menu();
