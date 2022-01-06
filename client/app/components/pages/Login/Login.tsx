import React, { FC, useCallback, useEffect, useState } from "react";

import LoadingScreen from "../../LoadingScreen/LoadingScreen";
import { connect, ConnectedProps } from "react-redux";
import { IRootState } from "../../../store";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Navigate } from "react-router-dom";
import { retrieveUser } from "../../../actions/users";
import { max, min } from "lodash";
import { useLocation } from "react-router";

const AUTO_LOGIN = true;

const connector = connect((store: IRootState) => store, { retrieveUser });

const Login: FC<ConnectedProps<typeof connector>> = ({ retrieveUser }) => {
  const { manualLogin } = useLocation().state as { manualLogin: boolean };

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

  // Automatic user login
  useEffect(() => {
    if (manualLogin || !AUTO_LOGIN) return;

    const HARDCODED = 707;
    // setUserPid(HARDCODED);
    fetchUser(HARDCODED);
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
          onChange={(e) => {
            const pid = parseInt(e.target.value) || 0;
            setUserPid(min([max([pid, 0]), 999999999]) || 0);
          }}
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
