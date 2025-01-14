import { useState } from "react"
import { useAuthContext } from "../context/AuthContext"
import toast from "react-hot-toast"

const handleInputErrors = ({
  username,
  email,
  password,
  confirmPassword,
  gender,
}) => {
  if (!username || !email || !password || !confirmPassword || !gender) {
    toast.error("Please fill all the fields")
    return true
  }

  if (password !== confirmPassword) {
    toast.error("Passwords do not match")
    return true
  }

  return false
}

const useSignup = () => {
  const [loading, setLoading] = useState(false)
  const { setAuthUser } = useAuthContext()

  const signup = async ({
    username,
    email,
    password,
    confirmPassword,
    gender,
  }) => {
    const hasError = handleInputErrors({
      username,
      email,
      password,
      confirmPassword,
      gender,
    })

    if (hasError) {
      return
    }

    try {
      setLoading(true)

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          confirmPassword,
          gender,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (data.error === "Email already exists") {
          toast.error("Email is already registered")
        } else {
          toast.error(data.error || "An error occurred")
        }
        return
      }

      localStorage.setItem("user", JSON.stringify(data))
      setAuthUser(data)
      toast.success("Account created successfully")
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return { loading, signup }
}

export default useSignup
