import React, { useState, useEffect } from 'react'
import { Button, Container } from "react-bootstrap";
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  let notificationClass = ''

  if (type === 'success') {
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

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
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

  // TODO: Move this to LoginForm.js
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

  const handleAddLike = async (blogObject) => {
    const response = await blogService.addLike(blogObject)
    // Update the likes count of the blog item in state array
    // Make a copy of the blogs state array
    let blogsCopy = [...blogs]
    // Get the index of the blog to update likes count
    let blogIndexToUpdate = blogs.findIndex(blog => blog.id === blogObject.id)
    // Set that item to the returned blog object
    blogsCopy[blogIndexToUpdate] = response
    // Set the modified copy to state
    setBlogs(blogsCopy)
  }

  // Function to display the list of blogs
  const blogList = () => (
    <div>
      <h2>List of blogs</h2>
      {blogs
        .sort((a, b) => { // sort by the number of likes
          if (a.likes < b.likes) return 1
          if (a.likes > b.likes) return -1
          return 0
        })
        .map(blog =>
          <Blog key={blog.id} blog={blog} handleAddLike={handleAddLike} handleRemove={handleRemoveBlog} />
        )}
    </div>
  )

  const handleCreateBlog = (blogObject) => {

    blogService.create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
      })
      .catch(error => {
        setNotificationMessage(`Error when creating blog: ${error}.`)
        setNotificationType('error')
        setTimeout(() => {
          setNotificationMessage(null)
        }, 5000)
      })

    setNotificationMessage(`A new blog ${blogObject.title} by ${blogObject.author} has been added.`)
    setNotificationType('success')
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)

  }

  const handleRemoveBlog = async (blogId) => {

    const response = await blogService.remove(blogId)

    console.log('remove response', response)

    // remove the blog from state blogs array too
    setBlogs(blogs.filter(blog => blog.id !== blogId))
  }

  const loginForm = () => {
    return (
      <Togglable buttonLabel="Log in">
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </Togglable>
    )
  }

  const createBlogForm = () => (
    <Togglable buttonLabel="Create new blog listing">
      <BlogForm createBlog={handleCreateBlog} />
    </Togglable>
  )

  return (
    <Container>
      <h1>Blogs</h1>
      <Notification message={notificationMessage} type={notificationType} />
      {user === null
        ? loginForm() :
        <div>
          <p>{user.name} logged in. <Button onClick={handleLogout}>Logout</Button></p>
          {createBlogForm()}
          {blogList()}
        </div>

      }
    </Container>
  )
}

export default App