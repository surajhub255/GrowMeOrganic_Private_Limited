import { useState, ChangeEvent, FormEvent } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import './index.css';
import { useNavigate } from 'react-router-dom';

interface FormData {
  username: string;
  email: string;
  number: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  number?: string;
}

function App() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    number: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors = validateForm(formData);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted successfully!');
      localStorage.setItem('data', JSON.stringify(formData));
      navigate("/fetchdata");
    } else {
      console.log('Form submission failed due to validation errors.');
    }
  };

  const validateForm = (data: FormData): FormErrors => {
    const errors: FormErrors = {};

    if (!data.username.trim()) {
      errors.username = 'Username is required';
    }

    if (!data.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(data.email)) {
      errors.email = 'Email is invalid';
    }

    if (!data.number.trim()) {
      errors.number = 'Phone number is required';
    } else if (!/^\d{10}$/.test(data.number)) {
      errors.number = 'Phone number must be exactly 10 digits long';
    }

    return errors;
  };

  return (
    <div className="form-container">
      <h2 className="form-title">User Form</h2>
      <form onSubmit={handleSubmit}>
        <div className='user'>
          <TextField
            id="outlined-basic"
            className="form-input"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            label="UserName"
            variant="outlined"
          />
          {errors.username &&
            <span className="error-message">
              {errors.username}
            </span>
          }
        </div>
        <div className='email'>
          <TextField
            id="outlined-basic"
            className="form-input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            label="Email"
            variant="outlined"
          />
          {errors.email &&
            <span className="error-message">
              {errors.email}
            </span>
          }
        </div>
        <div className='phone'>
          <TextField
            id="outlined-basic"
            className="form-input"
            type="text"
            name="number"
            value={formData.number}
            onChange={handleChange}
            label="Phone Number"
            variant="outlined"
          />
          {errors.number &&
            <span className="error-message">
              {errors.number}
            </span>
          }
        </div>
        <Button variant="contained" className="submit-button" type="submit">
          Submit
        </Button>
      </form>
    </div>
  );
}

export default App;
