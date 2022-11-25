import './App.css';

import {Howl, Howler, howlerList} from 'howler';

import PlayTTS from './component/PlayTTS';

function App() {
  return (
    <div className="App">
      <header className="App-header">
<PlayTTS />

      </header>
    </div>
  );
}

export default App;
