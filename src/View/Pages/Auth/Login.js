import axios from "axios"
import Cookies from "js-cookie"
import React, { useContext, useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { UserContext } from "../../../Contexts/UserContext"
import { message } from 'antd';
import { Form, Button, Spinner } from 'react-bootstrap';
import config from "../../../config"
import jwt_decode from 'jwt-decode'

const Login = () => {
  let history = useHistory()
  const {
    setLoginStatus,
    setRole,
    setUser,
    fetchUser
  } = useContext(UserContext)
  const [isLoading, setIsLoading] = useState(false);

  const [input, setInput] = useState({
    email: "",
    password: ""
  })

  useEffect(() => document.title = "Login", [])

  const handleChange = (event) => {
    let typeOfInput = event.target.value
    let name = event.target.name

    setInput({ ...input, [name]: typeOfInput })
  }

  const handleSubmit = () => {
    if (input.email === "" || input.password === "") {
      message.error('Semua kolom harus diisi!');
      return
    }

    setIsLoading(true)

    axios.post(`${config.api.userService}/login`, {
      email: input.email,
      password: input.password
    }).then(
      async (res) => {
        var token = res.data.accessToken
        const decoded = jwt_decode(token)

        setLoginStatus(true)
        setRole(decoded.roles)
        Cookies.set('token', token, { expires: 1 })
        
        await fetchUser()

        history.push('/')
        message.success('Login berhasil!');
      },
    ).catch((err) => {
      message.error('Email atau password salah!');
    }).finally(() => {
      setIsLoading(false); // Set isLoading to false when the API call is completed
    });
  }

  return (
    <>
      <h2 className="text-center">Login</h2>
      <br />
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" placeholder="Masukkan email" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" onChange={handleChange} />
        </Form.Group>
        <Button
          variant="outline-success"
          onClick={handleSubmit}
          className="w-100"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
              &nbsp;
              Loading...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </Form>

      <br />
      <p className="text-center">
        Belum punya akun?&nbsp;
        <Link to="/register">Daftar</Link>
      </p>
    </>
  )
}

export default Login