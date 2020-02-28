// valor disponível para aposta
const availableToBet = 500;

// embaralhar
const suffle = {
  name: 'Shuffle',
  src: '../assets/img/shuffling.gif',
};

document.addEventListener('DOMContentLoaded', () => {
  const gameBalance = createBalance(availableToBet);

  const spinButton = document.getElementById('spin-button');
  spinButton.addEventListener('click', run);

  // Armazena toda a lógica quando o usuário clicar no botão Spin
  function run(event) {
    const slotItemOneEl = document.getElementById('slot-item-1');
    const slotItemTwoEl = document.getElementById('slot-item-2');
    const slotItemThreeEl = document.getElementById('slot-item-3');

    gameBalance.setBalance(gameBalance.getBalance() - 10);
    event.target.disabled = true;

    setSlotProperties(slotItemOneEl, suffle);
    setSlotProperties(slotItemTwoEl, suffle);
    setSlotProperties(slotItemThreeEl, suffle);

    calculateResults().then((json) => {
      setTimeout(() => {
        setSlotProperties(slotItemOneEl, json.items.slotItemOne);
      }, 1000);

      setTimeout(() => {
        setSlotProperties(slotItemTwoEl, json.items.slotItemTwo);
      }, 2000);

      setTimeout(() => {
        setSlotProperties(slotItemThreeEl, json.items.slotItemThree);

        gameBalance.setBalance(json.balance);

        if (json.reward !== 0) {
          changeTitleTemporarily(json.reward);
        }

        event.target.disabled = gameBalance.getBalance() <= 0 ? true : false;
      }, 3000);
    });
  }

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

  function setSlotProperties(target, item) {
    target.src = item.src;
    target.title = item.title;
    target.alt = item.alt
  }

  // calcula os resultados utilizando o back-end
  async function calculateResults() {
    const url = 'http://localhost:5000/heroway-exercises/us-central1/app/slot-machine/calculate';
    // const url = 'https://us-central1-heroway-exercises.cloudfunctions.net/app/slot-machine/calculate';
    const options = {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        balance: gameBalance.getBalance(),
      }),
    };

    const response = await fetch(url, options);
    const json = await response.json();

    return json;
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