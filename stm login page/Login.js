import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentPaper from '../../components/layouts/rfs/Content';
import { loginRequest } from '../../utils/authConfig';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { Image, Text, Button, Grid, } from '@mantine/core';
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
    <Grid.Col span={6} style={{ minHeight: '100vh', backgroundColor:'black' }}>
        <Image
          style={{ display:"flex", marginTop: '35vh',marginBottom: '3vh', justifyContent:'right', paddingLeft:'5vw', paddingRight:'4vw',  marginBottom:'0.5vh', height:'100%', width:'100%', objectFit: 'fill'}}
          src={abilogo}
          alt='AB InBev Logo'
        />
    </Grid.Col>
    <Grid.Col span={6} style={{minHeight: '100vh' }}>
    <div style={{marginTop: '30vh', width:'100%'}}>
      <Text style={{fontSize:'7vh', fontWeight:'700', paddingTop:'3vh', display:"inline-flex", justifyContent:'center', width:'100%'}} >Speed to Market</Text>
      <Text  style={{ paddingTop:'3vh', fontSize:'4vh', fontWeight:'500', display:"inline-flex", justifyContent:'center', width:'100%'}}><b>Welcome</b></Text>
      <Text size='lg' style={{display:"inline-flex", fontSize:'2vh',justifyContent:'center', width:'100%',paddingTop:'3vh'}}><b>Please use your official AB InBev ID to login</b></Text>
    </div>
    <div style={{display:"flex", justifyContent:'space-between'}}>
      <Button
        style={{ marginLeft: '10vw' ,marginTop: '4vh', justifyContent:'left', width:'30vh', height:'9vh'}}
        color='yellow'
        variant='filled'
        onClick={() => handleLogin()}
        styles={{
          root:{
            fontSize:'4.00vh',
            paddingLeft:'0',
            paddingRight:'0',
            paddingTop:'0',
            paddingBottom:'0',
          },}}
        >
        Register
      </Button>
      
      <Button
      style={{ marginRight: '10vw',marginTop: '4vh', justifyContent:'right', width:'30vh', height:'9vh'}}
        color='yellow'
        variant='filled'
        onClick={() => handleLogin()}
        styles={{root:{
          fontSize:'4.00vh',
          paddingLeft:'0',
          paddingRight:'0',
          paddingTop:'0',
          paddingBottom:'0',
        }}}
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
