const http = require('http');

// Test cases
const testCases = [
    {
        name: "Test Case 1 - Mixed Data",
        data: ["a","1","334","4","R", "$"]
    },
    {
        name: "Test Case 2 - Complex Mixed",
        data: ["2","a", "y", "4", "&", "-", "*", "5","92","b"]
    },
    {
        name: "Test Case 3 - Only Alphabets",
        data: ["A","ABcD","DOE"]
    },
    {
        name: "Test Case 4 - Empty Array",
        data: []
    },
    {
        name: "Test Case 5 - Numbers Only",
        data: ["1", "2", "3", "4", "5"]
    }
];

function runTest(testCase, port = 3000) {
    return new Promise((resolve, reject) => {
        const postData = JSON.stringify({ data: testCase.data });
        
        const options = {
            hostname: 'localhost',
            port: port,
            path: '/bfhl',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    resolve({
                        testCase: testCase.name,
                        status: res.statusCode,
                        response: response
                    });
                } catch (e) {
                    reject(e);
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(postData);
        req.end();
    });
}

async function runAllTests() {
    console.log('Starting API Tests...\n');
    
    for (let testCase of testCases) {
        try {
            const result = await runTest(testCase);
            console.log(` ${result.testCase}`);
            console.log(`Status: ${result.status}`);
            console.log(`Response:`, JSON.stringify(result.response, null, 2));
            console.log('-'.repeat(50));
        } catch (error) {
            console.log(`${testCase.name} - Error:`, error.message);
            console.log('-'.repeat(50));
        }
    }
}

// Check if server is running first
const checkServer = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/',
    method: 'GET'
}, (res) => {
    console.log('Server is running, starting tests...\n');
    runAllTests();
});

checkServer.on('error', (e) => {
    console.log('Server not running. Please start server with: npm run dev');
    console.log('Error:', e.message);
});

checkServer.end();