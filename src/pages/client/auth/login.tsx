import { useCurrentApp } from '@/components/context/app.context';
import { loginAPI, loginWithGoogleAPI } from '@/services/api';
import { GooglePlusOutlined } from '@ant-design/icons';
import { App, Button, Divider, Form, FormProps, Input } from 'antd';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

interface FieldType {
    username: string;
    password: string;
}

const LoginPage = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const { notification } = App.useApp();
    const navigate = useNavigate();
    const { setIsAuthenticated, setUser } = useCurrentApp();

    const onFinish: FormProps<FieldType>['onFinish'] = async (values) => {
        setIsSubmit(true);
        const { username, password } = values;
        const res = await loginAPI(username, password);
        if (res.data) {
            notification.success({
                message: "Login Success",
                description: "Login Successfully!",
            })
            navigate('/');
            localStorage.setItem('access_token', res.data.access_token);
            setIsAuthenticated(true);
            setUser(res.data.user);
        } else {
            notification.error({
                message: "Login failed",
                description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                duration: 5
            })
        }
        setIsSubmit(false);
    }

    const loginGoogle = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log(tokenResponse)

            const { data } = await axios(
                "https://www.googleapis.com/oauth2/v3/userinfo",
                {
                    headers: {
                        Authorization: `Bearer ${tokenResponse?.access_token}`,
                    },
                }
            );
            if (data && data.email) {
                //call backend create user
                const res = await loginWithGoogleAPI("GOOGLE", data.email);
                if (res?.data) {
                    setIsAuthenticated(true);
                    setUser(res.data.user);
                    localStorage.setItem('access_token', res.data.access_token);
                    navigate('/');
                } else {
                    notification.error({
                        message: "Login Error",
                        description: res.message && Array.isArray(res.message) ? res.message[0] : res.message,
                        duration: 5,
                    })
                }
            }

        },
    });

    return (
        <div className="register-page">
            <main className="main">
                <div className="container">
                    <section className="wrapper">
                        <div className="heading">
                            <h2 className="text text-large">Login</h2>
                            <Divider />
                        </div>
                        <Form
                            name="form-register"
                            onFinish={onFinish}
                            autoComplete="off"
                        >
                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }} //whole column
                                label="UserName"
                                name="username"
                                rules={[{ required: true, message: 'Please input username' }]}
                            >
                                <Input />
                            </Form.Item>




                            <Form.Item<FieldType>
                                labelCol={{ span: 24 }} //whole column
                                label="Password"
                                name="password"
                                rules={[{ required: true, message: 'Please input password' }]}
                            >
                                <Input.Password />
                            </Form.Item>


                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={isSubmit}>
                                    Login
                                </Button>
                            </Form.Item>
                            <Divider>Or</Divider>
                            <div title='Login with Google'
                                onClick={() => loginGoogle()}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    justifyContent: 'center',
                                    gap: 10,
                                    marginBottom: 25,
                                    cursor: 'pointer'
                                }}>
                                Login with
                                <GooglePlusOutlined style={{ fontSize: 30, color: 'orange' }} />
                            </div>
                            <p className="text text-normal" style={{ textAlign: "center" }}>
                                Don't have any account?
                                <span>
                                    <Link to='/register' > Register</Link>
                                </span>
                            </p>
                        </Form>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default LoginPage;