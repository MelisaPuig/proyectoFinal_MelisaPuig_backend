import ChatORM from '~/model/ORM/ChatORM';
import { NewChatMessageWithDataType, ChatMessageType } from '~/types/Chat';

class ChatDAO {
  async add(newChat: NewChatMessageWithDataType): Promise<ChatMessageType> {
    try {
      const addedChat = new ChatORM(newChat);
      await addedChat.save();
      return addedChat.toObject();
    } catch (error) {
      throw error;
    }
  }

  async getByUserMail(userMail: string, limit = 1000): Promise<ChatMessageType[]> {
    try {
      const chats = await ChatORM.find({ userMail }).sort({ date: -1 }).limit(limit);
      if (!chats) {
        return [];
      }
      return chats.map((e) => e.toObject());
    } catch (error) {
      throw error;
    }
  }
}

export default new ChatDAO();
