import React, { FC } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { connect, ConnectedProps } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { NavLink } from "react-router-dom";
import { IRootState } from "../../store";
import { formatName } from "../../utils/formatters";

const connector = connect((store: IRootState) => {
  return { user: store.user };
}, {});

export const Header: FC<ConnectedProps<typeof connector>> = ({ user }) => {
  return (
    <header>
      <Navbar bg="dark" variant="dark">
        <Container>
          <div className="d-flex justify-content-start">
            <LinkContainer to="/">
              <Navbar.Brand>פניות מפקדים כנף 4</Navbar.Brand>
            </LinkContainer>
            {user._id ? (
              <Navbar.Text>{`מזהה משתמש: ${formatName(
                user.publicName ? user.publicName : user.hash
              )}`}</Navbar.Text>
            ) : (
              <></>
            )}
          </div>
          <div className="d-flex flex-row-reverse justify-content-end">
            <LinkContainer to="/">
              <Button variant="outline-info" className="ms-3">
                ראשי
              </Button>
            </LinkContainer>
            {user.isAdmin ? (
              <>
                <LinkContainer to="/admin">
                  <Button variant="outline-warning" className="ms-3">
                    ניהול משתמשים
                  </Button>
                </LinkContainer>
                <NavLink to="/login" state={{ manualLogin: true }}>
                  <Button variant="outline-warning" className="ms-3">
                    כניסה יזומה למשתמש אחר
                  </Button>
                </NavLink>
                <Navbar.Text className="text-warning">
                  {`מספר אישי נוכחי: ${user.pid}`}
                </Navbar.Text>
              </>
            ) : (
              <></>
            )}
          </div>
        </Container>
      </Navbar>
    </header>
  );
};

export default connector(Header);
