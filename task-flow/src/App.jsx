import { useState, useEffect } from 'react';

// Custom helper function to sync data with Local Storage
const saveToLocalStorage = (data) => {
  localStorage.setItem('todos_data', JSON.stringify(data));
};

export default function App() {
  const [todos, setTodos] = useState([]); //  Starts completely empty
  const [textInput, setTextInput] = useState('');
  const [categoryInput, setCategoryInput] = useState(''); // Unselected by default
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  //  Load from Local Storage using useEffect on first load
  useEffect(() => {
    const savedTodos = localStorage.getItem('todos_data');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  //  Helper to update state and call Local Storage helper across CRUD actions
  const updateTodos = (newTodos) => {
    setTodos(newTodos);
    saveToLocalStorage(newTodos);
  };

  // Add Todo with category validation
  const handleAdd = (e) => {
    e.preventDefault();
    
    if (!textInput.trim()) {
      alert('Please enter a task description.');
      return;
    }

    if (!categoryInput) {
      alert('Please select a category!');
      return;
    }
    
    const newTodo = {
      id: Date.now(),
      text: textInput.trim(),
      completed: false,
      category: categoryInput
    };

    updateTodos([newTodo, ...todos]);
    setTextInput('');
    setCategoryInput('');
  };

  // Toggle Complete
  const handleToggle = (id) => {
    const updated = todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    updateTodos(updated);
  };

  // Delete Todo
  const handleDelete = (id) => {
    const updated = todos.filter(todo => todo.id !== id);
    updateTodos(updated);
  };

  // Save Edit
  const handleSaveEdit = (id) => {
    if (!editText.trim()) return;
    const updated = todos.map(todo => 
      todo.id === id ? { ...todo, text: editText.trim() } : todo
    );
    updateTodos(updated);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans p-6">
      <div className="max-w-md mx-auto space-y-6">
        
        <header className="border-b border-slate-800 pb-4">
          <h1 className="text-lg font-bold">Task Flow</h1>
        </header>

        {/* Input Form */}
        <form onSubmit={handleAdd} className="flex gap-2">
          <input
            type="text"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="New task..."
            className="flex-1 bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-sm focus:outline-none focus:border-slate-500"
          />
          <select
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded px-2 text-xs text-slate-300"
          >
            <option value="" disabled>Select Category</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
          </select>
          <button 
            type="submit" 
            className="bg-slate-100 text-slate-900 text-sm px-3 py-1.5 rounded font-medium hover:bg-slate-200 transition"
          >
            Add
          </button>
        </form>

        {/* Todo List */}
        <ul className="space-y-2">
          {todos.length === 0 ? (
            <li className="text-center py-6 text-slate-500 text-sm">No tasks added yet.</li>
          ) : (
            todos.map((todo) => (
              <li 
                key={todo.id} 
                className="flex items-center justify-between bg-slate-800/60 p-3 rounded border border-slate-800"
              >
                {editingId === todo.id ? (
                  <div className="flex gap-2 flex-1 mr-2">
                    <input
                      type="text"
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 px-2 py-0.5 text-sm rounded text-white"
                      autoFocus
                    />
                    <button 
                      onClick={() => handleSaveEdit(todo.id)} 
                      className="text-xs text-emerald-400 font-medium"
                    >
                      Save
                    </button>
                    <button 
                      onClick={() => setEditingId(null)} 
                      className="text-xs text-slate-400"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => handleToggle(todo.id)}
                        className="accent-slate-400 cursor-pointer"
                      />
                      <span className={`text-sm truncate ${todo.completed ? 'line-through text-slate-500' : ''}`}>
                        {todo.text}
                      </span>
                      <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded">
                        {todo.category}
                      </span>
                    </div>

                    <div className="flex gap-2 text-xs ml-2">
                      <button 
                        onClick={() => { setEditingId(todo.id); setEditText(todo.text); }} 
                        className="text-slate-400 hover:text-white"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(todo.id)} 
                        className="text-rose-400 hover:text-rose-300"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))
          )}
        </ul>

      </div>
    </div>
  );
}