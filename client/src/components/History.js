import React, { useEffect, useState } from 'react';
import axios from 'axios';

function History({ navigateToHome }) {
  const [letters, setLetters] = useState([]);
  const [selectedLetter, setSelectedLetter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editedContent, setEditedContent] = useState('');
  const [selectMode, setSelectMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  // Fetch all letters from the server
  useEffect(() => {
    const fetchLetters = async () => {
      try {
        const response = await axios.get('/api/letters'); 
        setLetters(response.data);
      } catch (error) {
        console.error('Error fetching letters:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLetters();
  }, []);

  // choose letter to watch and modify
  const handleLetterClick = (letter) => {
    if (selectMode) return;
    setSelectedLetter(letter);
    setEditedContent(letter.content);
  };

  // save and update to server
  const handleSaveAndReturn = async () => {
    if (!selectedLetter) return; 

    try {
      await axios.post('/api/updateLetter', {
        id: selectedLetter._id,
        content: editedContent, 
      });
      navigateToHome(); 
    } catch (error) {
      console.error('Error saving letter:', error);
    }
  };

  // select mode
  const handleSelectModeToggle = () => {
    setSelectMode(!selectMode);
    setSelectedIds([]); 
  };

  // save ids of letters
  const handleCheckboxChange = (id) => {
    setSelectedIds((prevIds) =>
      prevIds.includes(id) ? prevIds.filter((prevId) => prevId !== id) : [...prevIds, id]
    );
  };

  // delete letters
  const handleDeleteSelected = async () => {
    try {
      await axios.post('/api/deleteLetters', { ids: selectedIds });
      setLetters(letters.filter(letter => !selectedIds.includes(letter._id))); 
      setSelectedLetter(null);
      setEditedContent('');
      setSelectMode(false); 
      setSelectedIds([]); 
    } catch (error) {
      console.error('Error deleting letters:', error);
    }
  };

  return (
    <div>
      <h1>Saved Letters</h1>
      {loading ? (
        <p>Loading letters...</p>
      ) : (
        <div>
          <button onClick={handleSelectModeToggle}>
            {selectMode ? 'Cancel' : 'Select'}
          </button>
          {/*if select mode*/}
          {selectMode && (
            <button onClick={handleDeleteSelected}>Delete Selected</button>
          )}
          <ul>
            {letters.map((letter) => (
              <li key={letter._id}>
                {selectMode && (
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(letter._id)}
                    onChange={() => handleCheckboxChange(letter._id)}
                  />
                )}
                {letter.motivation} by {letter.authorName}
                <button onClick={() => handleLetterClick(letter)}>View</button>
              </li>
            ))}
          </ul>
          {/*if select letter*/}
          {selectedLetter && (
            <div>
              <h2>Letter Details</h2>
              <p><strong>To:</strong> {selectedLetter.recipientName}</p>
              <p><strong>From:</strong> {selectedLetter.authorName}</p>
              <p><strong>Content:</strong></p>
              <textarea 
                value={editedContent} 
                onChange={(e) => setEditedContent(e.target.value)} 
                rows={10} 
                style={{ width: '100%', whiteSpace: 'pre-wrap' }} 
              />
              <button onClick={handleSaveAndReturn}>Save and Return</button>
            </div>
          )}
        </div>
      )}
      <button onClick={navigateToHome}>Back to Home</button>
    </div>
  );
}

export default History;

