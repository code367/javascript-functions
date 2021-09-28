function seed() {
  return [...arguments];
}

function same([x, y], [j, k]) {
  return (x === j) && (y === k);
}

// The game state to search for `cell` is passed as the `this` value of the function.
function contains(cell) {
  return this.find(entry => same(entry, cell)) !== undefined;
}

const printCell = (cell, state) => {
  return contains.call(state, cell) ? '\u25A3' : '\u25A2';
};

const corners = (state = []) => {  
  if (state.length) {
    const x = state.map(cell => cell[0]);
    const y = state.map(cell => cell[1]);
    return {
      topRight: [Math.max(...x), Math.max(...y)],
      bottomLeft: [Math.min(...x), Math.min(...y)]
    };
  } else {
    return {
      topRight: [0, 0],
      bottomLeft: [0, 0]
    }
  }
};

const printCells = (state) => {  
  const {
    topRight,
    bottomLeft
  } = corners(state);
  const rows = [];
  for (let y = bottomLeft[1]; y <= topRight[1]; y++) {
    const row = [];
    rows.push(row);
    for (let x = bottomLeft[0]; x <= topRight[0]; x++) {
      row.push(printCell([x, y], state));
    }
  }
  return rows.reverse().map(row => `${row.join(' ')}\n`).join("");
};

const getNeighborsOf = ([x, y]) => {
  return [
    [x - 1, y - 1],
    [x, y - 1],
    [x + 1, y - 1],
    [x - 1, y],
    [x + 1, y],
    [x - 1, y + 1],
    [x, y + 1],
    [x + 1, y + 1]
  ];
};

const getLivingNeighbors = (cell, state) => {
  const boundContains = contains.bind(state);
  return getNeighborsOf(cell).filter(cell => boundContains(cell));
};

const willBeAlive = (cell, state) => {
  const numLivingNeighbors = getLivingNeighbors(cell, state).length;
  return (contains.call(state, cell) && numLivingNeighbors == 2) || numLivingNeighbors == 3;
};

const calculateNext = (state) => {
  const {
    topRight,
    bottomLeft
  } = corners(state);
  bottomLeft[0] -= 1;
  bottomLeft[1] -= 1;
  topRight[0] += 1;
  topRight[1] += 1;
  const newState = [];
  for (let y = bottomLeft[1]; y <= topRight[1]; y++) {
    for (let x = bottomLeft[0]; x <= topRight[0]; x++) {
      const cell = [x, y];
      if (willBeAlive(cell, state)) {
        newState.push(cell);
      }
    }
  }
  return newState;
};

const iterate = (state, iterations) => {
  const states = [];
  if(iterations){
    states.push(state);
    for(let i = 0; i < iterations; i++){
      state = calculateNext(state);
      states.push(state);
    }
  }
  return states;
};

const main = (pattern, iterations) => {
  const state = startPatterns[pattern] || [];
  const states = iterate(state, iterations);
  states.forEach(state => console.log(printCells(state)));
};

const startPatterns = {
    rpentomino: [
      [3, 2],
      [2, 3],
      [3, 3],
      [3, 4],
      [4, 4]
    ],
    glider: [
      [-2, -2],
      [-1, -2],
      [-2, -1],
      [-1, -1],
      [1, 1],
      [2, 1],
      [3, 1],
      [3, 2],
      [2, 3]
    ],
    square: [
      [1, 1],
      [2, 1],
      [1, 2],
      [2, 2]
    ]
  };
  
  const [pattern, iterations] = process.argv.slice(2);
  const runAsScript = require.main === module;
  
  if (runAsScript) {
    if (startPatterns[pattern] && !isNaN(parseInt(iterations))) {
      main(pattern, parseInt(iterations));
    } else {
      console.log("Usage: node js/gameoflife.js rpentomino 50");
    }
  }
  
  exports.seed = seed;
  exports.same = same;
  exports.contains = contains;
  exports.getNeighborsOf = getNeighborsOf;
  exports.getLivingNeighbors = getLivingNeighbors;
  exports.willBeAlive = willBeAlive;
  exports.corners = corners;
  exports.calculateNext = calculateNext;
  exports.printCell = printCell;
  exports.printCells = printCells;
  exports.startPatterns = startPatterns;
  exports.iterate = iterate;
  exports.main = main;