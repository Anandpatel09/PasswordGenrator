import { useState, useCallback, useEffect, useRef } from 'react';

function App() {
  const [length, setLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false);
  const [password, setPassword] = useState("");
  const [label, setLabel] = useState("");
  const [savedPasswords, setSavedPasswords] = useState([]);
  const [visibleIndexes, setVisibleIndexes] = useState([]);

  const passwordRef = useRef(null);

  // Generate password
  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    if (numberAllowed) str += "0123456789";
    if (charAllowed) str += "!@#$%^&*-_+=[]{}~`";

    for (let i = 0; i < length; i++) {
      let char = Math.floor(Math.random() * str.length);
      pass += str.charAt(char);
    }

    setPassword(pass);
  }, [length, numberAllowed, charAllowed]);

  // Copy to clipboard
  const copyPasswordToClipboard = useCallback(() => {
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, 99);
    window.navigator.clipboard.writeText(password);
  }, [password]);

  // Save password to localStorage
  const savePassword = () => {
    if (!label) return alert("Please enter a label for the password!");

    const newEntry = { label, password };
    const updatedPasswords = [...savedPasswords, newEntry];
    localStorage.setItem("savedPasswords", JSON.stringify(updatedPasswords));
    setSavedPasswords(updatedPasswords);
    setLabel("");
    alert("Password saved!");
  };

  // Delete password from localStorage
  const deletePassword = (index) => {
    const updatedPasswords = savedPasswords.filter((_, i) => i !== index);
    localStorage.setItem("savedPasswords", JSON.stringify(updatedPasswords));
    setSavedPasswords(updatedPasswords);
    setVisibleIndexes(visibleIndexes.filter(i => i !== index)); // remove visibility state too
  };

  // Load saved passwords on component mount
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("savedPasswords")) || [];
    setSavedPasswords(stored);
  }, []);

  // Regenerate password when settings change
  useEffect(() => {
    passwordGenerator();
  }, [length, numberAllowed, charAllowed, passwordGenerator]);

  // Toggle password visibility
  const toggleVisibility = (index) => {
    setVisibleIndexes((prev) =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto shadow-md rounded-lg px-4 py-3 my-8 bg-gray-800">
      <h1 className='text-white text-center my-3'>Password Generator</h1>

      {/* Password Display */}
      <div className="flex shadow rounded-lg overflow-hidden mb-4">
        <input
          type="text"
          value={password}
          className="outline-none w-full py-1 px-3 bg-white text-gray-950"
          placeholder="Password"
          readOnly
          ref={passwordRef}
        />
        <button
          onClick={copyPasswordToClipboard}
          className='outline-none bg-blue-700 text-white px-3 py-0.5 shrink-0 cursor-pointer'
        >
          Copy
        </button>
      </div>

      {/* Options */}
      <div className='flex text-sm gap-x-2 mb-4'>
        <div className='flex items-center gap-x-1'>
          <input 
            type="range"
            min={6}
            max={100}
            value={length}
            className='cursor-pointer'
            onChange={(e) => setLength(Number(e.target.value))}
          />
          <label className='text-white'>Length: {length}</label>
        </div>

        <div className="flex items-center gap-x-1">
          <input
            type="checkbox"
            checked={numberAllowed}
            id="numberInput"
            onChange={() => setNumberAllowed(prev => !prev)}
          />
          <label htmlFor="numberInput" className='text-white'>Numbers</label>
        </div>

        <div className="flex items-center gap-x-1">
          <input
            type="checkbox"
            checked={charAllowed}
            id="characterInput"
            onChange={() => setCharAllowed(prev => !prev)}
          />
          <label htmlFor="characterInput" className='text-white'>Characters</label>
        </div>
      </div>

      {/* Label input and save button */}
      <div className="flex gap-x-2 mb-4">
        <input
          type="text"
          placeholder="Whose password is this ?"
          className="w-full py-1 px-3 rounded outline-none text-white bg-black"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
        />
        <button
          onClick={savePassword}
          className='bg-green-600 text-white px-3 py-1 rounded cursor-pointer'
        >
          Save Password
        </button>
      </div>

      {/* Saved passwords */}
      {savedPasswords.length > 0 && (
        <div className="bg-gray-700 p-3 rounded">
          <h2 className="text-white font-bold mb-2  ">Saved Passwords    </h2>
          <ul className="text-white">
            {savedPasswords.map((entry, index) => (
              <li key={index} className="mb-2 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-green-600 ">{entry.label} &nbsp; : &nbsp;&nbsp; </span >{" "}
                  {visibleIndexes.includes(index) ? entry.password : "••••••••"}
                </div>
                <div className="flex gap-x-2">
                  <button
                    onClick={() => toggleVisibility(index)}
                    className="bg-blue-600 px-2 py-0.5 rounded text-sm cursor-pointer"
                  >
                    {visibleIndexes.includes(index) ? "Hide" : "Show"}
                  </button>
                  <button
                    onClick={() => deletePassword(index)}
                    className="bg-red-600 px-2 py-0.5 rounded text-sm cursor-pointer"
                  >
                    ❌
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
