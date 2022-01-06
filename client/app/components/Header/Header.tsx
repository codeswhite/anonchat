import React, { FC } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import { connect, ConnectedProps } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { IRootState } from "../../store";

const connector = connect((store: IRootState) => {
  return { user: store.user };
}, {});

export const Header: FC<ConnectedProps<typeof connector>> = ({ user }) => {
  return (
    <header>
      <Navbar bg="dark" variant="dark">
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>פניות מפקדים כנף 4</Navbar.Brand>
          </LinkContainer>
          <div className="d-flex flex-row-reverse justify-content-end">
            <LinkContainer to="/">
              <Button variant="outline-info" className="ms-3">
                ראשי
              </Button>
            </LinkContainer>
            {user.isAdmin ? (
              <LinkContainer to="/admin">
                <Button variant="outline-warning" className="ms-3">
                  ניהול
                </Button>
              </LinkContainer>
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
