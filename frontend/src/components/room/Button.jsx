import { TbSwitch2 } from "react-icons/tb";
import { FaSignOutAlt } from "react-icons/fa";
import useRoomStore from "../../store/useRoomStore";

export default function Button({ text, event }) {
  const { setActiveRoom } = useRoomStore();
  return (
    <button
      className={`btn btn-sm gap-2 bg-green-700 text-white`}
      onClick={() => {
        setActiveRoom();
        if (event) event(null);
      }}
    >
      <TbSwitch2 size={20} />
      <span className=" sm:inline text-sm">{text}</span>
    </button>
  );
}
