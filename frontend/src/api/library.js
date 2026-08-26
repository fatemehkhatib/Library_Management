import client from "./client";

export async function loginRequest(nationalCode, password) {
  const { data } = await client.post("/api/auth/login", {
    national_code: nationalCode,
    password,
  });
  return data; // { access_token, token_type }
}

export async function searchBooks(query) {
  const { data } = await client.get("/api/books/search", {
    params: { q: query || "" },
  });
  return data;
}

export async function borrowBook(bookId) {
  const { data } = await client.post(`/api/books/${bookId}/borrow`);
  return data;
}

export async function getProfile() {
  const { data } = await client.get("/api/users/me");
  return data;
}

export async function getHistory() {
  const { data } = await client.get("/api/users/me/history");
  return data;
}

export async function returnBook(recordId) {
  const { data } = await client.post(`/api/users/me/history/${recordId}/return`);
  return data;
}
