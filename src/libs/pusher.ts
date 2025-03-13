import PusherServer from 'pusher';
import PusherClient from 'pusher-js';

// Define the environment variables required for Pusher
const pusherAppId = process.env.PUSHER_APP_ID;
const pusherAppKey = process.env.NEXT_PUBLIC_PUSHER_APP_KEY;
const pusherSecret = process.env.PUSHER_SECRET;
const pusherCluster = process.env.PUSHER_CLUSTER;

// Initialize PusherServer (server-side) with validation
export const pusherServer = (() => {
  if (!pusherAppId || !pusherAppKey || !pusherSecret || !pusherCluster) {
    console.warn('PusherServer environment variables missing. PusherServer will not be initialized.');
    return null;
  }

  return new PusherServer({
    appId: pusherAppId,
    key: pusherAppKey,
    secret: pusherSecret,
    cluster: pusherCluster,
    useTLS: true,
  });
})();

// Initialize PusherClient (client-side) with validation
export const pusherClient = (() => {
  if (!pusherAppKey || !pusherCluster) {
    console.warn('PusherClient environment variables missing. PusherClient will not be initialized.');
    return null;
  }

  return new PusherClient(pusherAppKey, {
    channelAuthorization: {
      endpoint: '/api/pusher/auth',
      transport: 'ajax',
    },
    cluster: pusherCluster,
  });
})();