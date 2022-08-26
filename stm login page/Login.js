import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentPaper from '../../components/layouts/rfs/Content';
import { loginRequest } from '../../utils/authConfig';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { Card, Image, Text, Badge, Button, Group, SimpleGrid, Grid, Center} from '@mantine/core';
import abilogo from '../../images/abilogo.png';
import { AuthContext } from '../../contexts/AuthContext';

import './Login.css';
import { AppLoader } from '../../components/common/loader';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  height: 100vh;
  width: 100vw;
`;

const Login = () => {
  const navigate = useNavigate();
  const { instance, accounts } = useMsal();
  const { login, loading, setToken, clearStorage, loggedIn } = useContext(AuthContext);
  const isAuthenticated = useIsAuthenticated();
  const isTokenLoading = localStorage.getItem('token');

  useEffect(() => {
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
  }, [isAuthenticated]);

  const handleLogin = () => {
    setToken('loading');
    instance.loginRedirect(loginRequest).catch(() => clearStorage());
  };

  if (loading || isTokenLoading === 'loading')
    return (
      <LoadingContainer>
        <AppLoader size='lg' center />
      </LoadingContainer>
    );

  return (
 //<ContentPaper page='home-login'>
 <div style={{height: "100vh",overflow: "hidden"}}>

 
  <Grid align="flex-start">
    <Grid.Col span={6} style={{ minHeight: 900, backgroundColor:'black' }}>
      <div style={{   height:'100%', marginTop: '12rem',marginBottom: '2rem'}}>
        <Image
          style={{ display:"flex", justifyContent:'right', paddingLeft:'7rem', paddingRight:'5rem',  marginBottom:'5px'}}
          src={abilogo}
          className='h6'
          alt='AB InBev Logo'
          height={100}
        />
        <Text color="yellow" style={{fontSize:'30px',display:"flex", justifyContent:'right',paddingLeft:'10rem', paddingRight:'7rem',}}> To a future with more Cheers
        </Text>
      </div>
    </Grid.Col>
    <Grid.Col span={6} style={{minHeight: 900 }}>
    <div style={{marginTop: '10rem'}}>
      <Text style={{fontSize:'74px', fontWeight:'700', paddingTop:'1.8rem', paddingLeft:'5rem', paddingRight:'5rem', display:"inline-flex", justifyContent:'left'}} >Speed to Market</Text>
      <Text  style={{paddingRight:'3rem', paddingTop:'2rem', fontSize:'40px', fontWeight:'500'}}>
        <Center> Welcome</Center>
      </Text>
      <Text size='lg' style={{paddingRight:'3rem',paddingTop:'2rem'}}>
        <Center>Please use your official AB InBev ID to login</Center>
      </Text>
    </div>
    <div style={{display:"flex", justifyContent:'space-between',marginTop: '2.5rem', paddingLeft:'13rem', paddingRight:'16.8rem',}}>
      <Button
        style={{ marginLeft: '20px' }}
        size='lg'
        color='yellow'
        variant='filled'
        onClick={() => navigate('/register')}
        >
        Register
      </Button>
      
      <Button
        size='lg'
        color='yellow'
        variant='filled'
        onClick={() => handleLogin()}
        >
        Login
      </Button>
    </div>
    </Grid.Col>
  </Grid>
 </div>
  );
};

export default Login;
