const CATEGORY_STYLES = {
  Environment: "bg-green-100 text-green-700",
  Cleanliness: "bg-blue-100 text-blue-700",
  Recycling: "bg-teal-100 text-teal-700",
  Event: "bg-purple-100 text-purple-700",
  "Public Notice": "bg-amber-100 text-amber-700",
};

const UpdateCategoryBadge = ({ category }) => {
  const style = CATEGORY_STYLES[category] || "bg-gray-100 text-gray-700";
  return (
    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${style}`}>
      {category}
    </span>
  );
};

export default UpdateCategoryBadge;