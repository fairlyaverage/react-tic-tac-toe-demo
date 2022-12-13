import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

class Square extends React.Component {
  render() { // {this.props.value} shows the value passed by prop[erties] called value. Pretty self-explanatory, just passing {value} into <button /> tags
    return (
      <button className="square" onClick={
        function() { console.log('click');
      }}>
        {this.props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return <Square value={i} />; // pass prop called value to the Square
    // return <Square />; // original
  }

  render() {
    const status = 'Next player: X';

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
