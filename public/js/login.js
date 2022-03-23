import axios from "axios";
import { showAlert } from "./alerts";
export const login = async (email, password) => {
  try {
    const res = await axios({
      method: "POST",
      url: "/v1/admin/kullanici/login",
      data: {
        email,
        password,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "Giriş başarılı ✅");
      window.setTimeout(() => {
        location.assign("/admin-yorumlar");
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
export const logout = async () => {
  try {
    const res = await axios({
      method: "GET",
      url: "/v1/admin/kullanici/logout",
    });
    if ((res.data.status = "success")) {
      location.reload();
      location.assign("/");
    }
  } catch (err) {
    showAlert("error", "Error logging out! Try again.");
  }
};
