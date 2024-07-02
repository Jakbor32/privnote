import emailjs from "@emailjs/browser";

const sendEmail = (email: string): void => {
  if (!email) {
    return;
  }

  const templateParams = {
    email: email,
  };

  emailjs
    .send(
      import.meta.env.VITE_EMAILJS_SERVICE_ID,
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
      templateParams,
      import.meta.env.VITE_EMAILJS_USER_ID
    )
    .catch((error) => {
      console.error("Error:", error);
    });
};

export default sendEmail;
