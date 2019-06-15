import React, { useState, useEffect } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

const useDataApi = (initialUrl, initialData) => {
  const [data, setData] = useState(initialData);
  const [url, setUrl] = useState(initialUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setError(false);
      setLoading(true);
      try {
        const result = await axios(url);
        setData(result.data);
      } catch (error) {
        setError(true);
      }
      setLoading(false);
    };
    fetchData();
  }, [url]);

  return [{ data, loading, error }, setUrl];
};

const App = () => {
  const [query, setQuery] = useState('redux');
  const [{ data, loading, error }, doFetch] = useDataApi(
    'http://hn.algolia.com/api/v1/search?query=redux',
    { hits: [] }
  );

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>useEffect data fetch</h1>
      </header>
      <main>
        <h2>Hacker News Search</h2>
        <form
          onSubmit={event => {
            doFetch(`http://hn.algolia.com/api/v1/search?query=${query}`);
            event.preventDefault();
          }}
        >
          <input
            type="text"
            value={query}
            onChange={event => setQuery(event.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        {error && <p>Error</p>}
        {loading ? (
          <p>Loading</p>
        ) : (
          <ul>
            {data.hits.map(item => (
              <li key={item.objectID}>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
};

export default App;
