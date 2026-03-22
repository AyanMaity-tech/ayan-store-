import { initializeApp } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-app.js";
import { getDatabase, ref, onValue, update } from "https://www.gstatic.com/firebasejs/12.11.0/firebase-database.js";

// 🔥 CONFIG
const firebaseConfig = {
  apiKey: "AIzaSyDXithbg3Dn50sfKXDl9buoFuL3IHJOs4o",
  authDomain: "ayan-store-298fe.firebaseapp.com",
  databaseURL: "https://ayan-store-298fe-default-rtdb.firebaseio.com/",
  projectId: "ayan-store-298fe",
  storageBucket: "ayan-store-298fe.firebasestorage.app",
  messagingSenderId: "520169064761",
  appId: "1:520169064761:web:46eec42202deecd06e80e8"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// =======================
// 📦 GLOBAL
// =======================
let products = [];
let container = document.getElementById("products");

// =======================
// ⭐ RATING
// =======================
function stars(n){
  let s="";
  for(let i=1;i<=5;i++) s+=i<=n?"★":"☆";
  return s;
}

// =======================
// 🛒 DISPLAY
// =======================
function display(list){
  if(!container) return;

  container.innerHTML="";

  if(list.length === 0){
    container.innerHTML = "<p style='color:#777;text-align:center'>No products found</p>";
    return;
  }

  list.forEach(p=>{
    container.innerHTML+=`
    <div class="card">
      <img src="${p.image}">
      <h3>${p.title}</h3>
      <div>${stars(p.rating || 4)}</div>
      <p>${p.desc || ""}</p>
     <div class="price">₹${p.price}</div>
      <div>👁 ${p.views||0}</div>

      <button onclick="view('${p.id}','${p.link}')">Buy Now</button>

      <div class="review-box">
        <div class="pros">✔ ${p.pros || ""}</div>
        <div class="cons">❌ ${p.cons || ""}</div>
        <div class="verdict">💡 ${p.verdict || ""}</div>
      </div>
    </div>`;
  });
}

// =======================
// 👁 VIEW COUNT
// =======================
window.view=function(id,link){
  let p=products.find(x=>x.id===id);
  if(!p) return;

  update(ref(db,"products/"+id),{
    views:(p.views||0)+1
  });

  window.open(link,"_blank");
};

// =======================
// 🔍 SEARCH (MAIN FIX)
// =======================
function bindSearch(){
  let search = document.getElementById("search");

  if(!search) return;

  search.oninput = function(){
    let v = this.value.toLowerCase().trim();

    let filtered = products.filter(p =>
      (p.title || "").toLowerCase().includes(v)
    );

    display(filtered);
  };
}

// =======================
// 🎯 CATEGORY FILTER
// =======================
window.filterCategory=function(cat,el){

  document.querySelectorAll(".chips button").forEach(b=>{
    b.style.color="#777";
  });

  if(el) el.style.color="white";

  if(cat==="all") display(products);
  else display(products.filter(p=>p.category===cat));
};

// =======================
// 📦 FIREBASE LOAD
// =======================
onValue(ref(db,"products"),snap=>{
  let data = snap.val();

  products = [];

  if(data){
    for(let id in data){
      products.push({...data[id],id});
    }
  }

  display(products);

  // 🔥 RE-RUN SEARCH IF USER TYPED
  let search = document.getElementById("search");
  if(search && search.value){
    search.oninput();
  }
});

// =======================
// 🚀 INIT
// =======================
window.addEventListener("DOMContentLoaded",()=>{
  bindSearch();
});

// 🔥 EXTRA SAFETY (FOR MOBILE / DELAY)
setTimeout(()=>{
  bindSearch();
},1000);
