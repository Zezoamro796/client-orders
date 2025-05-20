// بيانات المستخدمين (محفوظة مؤقتًا في المتصفح)
let users = {
  1: { name: "د/هبه", password: "1983", role: "admin" },
  2: { name: "د/ندي", password: "2", role: "user" },
  3: { name: "د/احمد الموافي", password: "3", role: "user" },
  4: { name: "د/سيد", password: "4", role: "user" },
  5: { name: "د/مي", password: "5", role: "user" },
  6: { name: "د/محمد ايمام", password: "6", role: "user" },
  7: { name: "د/مها", password: "7", role: "user" },
  8: { name: "تدريب", password: "8", role: "user" },
  9: { name: "د/ماري", password: "9", role: "user" },
};

let currentUser = null;
let orders = JSON.parse(localStorage.getItem("orders") || "[]");

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();
  let userId = document.getElementById("userId").value;
  let password = document.getElementById("password").value;

  if (users[userId] && users[userId].password === password) {
    currentUser = { id: userId, ...users[userId] };
    document.getElementById("loginPage").style.display = "none";
    document.getElementById("mainApp").style.display = "flex";
    document.getElementById("orderSection").style.display = "block";
    if (currentUser.role === "admin") {
      document.getElementById("addUserSection").style.display = "block";
      document.getElementById("backupSection").style.display = "block";
    }
    renderOrders();
  } else {
    alert("رقم المستخدم أو كلمة المرور غير صحيحة");
  }
});

document.getElementById("orderForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const name = document.getElementById("clientName").value;
  const address = document.getElementById("clientAddress").value;
  const phone = document.getElementById("clientPhone").value;
  const product = document.getElementById("clientProduct").value;
  const imageFile = document.getElementById("clientImage").files[0];
  const reader = new FileReader();

  reader.onload = function () {
    const imageUrl = imageFile ? reader.result : "";
    const now = new Date();
    const order = {
      id: Date.now(),
      user: currentUser.name,
      date: now.toLocaleDateString(),
      time: now.toLocaleTimeString(),
      name,
      address,
      phone,
      product,
      imageUrl,
      status: "قيد التجهيز",
    };
    orders.push(order);
    localStorage.setItem("orders", JSON.stringify(orders));
    renderOrders();
    e.target.reset();
  };

  if (imageFile) {
    reader.readAsDataURL(imageFile);
  } else {
    reader.onload();
  }
});

function renderOrders(filter = "") {
  const container = document.getElementById("ordersContainer");
  container.innerHTML = "";
  let filtered = orders.filter(order =>
    order.name.includes(filter) || order.phone.includes(filter) || order.status.includes(filter)
  );

  filtered.forEach((order) => {
    const div = document.createElement("div");
    div.className = "order-card";

    div.innerHTML = `
      <div class="order-header">
        <span><strong>المستخدم:</strong> ${order.user}</span>
        <span><strong>التاريخ:</strong> ${order.date} ${order.time}</span>
        <button class="delete-btn" onclick="deleteOrder(${order.id})">✖</button>
      </div>
      <p><strong>الاسم:</strong> ${order.name}</p>
      <p><strong>العنوان:</strong> ${order.address}</p>
      <p><strong>رقم الهاتف:</strong> ${order.phone}</p>
      <p><strong>الصنف المطلوب:</strong> ${order.product}</p>
      ${order.imageUrl ? `<img src="${order.imageUrl}" alt="صورة" class="order-image">` : ""}
      <p><strong>الحالة:</strong> ${order.status}</p>
      <div class="order-buttons">
        <button onclick="updateStatus(${order.id}, 'تم التوصيل')">تم التوصيل</button>
        <button onclick="updateStatus(${order.id}, 'قيد التجهيز')">قيد التجهيز</button>
        <button onclick="updateStatus(${order.id}, 'لم يرد')">لم يرد</button>
        <button onclick="updateStatus(${order.id}, 'تم الإلغاء')">تم الإلغاء</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function deleteOrder(id) {
  orders = orders.filter((order) => order.id !== id);
  localStorage.setItem("orders", JSON.stringify(orders));
  renderOrders(document.getElementById("searchInput").value);
}

function updateStatus(id, status) {
  const order = orders.find(o => o.id === id);
  if (order) {
    order.status = status;
    localStorage.setItem("orders", JSON.stringify(orders));
    renderOrders(document.getElementById("searchInput").value);
  }
}

document.getElementById("addOrderBtn").onclick = () => {
  showSection("orderSection");
};

document.getElementById("viewOrdersBtn").onclick = () => {
  showSection("ordersSection");
  renderOrders();
};

document.getElementById("addUserBtn").onclick = () => {
  showSection("userSection");
};

function showSection(sectionId) {
  document.getElementById("orderSection").style.display = "none";
  document.getElementById("ordersSection").style.display = "none";
  document.getElementById("userSection").style.display = "none";
  document.getElementById(sectionId).style.display = "block";
}

document.getElementById("searchInput").addEventListener("input", function () {
  renderOrders(this.value);
});

document.getElementById("addUserForm")?.addEventListener("submit", function (e) {
  e.preventDefault();
  const id = document.getElementById("newUserId").value;
  const password = document.getElementById("newUserPassword").value;
  const name = document.getElementById("newUserName").value;
  const role = document.getElementById("newUserRole").value;

  if (!users[id]) {
    users[id] = { name, password, role };
    alert("تم إضافة المستخدم بنجاح.");
    e.target.reset();
  } else {
    alert("رقم المستخدم موجود بالفعل.");
  }
});

document.getElementById("printBtn").addEventListener("click", function () {
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "الاسم,العنوان,رقم الهاتف,الصنف,المستخدم,التاريخ,الوقت,الحالة\n";

  orders.forEach(order => {
    csvContent += `${order.name},${order.address},${order.phone},${order.product},${order.user},${order.date},${order.time},${order.status}\n`;
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "طلبات_العملاء.csv");
  document.body.appendChild(link);
  link.click();
});
