//Flag to control the flashing
let flashing =false;

function rollSingleDie() {
  const x = Math.floor(Math.random() * 6) + 1;
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
  let rollDice = document.getElementById('dice_btn_id');
  rollDice.removeAttribute('disabled');
  rollDice.removeEventListener("mouseover", FlashTheAmount);
  let sum = 0;
  if (clicked_id <= 2) {
    container.style.gridTemplateColumns = "repeat(" + clicked_id + ",1fr)";
  }
  else {
    container.style.gridTemplateColumns = "repeat(3, 1fr)";
  }

  container.innerHTML = "";
  for (let i = 1; i <= clicked_id; i++) {
    //making the <div>
    let iShadow = document.createElement('div');
    iShadow.className = 'dice_shdw';

    let iDiv = document.createElement('div');
    iDiv.id = 'die' + i;
    iDiv.className = 'dice';

    //making the <i>
    let iElement = document.createElement('i');
    const value = rollSingleDie();
    iElement.className = `fa-solid fa-dice-${numberToWord(value)}`;
    iElement.style.fontSize = '3.5rem';

    //append <i> to the <div>
    iDiv.appendChild(iElement);
    iShadow.appendChild(iDiv);
    //append <div> to the container
    document.getElementsByClassName('dice_container')[0].appendChild(iShadow);
    sum += value;
  }
  document.getElementById("dice_sum").innerHTML = "Sum: " + sum;
}



function FlashTheAmount() {
  const rollDice = document.getElementById('dice_btn_id');
  console.log(flashing);  // Debugging output

  if (rollDice.disabled && flashing == false) {
    flashing = true;
    const buttons = document.querySelectorAll(".select_container button");
    rollDice.removeEventListener("mouseover", FlashTheAmount);

    buttons.forEach((element, index) => {
      setTimeout(() => {
        element.classList.add("flash");
        setTimeout(() => {
          element.classList.remove("flash");

          // When the last button finishes flashing, reset flashing and re-enable the event listener
          if (index === buttons.length - 1) {
            flashing = false;
            rollDice.addEventListener("mouseover", FlashTheAmount);
          }
        }, 500);
      }, 700 * index);
    });
  }
}


setTimeout(FlashTheAmount(), 1000);

