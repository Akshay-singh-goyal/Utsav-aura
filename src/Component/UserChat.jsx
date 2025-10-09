import React, { useEffect, useState, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
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
  IconButton,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DoneIcon from "@mui/icons-material/Done";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";

const API = "http://localhost:5000"; // 🔧 Change for production

const UserChat = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [chat, setChat] = useState(null);
  const chatEndRef = useRef(null);
  const botTimer1 = useRef(null);
  const botTimer2 = useRef(null);

  const token = localStorage.getItem("token"); // ✅ get token inside component

  const socket = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch chat
  useEffect(() => {
    if (!token) return; // not logged in

    const fetchChat = async () => {
      try {
        const { data } = await axios.get(`${API}/api/chat/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(data.messages || []);
        setChat(data);

        // Initialize socket only after chat is fetched
        socket.current = io(API, { auth: { token } });
        if (data._id) socket.current.emit("joinRoom", data._id);

        // Socket listeners
        socket.current.on("receiveMessage", (msg) => {
          if (!msg || msg.roomId !== data._id) return;
          setMessages((prev) => [...prev, msg]);
          if (msg.sender === "admin") clearBotTimers();
        });

        socket.current.on("chatClosed", ({ chatId }) => {
          if (data._id === chatId) setChat((prev) => ({ ...prev, isClosed: true }));
        });

        socket.current.on("chatContinued", ({ chatId }) => {
          if (data._id === chatId) setChat((prev) => ({ ...prev, isClosed: false }));
        });
      } catch (err) {
        console.error("fetchChat error:", err.response?.data || err.message);
      }
    };

    fetchChat();

    // Cleanup on unmount
    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, [token]);

  // Bot timers
  const clearBotTimers = () => {
    botTimer1.current && clearTimeout(botTimer1.current);
    botTimer2.current && clearTimeout(botTimer2.current);
  };

  const startBotTimers = () => {
    clearBotTimers();
    botTimer1.current = setTimeout(
      () => sendBotReply("We are still working on your query, please wait..."),
      2 * 60 * 1000
    );
    botTimer2.current = setTimeout(
      () => sendBotReply("We are offline, we will contact you shortly"),
      5 * 60 * 1000
    );
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
    setMessages((prev) => [...prev, botMsg]);
    socket.current.emit("sendMessage", { roomId: chat._id, message: botMsg });
  };

  // Send user message
  const sendMessage = async () => {
    if (!text.trim() || !chat || chat.isClosed || !token) return;
    try {
      const { data } = await axios.post(
        `${API}/api/chat/send`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newMsg = data.messages[data.messages.length - 1];
      setMessages(data.messages);
      socket.current.emit("sendMessage", { roomId: chat._id, message: newMsg });
      setText("");
      startBotTimers();
    } catch (err) {
      console.error("sendMessage error:", err.response?.data || err.message);
    }
  };

  // Continue chat
  const continueChat = async () => {
    if (!chat || !token) return;
    try {
      await axios.post(
        `${API}/api/chat/${chat._id}/continue`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChat((prev) => ({ ...prev, isClosed: false }));
      socket.current.emit("chatContinued", { chatId: chat._id });
    } catch (err) {
      console.error(err);
    }
  };

  // Close chat
  const closeChat = async () => {
    if (!chat || !token) return;
    try {
      await axios.post(
        `${API}/api/chat/${chat._id}/close`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setChat((prev) => ({ ...prev, isClosed: true }));
      socket.current.emit("chatClosed", { chatId: chat._id });
    } catch (err) {
      console.error(err);
    }
  };

  // Format date
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
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#1976d2" }}>
          💬 Customer Support
        </Typography>
        {chat && !chat.isClosed && (
          <IconButton color="error" onClick={closeChat} title="Close Chat">
            <CloseIcon />
          </IconButton>
        )}
      </Stack>

      {chat?.isClosed && (
        <Paper sx={{ p: 2, textAlign: "center", bgcolor: "#ffebee" }}>
          <Typography variant="body1" color="error" sx={{ mb: 1 }}>
            Chat ended by admin.
          </Typography>
          <Button variant="contained" color="primary" onClick={continueChat}>
            Continue Chat
          </Button>
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
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={chat?.isClosed}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        />
        <IconButton color="primary" onClick={sendMessage} disabled={chat?.isClosed}>
          <SendIcon />
        </IconButton>
      </Paper>
    </Box>
  );
};

export default UserChat;
