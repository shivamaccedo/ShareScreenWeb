//const socket = new WebSocket("ws://13.201.36.130:3000/")
const socket = new WebSocket("ws://localhost:8000/")

socket.addEventListener("open", () => {
    console.log("socket connection established")
    //socket.send("Hello")
  })

  socket.addEventListener("error", (event) => {
    console.log("WebSocket error: ", event);
  });


export default socket;