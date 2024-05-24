
export function createPeerConnection() {
    
    return new RTCPeerConnection({
        iceServers: [
          {
            username:'openrelayproject',
            credential:'openrelayproject',
            urls: 'turn:openrelay.metered.ca:443?transport=tcp'
          }
        ]
      });
}
  


// peer.addEventListener('icecandidate', event => {
//     if(event.candidate) {
      
//     }
//   })
  
  
  
//   peer.addEventListener('connectionstatechange', event => {
//     console.log(peer.connectionState);
//     if(peer.connectionState === 'connected') {
//       console.log('peer connected')
//     }
//   })
  