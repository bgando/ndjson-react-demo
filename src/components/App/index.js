import React, { Component } from 'react';
import './style.css';
import ndjsonStream from 'can-ndjson-stream';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      todos: [1,2,3]
    };
  }

  componentDidMount(){
    fetch('http://localhost:5000/api/10', {
      method: 'get'
    }).then(data => {
      return ndjsonStream(data.body);
    }).then((todoStream) => {
      const streamReader = todoStream.getReader();
      const read = result => {
        if (result.done) return;

        this.setState({ 
          todos: this.state.todos.concat([result.value.user])
        });

        streamReader.read().then(read);
      };
      
      streamReader.read().then(read); 
    }).catch(err => {
      console.error(err)
    });
  }

  render() {
    return (
      <div className="App">
      <h1> React + NDJSON Stream Demo</h1>
        <ul>
          {this.state.todos.map(todo =>
            <li>{todo}</li>
          )}
        </ul>
      </div>
    );
  }
}

export default App;
