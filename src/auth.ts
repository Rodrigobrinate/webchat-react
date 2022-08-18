import Headers from "./services/Headers";
import Api from "./services/Api";

const headers = Headers();

export default async function AuthProvider() {
  let isAuthenticated = false;

  Api.get("/auth/me", headers).then((response) => {
    if (response.data.auth == true) {
      isAuthenticated = true;
    } else {
      isAuthenticated = false;
    }
  });
}
