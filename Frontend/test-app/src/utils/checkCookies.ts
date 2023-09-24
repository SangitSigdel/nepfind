import Cookies from "js-cookie";

export const getUserName = async () => await Cookies.get("userName");
