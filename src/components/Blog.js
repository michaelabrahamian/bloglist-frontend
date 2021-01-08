import React, { useState } from 'react'
import { Button } from "react-bootstrap";

const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleShowDetails = () => {
    setShowDetails(!showDetails)
  }

  const showWhenVisible = { display: showDetails ? '' : 'none' }

  const blogStyle = {
    padding: 5,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleBtnStyle = {
    margin: 5
  }

  return (
  <div style={blogStyle}>
    {blog.title} {blog.author}
    <Button style={toggleBtnStyle} onClick={toggleShowDetails}>{showDetails ? 'Hide' : 'View'}</Button>
    <div style={showWhenVisible}>
      {blog.url}
      <br />
      Likes: {blog.likes} <Button>like</Button>
    </div>
  </div>
  )
}


export default Blog
