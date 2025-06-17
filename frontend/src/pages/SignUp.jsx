import React, { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";

export default function SignUp() {
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState([
    {
      name: "",
      email: "",
      password: "",
    },
  ]);

  const { SignUp, isSigningUp } = useAuthStore();

  const validateForm = () => {};
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return <div>SignUp</div>;
}
