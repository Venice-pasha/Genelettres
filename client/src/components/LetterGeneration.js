import React, { useState } from 'react';
import axios from 'axios';

function LetterGeneration({ navigateToHome }) {
  const [language, setLanguage] = useState('');
  const [motivation, setMotivation] = useState('');
  const [authorName, setAuthorIdentity] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [generatedLetter, setGeneratedLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [letterIds, setLetterIds] = useState([]);
  const [letterGenerated, setLetterGenerated] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const requestData = {
      language,
      motivation,
      authorName,
      recipientName,
      relationship,
      additionalInfo, 
    };
    // send to server
    try {
      const response = await axios.post('/api/generateLetter', requestData);
      setGeneratedLetter(response.data.letter);
      setLetterIds([...letterIds, response.data.letterId]);
      setLetterGenerated(true);
    } catch (error) {
      console.error('Error generating letter:', error);
    } finally {
      setLoading(false);
    }
  };

  // copy letter
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter)
      .then(() => {
        alert('Content copied to clipboard!');
      })
      .catch((error) => {
        console.error('Failed to copy content: ', error);
      });
  };
  
  // Save the last letter, delete the others, then return
  const handleSaveAndReturn = async () => {
    if (letterIds.length === 0) return;
    const lastLetterId = letterIds[letterIds.length - 1];
    const idsToDelete = letterIds.slice(0, -1); 
    const updatedContent = generatedLetter; 
    try {
        if (idsToDelete.length > 0) {
            await axios.post('/api/deleteLetters', { ids: idsToDelete }); 
        }
        await axios.post('/api/updateLetter', {
            id: lastLetterId,
            content: updatedContent,
        }); 
        navigateToHome();
    } catch (error) {
        console.error('Error saving letters:', error);
    }
  };

  // delete all and return
  const handleDeleteAndReturn = async () => {
    try {
        await axios.post('/api/deleteLetters', { ids: letterIds }); 
        navigateToHome();
    } catch (error) {
        console.error('Error deleting letters:', error);
    }
  };

  // make sure the text can be modified
  const handleTextareaChange = (e) => {
    setGeneratedLetter(e.target.value);
  };

  return (
    <div>
      <h1>Generate a Letter</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Language:</label>
          <input
            type="text"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          />
        </div>
        <div>
          <label>Motivation:</label>
          <input
            type="text"
            value={motivation}
            onChange={(e) => setMotivation(e.target.value)}
          />
        </div>
        <div>
          <label>Author Name:</label> 
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorIdentity(e.target.value)}
          />
        </div>
        <div>
          <label>Recipient Name:</label>
          <input
            type="text"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
          />
        </div>
        <div>
          <label>Relationship:</label>
          <input
            type="text"
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
          />
        </div>
        <div>
          <label>Additional Information:</label>  
          <input
            type="text"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
          />
        </div>
        <button type="submit" disabled={loading}>
        {generatedLetter ? 'Regenerate Letter' : (loading ? 'Generating...' : 'Generate Letter')}
        </button>
      </form>

      {/* if letter generated then show these things : */} 
      {generatedLetter && (
        <div>
          <h2>Generated Letter:</h2>
          <textarea 
            value={generatedLetter} 
            rows={10} 
            style={{ width: '100%', whiteSpace: 'pre-wrap' }} 
            onChange={handleTextareaChange}
          />
          <button onClick={handleCopyToClipboard}>Copy to Clipboard</button>
          <button onClick={handleSaveAndReturn}>Save and Return</button>
          <button onClick={handleDeleteAndReturn}>Delete and Return</button>
        </div>
      )}

      {!letterGenerated && (  
        <button onClick={navigateToHome}>Back to Home</button>
      )}
    </div>
  );
}

export default LetterGeneration;
