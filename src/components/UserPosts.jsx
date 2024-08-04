import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const UserPosts = () => {
  const { username } = useParams();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const accessKey = 'KrUhD5M3eO2kEwZswYnHlbPPERwImtqKI0DVBr00-YU'; // Directly included API key

  useEffect(() => {
    // Fetch user details
    fetch(`https://api.unsplash.com/users/${username}?client_id=${accessKey}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`User not found: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setUser(data);
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setError(error.message);
      });

    // Fetch user's photos with pagination
    const fetchPhotos = (pageNum) => {
      fetch(`https://api.unsplash.com/users/${username}/photos?page=${pageNum}&client_id=${accessKey}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Photos not found: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          if (data.length === 0) {
            setHasMore(false);
          } else {
            setUserPosts(prevPosts => [...prevPosts, ...data]);
          }
        })
        .catch(error => {
          console.error('Fetch error:', error);
          setError(error.message);
        });
    };

    fetchPhotos(page);

  }, [username, accessKey, page]);

  const loadMorePhotos = () => {
    if (hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };

  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="user-posts">
      {user && (
        <div className="user-info">
          <img src={user.profile_image.large} alt={user.name} className="avatar-large" />
          <div className="user-details">
            <div className="username">{user.name}</div>
            <div className="user-portfolio">
              {user.links && user.links.portfolio ? (
                <a href={user.links.portfolio} target="_blank" rel="noopener noreferrer">
                  Portfolio
                </a>
              ) : 'No portfolio available'}
            </div>
            <div className="user-location">{user.location || 'Location not provided'}</div>
            <div className="user-bio">{user.bio || 'No bio available'}</div>
            <div className="user-total-photos">Total photos: {user.total_photos || 'N/A'}</div>
            <div className="user-total-likes">Total likes: {user.total_likes || 'N/A'}</div>
            <div className="user-followers">Followers: {user.followers_count || 'N/A'}</div>
            <div className="user-following">Following: {user.following_count || 'N/A'}</div>
          </div>
        </div>
      )}
      <h2 className="posts-heading">All Posts by {user ? user.name : username}</h2>
      <div className="user-images">
        {userPosts.map((post, index) => (
          <a key={index} href={post.urls.regular} target="_blank" rel="noopener noreferrer">
            <img
              src={post.urls.small}
              alt={post.alt_description || 'User photo'}
              className="user-image"
            />
          </a>
        ))}
      </div>
      {hasMore && (
        <button className="load-more" onClick={loadMorePhotos}>
          Load More
        </button>
      )}
    </div>
  );
};

export default UserPosts;
