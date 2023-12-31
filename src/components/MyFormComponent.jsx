// Create a React component
import React, { useState } from 'react';
import { getApplication } from '../helper/utils';
import MainService from "../services/main-service";
import './MyFormComponent.css';

const MyFormComponent = ({ params }) => {
  const initialFormData = params.reduce((acc, param) => {
    acc[param.slug] = param.value || '';
    return acc;
  }, {});

  console.log(initialFormData);
  const [formData, setFormData] = useState(initialFormData);
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    console.log(e);
    setFormData((formData) => ({ ...formData, [id]: value }));
    console.log(formData);
  };

  const createBody = (formData) => {
    var body = []
    for(var key in formData) {
      body.push({
        "slug": key,
        "value": formData[key]
      })
    }
    return body;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const body = createBody(formData)
    try {
      const response = await MainService.submitCredentials(getApplication(), {'data': body})
      console.log(response);

      if (response.status === 201) {
        console.log('POST request successful');
        setShowSuccessBanner(true);

        setTimeout(() => {
          setShowSuccessBanner(false);
        }, 3000);

      } else {
        console.error('Failed to make POST request');
      }
    } catch (error) {
      console.error('Error during POST request:', error);
    }
    
  };

  return (
    <div id="root">
      <h1>Credentials</h1>
      <form method="post" onSubmit={handleSubmit}>
        {params.map((param, index) => (
          <div key={index}>
            <label htmlFor={param.name}>{param.name}:</label>
            <br />
            <input
              type={param.type}
              id={param.slug}
              name={param.name}
              value={formData[param.slug]}
              onChange={handleInputChange}
            />
            <br />
          </div>
        ))}
        <input type="submit" value="Submit" />
      </form>
      {showSuccessBanner && (
        <div className="success-banner">
          Update success!
        </div>
      )}
    </div>
  );
};

export default MyFormComponent;
