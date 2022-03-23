import axios from "axios";
import { showAlert } from "./alerts";

export const createData = async (data, path) => {
  try {
    const res = await axios({
      method: "POST",
      url: `http://127.0.0.1:3000/v1/admin/${path}/`,
      data,
    });
    if (res.data.status === "success") {
      showAlert("success", "Kayıt başarıyla alındı");
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const updateData = async (
  passwordCurrent,
  password,
  passwordConfirm
) => {
  try {
    const res = await axios({
      method: "PATCH",
      url: "http://127.0.0.1:3000/v1/admin/kullanici/sifremiGuncelle",
      data: {
        passwordCurrent,
        password,
        passwordConfirm,
      },
    });

    if (res.data.status === "success") {
      showAlert("success", "şifreniz başarıyla güncellendi!");
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};

export const deleteData = async (path, id) => {
  try {
    const res = await axios.delete(
      `http://127.0.0.1:3000/v1/admin/${path}/${id}`
    );
    console.log(res.data);
    if (res.data.status === "success") {
      showAlert("success", "Kayıt başarıyla silindi. Bekleyiniz...");
      window.setTimeout(() => {
        location.reload();
      }, 1500);
    }
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
