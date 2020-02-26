const mock = {
  me: {
    balance: 200,
  },
  items: [
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
  ]
};

function shuffleWithDelay(x, target, callback) {
  for (let index = 0; index < x; index++) {
    setTimeout(() => {
      const random = Math.floor(Math.random() * mock.items.length);
      selectedItem = mock.items[random];

      target.src = selectedItem.src;
      target.title = selectedItem.name;
      target.alt = selectedItem.name;

      if (callback !== undefined && index === (x - 1)) {
        callback();
      }
    }, 85 * index);
  }
}

function changeTitleTemporarily(value) {
  const title = document.getElementById('title');
  const defaultTitle = title.innerText;

  if (value > 0) {
    title.innerText = `Parabéns, você ganhou $${value}!`;
  } else {
    title.innerText = `Ops, você perdeu $${value}!`;
  }

  setInterval(() => {
    title.innerText = defaultTitle;
  }, 5000);
}

function calculateResults() {
  const slotItemOne = document.getElementById('slot-item-1');
  const slotItemTwo = document.getElementById('slot-item-2');
  const slotItemThree = document.getElementById('slot-item-3');
  const balance = document.getElementById('balance');

  mock.items.forEach((item) => {
    if (
      slotItemOne.title === item.name ||
      slotItemTwo.title === item.name ||
      slotItemThree.title === item.name
    ) {
      balance.innerText = Number(balance.innerText) + item.reward;
      changeTitleTemporarily(item.reward);
    }
  });
}

async function calculateResultsFromBackend() {
  const slotItemOne = document.getElementById('slot-item-1');
  const slotItemTwo = document.getElementById('slot-item-2');
  const slotItemThree = document.getElementById('slot-item-3');
  const balance = document.getElementById('balance');

  const url = 'http://localhost:5000/heroway-exercises/us-central1/app/slot-machine/calculate';
  // const url = 'https://us-central1-heroway-exercises.cloudfunctions.net/app/slot-machine/calculate';
  const options = {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      slotItemOne: slotItemOne.title,
      slotItemTwo: slotItemTwo.title,
      slotItemThree: slotItemThree.title,
      balance: balance.innerText,
    }),
  };

  const response = await fetch(url, options);
  const json = await response.json();

  balance.innerText = json.balance;

  if (json.reward !== 0) {
    changeTitleTemporarily(json.reward);
  }
}

function onSpin(event) {
  const balance = document.getElementById('balance');

  if (balance.innerText === '0') {
    return;
  } 
  
  balance.innerText -= 10;
  event.target.disabled = true;

  const slotItemOne = document.getElementById('slot-item-1');
  const slotItemTwo = document.getElementById('slot-item-2');
  const slotItemThree = document.getElementById('slot-item-3');

  shuffleWithDelay(20, slotItemOne, () => {
    console.log('embaralhou item 1');
  });

  shuffleWithDelay(40, slotItemTwo, () => {
    console.log('embaralhou item 2');
  });

  shuffleWithDelay(60, slotItemThree, () => {
    console.log('embaralhou item 3');
    
    // calculateResults();
    // event.target.disabled = balance.innerText <= '0' ? true : false;
    
    calculateResultsFromBackend().then(() => {
      event.target.disabled = balance.innerText <= '0' ? true : false;
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const balance = document.getElementById('balance');
  balance.innerText = mock.me.balance;

  const spinButton = document.getElementById('spin-button');
  spinButton.addEventListener('click', onSpin);
});