import React, { FC, FormEvent, useState } from "react";
import { connect, ConnectedProps } from "react-redux";
import EStatus from "../../../typings/models/estatus";
import User from "../../../typings/models/user";
import { IRootState } from "../../store";
import { deleteUser, setAdmin, updatePublicName } from "../../actions/users";
import LoadingScreen from "../LoadingScreen/LoadingScreen";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

const connector = connect(
  (store: IRootState) => {
    return store;
  },
  {
    setAdmin,
    updatePublicName,
    deleteUser,
  }
);

const EditUserForm: FC<
  {
    editable: User;
    done(user?: User): void;
  } & ConnectedProps<typeof connector>
> = ({ editable, done, deleteUser, setAdmin, updatePublicName }) => {
  const [status, setStatus] = useState(EStatus.Ready);
  const [userPublicName, setUserPublicName] = useState<string | undefined>(
    editable.publicName
  );
  const [userIsAdmin, setUserIsAdmin] = useState<boolean>(editable.isAdmin);

  // Handle submit click for "Update user's data"
  const handleUpdateUser = async (event: FormEvent) => {
    event.preventDefault();

    if (userPublicName !== editable.publicName) {
      // Update public name
      updatePublicName(editable._id, userPublicName)
        .then((res) => {
          done(res);
        })
        .catch((err) => {
          console.error(err);
          setStatus(EStatus.Error);
        });
    }
    if (userIsAdmin !== editable.isAdmin) {
      // Update is admin
      setAdmin(editable._id, userIsAdmin)
        .then((res) => {
          done(res);
        })
        .catch((err) => {
          console.error(err);
          setStatus(EStatus.Error);
        });
    }
  };

  const handleDeleteUser = (event: FormEvent) => {
    event.preventDefault();

    // Delete user
    deleteUser(editable._id)
      .then((res) => {
        res._id = "deleted";
        done(res);
      })
      .catch((err) => {
        console.error(err);
        setStatus(EStatus.Error);
      });
  };

  switch (status) {
    case EStatus.Loading:
      return <LoadingScreen />;

    case EStatus.Ready:
      return (
        <Form className="needs-validation my-2 text-center col-lg-8 offset-lg-2">
          <Form.Group className="mb-3">
            <Form.Label>מספר אישי</Form.Label>
            <Form.Control
              disabled
              readOnly
              type="number"
              value={editable.pid}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>מס&apos; אישי מקודד</Form.Label>
            <Form.Control disabled readOnly type="text" value={editable.hash} />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>שם פומבי</Form.Label>
            <Form.Control
              type="text"
              placeholder="אופציונאלי"
              onChange={(e) => setUserPublicName(e.target.value)}
              value={userPublicName}
            />
            <Form.Text className="row justify-content-center">
              שימו לב: משתמש בעל תואר פומבי לא יוכל להישאר אנונימי!
            </Form.Text>
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>הרשאות ניהול</Form.Label>
            <Form.Check
              onChange={(e) => setUserIsAdmin(e.target.checked)}
              checked={userIsAdmin}
            />
          </Form.Group>
          <div className="d-flex justify-content-around">
            <Button variant="success" type="submit" onClick={handleUpdateUser}>
              שמירת שינויים
            </Button>
            <Button variant="outline-info" type="submit" onClick={() => done()}>
              ביטול / יציאה
            </Button>
            <Button variant="danger" type="submit" onClick={handleDeleteUser}>
              מחיקת משתמש
            </Button>
          </div>
        </Form>
      );
    default:
      return (
        <h3>לא הצלחנו לטעון את נתוני הדף הפעם! לא נורא, תמיד יש פעם הבאה ;)</h3>
      );
  }
};

export default connector(EditUserForm);
