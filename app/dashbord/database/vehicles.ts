const handleSignUp = async () => {
  try {
    const userCredential = await signUp(
      email,
      password
    );

    const user = userCredential.user;

    await createUserProfile(
      user.uid,
      user.email || email,
      "New User",
      "driver"
    );

    router.push("/dashbord");
  } catch (error: any) {
    console.error("Signup error:", error);

    if (error.code === "auth/email-already-in-use") {
      alert("This email is already registered.");
    } else if (error.code === "auth/weak-password") {
      alert("Password must be at least 6 characters.");
    } else {
      alert("Signup failed.");
    }
  }
};