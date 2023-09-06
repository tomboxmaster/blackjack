export let credits = Number(JSON.parse(localStorage.getItem('credits')) || 0);

export function addToCredits(amount) {
  credits += amount;
  if (credits < 0) {
    credits = 0;
  }
  localStorage.setItem('credits', JSON.stringify(credits));
}
