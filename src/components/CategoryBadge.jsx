import "./CategoryBadge.css";
import { CATEGORY_COLORS } from "../data/coinCategories";

export const CategoryBadge = ({ category }) => {
  const color = CATEGORY_COLORS[category] ?? "#9ca3af";

  return (
    <span
      className="category-badge"
      style={{ color, borderColor: color, backgroundColor: `${color}1a` }}
    >
      {category}
    </span>
  );
};
