const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
const PORT = 5000;

app.use(bodyParser.json());
app.use(cors());

// Connect MongoDB
mongoose.connect('mongodb://localhost:27017/myMERNapp', { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('strictQuery', false); // avoid possible warning

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});

// Set up OpenAI API configuration and initialize OpenAIApi
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Define Schema and Model for Intoduction
const introSchema = new mongoose.Schema({
    t: String,
    t1: String,
    c1: String,
    t2: String,
    c2: String,
    t3: String,
    c3: String,
});

const Intro = mongoose.model('Intro', introSchema);

// Define Schema and Model for Generated Letters
const letterSchema = new mongoose.Schema({
    language: String,
    motivation: String,
    recipientName: String,
    relationship: String,
    authorName: String,
    additionalInfo: String,
    content: String, 
});

const Letter = mongoose.model('Letter', letterSchema);

// Initial route
app.get('/', (req, res) => {
    res.send('Hello from Express!');
});

// Define API endpoint to fetch intro content
app.get('/api/intro', async (req, res) => {
    try {
        const intro = await Intro.findOne();
        res.json(intro);
    } catch (error) {
        console.error('Error retrieving intro content:', error);
        res.status(500).send('Error retrieving intro content');
    }
});

// Initialize intro content if not already in database
async function initializeIntro() {
    try {
        const existingIntro = await Intro.findOne();
        if (!existingIntro) {
            await Intro.create({  
                t: 'Introduction', 
                t1: 'How does it work?',
                c1: 'This is a webpage that automatically generates letters. You only need to tell AI some key information to get a complete letter. After that, you can change some of the content in the letter according to AI suggestions. Finally, you can store your letters and check them at any time.',
                t2: 'What can I do with this website?',
                c2: 'You can write a quick birthday invitation, a quick and polite exchange with your boss, or even a letter of complaint! AI-generated content may not be perfect, and we recommend that you review it after use.',
                t3: 'Why create such a website?',
                c3: 'I hope this page can make it easier for people to learn or use language. Language is a tool, and I believe it should be more convenient for everyone to use. It can make life better and also allow us to face the troubles of formalism more calmly.'
            });
        }
    } catch (error) {
        console.error('Error initializing intro content:', error);
    }
}
initializeIntro().catch(console.error);

// generate a letter
const generateLetter = async (req, res) => {
    const {language,motivation,authorName,recipientName,relationship,additionalInfo,  } = req.body;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                { role: 'system', content: 'You are a helpful assistant that generates letters.' },
                { role: 'user', content: `Write a letter in ${language} to ${recipientName}, explaining ${motivation}. The relationship between the sender and ${recipientName} is ${relationship}. The letter is written by ${authorName}. Additional info: ${additionalInfo}.` }
            ],
            max_tokens: 600,
        });

        console.log('API Response:', response);

        if (!response || !response.choices || !response.choices.length) {
            throw new Error('Invalid API response format');
        }

        const generatedLetter = response.choices[0].message.content.trim();

        const newLetter = new Letter({
            language,
            motivation,
            recipientName,
            relationship,
            authorName,
            additionalInfo,
            content: generatedLetter,
        });

        await newLetter.save(); 

        res.json({ letter: generatedLetter, letterId: newLetter._id });
    } catch (error) {
        console.error('Error generating letter:', error);
        res.status(500).send('Error generating letter');
    }
};
generateLetter().catch(console.error);
app.post('/api/generateLetter', generateLetter);

// delete multiple letters by their IDs
app.post('/api/deleteLetters', async (req, res) => {
    const letterIds = req.body.ids;

    try {
        await Letter.deleteMany({ _id: { $in: letterIds } }); 
        res.json({ message: 'Letters deleted successfully' });
    } catch (error) {
        console.error('Error deleting letters:', error);
        res.status(500).send('Error deleting letters');
    }
});

// update letter 
app.post('/api/updateLetter', async (req, res) => {
    const { id, content } = req.body;

    try {
        await Letter.findByIdAndUpdate(id, { content });
        res.json({ message: 'Letter updated successfully' });
    } catch (error) {
        console.error('Error updating letter:', error);
        res.status(500).send('Error updating letter');
    }
});

// get all letters from database
app.get('/api/letters', async (req, res) => {
    try {
        const letters = await Letter.find(); 
        res.json(letters);
    } catch (error) {
        console.error('Error fetching letters:', error);
        res.status(500).send('Error fetching letters');
    }
});

// Start server only after successful initialization
db.once('open', async () => {
    console.log('Connected to MongoDB');
    
    try {
        await initializeIntro(); // Ensure initialization before starting server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error during initialization:', error);
        process.exit(1); // Exit process with error code
    }
});

db.on('error', console.error.bind(console, 'MongoDB connection error:'));