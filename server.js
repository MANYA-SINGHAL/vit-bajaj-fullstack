const express = require('express');
const cors = require('cors');

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
        
        if (!isNaN(str) && str.trim() !== '' && /^\d+$/.test(str)) {
            const num = parseInt(str);
            numSum += num;
            
            if (num % 2 === 0) {
                result.even_numbers.push(str);
            } else {
                result.odd_numbers.push(str);
            }
        }
    
        else if (/^[a-zA-Z]+$/.test(str)) {
            result.alphabets.push(str.toUpperCase());

            for (let char of str) {
                alphabetChars.push(char.toLowerCase());
            }
        }
    
        else if (!/^[a-zA-Z0-9]+$/.test(str)) {
            result.special_characters.push(str);
        }
    }

    result.sum = String(numSum);
    
    if (alphabetChars.length > 0) {
        const reversedChars = alphabetChars.reverse();
        let concatString = "";
        
        for (let i = 0; i < reversedChars.length; i++) {
            if (i % 2 === 0) {
                concatString += reversedChars[i].toUpperCase();
            } else {
                concatString += reversedChars[i].toLowerCase();
            }
        }
        result.concat_string = concatString;
    }

    return result;
}

app.post('/bfhl', (req, res) => {
    try {
        const { data } = req.body;

        if (!data || !Array.isArray(data)) {
            return res.status(400).json({
                is_success: false,
                error: "Invalid input. 'data' must be an array."
            });
        }

        const processedData = processData(data);

        const response = {
            is_success: true,
            user_id: "manya_singhal_10052003",
            email: "manya.singhal2022@vitstudent.ac.in", 
            roll_number: "22BCB0198",
            odd_numbers: processedData.odd_numbers,
            even_numbers: processedData.even_numbers,
            alphabets: processedData.alphabets,
            special_characters: processedData.special_characters,
            sum: processedData.sum,
            concat_string: processedData.concat_string
        };

        console.log('\nAPI Response for POST /bfhl:');
        console.log('Input data:', JSON.stringify(data));
        console.log('Response:', JSON.stringify(response, null, 2));
        console.log('─'.repeat(50));

        res.status(200).json(response);

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({
            is_success: false,
            error: "Internal server error"
        });
    }
});

app.get('/bfhl', (req, res) => {
    res.status(200).json({
        operation_code: 1,
        message: "GET method successful"
    });
});

app.get('/', (req, res) => {
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

app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ 
        is_success: false, 
        error: "Internal server error"
    });
});

app.listen(PORT, () => {
    console.log(`Local URL: http://localhost:${PORT}`);
    console.log(`API Endpoint: http://localhost:${PORT}/bfhl`);
    
});

module.exports = app;