
// Chỉnh giá tại đây nếu muốn thay đổi.
const prices = { "4": 229000, "6": 329000 };

const setType = document.getElementById("setType");
const quantity = document.getElementById("quantity");
const totalPrice = document.getElementById("totalPrice");
const orderForm = document.getElementById("orderForm");
const thankYou = document.getElementById("thankYou");
const backToSite = document.getElementById("backToSite");

const decorInputs = Array.from(
  document.querySelectorAll(".decor-quantity-row input[type='number']")
);

const decorCountSummary = document.getElementById("decorCountSummary");
const decorTypeHidden = document.getElementById("decorType");

function formatVND(amount) {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

function getRequiredCakeCount() {
  const selectedSet = Number(setType.value);
  const boxQuantity = Math.max(1, Math.min(15, Number(quantity.value) || 1));

  return selectedSet * boxQuantity;
}


function updateDecorSelection(changedInput = null) {
  const required = getRequiredCakeCount();

  // Lấy số lượng hiện tại của từng kiểu decor
  let values = decorInputs.map((input) => {
    return Math.max(0, Math.floor(Number(input.value) || 0));
  });

  // Nếu khách vừa nhập số lượng ở một ô decor:
  // Giới hạn ô đó theo số bánh còn lại.
  if (changedInput) {
    const changedIndex = decorInputs.indexOf(changedInput);

    const otherTotal = values.reduce((sum, value, index) => {
      return index === changedIndex ? sum : sum + value;
    }, 0);

    const maxForChangedInput = Math.max(0, required - otherTotal);

    values[changedIndex] = Math.min(
      values[changedIndex],
      maxForChangedInput
    );
  } else {
    // Nếu khách đổi Set 04/Set 06 hoặc số lượng hộp:
    // Tự điều chỉnh decor để không vượt tổng số bánh.
    let remaining = required;

    values = values.map((value) => {
      const adjustedValue = Math.min(value, remaining);
      remaining -= adjustedValue;
      return adjustedValue;
    });
  }

  // Cập nhật số lượng và giới hạn max cho từng ô decor
  decorInputs.forEach((input, index) => {
    input.value = values[index];

    const otherTotal = values.reduce((sum, value, otherIndex) => {
      return otherIndex === index ? sum : sum + value;
    }, 0);

    // Mỗi ô chỉ được chọn tối đa số bánh còn lại
    input.max = Math.max(0, required - otherTotal);
  });

  // Tính tổng decor đã chọn
  const selected = values.reduce((sum, value) => sum + value, 0);

  // Hiển thị thông báo
  decorCountSummary.textContent =
    `Đã chọn ${selected}/${required} bánh` +
    (selected === required
      ? " — Đã đủ số lượng."
      : ` — Còn thiếu ${required - selected} bánh.`);

  decorCountSummary.classList.toggle("is-valid", selected === required);
  decorCountSummary.classList.toggle("is-invalid", selected !== required);

  // Lưu danh sách decor đã chọn
  decorTypeHidden.value = decorInputs
    .filter((input) => Number(input.value) > 0)
    .map((input) => {
      const label = document.querySelector(`label[for="${input.id}"]`);
      return `${label.textContent}: ${input.value}`;
    })
    .join(", ");

  // Nếu chưa chọn đủ, ngăn form gửi đi
  decorInputs[0].setCustomValidity(
    selected === required
      ? ""
      : `Cậu cần chọn đủ ${required} bánh decor. Hiện đã chọn ${selected} bánh.`
  );
}


function updateTotal() {
  const selectedSet = setType.value;
  const qty = Math.max(1, Math.min(15, Number(quantity.value) || 1));

  quantity.value = qty;
  totalPrice.textContent = formatVND(prices[selectedSet] * qty);

  updateDecorSelection();
}

document.querySelectorAll("[data-choose-set]").forEach((button) => {
  button.addEventListener("click", () => {
    setType.value = button.dataset.chooseSet;
    updateTotal();

    document.getElementById("order").scrollIntoView({
      behavior: "smooth"
    });
  });
});

setType.addEventListener("change", updateTotal);
quantity.addEventListener("input", updateTotal);

decorInputs.forEach((input) => {
  input.addEventListener("input", () => {
    updateDecorSelection(input);
  });

  input.addEventListener("change", () => {
    updateDecorSelection(input);
  });
});

orderForm.addEventListener("submit", (event) => {
  event.preventDefault();

  updateDecorSelection();

  if (!orderForm.reportValidity()) {
    decorCountSummary.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
    return;
  }

  // Đây là trang demo: không gửi dữ liệu ra ngoài hoặc lưu thông tin khách hàng.
  orderForm.closest(".order").style.display = "none";
  thankYou.classList.add("show");

  thankYou.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
});

backToSite.addEventListener("click", () => {
  thankYou.classList.remove("show");
  orderForm.closest(".order").style.display = "";

  document.getElementById("home").scrollIntoView({
    behavior: "smooth"
  });
});

updateTotal();
