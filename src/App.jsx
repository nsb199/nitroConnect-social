import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Post from './components/Post';
import UserPosts from './components/UserPosts';
import { ThemeProvider } from './context/ThemeContext';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [error, setError] = useState(null);
  const accessKey = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;

  const fetchPosts = (page) => {
    fetch(`https://api.unsplash.com/search/photos?query=animals&client_id=${accessKey}&per_page=10&page=${page}`)
      .then(response => response.json())
      .then(data => {
        setPosts(prevPosts => [...prevPosts, ...data.results]);
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setError(error.message);
      });
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page, accessKey]);

  const handleLoadMore = () => {
    setPage(prevPage => prevPage + 1);
  };

  return (
    <ThemeProvider>
      <Router>
        <Header />
        <main className="main-content">
          {error && <div className="error">Error: {error}</div>}
          <Routes>
            <Route 
              path="/" 
              element={
                <>
                  {posts.map((post, index) => (
                    <Post 
                      key={post.id}  // Ensure each post has a unique key
                      user={{
                        username: post.user.username,
                        name: post.user.name,
                        avatar: post.user.profile_image.small
                      }}
                      date={post.created_at}
                      image={post.urls.regular}
                      description={`Photo by ${post.user.name}`}
                      hashtags={post.tags.map(tag => tag.title)}
                      id={post.id}  // Unique ID for each post
                    />
                  ))}
                  <button className="load-more" onClick={handleLoadMore}>
                    Load More
                  </button>
                </>
              } 
            />
            <Route 
              path="/user/:username" 
              element={<UserPosts accessKey={accessKey} />} 
            />
          </Routes>
        </main>
      </Router>
    </ThemeProvider>
  );
};

export default App;
