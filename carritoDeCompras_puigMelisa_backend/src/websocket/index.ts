import { Socket } from 'dgram';
import { Server as HTTPServer } from 'http';

const { Server } = require('socket.io');

import chatsService from '~/services/chatsService';
import { NewChatMessageType } from '~/types/Chat';

type AskingUserType = {
  userMail: string;
};

class Chat {
  listen(server: HTTPServer) {
    const io = new Server(server);
    io.on('connection', async (socket: Socket) => {
      socket.on('getChats', (askingUser) => this._sendAllChats(socket, askingUser));
      socket.on('newMessage', (message: NewChatMessageType) =>
        this._handleReceivedMessage(socket, message),
      );
      socket.on('error', (error) => console.error(error));
    });
  }

  /**
   *
   * PRIVATE METHODS
   */

  private async _sendAllChats(socket: Socket, askingUser: AskingUserType): Promise<void> {
    try {
      const { userMail } = askingUser;
      const messages = await chatsService.getByUserMail(userMail);
      socket.emit('chatMessages', messages);
    } catch (error) {
      console.error(error);
    }
  }

  private async _handleReceivedMessage(
    socket: Socket,
    newMessage: NewChatMessageType,
  ): Promise<void> {
    try {
      const message = {
        date: new Date(),
        type: 'user',
        ...newMessage,
      } as const;
      const addedChat = await chatsService.add(message);
      socket.emit('chatMessages', [addedChat]);
    } catch (error) {
      console.error(error);
    }
  }
}

export default new Chat();
