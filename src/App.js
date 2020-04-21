import React, { useState } from 'react';
import './App.css';

function App() {
  const [thought, setThought] = useState({ date: new Date().toISOString().split('T')[0], text: '' });
  const [memories, setMemories] = useState([])

  const saveThought = async () => {
    const resp = await fetch('/api/memories', { 
      method: 'POST',
      body: JSON.stringify(thought) 
    })
    
    const { error, newMem } = await resp.json()

    error ? console.error(error) : setMemories([ ...memories, newMem ])
  }

  const getMemories = async () => {
    const resp = await fetch('/api/memories')
    const data = await resp.json()
    setMemories(data)
  }

  const deleteMemory = async memory => {
    const resp = await fetch('/api/delete-memory', {
      method: 'DELETE',
      body: JSON.stringify(memory)
    })

    const { error, mem } = await resp.json()
    const surviving = memories.filter(m => mem.ref['@ref'].id !== m.ref['@ref'].id)
    error ? console.error(error) : setMemories(surviving)
    
  }

  const handleThoughtChange = e => setThought({ ...thought, [e.target.name]: e.target.value})

  const memCard = (m, i) => <div className="mem-card" key={i}>{m.data.text}<span onClick={() => deleteMemory(m)}>x</span></div>

  const renderMemories = memories ? memories.map(memCard) : null

  return (
    <div className="App">
        <header><h1>Memories</h1></header>
        <main>
          <div id="input">
            <input type="date" name="date" value={thought.date} onChange={handleThoughtChange}/>
            <input type="text" name="text" placeholder="Your thought" value={thought.text} onChange={handleThoughtChange}/>
            <button onClick={saveThought} disabled={!thought.text}>Commit to memory</button>
            <button onClick={getMemories}>Show all memories</button>
          </div>
          <div id="memories">{ renderMemories }</div>
        </main>
    </div>
  );
}

export default App;
