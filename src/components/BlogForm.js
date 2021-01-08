import React, { useState } from 'react';
import { Form, Button } from "react-bootstrap";

const BlogForm = ({ createBlog }) => {
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  const handleCreateBlog = (event) => {
    event.preventDefault()

    createBlog({
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
    })

    resetNewBlogForm()
  }

  const resetNewBlogForm = () => {
    setBlogAuthor('')
    setBlogTitle('')
    setBlogUrl('')
  }

  return (
    <div>
      <h2>Create new blog</h2>
      <Form onSubmit={handleCreateBlog}>
        <Form.Group controlId="formBlogTitle">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            value={blogTitle}
            name="BlogTitle"
            onChange={({ target }) => setBlogTitle(target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBlogAuthor">
          <Form.Label>Author</Form.Label>
          <Form.Control
            type="text"
            value={blogAuthor}
            name="BlogAuthor"
            onChange={({ target }) => setBlogAuthor(target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formBlogUrl">
          <Form.Label>URL</Form.Label>
          <Form.Control
            type="text"
            value={blogUrl}
            name="BlogUrl"
            onChange={({ target }) => setBlogUrl(target.value)}
          />
        </Form.Group>

        <Button type="submit">Create</Button>
      </Form>
    </div>
  )
}

export default BlogForm