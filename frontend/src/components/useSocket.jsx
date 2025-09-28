import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const useSocket = (url) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const socket = io(url, { transports: ['websocket'] });

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
    });

    socket.on('locationUpdate', (update) => {
      setData(update); // { lat, lon, speed, eta, distance, timestamp }
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    return () => {
      socket.disconnect();
    };
  }, [url]);

  return data;
};

export default useSocket;