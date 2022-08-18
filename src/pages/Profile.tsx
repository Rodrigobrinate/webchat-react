import Header from "../components/Header";
import styles from "../styles/Profile.module.css";
import { useCookies } from "react-cookie";
import Api from "../services/Api";

export default function Profile() {
  const [cookies, setCookie] = useCookies([
    "token",
    "name",
    "profile_image",
    "background_image",
    "email",
    "user_id",
  ]);
  const header = {
    headers: {
      "Content-Type": "multipart/form-data",
      "x-access-token": cookies.token,
    },
  };

  function uploadImageProfile(e: any) {
    Api.post(
      "/user/update_profile_image",
      {
        profile_image: e.target.files[0],
      },
      header
    ).then((res) => {
      console.log(res.data);
      setCookie("profile_image", res.data.user, { maxAge: 3600 * 24 });
    });
  }


  function update_background_image(e: any) {
    Api.post(
      "/user/update_background_image",
      {
        background_image: e.target.files[0],
      },
      header
    ).then((res) => {
      console.log(res.data);
      setCookie("background_image", res.data.user, { maxAge: 3600 * 24 });
    });
  }

  return (
    <>
      <Header />
      <main className={styles.container}>
        <div className={styles.settings}>
          <ul>
            <li>configuração</li>
            <li>sobre</li>
            <li>minha conta</li>
            
          </ul>
        </div>
        <div className={styles.profile}>
          <div>
            <label htmlFor="background-img">
              <img
                src={
                    "http://localhost:3001/static/profile/" +
                    cookies.background_image
                  }
                alt=""
              />
            </label>
            <input
              type="file"
              onChange={(e) => {
                update_background_image(e);
              }}
              hidden
              name=""
              id="background-img"
            />
          </div>
          <div>
            <label htmlFor="profile-img">
              <img
                src={
                  "http://localhost:3001/static/profile/" +
                  cookies.profile_image
                }
                alt=""
              />
            </label>
            <input
              type="file"
              onChange={(e) => {
                uploadImageProfile(e);
              }}
              hidden
              name=""
              id="profile-img"
            />
          </div>
          <h1>{cookies.name}</h1>
          <div>
            <span>email</span>
            <input type="text" value={cookies.email} />
            <span>antiga senha</span>
            <input type="text" />
            <span>nova senha</span>
            <input type="text" />
            <span>confirm senha</span>
            <input type="text" />
            <span>address</span>
          </div>
        </div>
      </main>
    </>
  );
}
