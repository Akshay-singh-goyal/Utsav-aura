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
  Divider,
  Stack,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";

// Socket.IO connection
const socket = io("http://localhost:5000");

const UserChat = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [chat, setChat] = useState(null);
  const chatEndRef = useRef(null);

  const botTimer1 = useRef(null);
  const botTimer2 = useRef(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  // Emit online status
  useEffect(() => {
    socket.emit("userStatus", { online: true });
    return () => socket.emit("userStatus", { online: false });
  }, []);

  // Fetch chat on mount
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const { data } = await API.get("/chat/me");
        setMessages(data.messages || []);
        setChat(data);
        if (data._id) socket.emit("joinRoom", data._id);
      } catch (err) {
        console.error("fetchChat error:", err.response?.data || err.message);
      }
    };
    fetchChat();
  }, []);

  // Listen for messages & chat events
  useEffect(() => {
    socket.on("receiveMessage", (msg) => {
      if (!msg || !chat || msg.roomId !== chat._id) return;
      setMessages((prev) => [...prev, msg]);
      if (msg.sender === "admin") clearBotTimers();
    });

    socket.on("chatClosed", ({ chatId }) => {
      if (chat && chat._id === chatId) setChat(prev => ({ ...prev, isClosed: true }));
    });

    socket.on("chatContinued", ({ chatId }) => {
      if (chat && chat._id === chatId) setChat(prev => ({ ...prev, isClosed: false }));
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("chatClosed");
      socket.off("chatContinued");
    };
  }, [chat]);

  // Bot timers
  const clearBotTimers = () => {
    if (botTimer1.current) clearTimeout(botTimer1.current);
    if (botTimer2.current) clearTimeout(botTimer2.current);
  };

  const startBotTimers = () => {
    clearBotTimers();
    botTimer1.current = setTimeout(() => sendBotReply("We are still working on your query, please wait..."), 2 * 60 * 1000);
    botTimer2.current = setTimeout(() => sendBotReply("We are offline, we will contact you shortly"), 5 * 60 * 1000);
  };

  const sendBotReply = (text) => {
    if (!chat) return;
    const botMsg = {
      _id: `bot-${Date.now()}`,
      roomId: chat._id,
      sender: "admin",
      text,
      createdAt: new Date(),
      status: "delivered",
    };
    setMessages(prev => [...prev, botMsg]);
    socket.emit("sendMessage", { roomId: chat._id, message: botMsg });
  };

  // Send user message
  const sendMessage = async () => {
    if (!text.trim() || !chat || chat.isClosed) return;
    try {
      const { data } = await API.post("/chat/send", { text });
      const newMsg = data.messages[data.messages.length - 1];
      setMessages(data.messages);
      socket.emit("sendMessage", { roomId: chat._id, message: newMsg });
      setText("");
      startBotTimers();
    } catch (err) {
      console.error("sendMessage error:", err.response?.data || err.message);
    }
  };

  // Continue chat
  const continueChat = async () => {
    if (!chat) return;
    try {
      await API.post(`/chat/${chat._id}/continue`);
      setChat(prev => ({ ...prev, isClosed: false }));
      socket.emit("chatContinued", { chatId: chat._id });
    } catch (err) {
      console.error(err);
    }
  };

  // Format date for messages
  const formatDate = (dateStr) => {
    const msgDate = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    if (msgDate.toDateString() === today.toDateString()) return "Today";
    if (msgDate.toDateString() === yesterday.toDateString()) return "Yesterday";
    return msgDate.toLocaleDateString();
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <Box sx={{ maxWidth: 650, mx: "auto", mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h5" align="center" sx={{ fontWeight: "bold", color: "#1976d2" }}>
        💬 Customer Support
      </Typography>

      {chat?.isClosed && (
        <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#ffebee" }}>
          <Typography variant="body1" color="error" sx={{ mb: 1 }}>
            Chat ended by admin.
          </Typography>
          <Button variant="contained" color="primary" onClick={continueChat}>Continue Chat</Button>
        </Paper>
      )}

      <Paper sx={{ p: 2, height: 520, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1, bgcolor: "#f9f9f9" }}>
        <List>
          {messages.map((msg, i) => {
            const prevMsg = messages[i - 1];
            const showDateDivider = !prevMsg || new Date(prevMsg.createdAt).toDateString() !== new Date(msg.createdAt).toDateString();

            return (
              <React.Fragment key={msg._id || i}>
                {showDateDivider && (
                  <Divider sx={{ my: 1 }}>
                    <Typography variant="caption" color="textSecondary">{formatDate(msg.createdAt)}</Typography>
                  </Divider>
                )}

                <ListItem sx={{ justifyContent: msg.sender === "user" ? "flex-end" : "flex-start" }}>
                  {msg.sender !== "user" && (
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "#4caf50", width: 36, height: 36 }}>
                        <AdminPanelSettingsIcon />
                      </Avatar>
                    </ListItemAvatar>
                  )}

                  <Paper sx={{ p: 1.5, bgcolor: msg.sender === "user" ? "#1976d2" : "#e0f7fa", color: msg.sender === "user" ? "white" : "black", maxWidth: "70%", borderRadius: 3 }}>
                    <ListItemText primary={msg.text} />
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mt={0.5}>
                      <Typography variant="caption">{new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Typography>
                      {msg.sender === "user" && (
                        <Box sx={{ ml: 1 }}>
                          {msg.status === "sent" && <DoneIcon fontSize="small" />}
                          {(msg.status === "delivered" || msg.status === "read") && <DoneAllIcon fontSize="small" color={msg.status === "read" ? "primary" : "inherit"} />}
                        </Box>
                      )}
                    </Stack>
                  </Paper>

                  {msg.sender === "user" && (
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "#ff9800", width: 36, height: 36 }}>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                  )}
                </ListItem>
              </React.Fragment>
            );
          })}
          <div ref={chatEndRef} />
        </List>
      </Paper>

      <Paper sx={{ display: "flex", gap: 1, p: 1, borderRadius: 3, bgcolor: "#fff", boxShadow: 2 }}>
        <TextField
          fullWidth
          placeholder={chat?.isClosed ? "Chat ended by admin..." : "Type your message..."}
          variant="outlined"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") sendMessage(); }}
          disabled={chat?.isClosed}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        />
        <Button variant="contained" color="primary" onClick={sendMessage} disabled={chat?.isClosed}>Send</Button>
      </Paper>
    </Box>
  );
};

export default UserChat;
