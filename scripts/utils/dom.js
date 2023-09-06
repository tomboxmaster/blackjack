import { credits } from '../credits.js';

export function updateTitle(title) {
  document.querySelector('.js-title').innerHTML = title;
}

export function updateCredits() {
  document.querySelector('.js-credits-amount').innerHTML = credits;
  document.querySelector('.js-credits-text').innerHTML = credits === 1 ? 'Credit' : 'Credits';
}

export function updateMain(html) {
  document.querySelector('.js-main').innerHTML = html;
}

export function displayTooltip(tooltip) {
  document.querySelector(tooltip).classList.add('menu-button-tooltip-visible');
}

export function hideTooltip(tooltip) {
  document.querySelector(tooltip).classList.remove('menu-button-tooltip-visible');
}

export function updateInfo(resultInfo, info) {
  if (resultInfo) {
    document.querySelector('.js-result-info').innerHTML = resultInfo;
  }
  if (info) {
    document.querySelector('.js-game-info').innerHTML = info;
  }
}

export function updateButtons(buttons) {
  document.querySelector('.js-buttons').innerHTML = buttons;
}

export function updateTable(dealerScore, dealerHand, playerScore, playerHand) {
  if (dealerScore) {
    document.querySelector('.js-dealer-score').innerHTML = dealerScore;
  }
  if (dealerHand) {
    document.querySelector('.js-dealer-hand').innerHTML = dealerHand;
  }
  if (playerScore) {
    document.querySelector('.js-player-score').innerHTML = playerScore;
  }
  if (playerHand) {
    document.querySelector('.js-player-hand').innerHTML = playerHand;
  }
}

export function assignButtonFunctionality(buttonClass, functionality) {
  document.querySelector(buttonClass).addEventListener('click', functionality);
}
