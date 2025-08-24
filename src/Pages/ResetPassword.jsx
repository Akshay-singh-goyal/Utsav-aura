// import React, { useState } from "react";
// import { useLocation, useNavigate, Link } from "react-router-dom";
// // import api from "../api";
// import OtpInput from "../components/OtpInput";

// export default function ResetPassword() {
//   const { state } = useLocation();
//   const email = state?.email || "";
//   const [otp, setOtp] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const nav = useNavigate();

//   const submit = async (e) => {
//     e.preventDefault();
//     await api.post("/auth/reset-password", { email, otp, newPassword });
//     alert("Password reset successful. Please login.");
//     nav("/login");
//   };

//   return (
//     <div style={{ padding: 24 }}>
//       <h2>Reset Password</h2>
//       <p>Enter the OTP sent to <b>{email}</b></p>
//       <form onSubmit={submit}>
//         <OtpInput length={6} onChange={setOtp} />
//         <br/>
//         <input type="password" placeholder="New password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} required />
//         <br/>
//         <button type="submit" disabled={otp.length !== 6}>Reset Password</button>
//       </form>
//       <div style={{ marginTop: 12 }}>
//         <Link to="/login">Back to Login</Link>
//       </div>
//     </div>
//   );
// }
