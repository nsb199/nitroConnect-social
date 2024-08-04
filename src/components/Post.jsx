import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Post = ({ user, date, image, description, hashtags, id }) => {
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [heartVisible, setHeartVisible] = useState(false);
  const imageRef = useRef(null);

  // Load likes and comments from local storage on component mount
  useEffect(() => {
    const savedLikes = localStorage.getItem(`likes_${id}`);
    const savedComments = localStorage.getItem(`comments_${id}`);
    
    if (savedLikes) {
      setLikes(parseInt(savedLikes, 10));
      setLiked(localStorage.getItem(`liked_${id}`) === 'true');
    }
    
    if (savedComments) {
      setComments(JSON.parse(savedComments));
    }
  }, [id]);

  // Save likes and comments to local storage whenever they change
  useEffect(() => {
    localStorage.setItem(`likes_${id}`, likes);
    localStorage.setItem(`liked_${id}`, liked);
    localStorage.setItem(`comments_${id}`, JSON.stringify(comments));
  }, [likes, liked, comments, id]);

  const handleLike = () => {
    if (!liked) {
      setLikes(likes + 1);
      setLiked(true);
      setHeartVisible(true);
      setTimeout(() => setHeartVisible(false), 1000); // Hide heart animation after 1 second
    } else {
      setLikes(likes - 1);
      setLiked(false);
    }
  };

  const handleDoubleTap = (e) => {
    const rect = imageRef.current.getBoundingClientRect();
    if (
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom
    ) {
      handleLike();
    }
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      setComments([...comments, comment.trim()]);
      setComment('');
      setShowCommentBox(false);
    }
  };

  return (
    <div className="post">
      <div className="post-header">
        <img src={user.avatar} alt={user.name} className="avatar" />
        <div className="user-info">
          <Link to={`/user/${user.username}`} className="username">
            {user.name}
          </Link>
          <div className="date">{new Date(date).toLocaleString()}</div>
        </div>
      </div>
      <img
        src={image}
        alt="post"
        className="post-image"
        onDoubleClick={handleDoubleTap}
        ref={imageRef}
      />
      {heartVisible && <div className="heart-animation">❤️</div>}
      <div className="post-description">{description}</div>
      <div className="hashtags">
        {hashtags.map((tag, index) => (
          <span key={index} className="hashtag">#{tag}</span>
        ))}
      </div>
      <div className="post-footer">
        <button
          onClick={handleLike}
          className="like-button"
        >
          ❤️ {likes}
        </button>
        <button
          onClick={() => setShowCommentBox(!showCommentBox)}
          className="comment-button"
        >
          💬
        </button>
      </div>
      {showCommentBox && (
        <div className="comment-box">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write a comment..."
          />
          <button onClick={handleCommentSubmit}>Post</button>
        </div>
      )}
      <div className="comments">
        {comments.map((cmt, index) => (
          <div key={index} className="comment">
            {cmt}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Post;
