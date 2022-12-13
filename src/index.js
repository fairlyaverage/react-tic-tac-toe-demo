import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
// define Square as a function component instead--"components that only contain a render method and don't have their own state"
// class Square extends React.Component {
//   // constructor disabled because Square no longer keeps track of the game's state
//   // constructor to initialize state
//   // constructor(props) {
//   //   super(props); // all react component classes w/ constructor: must call ```super(props);``` first
//   //   this.state = {  // object where value: null
//   //     value: null,
//   //   };
//   // }

//   render() { // {this.props.value} shows the value passed by prop[erties] called value. Pretty self-explanatory, just passing {value} into <button /> tags
//     return (
//       <button
//         className="square"
//         onClick={() => this.props.onClick()}
//       > {/* syntax equivalent onClick={function() { foobar }}
//             new line for readability
//             note: don't comment inside tag braces
//             """"""
//             was this.setState({value: 'X'}) -> now this.props.onClick(), see onClick prop passed by Board.renderSquare()
//         */}
//         {this.props.value} {/* was this.state.value, but now parent (Board) tracks each square's state which is passed down through props */}
//       </button>
//     );
//   }
// }
function Square(props) { // note: no need for this keyword in function component
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  // "lift state up" to Game -> delete (disable) constructor
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     squares: Array(9).fill(null),
  //     xIsNext: true,
  //   }; // note: "lifting state" into a parent to share info among children
  //   /* init such that
  //     squares = [
  //       null, null, null,
  //       null, null, null,
  //       null, null, null,
  //     ]
  //     */
  // }

  // moved to parent (Game)
  // handleClick(i) {
  //   const squares = this.state.squares.slice(); // use slice() to create copies of squares array
  //   if (calculateWinner(squares) || squares[i]) {
  //     return; // do nothing if this Square has already been clicked (!null) or winner exists
  //   }
  //   squares[i] = this.state.xIsNext ? 'X' : 'O'; // ternary conditional assignment
  //   this.setState({
  //     squares: squares,
  //     xIsNext: !this.state.xIsNext, // reassign boolean
  //   });
  // }

  renderSquare(i) {
    return ( // pass the ith state in squares array 'down' (parent Board->child Square) to this Square's value
      <Square
        value={this.props.squares[i]} // value (1/2) prop passed down from Game to Board to Square
        onClick={() => this.props.onClick(i)} // [this.handleClick() -> this.props.onClick()] (2/2) prop, defines function called on click event
      />
      // note: follow React props naming convention on[Event] and handle[Event], even though they could be nAmEdaNYtHiNG
    );
  }

  render() {
    // winner, status now rendered by parent (Game) so Board only needs to return the board <div />
    // const winner = calculateWinner(this.state.squares); // assign via function using state's squares array upon render() which returns the contents of the first element matching 3-in-a-line or null
    // let status;
    // if (winner) { // not null
    //   status = 'Winner: ' + winner;
    // } else {
    //   status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O'); // moved inside conditional, ternary logic unchanged--no winner, note: keep in mind xIsNext is a state, not just attribute
    // }
    return (
      <div>
        {/* <div className="status">{status}</div> now render()-ed by Game */}
        <div className="board-row">
          {this.renderSquare(0)} {/* pass a number to renderSquare() defined in this class that returns a Square with a value set as the parameter, and the square class passes value in the button tags  so renderSquare(value) returns new Square */}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {                    // state has three properties
      history: [{                     // history (1/3 prop) will be an array of objects with each having a squares array (?)
        squares: Array(9).fill(null), // 'lifted up' from Board constructor
      }],
      stepNumber: 0,                  // stepNumber (2/3 prop) before xIsNext to test for evenness in jumpTo() (unnecessary?)
      xIsNext: true,                  // xIsNext (3/3 prop)
    };
  }

  // moved from Board and modified to also concatenate new history entries
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1); // slice() in this range ensures new moves made after returning to previous state discard 'future' history
    const current = history[history.length - 1]; // note: const for these because immutability is desired and functional
    const squares = current.squares.slice(); // [modified this.state. -> current.] to use slice() to create copies of squares array
    if (calculateWinner(squares) || squares[i]) {
      return; // do nothing if this Square has already been clicked (!null) or winner exists
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'; // ternary conditional assignment
    this.setState({
      history: history.concat([{ // note: concat() preferred because it doesn't mutate original array like push()
        squares: squares,
      }]),
      stepNumber: history.length, // functionally increments stepNumber
      xIsNext: !this.state.xIsNext, // reassign boolean
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0, // true if even
      // setState() shallow merges so history is unchanged as it is not specified
    });
  }

  render() {
    /* "Lifting state" to Game requires render() to maintain additional data */
    const history = this.state.history;
    const current = history[this.state.stepNumber]; // modified from [history.length - 1] -> [this.state.stepNumber] to implement "time travel"

    // map history to moves
    const moves = history.map((step, move) => { // step is current history element value, move is current history element index
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {desc}
          </button>
        </li>
      );
    });

    // from Board.render()
    const winner = calculateWinner(current.squares); // [this.state.squares -> current.squares when lifted]
    let status;
    if (winner) { // not null
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O'); // moved inside conditional, ternary logic unchanged--no winner, note: keep in mind xIsNext is a state, not just attribute
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}             // props that Board was render()ing for Square moved here
            onClick={(i) => this.handleClick(i)}  // see above
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares) {
  /* returns null unless a player has tic-tac-toe'd */
  const lines = [
    [0, 1, 2],    // top horizontal
    [3, 4, 5],    // middle horizontal
    [6, 7, 8],    // bottom horizontal
    [0, 3, 6],    // left vertical
    [1, 4, 7],    // middle vertical
    [2, 5, 8],    // right vertical
    [0, 4, 8],    // diagonal
    [2, 4, 6],    // other diagonal
  ];
  /* for reference
  squares = [
    0, 1, 2,
    3, 4, 5,
    6, 7, 8,
  ]
  */

  for (let i=0; i<lines.length; i++) {
    const [a, b, c] = lines[i];
    if (
      squares[a]                    // element in squares[a] is not null
      && squares[a] === squares[b]  // element in [a] is STRICTLY EQUAL to [b]
      && squares[a] === squares[c]  // element in [a] is STRICTLY EQUAL to [c]
    ) {
      return squares[a];            // element will be 'X' or 'O', and the above means 3-in-a-line
    }
  }
  return null; // no 3-in-a-line, so no winner?
}
