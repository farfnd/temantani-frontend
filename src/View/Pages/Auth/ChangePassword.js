import React, { useContext, useEffect, useState } from "react"
import axios from "axios"
import { useHistory } from "react-router"
import { Typography, Form, Input, Button, message } from 'antd';
import Cookies from "js-cookie";

const ChangePassword = () => {
  let history = useHistory()
  const [input, setInput] = useState({
    current_password: "",
    new_password: "",
    new_confirm_password: ""
  })

  useEffect(() => document.title = "Change Password", [])

  const handleSubmit = () => {
    axios.post("https://backendexample.sanbersy.com/api/change-password",
      {
        current_password: input.current_password,
        new_password: input.new_password,
        new_confirm_password: input.new_confirm_password
      },
      {
        headers: {
          "Authorization": "Bearer " + Cookies.get('token')
        }
      }
    ).then(() => {
      message.success('Successfully changed password!');

      setInput({
        current_password: "",
        new_password: "",
        new_confirm_password: ""
      })

      history.push('/change-password')
    }).catch(function (error) {
        let errors = JSON.parse(error.response.data)
        for (const property in errors) {
          message.error(errors[property])
        }
      });
  }

  const handleChange = (event) => {
    let value = event.target.value
    let name = event.target.name

    setInput({ ...input, [name]: value })
  }

  const { Title, Text } = Typography;

  return (
    <>
      <Title>Change Password</Title>
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{ remember: true }}
        onFinish={handleSubmit}
        autoComplete="off"
      >
        <Form.Item
          label="Current Password"
          name="current_password"
          rules={[{ required: true, message: 'Please input your current password!' }]}
        >
          <Input.Password name="current_password" onChange={handleChange} />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="new_password"
          rules={[{ required: true, message: 'Please input new password!' }]}
        >
          <Input.Password name="new_password" onChange={handleChange} />
        </Form.Item>

        <Form.Item
          label="Confirm New Password"
          name="new_confirm_password"
          rules={[{ required: true, message: 'Please input confirmation password!' }]}
        >
          <Input.Password name="new_confirm_password" onChange={handleChange} />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default ChangePassword