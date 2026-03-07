import { Card, Form, Input, Button, Typography, message } from "antd";
import { useLogin } from "../../hooks/useLogin";
import { useNavigate } from "react-router";
import rocketLogo1 from '../../assets/img/rocketLogo1.png'

const { Title } = Typography;

const Login = () => {
  const navigate = useNavigate();
  const login = useLogin();

  const handleSubmit = async (values) => {
    try {
      await login.mutateAsync(values);
      navigate("/dashboard");
    } catch (err) {
      message.error("Invalid credentials");
    }
  };

  return (
    <div style={styles.container}>
      <Card style={styles.card}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
    <img
      src={rocketLogo1}
      alt="Logo"
      style={{ width: 300, borderRadius: 5 }}
    />
  </div>


        <Form
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Invalid email format" }
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please enter your password" }
            ]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={login.isPending}
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#f5f5f5"
  },
  card: {
    width: 400
  }
};

export default Login;
