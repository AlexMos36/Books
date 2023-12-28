import axios from "axios";
import booksImg from "../img/books-img.png";

let currentPage = 0;
let booksPerPage = 10;
let books = [];

const toggleLoading = (isLoading) => {
  const searchButton = document.getElementById("myBtn");
  const loadingIndicator = document.getElementById("loadingIndicator");

  if (isLoading) {
    searchButton.setAttribute("disabled", "disabled");
    loadingIndicator.classList.remove("hidden");
  } else {
    searchButton.removeAttribute("disabled");
    loadingIndicator.classList.add("hidden");
  }
};

// let input = document.getElementById("search-book");
// input.addEventListener("keypress", function (e) {
//   if (e.key === "Enter") {
//     e.preventDefault();
//     document.getElementById("myBtn").click();
//   }
// });

const getDescription = async (key, descriptionId) => {
  if (!key) {
    return;
  }
  const url = `https://openlibrary.org${key}.json`;

  try {
    const response = await axios.get(url);
    const description = response.data.description;

    const descriptionDiv = document.getElementById(descriptionId);

    if (typeof description === "string") {
      descriptionDiv.textContent = description || "No description available";
    } else if (description && typeof description.value === "string") {
      descriptionDiv.textContent =
        description.value || "No description available";
    } else {
      descriptionDiv.textContent = "No description available";
    }

    descriptionDiv.style.display =
      descriptionDiv.style.display === "none" ? "block" : "none";
  } catch (error) {
    console.log("Error fetching description", error);
  }
};

const moreBooks = () => {
  const loadMoreBooks = document.getElementById("loadMoreBooks");
  const listDom = document.getElementById("books");
  const listDomResult = document.getElementById("result");
  const start = currentPage * booksPerPage;
  const end = start + booksPerPage;

  if (books.length > end) {
    loadMoreBooks.style.display = "block";
    toggleLoading(false);

    const newBooks = books.slice(start, end);
    newBooks.forEach((element) => {
      const titleBooks = element.title;
      const bookDiv = document.createElement("div");
      bookDiv.className =
        "bg-gray-200 p-4 rounded-lg mt-3 md:flex md:flex-col lg:w-full";
      const buttonId = `get-description-${element.key}`;
      bookDiv.innerHTML += `
  <h4 class="font-bold text-lg mb-2">${titleBooks}</h4>
  <img src="../img/books-img.png" alt="book" class=" w-full h-32 sm:h-48 object-cover">
  <h3 class="text-gray-500 text-sm mb-4">${element.author_name}</h3>
  <div class="text-bold text-base break-all text-center pb-5" id="description${element.key}" style="display:none"></div>
  <div class="flex justify-center">
    <button class="btn text-sm text-white bg-gray-600 py-2 px-4 rounded-xl" id="${buttonId}">Show description</button>
  </div>
`;

      listDom.appendChild(bookDiv);

      const getDescriptionButton = document.getElementById(buttonId);
      getDescriptionButton.addEventListener("click", () => {
        getDescription(element.key, `description${element.key}`);
      });
    });
    currentPage++;
  } else {
    loadMoreBooks.style.display = "none";
  }
};

export const getBooks = async () => {
  toggleLoading(true);

  const query = document.getElementById("search-book").value;
  const url = `https://openlibrary.org/search.json?title=${query}`;

  try {
    const response = await axios.get(url);
    books = response.data.docs;

    if (books.length === 0) {
      alert("No books found for the given query.");
    } else {
      currentPage = 0;
      const listDom = document.getElementById("books");
      const listDomResult = document.getElementById("result");
      listDom.innerHTML = "";
      listDomResult.innerHTML = "";

      const resultHeading = document.createElement("h1");
      resultHeading.innerHTML +=
        "<h1 class='font-bold text-gray-600 text-3xl py-3 m-2'>Your Result</h1>";
      listDomResult.appendChild(resultHeading);

      moreBooks();

      if (listDom.children.length === 0) {
        alert("No books found for the given query");
      }
    }
  } catch (error) {
    console.error("Error", error);
  } finally {
    toggleLoading(false);
  }
};

document.getElementById("loadMoreBooks").onclick = moreBooks;
