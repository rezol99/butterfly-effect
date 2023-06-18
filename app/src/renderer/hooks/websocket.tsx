import { useSocket, useSocketEvent } from 'socket.io-react-hook';

const useAppWebSocket = () => {
  const { socket, error } = useSocket('localhost:5223', {
    reconnectionDelay: 1000,
  });
  return { socket, error };
};

export const useCompositionWebSocket = () => {
  const { socket, error } = useAppWebSocket();
  const { lastMessage, sendMessage } = useSocketEvent(socket, 'composition');
  if (!lastMessage) return { compositionImage: undefined, sendMessage, error };
  const parsed = JSON.parse(lastMessage);
  const compositionImage = parsed?.image as string;
  return { compositionImage, sendMessage, error };
};
