import { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';

export default function Register() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    eduEmail: '',
    password: ''
  });

  const { firstName, lastName, eduEmail, password } = formData;

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  }

  const onSubmit = (e) => {
    e.preventDefault();
  }

  return (<>
    <section className='heading'>
      <h1>
        <FaUser /> Register
      </h1>
      <p>Please create an account</p>
    </section>

    <section className='form'>
      <form onSubmit={onSubmit}>
        <div>
          <input 
            type='text' 
            className='form-control' 
            id='firstName' 
            name='firstName' 
            value={firstName}
            placeholder='Enter first name'
            onChange={onChange} 
          />
        </div>

        <div>
          <input 
            type='text' 
            className='form-control' 
            id='lastName' 
            name='lastName' 
            value={lastName}
            placeholder='Enter last name'
            onChange={onChange} 
          />
        </div>

        <div>
          <input 
            type='email' 
            className='form-control' 
            id='eduEmail' 
            name='eduEmail' 
            value={eduEmail}
            placeholder='Enter .edu email'
            onChange={onChange} 
          />
        </div>

        <div>
          <input 
            type='password' 
            className='form-control' 
            id='password' 
            name='password' 
            value={password}
            placeholder='Enter password'
            onChange={onChange} 
          />
        </div>

        <div>
          <button type="submit">
            Submit
          </button>
        </div>
      </form>
    </section>
  </>);
}
