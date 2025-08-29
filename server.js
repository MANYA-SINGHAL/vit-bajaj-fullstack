const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

function processData(data) {
    const result = {
        odd_numbers: [],
        even_numbers: [],
        alphabets: [],
        special_characters: [],
        sum: "0",
        concat_string: ""
    };

    let numSum = 0;
    let alphabetChars = [];

    for (let item of data) {
        const str = String(item);

        if (/^\d+$/.test(str)) {
            const num = parseInt(str);
            numSum += num;

            if (num % 2 === 0) result.even_numbers.push(str);
            else result.odd_numbers.push(str);
        } 
        else if (/^[a-zA-Z]+$/.test(str)) {
            result.alphabets.push(str.toUpperCase());
            alphabetChars.push(...str.toLowerCase());
        } 
        else if (!/^[a-zA-Z0-9]+$/.test(str)) {
            result.special_characters.push(str);
        }
    }

    result.sum = String(numSum);

    if (alphabetChars.length > 0) {
        const reversed = alphabetChars.reverse();
        result.concat_string = reversed
            .map((ch, i) => (i % 2 === 0 ? ch.toUpperCase() : ch.toLowerCase()))
            .join('');
    }

    return result;
}

// API routes
app.post('/bfhl', (req, res) => {
    try {
        const { data } = req.body;

        if (!Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                error: "Invalid input. 'data' must be an array."
            });
        }

        const processedData = processData(data);

        res.json({
            is_success: true,
            user_id: "manya_singhal_10052003",
            email: "manya.singhal2022@vitstudent.ac.in", 
            roll_number: "22BCB0198",
            ...processedData
        });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ is_success: false, error: "Internal server error" });
    }
});

app.get('/bfhl', (req, res) => {
    res.json({ operation_code: 1, message: "GET method successful" });
});

// Status route
app.get('/status', (req, res) => {
    res.json({ 
        message: "VIT Full Stack API is running!", 
        status: "Active",
        endpoints: {
            "POST /bfhl": "Main processing endpoint",
            "GET /bfhl": "Operation code endpoint"
        },
        timestamp: new Date().toISOString()
    });
});

// Serve static files (UI)
app.use(express.static(path.join(__dirname, 'public')));

// Start server
app.listen(PORT, () => {
    console.log(`Local URL: http://localhost:${PORT}`);
    console.log(`API Endpoint: http://localhost:${PORT}/bfhl`);
});
