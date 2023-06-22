import { useSocket, useSocketEvent } from 'socket.io-react-hook';

const useAppWebSocket = () => {
  const { socket, error } = useSocket('localhost:5223', {
    reconnectionDelay: 1000,
  });
  return { socket, error };
};

export const useCompositionWebSocket = () => {
  const { socket, error } = useAppWebSocket();
  const { lastMessage, sendMessage: sendCompositionMessage } = useSocketEvent(
    socket,
    'composition'
  );
  if (!lastMessage)
    return {
      compositionImageSharedMemoryName: undefined,
      sendCompositionMessage,
      error,
    };
  const parsed = JSON.parse(lastMessage);
  const compositionImageSharedMemoryName = parsed?.image as string;
  return { compositionImageSharedMemoryName, sendCompositionMessage, error };
};
