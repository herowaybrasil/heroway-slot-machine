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

document.addEventListener('DOMContentLoaded', () => {
  const gameBalance = createBalance(availableToBet);

  const spinButton = document.getElementById('spin-button');
  spinButton.addEventListener('click', run);

  // Cria o contexto de balanço do jogo
  function createBalance(initialBalance) {
    const balanceEl = document.getElementById('balance');
    balanceEl.innerText = initialBalance;
    
    let balance = initialBalance;
    const history = [];

    function getBalance() {
      history.push('visualizou o balanço');
      return balance;
    }

    function setBalance(newBalance) {
      history.push('atualizou o balanço');
      balance = newBalance;
      balanceEl.innerText = newBalance;
    }

    return {
      getBalance,
      setBalance
    }
  }

  // Armazena toda a lógica quando o usuário clicar no botão Spin
  function run(event) {
    const slotItemOneEl = document.getElementById('slot-item-1');
    const slotItemTwoEl = document.getElementById('slot-item-2');
    const slotItemThreeEl = document.getElementById('slot-item-3');

    gameBalance.setBalance(gameBalance.getBalance() - 10);
    event.target.disabled = true;

    shuffleWithDelay(1, slotItemOneEl, () => {
      console.log('embaralhou item 1');
    });

    shuffleWithDelay(2, slotItemTwoEl, () => {
      console.log('embaralhou item 2');
    });

    shuffleWithDelay(3, slotItemThreeEl, () => {
      console.log('embaralhou item 3');

      calculateResults();
      event.target.disabled = gameBalance.getBalance() <= 0 ? true : false;

      // calculateResultsFromBackend().then(() => {
      //   event.target.disabled = gameBalance.getBalance() <= 0 ? true : false;
      // });
    });
  }

  // embaralha itens
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
      }, 85 * index);
    }
  }

    // calcula os resultados
    function calculateResults() {
      const slotItemOneEl = document.getElementById('slot-item-1');
      const slotItemTwoEl = document.getElementById('slot-item-2');
      const slotItemThreeEl = document.getElementById('slot-item-3');
  
      items.forEach((item) => {
        if (
          slotItemOneEl.title === item.name &&
          slotItemTwoEl.title === item.name &&
          slotItemThreeEl.title === item.name
        ) {
          gameBalance.setBalance(gameBalance.getBalance() + item.reward);
          changeTitleTemporarily(item.reward);
        }
      });
    }
  
    // calcula os resultados utilizando o back-end
    async function calculateResultsFromBackend() {
      const slotItemOneEl = document.getElementById('slot-item-1');
      const slotItemTwoEl = document.getElementById('slot-item-2');
      const slotItemThreeEl = document.getElementById('slot-item-3');

      const url = 'http://localhost:5000/heroway-exercises/us-central1/app/slot-machine/calculate';
      // const url = 'https://us-central1-heroway-exercises.cloudfunctions.net/app/slot-machine/calculate';
      const options = {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          slotItemOne: slotItemOneEl.title,
          slotItemTwo: slotItemTwoEl.title,
          slotItemThree: slotItemThreeEl.title,
          balance: gameBalance.getBalance(),
        }),
      };
  
      const response = await fetch(url, options);
      const json = await response.json();
  
      gameBalance.setBalance(json.balance);

      if (json.reward !== 0) {
        changeTitleTemporarily(json.reward);
      }
    }

  // muda o titulo da aplicação
  function changeTitleTemporarily(value) {
    const title = document.getElementById('title');
    const defaultTitle = title.innerText;

    if (value > 0) {
      title.innerText = `Parabéns, você ganhou $${value}!`;
    } else {
      title.innerText = `Ops, você perdeu $${value}!`;
    }

    setTimeout(() => {
      title.innerText = defaultTitle;
    }, 5000);
  }
});