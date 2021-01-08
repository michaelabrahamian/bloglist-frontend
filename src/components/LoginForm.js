import React from 'react'
import { Form } from "react-bootstrap";

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
  username,
  password
}) => {
  return (
    <div>
      <h2>Login to application</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={username}
            name="Username"
            onChange={handleUsernameChange}
          />
        </Form.Group>

        <Form.Group controlId="formPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            name="Password"
            onChange={handlePasswordChange}
          />
        </Form.Group>

        <button type="submit">Login</button>
      </Form>
    </div>
  )
}

export default LoginForm