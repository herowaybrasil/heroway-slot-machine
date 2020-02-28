// valor disponível para aposta
const availableToBet = 500;

// itens para aposta
const items = [
  {
    id: 1,
    reward: 1000,
    name: 'Batman',
    src: './assets/img/batman.png',
  }, {
    id: 2,
    reward: 120,
    name: 'SpiderMan',
    src: './assets/img/spiderman.png',
  }, {
    id: 3,
    reward: -40,
    name: 'Deadpool',
    src: './assets/img/deadpool.png',
  }, {
    id: 4,
    reward: -5000,
    name: 'Bomb',
    src: './assets/img/bomb.png',
  },
];

function shuffleWithDelay(x, target, callback) {
  for (let index = 0; index < x; index++) {
    setTimeout(() => {
      const random = Math.floor(Math.random() * items.length);
      selectedItem = items[random];

      target.src = selectedItem.src;
      target.title = selectedItem.name;
      target.alt = selectedItem.name;

      if (callback !== undefined && index === (x - 1)) {
        callback();
      }
    }, 100 * index);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const balance = document.getElementById('balance');
  balance.innerText = availableToBet;

  const spinButton = document.getElementById('spin-button');
  spinButton.addEventListener('click', function onSpin(event) {
    const slotItemOne = document.getElementById('slot-item-1');
    const slotItemTwo = document.getElementById('slot-item-2');
    const slotItemThree = document.getElementById('slot-item-3');
    const balance = document.getElementById('balance');
    const title = document.getElementById('title');

    if (balance.innerText === '0') {
      return;
    }

    balance.innerText -= 10;
    event.target.disabled = true;

    shuffleWithDelay(20, slotItemOne, () => {
      console.log('embaralhou item 1');
    });

    shuffleWithDelay(40, slotItemTwo, () => {
      console.log('embaralhou item 2');
    });

    shuffleWithDelay(60, slotItemThree, () => {
      console.log('embaralhou item 3');

      items.forEach((item) => {
        if (
          slotItemOne.title === item.name &&
          slotItemTwo.title === item.name &&
          slotItemThree.title === item.name
        ) {
          balance.innerText = Number(balance.innerText) + item.reward;

          const defaultTitle = title.innerText;

          if (item.reward > 0) {
            title.innerText = `Parabéns, você ganhou $${item.reward}!`;
          } else {
            title.innerText = `Ops, você perdeu $${item.reward}!`;
          }

          setInterval(() => {
            title.innerText = defaultTitle;
          }, 5000);
        }
      });

      event.target.disabled = balance.innerText <= '0' ? true : false;
    });
  });
});