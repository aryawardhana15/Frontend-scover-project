import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../api/axios';
import { ChatBubbleLeftIcon, PaperAirplaneIcon, UserIcon, AcademicCapIcon } from '@heroicons/react/24/outline';

const Chat = ({ isOpen, onClose }) => {
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);

  // ambil data user yang login dari localStorage
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserId = currentUser.id;
  const currentUserRole = currentUser.role;

  useEffect(() => {
    if (isOpen) {
      console.log('Chat component opened. Loading conversations...');
      loadConversations();
    }
  }, [isOpen]);

  useEffect(() => {
    // Filter daftar percakapan saat search berubah
    if (searchTerm.trim() === '') {
      setFilteredConversations(conversations);
    } else {
      const filtered = conversations.filter(conv => {
        let otherParticipantName = '';
        if (currentUserRole === 'admin') {
          otherParticipantName = conv.user_nama || conv.mentor_nama;
        } else if (conv.user_id === currentUserId || conv.mentor_id === currentUserId) {
          otherParticipantName = conv.admin_nama;
        }
        return (
          otherParticipantName &&
          otherParticipantName.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      setFilteredConversations(filtered);
    }
  }, [searchTerm, conversations, currentUserId, currentUserRole]);

  const loadConversationMessages = useCallback(async () => {
    if (!selectedConversation || !selectedConversation.id || String(selectedConversation.id).startsWith('new-')) return;
    try {
      setLoading(true);
      const response = await api.get(
        `/chat/conversations/${selectedConversation.id}/messages`
      );
      setMessages(response.data);
    } catch (error) {
      console.error('Error loading conversation messages:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedConversation]);

  useEffect(() => {
    if (selectedConversation && selectedConversation.id !== null && selectedConversation.id !== undefined) {
      const conversationId = String(selectedConversation.id);
      if (!conversationId.startsWith('new-')) {
        loadConversationMessages();
      } else {
        setMessages([]);
      }
    }
  }, [selectedConversation, loadConversationMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      let response;
      if (currentUserRole === 'admin') {
        console.log('Admin role detected. Fetching all users for chat...');
        response = await api.get('/chat/users');
        console.log('Fetched users:', response.data);
        const existingConversationsResponse = await api.get('/chat/conversations');
        const existingConversations = existingConversationsResponse.data;
        console.log('Fetched existing conversations:', existingConversations);

        const transformedParticipants = response.data.map(participant => {
          const existingConv = existingConversations.find(ec =>
            (participant.role === 'user' && ec.user_id === participant.id) ||
            (participant.role === 'mentor' && ec.mentor_id === participant.id)
          );

          if (existingConv) {
            console.log(`Found existing conversation for ${participant.nama}:`, existingConv);
            return existingConv;
          } else {
            const newConv = {
              id: `new-${participant.id}-${participant.role}`,
              user_id: participant.role === 'user' ? participant.id : null,
              user_nama: participant.role === 'user' ? participant.nama : null,
              mentor_id: participant.role === 'mentor' ? participant.id : null,
              mentor_nama: participant.role === 'mentor' ? participant.nama : null,
              admin_id: currentUserId,
              admin_nama: currentUser.nama,
              created_at: new Date().toISOString(),
              last_message_at: new Date().toISOString(),
            };
            console.log(`Creating new conversation placeholder for ${participant.nama}:`, newConv);
            return newConv;
          }
        });
        
        const sortedParticipants = transformedParticipants.sort((a, b) => {
          const dateA = new Date(a.last_message_at || a.created_at);
          const dateB = new Date(b.last_message_at || b.created_at);
          return dateB - dateA;
        });
        setConversations(sortedParticipants);
        setFilteredConversations(sortedParticipants);
      } else {
        console.log('User/Mentor role detected. Fetching user conversations...');
        response = await api.get('/chat/conversations');
        console.log('Fetched conversations:', response.data);
        
        const sortedConversations = response.data.sort((a, b) => {
          const dateA = new Date(a.last_message_at || a.created_at);
          const dateB = new Date(b.last_message_at || b.created_at);
          return dateB - dateA;
        });
        setConversations(sortedConversations);
        setFilteredConversations(sortedConversations);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    } finally {
      setLoading(false);
      console.log('Finished loading conversations.');
    }
  }, [currentUserRole, currentUserId, currentUser.nama]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) {
      console.log('Message is empty, not sending.');
      return;
    }

    let conversationToUse = selectedConversation;
    console.log('Attempting to send message. Current selectedConversation:', selectedConversation);

    // If it's a new conversation placeholder for admin
    if (currentUserRole === 'admin' && selectedConversation && selectedConversation.id !== null && selectedConversation.id !== undefined) {
      const conversationId = String(selectedConversation.id);
      if (conversationId.startsWith('new-')) {
        console.log('Admin initiating new conversation. Calling findOrCreate...');
        try {
          setLoading(true);
          const [, targetId, targetRole] = conversationId.split('-');
          console.log(`Target ID: ${targetId}, Target Role: ${targetRole}`);
          const response = await api.post('/chat/admin/conversations/findOrCreate', {
            targetId: parseInt(targetId),
            targetRole,
          });
          conversationToUse = response.data;
          console.log('Conversation found or created:', conversationToUse);
          setSelectedConversation(conversationToUse);

          // Replace the placeholder in conversations and filteredConversations
          setConversations(prev => prev.map(conv =>
            conv.id === selectedConversation.id ? conversationToUse : conv
          ));
          setFilteredConversations(prev => prev.map(conv =>
            conv.id === selectedConversation.id ? conversationToUse : conv
          ));

        } catch (error) {
          console.error('Error finding or creating conversation:', error);
          setLoading(false);
          return;
        } finally {
          setLoading(false);
        }
      }
    }

    if (!conversationToUse || !conversationToUse.id) {
      console.error('No valid conversation selected to send message after findOrCreate.');
      return;
    }

    try {
      console.log(`Sending message to conversation ID: ${conversationToUse.id}`);
      const response = await api.post('/chat/messages/send', {
        conversation_id: conversationToUse.id,
        message: newMessage.trim(),
      });

      console.log('Message sent successfully:', response.data);
      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleConversationClick = async (conv) => {
    console.log('Conversation clicked:', conv);
    setSelectedConversation(conv);
    
    if (currentUserRole === 'admin' && conv && conv.id !== null && conv.id !== undefined) {
      const conversationId = String(conv.id);
      if (conversationId.startsWith('new-')) {
        console.log('Admin clicked on a new conversation placeholder.');
        setMessages([]);
      } else {
        console.log('Loading messages for existing conversation:', conv.id);
        loadConversationMessages();
      }
    } else if (conv && conv.id !== null && conv.id !== undefined) {
      console.log('Loading messages for existing conversation:', conv.id);
      loadConversationMessages();
    } else {
      setMessages([]);
    }
  };

  // Helper function to get sender info
  const getSenderInfo = (message) => {
    if (message.sender_id === currentUserId) {
      return {
        name: currentUser.nama || 'Anda',
        role: currentUserRole,
        isCurrentUser: true
      };
    } else {
      // Find sender info from conversation data
      if (currentUserRole === 'admin') {
        if (selectedConversation.user_id === message.sender_id) {
          return {
            name: selectedConversation.user_nama,
            role: 'user',
            isCurrentUser: false
          };
        } else if (selectedConversation.mentor_id === message.sender_id) {
          return {
            name: selectedConversation.mentor_nama,
            role: 'mentor',
            isCurrentUser: false
          };
        }
      } else {
        return {
          name: selectedConversation.admin_nama,
          role: 'admin',
          isCurrentUser: false
        };
      }
    }
    return {
      name: 'Unknown',
      role: 'unknown',
      isCurrentUser: false
    };
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[80vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 rounded-t-lg flex items-center justify-between">
          <h2 className="text-xl font-bold">Chat</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar - daftar user */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col bg-gray-50">
            <div className="p-4 border-b border-gray-200 bg-white">
              <h3 className="font-semibold text-gray-800 mb-3">
                Pilih User/Mentor
              </h3>
              <input
                type="text"
                placeholder="Cari user atau mentor..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading && searchTerm.trim() === '' ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto mb-2"></div>
                  Memuat percakapan...
                </div>
              ) : filteredConversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  <ChatBubbleLeftIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  Tidak ada percakapan yang ditemukan
                </div>
              ) : (
                filteredConversations.map(conv => {
                  let otherParticipantName = '';
                  let otherParticipantRole = '';
                  let otherParticipantPhoto = '';

                  if (currentUserRole === 'admin') {
                    if (conv.user_id) {
                      otherParticipantName = conv.user_nama;
                      otherParticipantRole = 'user';
                      otherParticipantPhoto = conv.user_foto;
                    } else if (conv.mentor_id) {
                      otherParticipantName = conv.mentor_nama;
                      otherParticipantRole = 'mentor';
                      otherParticipantPhoto = conv.mentor_foto;
                    }
                  } else {
                    otherParticipantName = conv.admin_nama;
                    otherParticipantRole = 'admin';
                  }

                  return (
                    <div
                      key={conv.id}
                      onClick={() => handleConversationClick(conv)}
                      className={`p-4 mx-2 my-1 rounded-lg cursor-pointer transition-all duration-200 ${
                        selectedConversation?.id !== null && selectedConversation?.id !== undefined && String(selectedConversation.id) === String(conv.id)
                          ? 'bg-blue-100 border-2 border-blue-500 shadow-md'
                          : 'bg-white hover:bg-gray-100 hover:shadow-sm border border-gray-200'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center overflow-hidden">
                            {otherParticipantPhoto ? (
                              <img src={otherParticipantPhoto} alt="Profile" className="w-full h-full object-cover" />
                            ) : otherParticipantRole === 'mentor' ? (
                              <AcademicCapIcon className="w-6 h-6 text-white" />
                            ) : (
                              <UserIcon className="w-6 h-6 text-white" />
                            )}
                          </div>
                          {/* Online indicator (optional) */}
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {otherParticipantName}
                          </h4>
                          <div className="flex items-center space-x-2">
                            <span className={`inline-block w-2 h-2 rounded-full ${
                              otherParticipantRole === 'admin' ? 'bg-red-500' :
                              otherParticipantRole === 'mentor' ? 'bg-green-500' : 'bg-blue-500'
                            }`}></span>
                            <p className="text-sm text-gray-500 capitalize">
                              {otherParticipantRole}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col bg-white">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-white shadow-sm">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center overflow-hidden">
                      {currentUserRole === 'admin' ? (
                        selectedConversation.user_foto || selectedConversation.mentor_foto ? (
                          <img src={selectedConversation.user_foto || selectedConversation.mentor_foto} alt="Profile" className="w-full h-full object-cover" />
                        ) : selectedConversation.mentor_id ? (
                          <AcademicCapIcon className="w-5 h-5 text-white" />
                        ) : (
                          <UserIcon className="w-5 h-5 text-white" />
                        )
                      ) : (
                        <UserIcon className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {currentUserRole === 'admin'
                          ? selectedConversation.user_nama || selectedConversation.mentor_nama
                          : selectedConversation.admin_nama}
                      </h3>
                      <p className="text-sm text-gray-500 capitalize">
                        {currentUserRole === 'admin'
                          ? selectedConversation.user_id ? 'user' : 'mentor'
                          : 'admin'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {loading && selectedConversation.id && !String(selectedConversation.id).startsWith('new-') ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-gray-500 mt-8">
                      <ChatBubbleLeftIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                      <p>Belum ada pesan. Mulai percakapan sekarang!</p>
                    </div>
                  ) : (
                    messages.map(message => {
                      const senderInfo = getSenderInfo(message);
                      const isCurrentUser = senderInfo.isCurrentUser;
                      
                      return (
                        <div key={message.id} className={`flex items-end space-x-2 ${isCurrentUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                          {/* Avatar */}
                          {!isCurrentUser && (
                            <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
                              {senderInfo.role === 'mentor' ? (
                                <AcademicCapIcon className="w-4 h-4 text-white" />
                              ) : senderInfo.role === 'admin' ? (
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                              ) : (
                                <UserIcon className="w-4 h-4 text-white" />
                              )}
                            </div>
                          )}
                          
                          <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                            {/* Sender name */}
                            {!isCurrentUser && (
                              <div className="mb-1">
                                <span className={`text-xs font-medium ${
                                  senderInfo.role === 'admin' ? 'text-red-600' :
                                  senderInfo.role === 'mentor' ? 'text-green-600' : 'text-blue-600'
                                }`}>
                                  {senderInfo.name}
                                </span>
                                <span className="text-xs text-gray-500 ml-1 capitalize">
                                  ({senderInfo.role})
                                </span>
                              </div>
                            )}
                            
                            {/* Message bubble */}
                            <div className={`px-4 py-2 rounded-2xl shadow-sm ${
                              isCurrentUser
                                ? 'bg-blue-500 text-white rounded-br-md'
                                : 'bg-white text-gray-800 rounded-bl-md border border-gray-200'
                            }`}>
                              <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
                            </div>
                            
                            {/* Timestamp */}
                            <div className={`mt-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                              <span className="text-xs text-gray-400">
                                {new Date(message.created_at).toLocaleTimeString('id-ID', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                                {isCurrentUser && (
                                  <span className="ml-1 text-blue-400">✓</span>
                                )}
                              </span>
                            </div>
                          </div>
                          
                          {/* Current user avatar */}
                          {isCurrentUser && (
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                              {currentUserRole === 'mentor' ? (
                                <AcademicCapIcon className="w-4 h-4 text-white" />
                              ) : currentUserRole === 'admin' ? (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              ) : (
                                <UserIcon className="w-4 h-4 text-white" />
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex space-x-3 items-end">
                    <div className="flex-1">
                      <textarea
                        value={newMessage}
                        onChange={e => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ketik pesan..."
                        rows="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none max-h-32"
                        style={{ minHeight: '44px' }}
                      />
                    </div>
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() || loading}
                      className="px-4 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg"
                    >
                      <PaperAirplaneIcon className="w-5 h-5" />
                    </button>
                  </div>
                  
                  {/* Typing indicator */}
                  <div className="mt-2 text-xs text-gray-400">
                    Tekan Enter untuk mengirim, Shift+Enter untuk baris baru
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500 bg-gray-50">
                <div className="text-center">
                  <ChatBubbleLeftIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium text-gray-600">Pilih percakapan untuk memulai chat</p>
                  <p className="text-sm text-gray-400 mt-2">Klik pada nama user atau mentor di sidebar</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;