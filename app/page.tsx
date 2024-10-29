'use client';
// /pages/index.js

import { useState } from 'react';
import axios from 'axios';

export default function Home() {
    const [query, setQuery] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async () => {
        if (!query.trim()) {
            alert("Please enter a search query.");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post('/api/search', { query });
            setResult(response.data);
        } catch (error) {
            console.error("Error performing search:", error);
        }
        setLoading(false);
    };

    const suggestedQueries = [
        "A group of polar bears",
        "A famous landmark in Paris",
        "A hot pizza fresh from the oven",
        "Food",
        "A Place",
        "A Structure in Europe",
        "Animals"
    ];

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
            <h1>Text-to-Image Search</h1>
            <input
                type="text"
                placeholder="Enter your custom query here"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ width: '100%', padding: '1rem', marginBottom: '1rem' }}
            />
            <button onClick={handleSearch} style={{ padding: '1rem 2rem' }}>
                {loading ? 'Searching...' : 'Submit Query'}
            </button>

            <div style={{ marginTop: '1rem' }}>
                <h2>Suggested Queries</h2>
                {suggestedQueries.map((suggestion) => (
                    <button
                        key={suggestion}
                        onClick={() => setQuery(suggestion)}
                        style={{ margin: '0.5rem', padding: '0.5rem 1rem' }}
                    >
                        {suggestion}
                    </button>
                ))}
            </div>

            {result && (
                <div style={{ marginTop: '2rem' }}>
                    <h3>Retrieved Image</h3>
                    <img src={result.image} alt="Retrieved" style={{ width: '100%' }} />
                    <p>Accuracy score: {result.accuracy_score.toFixed(4)}</p>
                </div>
            )}
        </div>
    );
}
