// model
let minefield = [];
let spacesRevealed = 0;
let minesFlagged = 0;
let firstTile = true;
let doubleClick = [];

const baseModes = [
  {
    gamemode: 'Beginner',
    rows: 9,
    columns: 9,
    mines: 10,
    isActive: false,
    width: 63
  },
  {
    gamemode: 'Intermediate',
    rows: 16,
    columns: 16,
    mines: 40,
    isActive: false,
    width: 63
  },
  {
    gamemode: 'Expert',
    rows: 16,
    columns: 30,
    mines: 99,
    isActive: false,
    width: 120
  }
]
const defaultMode = 2;
baseModes[defaultMode].isActive = true
let currentMode = defaultMode;
let previousMode = defaultMode;
let mode = baseModes[currentMode];

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
  firstTile = true;
  minesFlagged = 0;

  loadGrid(rows, columns);
}

const createMineField = () => {
  spacesRevealed = 0;
  return(Array.from(Array(mode.rows), () => new Array(mode.columns).fill(0)));
}

const placeMines = field => {

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

const replaceMines = (row, column) => {
  // load mines not near first click
  minefield = createMineField();
  let coords = [[row, column]];
  minefield[row][column] = 2;
  if (row < mode.rows - 1) {
    minefield[row+1][column] = 2;
    coords.push([row+1, column]);
  }
  if (row > 0) {
    minefield[row-1][column] = 2;
    coords.push([row-1, column]);
  }
  if (column < mode.columns - 1) {
    minefield[row][column+1] = 2;
    coords.push([row, column+1]);
  }
  if (column > 0) {
    minefield[row][column-1] = 2;
    coords.push([row, column-1]);
  }
  if (row < mode.rows - 1 && column < mode.columns - 1) {
    minefield[row+1][column+1] = 2;
    coords.push([row+1, column+1]);
  }
  if (row > 0 && column < mode.columns - 1) {
    minefield[row-1][column+1] = 2;
    coords.push([row-1, column+1]);
  }
  if (row < mode.rows - 1 && column > 0) {
    minefield[row+1][column-1] = 2;
    coords.push([row+1, column-1]);
  }
  if (row > 0 && column > 0) {
    minefield[row-1][column-1] = 2;
    coords.push([row-1, column-1]);
  }
  minefield = placeMines(minefield);
  coords.forEach(coord => {
    minefield[coord[0]][coord[1]] = 0;
  });
  firstTile = false;
}

const checkWin = () => {
  if (spacesRevealed == (mode.rows * mode.columns) - mode.mines) {
    showFlags();
    endScreen('won', 'You Win!', 'green');
  }
}

const showFlags = () => {
  // display flags on unflaggged mines
}

const revealedMine = idIsMine => {
  const idCoords = idIsMine.split(/_/);
  return minefield[+idCoords[0]][+idCoords[1]] == 1;
}

const revealMines = (idRevealed) => {
  // display location of all mines and misplaced flags
  for (let j = 0; j < mode.columns; j++) {
    for (let i = 0; i < mode.rows; i++) {
      const currentTile = document.getElementById(i + '_' + j);
      currentTile.onclick = '';
      currentTile.oncontextmenu = '';
      if (minefield[i][j] === 1) {
        if (i + '_' + j == idRevealed) {displayMine(idRevealed, 'red-mine')}
        else if (!currentTile.classList.contains('flagged')) {displayMine(i + '_' + j, 'mine')}
      }
      else if (currentTile.classList.contains('flagged')) {
        removeFlag(i + '_' + j);
        displayMine(i + '_' + j, 'flag-mine')
      }
    }
  }
}

const recursiveClear = (row, column) => {
  // recursively clears surrounding squares
  if (checkFlag(row + '_' + column)) {return}
  if (document.getElementById(row + '_' + column).classList.contains('revealed-clear')) {return};

  document.getElementById(row + '_' + column).onclick = '';
  document.getElementById(row + '_' + column).oncontextmenu = '';

  spacesRevealed ++;

  const surroundingMines = getSurrounding(row, column);
  if (surroundingMines > 0) {
    displayNumber(row, column, surroundingMines);
    return;
  }
  displayClear(row, column);
  if (row < mode.rows - 1 && minefield[row+1][column] == 0) {recursiveClear(row+1, column);}
  if (row > 0 && minefield[row-1][column] == 0) {recursiveClear(row-1, column);}
  if (column < mode.columns - 1 && minefield[row][column+1] == 0) {recursiveClear(row, column+1);}
  if (column > 0 && minefield[row][column-1] == 0) {recursiveClear(row, column-1);}
  if (row < mode.rows - 1 && column < mode.columns - 1 && minefield[row+1][column+1] == 0) {recursiveClear(row+1, column+1);}
  if (row > 0 && column < mode.columns - 1 && minefield[row-1][column+1] == 0) {recursiveClear(row-1, column+1);}
  if (row < mode.rows - 1 && column > 0 && minefield[row+1][column-1] == 0) {recursiveClear(row+1, column-1);}
  if (row > 0 && column > 0 && minefield[row-1][column-1] == 0) {recursiveClear(row-1, column-1);}
}

const getSurrounding = (row, column) => {
  // tallies number of surrounding mines for current square
  let surrounding = 0;
  if (row < mode.rows - 1 && minefield[row+1][column] == 1) {surrounding++}
  if (row > 0 && minefield[row-1][column] == 1) {surrounding++}
  if (column < mode.columns - 1 && minefield[row][column+1] == 1) {surrounding++}
  if (column > 0 && minefield[row][column-1] == 1) {surrounding++}
  if (row < mode.rows - 1 && column < mode.columns - 1 && minefield[row+1][column+1] == 1) {surrounding++}
  if (row > 0 && column < mode.columns - 1 && minefield[row-1][column+1] == 1) {surrounding++}
  if (row < mode.rows - 1 && column > 0 && minefield[row+1][column-1] == 1) {surrounding++}
  if (row > 0 && column > 0 && minefield[row-1][column-1] == 1) {surrounding++}
  return surrounding;
}

const toggleFlag = flagged => {
  if (flagged) {minesFlagged--}
  else {minesFlagged++}
  return flagged;
}

const checkFlag = idToCheck => {
  return document.getElementById(idToCheck).classList.contains('flagged');
}

const checkUnrevealed = idToCheck => {
  return document.getElementById(idToCheck).classList.contains('unrevealed');
}

const revealSurrounding = (row, column) => {
  let unrevealed = [];
  let flagged = [];
  let surrounding = 0;
  if (row < mode.rows - 1) {
    if (minefield[row+1][column] == 1) { surrounding++ }
    if (checkUnrevealed((row+1) + '_' + column)) { unrevealed.push([row+1, column]) }
    if (checkFlag((row+1) + '_' + column)) { flagged.push([row+1, column]); unrevealed.pop() }
  }
  if (row > 0) {
    if (minefield[row-1][column] == 1) { surrounding++ }
    if (checkUnrevealed((row-1) + '_' + column)) { unrevealed.push([row-1, column]) }
    if (checkFlag((row-1) + '_' + column)) { flagged.push([row-1, column]); unrevealed.pop() }
  }
  if (column < mode.columns - 1) {
    if (minefield[row][column+1] == 1) { surrounding++ }
    if (checkUnrevealed(row + '_' + (column+1))) { unrevealed.push([row, column+1]) }
    if (checkFlag(row + '_' + (column+1))) { flagged.push([row, column+1]); unrevealed.pop() }
  }
  if (column > 0) {
    if (minefield[row][column-1] == 1) { surrounding++ }
    if (checkUnrevealed(row + '_' + (column-1))) { unrevealed.push([row, column-1]) }
    if (checkFlag(row + '_' + (column-1))) { flagged.push([row, column-1]); unrevealed.pop() }
  }
  if (row < mode.rows - 1 && column < mode.columns - 1) {
    if (minefield[row+1][column+1] == 1) { surrounding++ }
    if (checkUnrevealed((row+1) + '_' + (column+1))) { unrevealed.push([row+1, column+1]) }
    if (checkFlag((row+1) + '_' + (column+1))) { flagged.push([row+1, column+1]); unrevealed.pop() }
  }
  if (row > 0 && column < mode.columns - 1) {
    if (minefield[row-1][column+1] == 1) { surrounding++ }
    if (checkUnrevealed((row-1) + '_' + (column+1))) { unrevealed.push([row-1, column+1]) }
    if (checkFlag((row-1) + '_' + (column+1))) { flagged.push([row-1, column+1]); unrevealed.pop() }
  }
  if (row < mode.rows - 1 && column > 0) {
    if (minefield[row+1][column-1] == 1) { surrounding++ }
    if (checkUnrevealed((row+1) + '_' + (column-1))) { unrevealed.push([row+1, column-1]) }
    if (checkFlag((row+1) + '_' + (column-1))) { flagged.push([row+1, column-1]); unrevealed.pop() }
  }
  if (row > 0 && column > 0) {
    if (minefield[row-1][column-1] == 1) { surrounding++ }
    if (checkUnrevealed((row-1) + '_' + (column-1))) { unrevealed.push([row-1, column-1]) }
    if (checkFlag((row-1) + '_' + (column-1))) { flagged.push([row-1, column-1]); unrevealed.pop() }
  }
  doubleClick = [unrevealed, flagged, surrounding];
}

const revealSurroundingDisplay = ([unrevealed, flagged, surrounding]) => {
  let minesToClear = [];
  if (flagged.length != surrounding) {return}
  for (const tile of unrevealed) {
    if (!revealedMine(tile[0] + '_' + tile[1])) {
      recursiveClear(tile[0], tile[1]);
      checkWin();
    } else {
      minesToClear.push(tile);
    }
  }
  if (minesToClear.length === 0) {return}
  revealMines(minesToClear[0]);
  endScreen('lost', 'Game Over', 'red');
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

const onNewGame = () => {
  createNew();
  unloadEndScreen();
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
  const idCoords = tileId.split(/_/);

  if (checkFlag(tileId)) {
    toggleFlag(checkFlag(tileId));
    removeFlag(tileId);
  }

  if (firstTile) {replaceMines(+idCoords[0], +idCoords[1])}

  if (revealedMine(tileId)) {
    revealMines(tileId);
    endScreen('lost', 'Game Over', 'red');
    return;
  }
  else {
    recursiveClear(+idCoords[0], +idCoords[1]);
  }
  
  checkWin();

}

const onRevealSurrounding = tileId => {
  // reveal all surrounding tiles if flags == mines in uncleared
  const [ row, column ] = tileId.split('_');
  revealSurrounding(+row, +column);
}

const onRevealSurroundingDisplay = () => {
  revealSurroundingDisplay(doubleClick);
}

const onFlag = event => {
  const tileToFlag = event.target;
  const tileId = tileToFlag.id;

  toggleFlag(checkFlag(tileId));

  if (checkFlag(tileId)) {
    removeFlag(tileId);
  }
  else {
    displayFlag(tileId);
  }
}

// view
const addElement = (elements, destination) => {
  elements.forEach(element => {
    destination.append(element);
  });
}

const doubleHoverOn = (tilesToHover) => {
  for (const tile of tilesToHover) {
    const [row, column] = tile;
    document.getElementById(row + '_' + column).classList.add('unrevealed-double-click');
  }
}

const doubleHoverOff = (tilesToUnHover) => {
  for (const tile of tilesToUnHover) {
    const [row, column] = tile;
    document.getElementById(row + '_' + column).classList.remove('unrevealed-double-click');
  }
}

const displayActive = (activeMode) => {
  document.getElementsByClassName('settings-active-button')[0].classList.remove('settings-active-button');
  const activeButton = document.getElementById('settings-mode-' + baseModes[currentMode].gamemode);
  activeButton.classList.add('settings-active-button');
}

const unloadSettingsPage = () => {
  document.getElementById('greyout').remove();
  document.getElementById('header-title').innerText = 'Minesweeper - ' + baseModes[currentMode].gamemode;
}

const displayNumber = (row, column, mineCount) => {
  const bothButtonsPressedPrep = e => {
    if (e.button === 0) {left = true}
    if (e.button === 2) {right = true}
    if (left && right) {
      onRevealSurrounding(row + '_' + column);
      doubleHoverOn(doubleClick[0])
    }
  }

  const bothButtonsPressed = e => {
    if (e.button === 0) {left = true}
    if (e.button === 2) {right = true}
    if (left && right) {
      onRevealSurroundingDisplay(doubleClick.concat(doubleClick[1]));
      doubleHoverOff(doubleClick[0].concat(doubleClick[1]))
    }
  }
  
  const bothButtonsPressedOff = e => {
    setTimeout(() => {
      if (e.button === 0) {left = false}
      if (e.button === 2) {right = false}
    }, 100);
  }
  
  const toDisplayNumber = document.getElementById(row + '_' + column);
  toDisplayNumber.classList.remove('unrevealed');
  toDisplayNumber.classList.add('revealed-clear');

  let left = false;
  let right = false;
  toDisplayNumber.addEventListener('mousedown', bothButtonsPressedPrep)
  toDisplayNumber.addEventListener('mouseup', bothButtonsPressed);
  toDisplayNumber.addEventListener('mouseup', bothButtonsPressedOff);

  const numberImage = document.createElement('img');
  numberImage.className = 'm-button-icon';
  numberImage.src = `icons/${mineCount}.PNG`;

  toDisplayNumber.append(numberImage);
}

const displayClear = (row, column) => {
  const toClear = document.getElementById(row + '_' + column);
  toClear.classList.remove('unrevealed');
  toClear.classList.add('revealed-clear');
}

const displayFlag = idToFlag => {
  const toFlag = document.getElementById(idToFlag);
  toFlag.classList.add('flagged');
  toFlag.onclick = '';

  const flagImage = document.createElement('img');
  flagImage.className = 'm-button-icon';
  flagImage.src = 'icons/flag.PNG';

  toFlag.append(flagImage);

  document.getElementById('score').innerText = baseModes[currentMode].mines - minesFlagged;
}

const removeFlag = flagToRemove => {
  const toUnFLag = document.getElementById(flagToRemove);
  toUnFLag.classList.remove('flagged');
  toUnFLag.innerHTML = '';
  toUnFLag.onclick = onReveal;
  
  document.getElementById('score').innerText = baseModes[currentMode].mines - minesFlagged;
}

const displayMine = (mineToDisplay, type) => {
  const toShowMine = document.getElementById(mineToDisplay);
  
  const mineImage = document.createElement('img');
  mineImage.className = 'm-button-icon';
  mineImage.src =`icons/${type}.PNG`;

  toShowMine.append(mineImage);
}

const loadSettingsPage = () => { // settings page
  const greyout = document.createElement('div');
  greyout.id = 'greyout';
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
  
  const rightHeader = document.createElement('div');
  rightHeader.id = 'right-header';

  const scoreContainer = document.createElement('div');
  scoreContainer.id = 'score-container';

  const score = document.createElement('h2');
  score.id = 'score';
  score.innerText = baseModes[currentMode].mines - minesFlagged;

  addElement([score], scoreContainer);

  const settingsIcon = document.createElement('img');
  settingsIcon.src = 'icons/settings.png';
  settingsIcon.id = 'settings-icon';
  settingsIcon.onclick = onSettings;

  addElement([scoreContainer, settingsIcon], rightHeader);

  addElement([headerTitle, rightHeader], header);


  // game display
  const display = document.createElement('section');
  display.id = 'game-display';

  addElement([header, display], main);
  loadGrid(baseModes[defaultMode].rows, baseModes[defaultMode].columns);
}

// loads game board givin number of rows and columns
const loadGrid = (rows, columns) => {
  // removes current buttons
  mode = baseModes[currentMode];
  const display = document.getElementById('game-display');
  display.innerHTML = ''
  display.style.gridTemplateColumns = repeatString('1fr ', columns);
  display.addEventListener("contextmenu", e => {e.preventDefault()});

  document.getElementById('main-container').style.width = baseModes[currentMode].width + 'rem';
  document.getElementById('score').innerText = baseModes[currentMode].mines - minesFlagged;


  let gridButton;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      gridButton = document.createElement('div');
      gridButton.id = i + '_' + j;
      gridButton.className = 'minesweeper-button unrevealed';
      gridButton.onclick = onReveal;
      gridButton.oncontextmenu = onFlag;
      
      display.append(gridButton);
    }
  }
  minefield = placeMines(createMineField());
}

const endScreen = (result, display, color) => {
  // lost game menu
  const greyout = document.createElement('div');
  greyout.className = 'greyout-clear';
  document.body.append(greyout);

  const menu = document.createElement('div');
  menu.className = 'menu-container';

  const heading = document.createElement('h1');
  heading.className = 'msg-display';
  heading.innerText = display;
  heading.style.color = color;

  const newGame = document.createElement('button');
  newGame.className = 'new-game-button settings-button';
  newGame.innerText = 'New Game';
  newGame.onclick = onNewGame;

  addElement([heading, newGame], menu);
  greyout.append(menu);

}

const unloadEndScreen = () => {
  document.getElementsByClassName('greyout-clear')[0].remove();
}

initialize();