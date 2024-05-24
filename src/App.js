import './App.css';
import React, { Component } from 'react';
import { Box, Button, Container, Heading } from '@chakra-ui/react';
import { createPeerConnection } from './clients/webrtc';
import socket from './clients/socket';

class App extends Component  {

  constructor() {
    super();
    this.state = {
      isLoggedIn : false,
      isStreamReq: false
    }

    this.peerConnection = createPeerConnection();
    this.videoRef = React.createRef();
    this.username = React.createRef();
    this.target = React.createRef();
  }

  componentDidMount() {
    console.log('on componentDidMount')
  }

  render() {
    if(this.state.isLoggedIn) {
      return this.webRTCPage()  
    } else {
      return this.loginPage()
    }
  }

   loginPage() {
    return (
      <div className="App">
        <header className="App-header">
          <form  action = ''>
            <h1>Sign In</h1>
            <div className="input-box"> 
              <input type='text' placeholder='Enter Username' onChange = { this.handleInputUsernameChange } required/>
              
            </div>
  
            <button onClick={ ()=> {
            this.signIn(this.username);
            this.setState({
              isLoggedIn : true
            });
            } } >
              Request
            </button>
  
  
          </form>
        </header>
      </div>
    );
  }


  webRTCPage() {
    return (
      <Box>
        <Heading as="h4" size="xl">username : {this.username}</Heading>
        <div>
            {
              this.state.isStreamReq ? <div> 
                <h4>A request received form {this.target}</h4>
                <Button onClick= { () => {
                  this.acceptCall();
                  this.setState({
                    isStreamReq: false
                  });

                }}>Accept</Button>
              </div> : <div/> 
            }
        </div>
        <Container maxW="1200px" mt="8">
          <Heading as="h2" size="2xl"> Remote Monitoring </Heading>
          <video ref={this.videoRef} autoPlay playsInline style={{ width: '100%' }} />
        </Container>
      </Box>
    );
  }

  async addPeerConnectionListeners() {

    console.log('addPeerConnectionListeners called');
    
    this.peerConnection.ontrack = (event) => {
      console.log('onTrack called')
      this.videoRef.current.srcObject = event.streams[0];
    }

    this.peerConnection.onicecandidate =  async (event) => {
      console.log('onicecandidate called')
      await this.peerConnection.addIceCandidate(event.candidate);
      const icecandidate = {
        type : "IceCandidates",
        username : this.username,
        target : this.target,
        data :  JSON.stringify(event.candidate)
      };
      socket.send(JSON.stringify(icecandidate));
    }

    this.peerConnection.onconnectionstatechange = (event) => {
      console.log('onconnectionstatechange called')
      if(this.peerConnection.connectionState ==  "connected") {
        // change UI to display disconnect button
      }
    }

  }

  signIn(username) {
    const signJson = {
      type: 'SignIn',
      username: username
    }
    socket.send(JSON.stringify(signJson))
    this.addSocketMessageListener();
    this.addPeerConnectionListeners();
  }

  handleInputUsernameChange = (event) => {
    this.username = event.target.value
  }

  async addSocketMessageListener() {
    socket.addEventListener('message', async (message) => {
      console.log('socket on message: ' + (message.data));
      const model = JSON.parse(message.data);
  
      switch(model.type) {
  
        case 'IceCandidates' : 
          try {
            await this.peerConnection.addIceCandidate(model.data);
          } catch(e) {
            console.error('Error adding ice candidate', e);
          }
        
        break;
  
        case 'StartStreaming' :
          this.target = model.username;
          this.initOffer();

        break;
        
        case 'Answer' : 
        try {
          await this.peerConnection.setRemoteDescription({
            type: 'answer',
            sdp: model.data
          });
        } catch(e) {
          console.error('Error setRemoteDescription', e);
        }
      
        
        break;
      }
    })
  }

  async initOffer() {
    try {
      
      const offer = await this.peerConnection.createOffer({
        offerToReceiveVideo: true
      });
      console.log('offer', offer)
      await this.peerConnection.setLocalDescription(offer);
      const offerJSON = {
        type : "Offer",
        username : this.username,
        target : this.target,
        data : offer.sdp
      };
      socket.send(JSON.stringify(offerJSON));
      console.log('candidateState: ', this.peerConnection.connectionState)
    } catch(error) {
      console.log('Error acceptCall: ', error);
    }
  }

}


export default App;
