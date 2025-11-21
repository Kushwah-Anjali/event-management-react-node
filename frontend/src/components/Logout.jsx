import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import useLogout from "../hooks/useLogout";

export default function LogoutButton() {
  const logout = useLogout();

  return (
    <button
      className="btn btn-outline-light d-flex align-items-center justify-content-center rounded-3 fw-semibold"
      onClick={logout}
      style={{ width: "42px", height: "42px" }}
    >
      <FontAwesomeIcon icon={faRightFromBracket} />
    </button>
  );
}
