(function () {
  let current = "0";
  let previous = "";
  let operator = null;
  let justEvaluated = false;

  const currentEl = document.getElementById("current");
  const historyEl = document.getElementById("history");
  const symbols = { "+": "+", "-": "−", "*": "×", "/": "÷" };

  function update() {
    currentEl.textContent = current;
    historyEl.textContent = operator ? previous + " " + symbols[operator] : "";
  }

  function inputNumber(n) {
    if (justEvaluated) { current = "0"; justEvaluated = false; }
    current = current === "0" ? n : current + n;
  }

  function inputDecimal() {
    if (justEvaluated) { current = "0"; justEvaluated = false; }
    if (!current.includes(".")) current += ".";
  }

  function compute(a, b, op) {
    a = parseFloat(a); b = parseFloat(b);
    if (op === "+") return a + b;
    if (op === "-") return a - b;
    if (op === "*") return a * b;
    if (op === "/") return b === 0 ? "Error" : a / b;
  }

  function format(n) {
    if (n === "Error") return n;
    return String(parseFloat(n.toFixed(10)));
  }

  function chooseOperator(op) {
    if (current === "Error") return;
    if (operator && !justEvaluated) {
      current = format(compute(previous, current, operator));
    }
    previous = current;
    operator = op;
    current = "0";
    justEvaluated = false;
    if (previous === "Error") clearAll();
  }

  function equals() {
    if (!operator) return;
    const result = compute(previous, current, operator);
    current = format(result);
    previous = "";
    operator = null;
    justEvaluated = true;
  }

  function clearAll() {
    current = "0"; previous = ""; operator = null; justEvaluated = false;
  }

  function del() {
    if (justEvaluated || current === "Error") { current = "0"; return; }
    current = current.length > 1 ? current.slice(0, -1) : "0";
  }

  function percent() {
    if (current === "Error") return;
    current = format(parseFloat(current) / 100);
  }

  document.querySelector(".keys").addEventListener("click", function (e) {
    const btn = e.target.closest("button");
    if (!btn) return;
    const action = btn.dataset.action;
    const value = btn.dataset.value;

    if (action === "number") inputNumber(value);
    else if (action === "decimal") inputDecimal();
    else if (action === "operator") chooseOperator(value);
    else if (action === "equals") equals();
    else if (action === "clear") clearAll();
    else if (action === "delete") del();
    else if (action === "percent") percent();
    update();
  });

  // Keyboard support
  document.addEventListener("keydown", function (e) {
    if (/^[0-9]$/.test(e.key)) inputNumber(e.key);
    else if (e.key === ".") inputDecimal();
    else if ("+-*/".includes(e.key)) chooseOperator(e.key);
    else if (e.key === "Enter" || e.key === "=") { e.preventDefault(); equals(); }
    else if (e.key === "Backspace") del();
    else if (e.key === "Escape") clearAll();
    else if (e.key === "%") percent();
    else return;
    update();
  });

  update();
})();
