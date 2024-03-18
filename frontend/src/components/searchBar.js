import axios from 'axios';
import { useState } from 'react';

export const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`http://backend-url/search/?query=${query}`);
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <ul>
        {results.map((result, index) => (
          <li key={index}>{result.name} - {result.description}</li>
        ))}
      </ul>
    </div>
  );
};
