import React, { useState } from 'react'
import { Button } from "react-bootstrap";

const Blog = ({ blog, handleAddLike, handleRemove }) => {
  const [showDetails, setShowDetails] = useState(false)

  // Function to toggle showDetails in state 
  const toggleShowDetails = () => {
    setShowDetails(!showDetails)
  }

  // Styling for hiding a div if showDetails is false
  const showWhenVisible = { display: showDetails ? '' : 'none' }

  // Styling for each blog 
  const blogStyle = {
    padding: 5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
    borderRadius: 10
  }

  // Styling for the View/Hide details toggle button
  const toggleBtnStyle = {
    margin: 5
  }

  // Prompt user to confirm if they want to delete
  const removePrompt = () => {
    if (window.confirm(`Remove blog ${blog.name} by ${blog.author}?`)) {
      handleRemove(blog.id)
    }
  }

  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <Button style={toggleBtnStyle} onClick={toggleShowDetails}>{showDetails ? 'Hide' : 'View'}</Button>
      <div style={showWhenVisible}>
        {blog.url}
        <br />
      Likes: {blog.likes} <Button onClick={() => handleAddLike(blog)}>like</Button>
        <br />
        {blog.user ?
          <p>{blog.user.name}</p>
          // Only try to output name if the blog has a user - to prevent errors
          : ''}

        <Button onClick={removePrompt}>Remove</Button>
      </div>
    </div>
  )
}


export default Blog
