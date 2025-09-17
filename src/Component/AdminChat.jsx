import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import API from "../api";
import {
  Box,
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  TextField,
  Button,
  Typography,
  Badge,
  Divider,
  Stack,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";

// Connect Socket.IO
const socket = io("http://localhost:5000");

const AdminChat = () => {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [text, setText] = useState("");
  const chatEndRef = useRef(null);

  // Bot timers per chat
  const botTimersRef = useRef({});

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  // Fetch all user chats
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const { data } = await API.get("/chat/all");
        setChats(data);
      } catch (err) {
        console.error("fetchChats error:", err.response?.data || err.message);
      }
    };
    fetchChats();
  }, []);

  // Socket listeners
  useEffect(() => {
    // Receive new message
    socket.on("receiveMessage", (msg) => {
      if (!msg) return;

      setChats(prev =>
        prev.map(chat =>
          chat._id === msg.roomId ? { ...chat, messages: [...(chat.messages || []), msg] } : chat
        )
      );

      if (selectedChat && selectedChat._id === msg.roomId) {
        setSelectedChat(prev => ({ ...prev, messages: [...prev.messages, msg] }));
      }

      if (msg.sender === "user") startBotTimers(msg.roomId);
      if (msg.sender === "admin") clearBotTimers(msg.roomId);
    });

    // Update message status
    socket.on("updateStatus", ({ messageId, status }) => {
      setChats(prevChats =>
        prevChats.map(chat => ({
          ...chat,
          messages: (chat.messages || []).map(m => (m._id === messageId ? { ...m, status } : m))
        }))
      );

      if (selectedChat) {
        setSelectedChat(prev => ({
          ...prev,
          messages: prev.messages.map(m => (m._id === messageId ? { ...m, status } : m))
        }));
      }
    });

    // User online/offline
    socket.on("userStatusUpdate", ({ userId, online }) => {
      setChats(prev =>
        prev.map(c => (c.user._id === userId ? { ...c, user: { ...c.user, online } } : c))
      );
    });

    // Chat closed / continued
    socket.on("chatClosed", ({ chatId }) => {
      setChats(prev =>
        prev.map(c => (c._id === chatId ? { ...c, isClosed: true } : c))
      );
      if (selectedChat && selectedChat._id === chatId) {
        setSelectedChat(prev => ({ ...prev, isClosed: true }));
      }
    });

    socket.on("chatContinued", ({ chatId }) => {
      setChats(prev =>
        prev.map(c => (c._id === chatId ? { ...c, isClosed: false } : c))
      );
      if (selectedChat && selectedChat._id === chatId) {
        setSelectedChat(prev => ({ ...prev, isClosed: false }));
      }
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("updateStatus");
      socket.off("userStatusUpdate");
      socket.off("chatClosed");
      socket.off("chatContinued");
    };
  }, [selectedChat]);

  // Bot timer functions
  const startBotTimers = (roomId) => {
    clearBotTimers(roomId);

    botTimersRef.current[roomId] = {
      timer1: setTimeout(() => sendBotReply(roomId, "We are still working on your query, please wait..."), 2 * 60 * 1000),
      timer2: setTimeout(() => sendBotReply(roomId, "We are offline, we will contact you shortly"), 5 * 60 * 1000),
    };
  };

  const clearBotTimers = (roomId) => {
    if (botTimersRef.current[roomId]) {
      clearTimeout(botTimersRef.current[roomId].timer1);
      clearTimeout(botTimersRef.current[roomId].timer2);
      delete botTimersRef.current[roomId];
    }
  };

  const sendBotReply = (roomId, text) => {
    const botMsg = {
      _id: `bot-${Date.now()}`,
      roomId,
      sender: "admin",
      text,
      createdAt: new Date(),
      status: "delivered",
    };

    setChats(prev =>
      prev.map(chat => (chat._id === roomId ? { ...chat, messages: [...(chat.messages || []), botMsg] } : chat))
    );

    if (selectedChat && selectedChat._id === roomId) {
      setSelectedChat(prev => ({ ...prev, messages: [...prev.messages, botMsg] }));
    }

    socket.emit("sendMessage", { roomId, message: botMsg });
  };

  // Open chat
  const openChat = (chat) => {
    setSelectedChat(chat);
    socket.emit("joinRoom", chat._id);
  };

  // Admin send message
  const sendMessage = async () => {
    if (!text.trim() || !selectedChat || selectedChat.isClosed) return;

    try {
      const { data } = await API.post(`/chat/admin/${selectedChat._id}`, { text });
      const newMsg = {
        ...data.messages[data.messages.length - 1],
        roomId: selectedChat._id,
        sender: "admin",
        createdAt: new Date(),
        status: "sent",
      };

      setSelectedChat(data);
      setChats(prev => prev.map(chat => (chat._id === data._id ? data : chat)));
      socket.emit("sendMessage", { roomId: selectedChat._id, message: newMsg });
      setText("");
      clearBotTimers(selectedChat._id);
    } catch (err) {
      console.error("sendMessage error:", err.response?.data || err.message);
    }
  };

  // End chat
  const endChat = async () => {
    if (!selectedChat) return;
    try {
      await API.post(`/chat/${selectedChat._id}/close`);
      setSelectedChat(prev => ({ ...prev, isClosed: true }));
      setChats(prev => prev.map(c => (c._id === selectedChat._id ? { ...c, isClosed: true } : c)));
      socket.emit("chatClosed", { chatId: selectedChat._id });
      clearBotTimers(selectedChat._id);
    } catch (err) {
      console.error("endChat error:", err.response?.data || err.message);
    }
  };

  // Continue chat
  const continueChat = async () => {
    if (!selectedChat) return;
    try {
      await API.post(`/chat/${selectedChat._id}/continue`);
      setSelectedChat(prev => ({ ...prev, isClosed: false }));
      setChats(prev => prev.map(c => (c._id === selectedChat._id ? { ...c, isClosed: false } : c)));
      socket.emit("chatContinued", { chatId: selectedChat._id });
    } catch (err) {
      console.error("continueChat error:", err.response?.data || err.message);
    }
  };

  const formatDate = (dateStr) => {
    const msgDate = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (msgDate.toDateString() === today.toDateString()) return "Today";
    if (msgDate.toDateString() === yesterday.toDateString()) return "Yesterday";
    return msgDate.toLocaleDateString();
  };

  useEffect(scrollToBottom, [selectedChat?.messages]);

  return (
    <Box sx={{ display: "flex", height: "90vh", p: 2, gap: 2 }}>
      {/* Sidebar */}
      <Paper sx={{ width: 250, p: 1, overflowY: "auto" }}>
        <Typography variant="h6" align="center" gutterBottom>👥 Users</Typography>
        <List>
          {chats.map(chat => (
            <ListItem key={chat._id} disablePadding>
              <Button fullWidth onClick={() => openChat(chat)}>
                <ListItemAvatar>
                  <Badge
                    variant="dot"
                    color={chat.user.online ? "success" : "error"}
                    overlap="circular"
                    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  >
                    <Avatar><PersonIcon /></Avatar>
                  </Badge>
                </ListItemAvatar>
                <ListItemText primary={chat.user?.name || "Unknown User"} />
              </Button>
            </ListItem>
          ))}
        </List>
      </Paper>

      {/* Chat Window */}
      <Paper sx={{ flex: 1, display: "flex", flexDirection: "column", p: 2 }}>
        {selectedChat ? (
          <>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography variant="subtitle1">Chat with {selectedChat.user?.name} {selectedChat.isClosed && "(Closed)"}</Typography>
              {!selectedChat.isClosed ? (
                <Button variant="outlined" color="error" onClick={endChat}>End Chat</Button>
              ) : (
                <Button variant="contained" color="primary" onClick={continueChat}>Continue Chat</Button>
              )}
            </Box>

            <Box sx={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1, mb: 1 }}>
              {selectedChat.messages.map((msg, i) => {
                const prevMsg = selectedChat.messages[i - 1];
                const showDateDivider = !prevMsg || new Date(prevMsg.createdAt).toDateString() !== new Date(msg.createdAt).toDateString();
                return (
                  <React.Fragment key={msg._id || i}>
                    {showDateDivider && <Divider sx={{ my: 1 }}><Typography variant="caption">{formatDate(msg.createdAt)}</Typography></Divider>}

                    <Box sx={{ display: "flex", justifyContent: msg.sender === "admin" ? "flex-end" : "flex-start" }}>
                      <Paper sx={{ p: 1.5, bgcolor: msg.sender === "admin" ? "#1976d2" : "#e0f7fa", color: msg.sender === "admin" ? "white" : "black", maxWidth: "70%", borderRadius: 2 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between">
                          <ListItemText primary={msg.text} />
                          <Typography variant="caption">{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Typography>
                        </Stack>
                      </Paper>
                    </Box>
                  </React.Fragment>
                );
              })}
              <div ref={chatEndRef} />
            </Box>

            {/* Message input */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                fullWidth
                placeholder="Type your message..."
                variant="outlined"
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
              />
              <Button variant="contained" color="primary" onClick={sendMessage}>Send</Button>
            </Box>
          </>
        ) : (
          <Typography align="center" sx={{ mt: 4 }}>Select a user to start chat</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default AdminChat;
