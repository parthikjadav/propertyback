
let io;

function initIO(server) {
    let socketIO = require("socket.io")(server, {
        cors: {
            origin: "*"
        }
    })

    io = socketIO;

    socketIO.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        // socket.on('register',(user)=>{

        // })
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });

    return socketIO;
}

function getIO() {
    if (!io) {
        throw new Error("io is not initialized ")
    }
    return io;
}

module.exports = { initIO, getIO }