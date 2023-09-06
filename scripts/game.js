import * as credits from './credits.js';
import * as dom from './utils/dom.js';
import { menu } from './index.js';
import * as blackjack from './blackjack.js';

const resultDivs = [
  `
    <div class="result-message result-message-win">
      You win.
    </div>
  `,
  `
    <div class="result-message result-message-lose">
      You lose.
    </div>
  `,
  `
  <div class="result-message result-message-tie">
    Tie.
  </div>
  `
];

export function newGame(gameMode) {
  if (gameMode === 'betting-game') {
    bettingGame();
  } else if (gameMode === 'exponential-duel') {
    exponentialDuel();
  } else if (gameMode === 'win-1-get-1') {
    win1Get1();
  }
}

function bettingGame() {
  if (!credits.credits) {
    alert('You need at least 1 Credit to play the Betting Game.');
    return;
  }
  dom.updateTitle(`
    <div class="betting-game-title">
      Betting Game
    </div>
  `);
  bettingGameStart();
}

let betAmount;

function bettingGameStart() {
  if (!credits.credits) {
    alert('You need at least 1 Credit to play the Betting Game.');
    return;
  }
  dom.updateMain(`
    <div class="betting-menu">
      <input class="bet-input js-bet-input" type="number" min="1" max="${credits.credits}">
      <div class="button-container">
        <button class="bet-button js-bet-button">
          Bet
        </button>
      </div>
      <div class="button-container back-to-menu-button-container">
        <button class="back-to-menu-button js-back-to-menu-button">
          Back to Menu
        </button>
      </div>
    </div>
  `);
  dom.assignButtonFunctionality('.js-bet-button', () => {
    betAmount = Number(document.querySelector('.js-bet-input').value);
    if (betAmount % 1 !== 0 || betAmount <= 0 || betAmount > credits.credits) {
      return;
    }
    credits.addToCredits(-betAmount);
    dom.updateCredits();
    prepareGameWith(`
      <div class="betting-game-info">
        <div class="bet-message">
          Your Bet
        </div>
        <div class="bet-amount">
          ${betAmount}
        </div>
      </div>
    `,
    () => {
      const result = blackjack.hit();
      if (result) {
        bettingGameEnd(result);
      }
    },
    async () => {
      dom.updateButtons('');
      bettingGameEnd(await blackjack.stand());
    });
  });
  dom.assignButtonFunctionality('.js-back-to-menu-button', menu);
}

function bettingGameEnd(result) {
  if (result === blackjack.WIN) {
    credits.addToCredits(2 * betAmount);
  } else if (result === blackjack.TIE) {
    credits.addToCredits(betAmount);
  }
  dom.updateCredits();
  endGameWith(resultDivs[result], undefined, bettingGameStart);
}

const amounts = {

  win: undefined,
  lose: undefined,

  reset() {
    this.win = 1;
    this.lose = 1;
  }
};

function exponentialDuel() {
  dom.updateTitle(`
    <div class="exponential-duel-title">
      Exponential Duel
    </div>
  `);
  amounts.reset();
  exponentialDuelStart();
}

function exponentialDuelStart() {
  prepareGameWith(`
    <div class="exponential-duel-info">
      <div class="exponential-duel-win-option">
        <div class="exponential-duel-option-message">
          Win
        </div>
        <div class="exponential-duel-option-amount">
          ${amounts.win}
        </div>
      </div>
      <div class="exponential-duel-or-message">
        OR
      </div>
      <div class="exponential-duel-lose-option">
        <div class="exponential-duel-option-message">
          Lose
        </div>
        <div class="exponential-duel-option-amount">
          ${amounts.lose}
        </div>
      </div>
    </div>
  `,
  () => {
    const result = blackjack.hit();
    if (result) {
      exponentialDuelEnd(result);
    }
  },
  async () => {
    dom.updateButtons('');
    exponentialDuelEnd(await blackjack.stand());
  });
}

function exponentialDuelEnd(result) {
  if (result === blackjack.WIN) {
    credits.addToCredits(amounts.win);
    amounts.win *= 2;
  } else if (result === blackjack.LOSE) {
    credits.addToCredits(-amounts.lose);
    amounts.lose *= 2;
  }
  dom.updateCredits();
  endGameWith(resultDivs[result], `
    <div class="exponential-duel-info">
      <div class="exponential-duel-win-option">
        <div class="exponential-duel-option-message">
          Win
        </div>
        <div class="exponential-duel-option-amount">
          ${amounts.win}
        </div>
      </div>
      <div class="exponential-duel-or-message">
        OR
      </div>
      <div class="exponential-duel-lose-option">
        <div class="exponential-duel-option-message">
          Lose
        </div>
        <div class="exponential-duel-option-amount">
          ${amounts.lose}
        </div>
      </div>
    </div>
  `, exponentialDuelStart);
}

function win1Get1() {
  dom.updateTitle(`
    <div class="win-1-get-1-title">
      Win 1 Get 1
    </div>
  `);
  win1Get1Start();
}

function win1Get1Start() {
  prepareGameWith(`
    <div class="win-1-get-1-info">
      <div class="win-1-get-1-message">
        Potential Win
      </div>
      <div class="win-1-get-1-amount">
        1
      </div>
    </div>
  `,
  () => {
    const result = blackjack.hit();
    if (result) {
      win1Get1End(result);
    }
  },
  async () => {
    dom.updateButtons('');
    win1Get1End(await blackjack.stand());
  });
}

function win1Get1End(result) {
  if (result === blackjack.WIN) {
    credits.addToCredits(1);
    dom.updateCredits();
  }
  endGameWith(resultDivs[result], undefined, win1Get1Start);
}

function prepareGameWith(info, hitFunction, standFunction) {
  dom.updateMain(`
    <div class="game">
      <div class="table js-table">
        <div class="scores">
          <div class="card-hand-score js-dealer-score"></div>
          <div class="card-hand-score js-player-score"></div>
        </div>
        <div class="hands">
          <div class="card-hand js-dealer-hand"></div>
          <div class="card-hand js-player-hand"></div>
        </div>
      </div>
      <div class="info">
        <div class="result-info js-result-info">
          <div class="result-message result-message-none">
            ...
          </div>
        </div>
        <div class="game-info js-game-info">
          ${info}
        </div>
      </div>
    </div>
    <div class="buttons js-buttons">
      <button class="game-button hit-button js-hit-button">
        Hit
      </button>
      <button class="game-button stand-button js-stand-button">
        Stand
      </button>
    </div>
  `);
  dom.assignButtonFunctionality('.js-hit-button', hitFunction);
  dom.assignButtonFunctionality('.js-stand-button', standFunction);
  blackjack.play();
}

function endGameWith(resultInfo, info, gameMode) {
  dom.updateInfo(resultInfo, info);
  dom.updateButtons(`
    <button class="game-button play-again-button js-play-again-button">
      Play Again
    </button>
    <button class="game-button back-to-menu-button js-back-to-menu-button">
      Back to Menu
    </button>
  `);
  dom.assignButtonFunctionality('.js-play-again-button', gameMode);
  dom.assignButtonFunctionality('.js-back-to-menu-button', menu);
}
