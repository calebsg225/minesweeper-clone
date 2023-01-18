// minesweeper main js v1

// model

const defaultMode = 'Expert';
const currentMode = defaultMode;
const baseModes = [
  {
    gamemode: 'Beginner',
    rows: 9,
    columns: 9,
    mines: 10
  },
  {
    gamemode: 'Intermediate',
    rows: 16,
    columns: 16,
    mines: 40
  },
  {
    gamemode: 'Expert',
    rows: 16,
    columns: 30,
    mines: 99
  }
]

const repeatString = (str, num) => {
  if (num <= 1) {
    return str;
  }
  return str + repeatString(str, num-1);
}


// controller

const onSettings = () => {
  loadSettingsPage();
}

const onExit = () => {
  unloadSettingsPage();
}

// view
const addElement = (elements, destination) => {
  elements.forEach(element => {
    destination.append(element);
  });
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
    modebutton.id = 'settings-mode-select';
    modebutton.className = 'settings-button';
    modebutton.innerText = mode.gamemode;
    addElement([modebutton], menu);
  });

  const actionDiv = document.createElement('div');
  actionDiv.id = 'action-container';
  addElement([actionDiv], menu);

  const create = document.createElement('button');
  create.id = 'settings-create';
  create.className = 'settings-button action';
  create.innerText = 'Create';

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