import React, { useContext, useEffect, useState } from "react"
import axios from "axios"
import { Link, useHistory } from "react-router-dom"
import { Form, Button, Spinner } from 'react-bootstrap';
import { message } from 'antd';
import config from "../../../config"

const Register = () => {
  let history = useHistory()
  const [input, setInput] = useState({ name: "", email: "", password: "", confirmPassword: "", phoneNumber: "" });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => document.title = "Register", [])

  const handleSubmit = () => {
    if(input.name === "" || input.email === "" || input.password === "") {
      message.error('Semua kolom harus diisi!');
      return
    }
    if(input.password !== input.confirmPassword) {
      message.error('Password tidak sama!');
      return
    }
    
    setIsLoading(true)

    axios.post(`${config.api.userService}/register`, {
      name: input.name,
      email: input.email,
      password: input.password,
      phoneNumber: input.phoneNumber,
      roles: ["BUYER"]
    }).then(
      () => {
        history.push('/register')
        message.success('Registrasi berhasil!');
        
      }
    ).catch((err) => {
      console.log(err)
      alert(err)
    }).finally(() => {
      setIsLoading(false); // Set isLoading to false when the API call is completed
    });
  }

  const handleChange = (event) => {
    let value = event.target.value
    let name = event.target.name

    setInput({ ...input, [name]: value })
  }

  return (
    <>
      <h2 className="text-center">Daftar Akun Baru</h2>
      <br />
      <Form>
        <Form.Group className="mb-3" controlId="formBasicName">
          <Form.Label>Nama Lengkap</Form.Label>
          <Form.Control type="text" name="name" placeholder="Masukkan nama" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Email</Form.Label>
          <Form.Control type="email" name="email" placeholder="Masukkan email" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" name="password" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
          <Form.Label>Konfirmasi Password</Form.Label>
          <Form.Control type="password" name="confirmPassword" onChange={handleChange} />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPhone">
          <Form.Label>Nomor Telepon</Form.Label>
          <Form.Control type="text" name="phoneNumber" placeholder="Masukkan nomor telepon" onChange={handleChange} />
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
        Sudah punya akun?&nbsp;
        <Link to="/login">Masuk</Link>
      </p>
    </>
  )
}

export default Register