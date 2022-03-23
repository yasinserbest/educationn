import axios from "axios";
import { showAlert } from "./alerts";

export const contactMail = async (name, subject, email, message) => {
  try {
    const res = await axios({
      method: "POST",
      url: `/v1/iletisim/`,
      data: {
        name,
        subject,
        email,
        message,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Mesajınız Başarıyla Gönderildi ✅");
      window.setTimeout(() => {
        location.reload();
      }, 2500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
