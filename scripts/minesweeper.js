// minesweeper main js v1


const repeatString = (str, num) => {
  if (num <= 1) {
    return str;
  }
  return str + repeatString(str, num-1);
}

const addElement = (elements, destination) => {
  elements.forEach(element => {
    destination.append(element);
  });
}


const initialize = () => {
  const main = document.createElement('main');
  main.id = 'main-container';
  addElement([main], document.body);

  const header = document.createElement('header');
  header.id = 'header';
  header.innerText = 'Minesweeper';

  const display = document.createElement('section');
  display.id = 'game-display';

  const section = document.createElement('section');
  section.id = 'config-buttons';

  addElement([header, display, section], main);
}

// loads game board givin number of rows and columns
const loadGrid = (rows, columns) => {
  // removes current buttons
  const display = document.getElementById('game-display');
  display.innerHTML = ''
  display.style.gridTemplateColumns = repeatString('1fr ', columns);
  let gridButton;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      gridButton = document.createElement('button');
      gridButton.id = i + '_' + j;
      gridButton.className = 'minesweeper-button';
      display.append(gridButton);
    }
  }
}


initialize();
loadGrid(16, 30);