// minesweeper main js v1

// create header and main divs

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

initialize()