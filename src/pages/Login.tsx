import React from "react";
import "../App.css";
import { Button, Form, Input, Typography, message } from "antd";
import { useMutation, gql, ApolloError } from "@apollo/client";
import { useNavigate } from "react-router-dom";

const LOGIN_MUTATION = gql`
    mutation Mutation($username: String!, $password: String!) {
        SignIn(username: $username, password: $password)
    }
`;

function Login(): JSX.Element {
    const navigate = useNavigate();
    const [loginMutation] = useMutation(LOGIN_MUTATION);

    const login = async (values: { myUsername: string; myPassword: string }): Promise<void> => {
        try {
            const { data } = await loginMutation({
                variables: {
                    username: values.myUsername,
                    password: values.myPassword,
                },
            });

            const accessToken = data.SignIn;

            sessionStorage.setItem("AccessToken", accessToken);

            message.success(`Login Successful. Access Token: ${accessToken}`);

            navigate("/Dashboard");
        } catch (error) {
            console.error("Login error:", error);

            if (error instanceof ApolloError) {
                error.graphQLErrors.forEach((graphQLError) => {
                    console.error("GraphQL Error:", graphQLError.message);
                });

                if (error.networkError) {
                    console.error("Network Error:", error.networkError);
                }
            }

            message.error("Login Failed. Please check your credentials.");
        }
    };

    return (
        <div className="loginbg">
            <Form className="loginForm" onFinish={login} layout="vertical">
                <Typography.Title style={{ color: "blue", textAlign: "center" }}>
                    Welcome!
                </Typography.Title>
                <Form.Item
                    rules={[
                        {
                            required: true,
                            type: "string",
                            message: "Please enter your username",
                        },
                    ]}
                    label="Username"
                    name="myUsername"
                >
                    <Input placeholder="Enter your Username" />
                </Form.Item>
                <Form.Item
                    rules={[
                        {
                            required: true,
                            message: "Please enter your password",
                        },
                    ]}
                    label="Password"
                    name="myPassword"
                >
                    <Input.Password placeholder="Enter your password" />
                </Form.Item>
                <Button type="primary" htmlType="submit" block>
                    Login
                </Button>
            </Form>
        </div>
    );
}

export default Login;
