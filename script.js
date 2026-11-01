// Chỉnh giá tại đây nếu muốn thay đổi.
    const prices = { "4": 229000, "6": 329000 };
    const setType = document.getElementById("setType");
    const quantity = document.getElementById("quantity");
    const totalPrice = document.getElementById("totalPrice");
    const orderForm = document.getElementById("orderForm");
    const thankYou = document.getElementById("thankYou");
    const backToSite = document.getElementById("backToSite");

    function formatVND(amount) {
      return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
    }

    function updateTotal() {
      const selectedSet = setType.value;
      const qty = Math.max(1, Math.min(15, Number(quantity.value) || 1));
      quantity.value = qty;
      totalPrice.textContent = formatVND(prices[selectedSet] * qty);
    }

    document.querySelectorAll("[data-choose-set]").forEach((button) => {
      button.addEventListener("click", () => {
        setType.value = button.dataset.chooseSet;
        updateTotal();
        document.getElementById("order").scrollIntoView({ behavior: "smooth" });
      });
    });

    setType.addEventListener("change", updateTotal);
    quantity.addEventListener("input", updateTotal);

    orderForm.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!orderForm.reportValidity()) return;

      // Đây là trang demo: không gửi dữ liệu ra ngoài hoặc lưu thông tin khách hàng.
      orderForm.closest(".order").style.display = "none";
      thankYou.classList.add("show");
      thankYou.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    backToSite.addEventListener("click", () => {
      thankYou.classList.remove("show");
      orderForm.closest(".order").style.display = "";
      document.getElementById("home").scrollIntoView({ behavior: "smooth" });
    });

    updateTotal();
