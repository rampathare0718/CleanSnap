import { useEffect, useState } from "react";

// NOTE: This assumes the logged-in user object was stored in localStorage
// at login time (e.g. localStorage.setItem("user", JSON.stringify(user))).
// If your app uses AuthContext instead, replace this with:
//   const { user } = useAuth();
export default function Profile() {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        setAdmin(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to parse stored user:", err);
    }
  }, []);

  if (!admin) {
    return (
      <p className="text-gray-500">
        No profile data found. Make sure the logged-in user is stored after login.
      </p>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-6">My Profile</h2>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Full Name</p>
            <p className="text-gray-800 font-medium">{admin.fullName}</p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="text-gray-800 font-medium">{admin.email}</p>
          </div>
          <div>
            <p className="text-gray-500">Mobile Number</p>
            <p className="text-gray-800 font-medium">{admin.mobileNumber}</p>
          </div>
          <div>
            <p className="text-gray-500">Role</p>
            <p className="text-gray-800 font-medium capitalize">{admin.role}</p>
          </div>
          {admin.address && (
            <div className="sm:col-span-2">
              <p className="text-gray-500">Address</p>
              <p className="text-gray-800 font-medium">
                {[admin.address.street, admin.address.area, admin.address.city, admin.address.state, admin.address.pincode]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}