export default function UserInfo({ user }) {
  if (!user) return <p>در حال بارگذاری...</p>;

  return (
    <div className="user-info">
      <h2>مشخصات کاربری</h2>
      <p>
        <strong>نام و نام خانوادگی:</strong> {user.full_name}
      </p>
      <p>
        <strong>کد ملی:</strong> {user.national_code}
      </p>
    </div>
  );
}
