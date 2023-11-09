const express = require('express');
const noblox = require('noblox.js');
const { parse } = require('path');
const app = express();

require('dotenv').config();

const cookie = process.env.COOKIE;
const groupid = process.env.GROUPID;

app.use(express.static('public'));

async function startApp() {
    await noblox.setCookie(cookie);
    let currentUser = await noblox.getCurrentUser(); // Get information about the current user
    console.log(`Logged in as ${currentUser.UserName} (${currentUser.UserID})`); // Log the current user's username and ID to the console
}

startApp();

// Middleware to check API key
function authenticateApiKey(req, res, next) {
    const providedApiKey = req.headers.apikey;
    if (providedApiKey === process.env.APIKEY) {
        next(); // API key is valid, proceed to the next middleware/route
    } else {
        res.status(401).json({ error: 'Unauthorized: Invalid API key' });
    }
}

app.use(authenticateApiKey); // Apply the middleware to all routes below

app.get('/getRank', async (req, res) => {
    const userId = req.param('userid');
    
    try {
        const userRank = await noblox.getRankInGroup(groupid, parseInt(userId));
        res.json({ rank: userRank });
    } catch (error) {
        res.status(500).json({ error: 'Error getting user rank' });
    }
});

app.get('/promote', async (req, res) => {
    const userId = req.param('userid');

    try {
        await noblox.promote(groupid, parseInt(userId));
        res.json("User has been promoted.");
    } catch (error) {
        res.status(500).json({ error: 'Error promoting user' });
    }
});

app.get('/demote', async (req, res) => {
    const userId = req.param('userid');

    try {
        await noblox.demote(groupid, parseInt(userId));
        res.json("User has been demoted.");
    } catch (error) {
        res.status(500).json({ error: 'Error demoting user' });
    }
});

app.get('/setRank', async (req, res) => {
    const userId = req.param('userid');
    const newRank = req.param('rank');

    try {
        await noblox.setRank(groupid, parseInt(userId), parseInt(newRank));
        res.json("Rank has been set.");
    } catch (error) {
        if (error.message.includes("400 You cannot change the user's role to the same role.")) {
            res.status(400).json({ error: "Cannot change user's role to the same role." });
        } else {
            res.status(500).json({ error: 'Error setting user rank' });
        }
    }
});

const listener = app.listen(process.env.PORT, () => {
    console.log('Your app is listening on port ' + listener.address().port);
});