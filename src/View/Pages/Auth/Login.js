import axios from "axios"
import Cookies from "js-cookie"
import React, { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router"
import { UserContext } from "../../../Contexts/UserContext"
import { message } from 'antd';
import { Form, Button } from 'react-bootstrap';
import config from "../../../config"

const Login = () => {
  let history = useHistory()
  const { setLoginStatus } = useContext(UserContext)

  const [input, setInput] = useState({
    email: "",
    password: ""
  })

  useEffect(() => document.title = "Login", [])

  const handleChange = (event) => {
    let typeOfInput = event.target.value
    let name = event.target.name
    console.log({ ...input, [name]: typeOfInput })

    setInput({ ...input, [name]: typeOfInput })
  }

  const handleSubmit = () => {
    if(input.email === "" || input.password === "") {
      message.error('Semua kolom harus diisi!');
      return
    }
    axios.post(config.api.userService + '/login', {
      email: input.email,
      password: input.password
    }).then(
      (res) => {
        console.log(res)
        var token = res.data.accessToken
        Cookies.set('token', token, { expires: 1 })
        history.push('/')

        setLoginStatus(true)

        message.success('Login berhasil!');
      },
    ).catch((err) => {
      message.error('Email atau password salah!');
    })
  }

  return (
    <>
      <h2 className="text-center">Login</h2>
      <br/>
      <Form>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" placeholder="Masukkan email" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" onChange={handleChange} />
        </Form.Group>
        <Button variant="outline-success" onClick={handleSubmit} className="w-100">
          Submit
        </Button>
      </Form>

      <br/>
      <p className="text-center">Belum punya akun? <a href="/register">Daftar</a></p>
    </>
  )
}

export default Login