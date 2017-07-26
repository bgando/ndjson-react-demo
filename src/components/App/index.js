import React, { Component } from 'react';
import logo from './logo.svg';
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
    fetch('http://localhost:5000/api/5', {
      method: 'get'
    }).then(data => {
      return ndjsonStream(data.body);
    }).then((todoStream) => {
      const streamReader = todoStream.getReader();
      const read = result => {
        if (result.done) return;
        console.log(result.value.user)
        this.setState({ 
          todos: this.state.todos.concat([result.value.user])
        });

        streamReader.read().then(read); //recurse through the stream
      };
      
      streamReader.read().then(read); 
    }).catch(err => {
      console.error(err)
    });
  }

  render() {
    return (
      <div className="App">
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
