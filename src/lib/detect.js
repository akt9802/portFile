const net = require('net');

function checkPort(port, host) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    socket.setTimeout(400);

    const cleanUp = () => {
      socket.removeAllListeners();
      socket.destroy();
    };

    socket.on('connect', () => {
      cleanUp();
      resolve(true); // Something is listening
    });

    socket.on('timeout', () => {
      cleanUp();
      resolve(false); // Timeout, assume not live
    });

    socket.on('error', (err) => {
      cleanUp();
      resolve(false); // Connection refused, nothing listening
    });

    socket.connect(port, host);
  });
}

/**
 * Checks if a port is in use (live) by attempting a TCP connection.
 */
async function isPortLive(port) {
  // Check localhost first, fallback to 0.0.0.0
  let live = await checkPort(port, '127.0.0.1');
  if (!live) {
    live = await checkPort(port, '0.0.0.0');
  }
  return live;
}

module.exports = {
  isPortLive
};
