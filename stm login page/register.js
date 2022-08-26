import React, { useState, useContext, useEffect } from 'react';
import { Text, Select, Button, SimpleGrid,Grid, Image, TextInput } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import ContentPaper from '../../../components/layouts/rfs/Content';
import { AuthContext } from '../../../contexts/AuthContext';
import { Row, Col } from 'react-bootstrap';
import { axios } from '../../../utils/axios';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { routes } from '../../../routes';
import { loginRequest } from '../../../utils/authConfig';
import abilogo from '../../../images/abilogo.png'
import { ChevronDownIcon } from '@radix-ui/react-icons';
import './userRegister.css'

function Register() {
  const { login, clearStorage, userName = '' } = useContext(AuthContext);
  const [fetched, setFetched] = useState({});
  const [userEmail, setUserEmail] = useState();
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();
  const { instance, accounts } = useMsal();

  useEffect(() => {
    setUserEmail(accounts[0].username);
  }, [accounts[0]]);

  const handleSelect = (name, value) => {
    const currentValues = { ...fetched };
    currentValues[name] = value;
    setFetched(currentValues);
  };

  const createRegister = (payload, callback) => {
    axios.post(`/register`, payload)
      .then(
        (res) => {
          callback();
        },
        (err) => {
          console.log(err);
        }
      );
  };

  const handleNext = () => {
    createRegister(
      {
        name: userName,
        email: userEmail,
        role_requested: fetched.role_requested,
        role_approved: 'initiator',
        role_reviewed: false,
      },
      () => {
        if (isAuthenticated) {
          const request = {
            ...loginRequest,
            account: accounts[0],
          };

          instance
            .acquireTokenSilent(request)
            .then((response) => {
              login(
                {
                  token: response.accessToken,
                  email: response.idTokenClaims.email,
                },
                (path) => {
                  navigate(path);
                }
              );
            })
            .catch((e) => {
              clearStorage();
              navigate('/');
              console.log(e);
            });
        }
      }
    );
  };

  return (
    
    <div style={{position: "relative",overflow: "hidden",height: "100vh"}}>
    
    <Grid align="flex-start">
      <Grid.Col span={6} style={{ minHeight: 800, backgroundColor:'black' }}>
        <div className='image-div'>
          <Image
            style={{ display:"flex", justifyContent:'right', paddingLeft:'7rem', paddingRight:'3rem',  marginBottom:'5px'}}
            src={abilogo}
            className='h6'
            alt='AB InBev Logo'
            height={100}
          />
          <Text color="yellow" style={{fontSize:'30px',display:"flex", justifyContent:'right',paddingLeft:'10rem', paddingRight:'5rem',}}> To a future with more Cheers
          </Text>
        </div>
        </Grid.Col>
        <Grid.Col span={6} style={{minHeight: 800 }}>
        <div style={{ height:'100%',marginLeft:'8rem', marginRight:'8rem', marginTop: '12rem',marginBottom: '2rem'}}>
          <TextInput
          style={{paddingTop:'2rem'}}
          styles={(theme) => ({
          input: {
            width:'30rem', 
            
          },
          label: {
            fontWeight: '500', 
            fontSize: '14px',
            width:'30rem',},
         })}
        value={userName}
        label="Full name"
        disabled='true'/>
          
          <TextInput
           style={{paddingTop:'1rem'}}
          styles={(theme) => ({
          input: {
            width:'30rem', 
            
          },
          label: {
            fontWeight: '500', 
            fontSize: '14px',
            width:'30rem',},
         })}
        value={userEmail}
        label="Email"
        disabled='true'/>
       

            <Text  style={{paddingTop:'1rem'}} size='sm' weight={600}>
              Select your desired role:
            </Text>
            <Select
              required
              clearable
              radius='md'
              data={[
                { value: 'pmo', label: 'PMO' },
                { value: 'initiator', label: 'Initiator' },
                { value: 'admin', label: 'Admin' },
                { value: 'superadmin', label: 'Super Admin' },
              ]}
              name='role_requested'
              value={fetched.role_requested}
              onChange={(value) => handleSelect('role_requested', value)}  
              icon={<ChevronDownIcon size={14} />}
              styles={(theme) => ({
                input: {
                  width:'30rem', 
                  
                }, 
                rightSection: { display:'none'}
              })}

                
            />
            
            <div style={{width:'100%', marginTop:'2rem',display: 'block', justifyContent:'center'}}>
          <Button color='yellow' size='xl' onClick={() => handleNext()}>
            Submit for Approval and Proceed as Initiator
          </Button>
          </div>
          </div>
      
       
      </Grid.Col>
  </Grid>
</div>
  );
}

export default Register;