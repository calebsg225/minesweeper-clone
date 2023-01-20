// minesweeper main js v1

// model

const defaultMode = 'Expert';
let currentMode = defaultMode;
let previousMode = defaultMode;
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
  modeToActivate.isActive = true;
  currentMode = modeToActivate.gamemode;
}

const revertActive = () => {
  let modeToRevert;
  baseModes.forEach(mode => {
    if (mode.gamemode == previousMode) {
      modeToRevert = mode;
    }
  });
  
  toggleActive(modeToRevert);

  currentMode = previousMode;
}

const createNew = () => {
  previousMode = currentMode;
  let rows;
  let columns;
  baseModes.forEach(mode => {
    if (mode.isActive) {
      rows = mode.rows;
      columns = mode.columns;
    }
  });
  loadGrid(rows, columns);
}


// controller

const onSettings = () => {
  loadSettingsPage();
}

const onExit = () => {
  unloadSettingsPage();
  revertActive();
}

const onCreate = () => {
    unloadSettingsPage();
    createNew();
}

const onActive = (modeToActivate) => {
  return () => {
    toggleActive(modeToActivate);
    displayActive(modeToActivate);
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
  const activeButton = document.getElementById('settings-mode-' + currentMode);
  activeButton.classList.add('settings-active-button');
}

const unloadSettingsPage = () => {
  const toRemove = document.getElementById('settings-greyout');
  toRemove.remove();
}

const loadSettingsPage = () => {
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

const initialize = () => {
  const main = document.createElement('main');
  main.id = 'main-container';
  addElement([main], document.body);


  // header
  const header = document.createElement('header');
  header.id = 'header';

  const headerTitle = document.createElement('h1');
  headerTitle.id = 'header-title';
  headerTitle.innerText = 'Minesweeper - ' + currentMode;
  
  const settingsIcon = document.createElement('img');
  settingsIcon.src = 'icons/settings.png';
  settingsIcon.id = 'settings-icon';
  settingsIcon.onclick = onSettings;

  addElement([headerTitle, settingsIcon], header);


  // game display
  const display = document.createElement('section');
  display.id = 'game-display';


  // tbd
  const section = document.createElement('section');
  section.id = 'config-buttons';

  addElement([header, display, section], main);
  loadGrid(16, 30);
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