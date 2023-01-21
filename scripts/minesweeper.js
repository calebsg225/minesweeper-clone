// minesweeper main js v1

// model

let minefield = [];
let spacesRevealed = 0;
let firstTile = true;

const baseModes = [
  {
    gamemode: 'Beginner',
    rows: 9,
    columns: 9,
    mines: 10,
    isActive: false
  },
  {
    gamemode: 'Intermediate',
    rows: 16,
    columns: 16,
    mines: 40,
    isActive: false
  },
  {
    gamemode: 'Expert',
    rows: 16,
    columns: 30,
    mines: 99,
    isActive: true
  }
]
const defaultMode = 2;
let currentMode = defaultMode;
let previousMode = defaultMode;

const repeatString = (str, num) => {
  if (num <= 1) {
    return str;
  }
  return str + repeatString(str, num-1);
}

const toggleActive = (modeToActivate) => {
  baseModes.forEach(mode => {
    mode.isActive = false;
  });
  for (let i = 0; i < 3; i++) {
    if (baseModes[i].gamemode == modeToActivate.gamemode) {
      currentMode = i;
    }
  }

  modeToActivate.isActive = true;
}

const createNew = () => {
  previousMode = currentMode;
  const rows = baseModes[currentMode].rows;
  const columns = baseModes[currentMode].columns;

  loadGrid(rows, columns);
}

const createMineField = () => {
  const mode = baseModes[currentMode];
  return(Array.from(Array(mode.rows), () => new Array(mode.columns).fill(0)));
}

const placeMines = field => {
  const mode = baseModes[currentMode];

  let row;
  let column;
  for (let i = 0; i < mode.mines; i++) {
    row = Math.floor(Math.random() * mode.rows);
    column = Math.floor(Math.random() * mode.columns);
    if (field[row][column] != 0) {i--; continue;}
    field[row][column]++;
  }
  return field;
}

const replaceMines = idMakeCLear => {

}

const checkWin = () => {
  const mode = baseModes[currentMode];
  return spacesRevealed == (mode.rows * mode.columns) - mode.mines;
}

const showFlags = () => {

}

const revealedMine = idIsMine => {
  const idCoords = idIsMine.split(/_/);
  return minefield[+idCoords[0]][+idCoords[1]] == 1;
}

const revealMines = () => {
  
}

const reveal = idToReveal => {
  const idCoords = idToReveal.split(/_/);

}

// controller

const onSettings = () => {
  loadSettingsPage();
}

const onExit = () => {
  toggleActive(baseModes[previousMode]);
  unloadSettingsPage();
}

const onCreate = () => {
    createNew();
    unloadSettingsPage();
}

const onActive = (modeToActivate) => {
  return () => {
    toggleActive(modeToActivate);
    displayActive(modeToActivate);
  }
}

const onReveal = event => {
  const tileToReveal = event.target;
  const tileId = tileToReveal.id;

  if (firstTile) {replaceMines(tileId)}

  if (revealedMine(tileId)) {
    revealMines();
    gameLost();
    return;
  }
  else {reveal(tileId);}
  
  if (checkWin()) {
    showFlags();
    gameWon();
  }

}

// view
const addElement = (elements, destination) => {
  elements.forEach(element => {
    destination.append(element);
  });
}

const displayActive = (activeMode) => {
  document.getElementsByClassName('settings-active-button')[0].classList.remove('settings-active-button');
  const activeButton = document.getElementById('settings-mode-' + baseModes[currentMode].gamemode);
  activeButton.classList.add('settings-active-button');
}

const unloadSettingsPage = () => {
  document.getElementById('settings-greyout').remove();
  document.getElementById('header-title').innerText = 'Minesweeper - ' + baseModes[currentMode].gamemode;
}

const loadSettingsPage = () => { // settings page
  const greyout = document.createElement('div');
  greyout.id = 'settings-greyout';
  addElement([greyout], document.body);

  const menu = document.createElement('div');
  menu.id = 'settings-menu-container';
  addElement([menu], greyout);

  baseModes.forEach(mode => {
    const modebutton = document.createElement('button');
    modebutton.id = 'settings-mode-' + mode.gamemode;
    modebutton.className = 'settings-button';
    if (mode.isActive) {
      modebutton.classList.add('settings-active-button');
    }
    modebutton.innerText = mode.gamemode + ' - ' + mode.rows + 'x' + mode.columns + ' ' + mode.mines + ' mines';
    modebutton.onclick = onActive(mode);
    addElement([modebutton], menu);
  });

  const actionDiv = document.createElement('div');
  actionDiv.id = 'action-container';
  addElement([actionDiv], menu);

  const create = document.createElement('button');
  create.id = 'settings-create';
  create.className = 'settings-button action';
  create.innerText = 'Create';
  create.onclick = onCreate;

  const exit = document.createElement('button');
  exit.id = 'settings-exit'
  exit.className = 'settings-button action';
  exit.innerText = 'Exit'
  exit.onclick = onExit;

  addElement([create, exit], actionDiv)
}

const initialize = () => { // load page
  const main = document.createElement('main');
  main.id = 'main-container';
  addElement([main], document.body);


  // header
  const header = document.createElement('header');
  header.id = 'header';

  const headerTitle = document.createElement('h1');
  headerTitle.id = 'header-title';
  headerTitle.innerText = 'Minesweeper - ' + baseModes[currentMode].gamemode;
  
  const settingsIcon = document.createElement('img');
  settingsIcon.src = 'icons/settings.png';
  settingsIcon.id = 'settings-icon';
  settingsIcon.onclick = onSettings;

  addElement([headerTitle, settingsIcon], header);


  // game display
  const display = document.createElement('section');
  display.id = 'game-display';

  addElement([header, display], main);
  loadGrid(baseModes[defaultMode].rows, baseModes[defaultMode].columns);
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
      gridButton.className = 'minesweeper-button unrevealed';
      gridButton.onclick = onReveal;
      display.append(gridButton);
    }
  }
  minefield = placeMines(createMineField());
}

const gameLost = () => {

}

const gameWon = () => {

}

initialize();