import chatsDAO from '~/model/DAO/chatsDAO';
import { ChatMessageType, NewChatMessageWithDataType } from '~/types/Chat';

class ChatService {
  async add(newChat: NewChatMessageWithDataType): Promise<ChatMessageType> {
    return chatsDAO.add(newChat);
  }

  async getByUserMail(userMail: string, limit = 1000): Promise<ChatMessageType[]> {
    return chatsDAO.getByUserMail(userMail, limit);
  }
}

export default new ChatService();
