import { getBooks } from "./generateBooks";

const form = document.getElementById("search-form");
form.addEventListener("submit", function (e) {
  e.preventDefault();
  getBooks();
});
