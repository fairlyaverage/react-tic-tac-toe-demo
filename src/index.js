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
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    }; // note: "lifting state" into a parent to share info among children
    /* init such that
      squares = [
        null, null, null,
        null, null, null,
        null, null, null,
      ]
      */
  }

  handleClick(i) {
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O'; // ternary conditional assignment
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext, // reassign boolean
    });
  }

  renderSquare(i) {
    return ( // pass the ith state in squares array 'down' (parent Board->child Square) to this Square's value
      <Square
        value={this.state.squares[i]} // value (1/2) prop passed down from Board to Square
        onClick={() => this.handleClick(i)} // onClick (2/2) prop, defines function called on click event
      />
      // note: follow React props naming convention on[Event] and handle[Event], even though they could be nAmEdaNYtHiNG
    );
  }

  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O'); // note: keep in mind xIsNext is a state, not just attribute, also is let better here?

    return (
      <div>
        <div className="status">{status}</div>
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
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
