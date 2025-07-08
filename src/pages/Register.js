import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
function Register() {

  const [ip, setIp] = useState()

  const getIp = async () => {
    const response = await fetch('https://ipapi.co/json')
    const data = await response.json()

    setIp(data.ip)
  }

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    ip: "",
  })

  useEffect(() => {
    getIp()
  }, [])


const [errors, setErrors] = useState([]);
const [success, setSuccess] = useState(false);

const handleChange = (e) => {
  setFormData({
    ...formData, [e.target.name]: e.target.value,
  });
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const form = new FormData();
  form.append("username", formData.username);
  form.append("email", formData.email);
  form.append("password", formData.password);
  form.append("ip", ip);

  try {
    const response = await fetch("http://149.28.160.232:8888/api/register", {
      method: "POST",
      body: form,
    });

    const data = await response.json();

    if (data.success) {
      setSuccess(true);
      setErrors([]);
    } else {
      setSuccess(false);
      setErrors(data.errors);
    }
  } catch (err) {
    setSuccess(false);
  }
};

return (
  <div>
    <Navbar />
    <h1>
      Register
    </h1>
    <form onSubmit={handleSubmit}>
      <input name="username" placeholder="Username" onChange={handleChange}></input>
      <input name="email" placeholder="E-Mail" onChange={handleChange}></input>
      <input name="password" placeholder="Password" onChange={handleChange}></input>

      <button type="submit">Register</button>
      {success && <p>Registration sucess</p>}
    </form>
  </div>
)
}


export default Register
