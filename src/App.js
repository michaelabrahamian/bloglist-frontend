import React, { useState, useEffect } from 'react'
import { Form } from "react-bootstrap";
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ message, type} ) => {
  if (message === null) {
    return null
  }

  let notificationClass = ''

  if (type == 'success') {
    notificationClass = 'success'
  } else {
    notificationClass = 'error'
  }

  return (
    <div className={notificationClass}>
      {message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationType, setNotificationType] = useState('')
  const [blogTitle, setBlogTitle] = useState('')
  const [blogAuthor, setBlogAuthor] = useState('')
  const [blogUrl, setBlogUrl] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  // Check for logged in user on load
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInBloglistUser')  
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password
      })

      window.localStorage.setItem(
        'loggedInBloglistUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setNotificationMessage('Wrong credentials')
      setNotificationType('error')
      setTimeout(() => {
        setNotificationMessage(null)
      }, 5000)

    }
  }

  // Logout by clearing the user cache item and user state
  const handleLogout = async (event) => {
    window.localStorage.removeItem('loggedInBloglistUser')
    setUser(null)

    setNotificationMessage('Logged out.')
    setNotificationType('success')
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
  }

  const loginForm = () => (
    <div>
      <h2>Login to application</h2>
      <Form onSubmit={handleLogin}>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </Form.Group>

        <button type="submit">Login</button>
      </Form>
    </div>
  )

  const blogList = () => (
    <div>
      <h2>List of blogs</h2>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )

  const handleCreateBlog = (event) => {
    event.preventDefault()

    const blogObject = {
      title: blogTitle,
      author: blogAuthor,
      url: blogUrl,
    }

    blogService.create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        resetNewBlogForm()
      })
      .catch(error => {
        setNotificationMessage(`Error when creating blog: ${error}.`)
        setNotificationType('error')
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      })

    setNotificationMessage(`A new blog ${blogTitle} by ${blogAuthor} has been added.`)
    setNotificationType('success')
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)

  }

  const resetNewBlogForm = () => {
    setBlogAuthor('')
    setBlogTitle('')
    setBlogUrl('')
  }



  const createBlogForm = () => (
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

        <button type="submit">Create</button>
      </Form>
    </div>
  )

  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={notificationMessage} type={notificationType} />
      {user === null
        ? loginForm() :
        <div>
          <p>{user.name} logged in. <button onClick={handleLogout}>Logout</button></p>
          {createBlogForm()}
          {blogList()}
        </div>
        
      }
    </div>
  )
}

export default App