import React, { FC, FormEvent, useEffect, useRef, useState } from "react";

import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormCheck from "react-bootstrap/FormCheck";
import Table from "react-bootstrap/Table";
import EStatus from "../../../../typings/models/estatus";
import LoadingScreen from "../../LoadingScreen/LoadingScreen";
import User from "../../../../typings/models/user";
import { getUserByPid, getAllUsers } from "../../../services/user.service";
import EditUserForm from "../../EditUserForm/EditUserForm";
import { updatePublicName } from "../../../actions/users";
import { connect, ConnectedProps } from "react-redux";
import { IRootState } from "../../../store";
import { formatPid } from "../../../utils/formatters";

const connector = connect((store: IRootState) => store, { updatePublicName });

const Admin: FC<ConnectedProps<typeof connector>> = ({ updatePublicName }) => {
  const [status, setStatus] = useState(EStatus.Loading);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [newUserPid, setNewUserPid] = useState<number | undefined>();
  const [newUserName, setNewUserName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [editing, setEditing] = useState<User | undefined>();
  const isMounted = useRef(true);

//todo debug store.publicUsers inside and outside

  // Load all users
  useEffect(() => {
    getAllUsers()
      .then((res) => res.data)
      .then((allUsers) => {
        if (isMounted.current) {
          setAllUsers(allUsers);
          setStatus(EStatus.Ready);
        }
      })
      .catch((err) => {
        console.error(err);
        setStatus(EStatus.Error);
      });
    return () => {
      isMounted.current = false;
    };
  }, []);

  // Handle submit click for "Add new user"
  const handleAddNewUser = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (!newUserPid) return;

    setStatus(EStatus.Loading);
    getUserByPid(newUserPid)
      .then((res) => res.data)
      .then((user: User) =>
        newUserName === "" ? user : updatePublicName(user._id, newUserName)
      )
      .then((user: User) => {
        // Set local state data
        setAllUsers([...allUsers, user]);
        setStatus(EStatus.Ready);
      })
      .catch((err) => {
        console.error(err);
        setStatus(EStatus.Error);
      })
      .finally(() => setSubmitted(false)); // Clear submitted state
  };

  switch (status) {
    case EStatus.Loading:
      return <LoadingScreen />;

    case EStatus.Ready:
      return editing ? (
        <EditUserForm
          editable={editing}
          done={(user?: User) => {
            setEditing(undefined);
            if (user) {
              if (user._id === "deleted") {
                setAllUsers(allUsers.filter((iuser) => iuser.pid !== user.pid));
              } else {
                setAllUsers(
                  allUsers.map((iuser) =>
                    iuser.pid === user.pid ? user : iuser
                  )
                );
              }
            }
          }}
        />
      ) : (
        <>
          <Form className="row justify-content-center needs-validation my-2">
            <Form.Group className="form-inline col-auto">
              <Form.Control
                className={
                  submitted && newUserPid === undefined ? "is-invalid" : ""
                }
                required
                type="number"
                placeholder="מספר אישי"
                value={newUserPid || undefined}
                onChange={(e) => setNewUserPid(formatPid(e.target.value))}
              />
            </Form.Group>
            <Form.Group className="form-inline col-auto">
              <Form.Control
                type="text"
                placeholder="שם פומבי (אופציונאלי)"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />
            </Form.Group>
            <Button
              variant="primary"
              type="submit"
              className="form-inline col-auto"
              onClick={handleAddNewUser}
            >
              הוספת משתמש חדש
            </Button>
            <Form.Text className="row justify-content-center">
              שימו לב: משתמש בעל שם פומבי לא יוכל להישאר אנונימי!
            </Form.Text>
          </Form>
          <hr></hr>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>מספר אישי</th>
                <th>שם פומבי</th>
                <th>כמות צ&apos;אטים</th>
                <th>הרשאת ניהול?</th>
                <th>עריכה</th>
              </tr>
            </thead>
            <tbody>
              {allUsers.map((user) => (
                <tr key={user._id}>
                  <th>{user.pid}</th>
                  <th>{user.publicName}</th>
                  <th>{user.chats.length}</th>
                  <th>
                    <FormCheck disabled checked={user.isAdmin} />
                  </th>
                  <th>
                    <Button onClick={() => setEditing(user)}>עריכה</Button>
                  </th>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      );
    default:
      return (
        <h3>לא הצלחנו לטעון את נתוני הדף הפעם! לא נורא, תמיד יש פעם הבאה ;)</h3>
      );
  }
};

export default connector(Admin);
