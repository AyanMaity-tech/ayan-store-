import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDXithbg3Dn50sfKXDl9buoFuL3IHJOs4o",
  authDomain: "ayan-store-298fe.firebaseapp.com",
  projectId: "ayan-store-298fe"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.login = function(){
  let email = document.getElementById("email").value;
  let pass = document.getElementById("password").value;

  signInWithEmailAndPassword(auth,email,pass)
  .then(()=>{
    window.location.href="admin.html";
  })
  .catch(()=>{
    alert("Login Failed ❌");
  });
};
