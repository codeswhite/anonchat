import React, { FC, useCallback, useEffect, useState } from "react";

import LoadingScreen from "../../LoadingScreen/LoadingScreen";
import { connect, ConnectedProps } from "react-redux";
import { IRootState } from "../../../store";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Navigate } from "react-router-dom";
import { retrieveUser } from "../../../actions/users";
import { useLocation } from "react-router";
import { formatPid } from "../../../utils/formatters";
import { getUserName } from "../../../utils/getUser";

const AUTO_LOGIN = true;
const USE_ACTIVEX = false;
const HARDCODED = 333;

const connector = connect((store: IRootState) => store, { retrieveUser });

const Login: FC<ConnectedProps<typeof connector>> = ({ retrieveUser }) => {
  const locationState = useLocation().state as { manualLogin?: boolean };
  const manualLogin = (locationState && locationState.manualLogin) || false;

  const [userPid, setUserPid] = useState(0);
  const [redir, setRedir] = useState(false);

  const fetchUser = useCallback(
    (pid: number) => {
      retrieveUser(pid)
        .then(() => setRedir(true))
        .catch((err) => {
          console.error(err);
        });
    },
    [retrieveUser]
  );

  const getFormattedActiveXUserName = () => {
    const raw = getUserName() as string;
    console.log("[ActiveX] raw=");
    console.log(raw);
    if (!raw) {
      console.error("[Error] Got empty response from ActiveX");
      return 0;
    }

    const slice = raw.slice(1);
    console.log("[ActiveX] raw.slice(1)=");
    console.log(slice);

    return parseInt(slice) || 0;
  };

  // Automatic user login
  useEffect(() => {
    if (manualLogin || !AUTO_LOGIN) return;

    fetchUser(USE_ACTIVEX ? getFormattedActiveXUserName() : HARDCODED);
  }, [fetchUser, manualLogin]);

  // Render
  if (redir) return <Navigate to="/" />;
  if (!manualLogin && AUTO_LOGIN)
    return <LoadingScreen progressBarText="מכניסים אותך אוטומטית למשתמש..." />;
  return (
    <Form className="container w-25 text-center">
      <Form.Group>
        <Form.Label>מספר אישי</Form.Label>
        <Form.Control
          type="number"
          value={userPid}
          onChange={(e) => setUserPid(formatPid(e.target.value))}
        />
        <Button
          className="mt-3"
          onClick={(e) => {
            e.preventDefault();
            fetchUser(userPid);
          }}
        >
          כניסה
        </Button>
      </Form.Group>
    </Form>
  );
};

export default connector(Login);
