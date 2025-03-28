function rollSingleDie() {
  const x = Math.floor(Math.random() * 6) + 1;
  console.log(x);
  return x;
}
function numberToWord(result) {
  return ["one", "two", "three", "four", "five", "six"][result - 1];
}

function rollDice() {
  let container = document.getElementsByClassName('dice_container')[0];
  let sum = 0;


  for (let i = 1; i <= container.children.length; i++) {
    const result = rollSingleDie();
    sum += result;
    let dieElement = document.getElementById("die" + i);
    dieElement.innerHTML = `<i class="fa-solid fa-dice-${numberToWord(result)}" style="font-size: 3.5rem"></i> `;

    dieElement.classList.add("roll");

    setTimeout(() => {
      dieElement.classList.remove("roll");
    }, 500);
  }
  document.getElementById("dice_sum").innerHTML = "Sum: " + sum;
}

function SelectDice(clicked_id) {
  let container = document.getElementsByClassName('dice_container')[0];
  container.innerHTML = "";
  for (let i = 1; i <= clicked_id; i++) {

    //making the <div>
    let iDiv = document.createElement('div');
    iDiv.id = 'die' + i;
    iDiv.className = 'dice';

    //making the <i>
    let iElement = document.createElement('i');
    iElement.className = `fa-solid fa-dice-${numberToWord(rollSingleDie())}`;
    iElement.style.fontSize = '3.5rem';

    //append <i> to the <div>
    iDiv.appendChild(iElement);

    //append <div> to the container
    document.getElementsByClassName('dice_container')[0].appendChild(iDiv);
  }
}
