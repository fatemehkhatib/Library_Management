import { useState } from "react";

export default function SearchBar({ onSearch, initialValue = "" }) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="نام کتاب، نویسنده یا سال انتشار را جستجو کنید..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit">جستجو</button>
    </form>
  );
}
