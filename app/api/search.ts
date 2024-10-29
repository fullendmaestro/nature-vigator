// /pages/api/search.js

import { exec } from 'child_process';
import { writeFileSync, unlinkSync } from 'fs';
import path from 'path';

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { query } = req.body;

        // Temporary file to store the query text for Python processing
        const queryFilePath = path.join(process.cwd(), 'temp_query.txt');
        writeFileSync(queryFilePath, query);

        exec(`python3 scripts/search.py ${queryFilePath}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing Python script: ${error}`);
                res.status(500).json({ error: 'Server error occurred' });
                return;
            }

            // Parse and return results from Python
            const result = JSON.parse(stdout);
            unlinkSync(queryFilePath);  // Clean up the temp file
            res.status(200).json(result);
        });
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
