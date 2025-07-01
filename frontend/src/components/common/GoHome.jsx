import { Link } from "react-router-dom";
import { IoCloseCircleOutline } from "react-icons/io5";

export default function GoHome({ className }) {
  return (
    <Link to={"/"}>
      <IoCloseCircleOutline
        className={" absolute  cursor-pointer " + className}
        size={40}
      />
    </Link>
  );
}
