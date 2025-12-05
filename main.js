window.ondragstart = () => false; // Prevent page dragging

document.querySelector(".start-screen .start-btn").onclick = () => {
  let playerName = prompt("What's your name?");

  if (playerName == null || playerName == "") {
    document.querySelector(".game-info .name span").textContent = "Unknown";
  } else {
    document.querySelector(".game-info .name span").textContent = playerName;
  }

  document.querySelector(".start-screen").remove();
};

let duration = 1000,
  gameDone = true,
  wrongTries = 0;

let blocksContainer = document.querySelector(".memory-game");
let blocks = Array.from(blocksContainer.children);

// let orderRange = Array.from(Array(blocks.length).keys());   #Same_Result
let orderRange = [...Array(blocks.length).keys()];

shuffle(orderRange);

blocks.forEach((block, i) => {
  block.style.order = orderRange[i];
  block.addEventListener("click", () => {
    flipback(block);
  });
});

function flipback(targetBlock) {
  targetBlock.classList.add("flipped");

  let flippedBlocks = blocks.filter((block) =>
    block.classList.contains("flipped")
  );

  if (flippedBlocks.length >= 2) {
    stopClicking();

    checkMatch(flippedBlocks[0], flippedBlocks[1]);
  }
}

function checkMatch(firstBlock, secondBlock) {
  if (firstBlock.dataset.animal === secondBlock.dataset.animal) {
    document.getElementById("success").play();

    firstBlock.classList.remove("flipped");
    secondBlock.classList.remove("flipped");

    firstBlock.classList.add("matched");
    secondBlock.classList.add("matched");

    endGame(blocks);
  } else {
    document.getElementById("fail").play();

    // if it was wrong
    let wrongTriesEl = document.querySelector(".game-info .tries span");
    wrongTriesEl.innerHTML = ++wrongTries;

    setTimeout(() => {
      firstBlock.classList.remove("flipped");
      secondBlock.classList.remove("flipped");
    }, duration);
  }
}

function stopClicking() {
  blocksContainer.classList.add("no-clicking");

  setTimeout(() => {
    blocksContainer.classList.remove("no-clicking");
  }, duration);
}

function shuffle(array) {
  let current = array.length,
    random;

  while (current > 0) {
    // Get a random number from an array range
    random = Math.floor(Math.random() * current);

    current--;

    // Swap values with destructuring
    [array[current], array[random]] = [array[random], array[current]];
  }
  return array;
}

function endGame(blocks) {
  for (block of blocks) {
    if (block.classList.contains("matched")) {
      gameDone = true;
    } else {
      gameDone = false;
      break;
    }
  }

  if (gameDone === true) {
    console.log("Game Finished");

    let popup = document.createElement("div");
    popup.className = "popup";

    let gif = document.createElement("img");
    gif.src = "./imgs/winner-banana.gif";
    gif.alt = "winner-gif";
    popup.appendChild(gif);

    let title = document.createElement("div");
    title.className = "title";
    title.appendChild(document.createTextNode("Congratulations!"));
    popup.appendChild(title);

    let tries = document.createElement("div");
    tries.className = "tries";
    tries.innerHTML = `Wrong tries: <span>${wrongTries}</span>`;
    popup.appendChild(tries);

    // To add Timer function later
    // let time = document.createElement("div");
    // time.className = "time";
    // time.innerHTML = `Time estimated: <span>0</span>s`;
    // popup.appendChild(time);

    let playAgain = document.createElement("div");
    playAgain.className = "play-again";
    playAgain.appendChild(document.createTextNode("Play Again"));
    popup.appendChild(playAgain);

    document.body.appendChild(popup);

    playAgain.onclick = () => {
      window.location.reload();
    };
  }
}
