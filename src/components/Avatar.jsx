import { fileUrl } from "../api/axiosClient";
import { colorFromString, initials } from "../utils/helpers";

export default function Avatar({ name = "", src, size = "h-9 w-9", rounded = "rounded-full", className = "" }) {
  const pic = fileUrl(src);
  if (pic) {
    return <img src={pic} alt="" className={`${size} ${rounded} shrink-0 object-cover ${className}`} />;
  }
  return (
    <div
      className={`grid ${size} ${rounded} shrink-0 place-items-center bg-gradient-to-br ${colorFromString(
        name
      )} text-xs font-bold text-white ${className}`}
    >
      {initials(name)}
    </div>
  );
}
