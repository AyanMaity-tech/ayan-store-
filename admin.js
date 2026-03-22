import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue, remove, update } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDXithbg3Dn50sfKXDl9buoFuL3IHJOs4o",
  authDomain: "ayan-store-298fe.firebaseapp.com",
  databaseURL: "https://ayan-store-298fe-default-rtdb.firebaseio.com/",
  projectId: "ayan-store-298fe"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

// 🔒 AUTH PROTECT
onAuthStateChanged(auth,user=>{
  if(!user){
    window.location.href="login.html";
  }
});

// 🔐 LOGOUT
window.logout = function(){
  signOut(auth);
  window.location.href="login.html";
};

let adminDiv = document.getElementById("adminProducts");
let editId = null;

// ➕ ADD / UPDATE
window.addProduct = function(){

  let product = {
    title: title.value,
    price: price.value,
    image: image.value,
    link: link.value,
    category: categoryInput.value,
    rating: Number(rating.value)||4,
    desc: desc.value,
    pros: pros.value,
    cons: cons.value,
    verdict: verdict.value,
    views:0
  };

  if(editId){
    update(ref(db,"products/"+editId),product);
    editId=null;
  }else{
    let newRef = push(ref(db,"products"));
    set(newRef,product);
  }

  document.querySelectorAll("input,textarea").forEach(i=>i.value="");
};

// 📦 LOAD
onValue(ref(db,"products"),snap=>{
  adminDiv.innerHTML="";
  let data=snap.val();

  for(let id in data){
    let p=data[id];

    adminDiv.innerHTML+=`
    <div class="card">
      <div>${p.title}</div>
      <div>
        <button class="edit" onclick="edit('${id}')">Edit</button>
        <button class="delete" onclick="del('${id}')">Delete</button>
      </div>
    </div>`;
  }
});

// ✏️ EDIT
window.edit=function(id){
  onValue(ref(db,"products/"+id),snap=>{
    let p=snap.val();

    title.value=p.title;
    price.value=p.price;
    image.value=p.image;
    link.value=p.link;
    categoryInput.value=p.category;
    rating.value=p.rating;
    desc.value=p.desc;
    pros.value=p.pros;
    cons.value=p.cons;
    verdict.value=p.verdict;

    editId=id;
  },{onlyOnce:true});
};

// ❌ DELETE
window.del=function(id){
  if(confirm("Delete?")){
    remove(ref(db,"products/"+id));
  }
};
