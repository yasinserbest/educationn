import axios from "axios";
import { showAlert } from "./alerts";

export const forgotPassword = async (email) => {
  try {
    const res = await axios({
      method: "POST",
      url: `http://127.0.0.1:3000/v1/admin/kullanici/sifremiUnuttum`,
      data: {
        email,
      },
    });
    if (res.data.status === "success") {
      showAlert("success", "E-mailinize kodunuzu gönderdik. ✅");
      document.querySelector(".btn-forgotPassword").textContent =
        "Bekleyiniz..";
      document.querySelector(".btn-forgotPassword").style.color = "#3E8CC3";
      window.setTimeout(() => {
        location.reload();
      }, 5500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
    document.querySelector(".btn-forgotPassword").disabled = false;
  }
};

export const resetPassword = async (password, passwordConfirm, token) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: `http://127.0.0.1:3000/v1/admin/kullanici/sifremiYenile/${token}`,
      data: {
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "Şifreniz başarıyla oluşturuldu!");
      window.setTimeout(() => {
        location.assign("/login");
      }, 2500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
