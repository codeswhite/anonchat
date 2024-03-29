import React, { FC, useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { connect, ConnectedProps } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { IRootState } from "../../../store";
import EStatus from "../../../../typings/models/estatus";
import { retrievePublicUsers } from "../../../actions/users";
import GridGenerator from "./GridGenerator/GridGenerator";
import LoadingScreen from "../../LoadingScreen/LoadingScreen";
import { formatName } from "../../../utils/formatters";
import { Navigate } from "react-router-dom";

const connector = connect(
  (state: IRootState) => {
    return state;
  },
  {
    retrievePublicUsers,
  }
);

const Home: FC<ConnectedProps<typeof connector>> = ({
  user,
  publicUsers,
  retrievePublicUsers,
}) => {
  const [userPublicName, setIsPublic] = useState("");
  const [status, setStatus] = useState(EStatus.Loading);

  useEffect(() => {
    if (!user._id) return;
    const userPublicName = !user.publicName ? "" : user.publicName;
    setIsPublic(userPublicName);
    if (userPublicName) {
      setStatus(EStatus.Ready);
    } else
      retrievePublicUsers()
        .then(() => {
          setStatus(EStatus.Ready);
        })
        .catch((err) => {
          console.error("[Error] retrieve user failed:");
          console.error(err);
          setStatus(EStatus.Error);
        });
  }, [retrievePublicUsers, user._id, user.publicName]);

  const countMessagesWithParty = (id: string) => {
    const chatsLookup = user.chats.filter((chat) => {
      if (
        (!userPublicName && chat.public.id === id) ||
        (userPublicName && chat.private.id === id)
      )
        return chat;
    });
    return chatsLookup.length ? chatsLookup.at(0)?.messages.length : 0;
  };

  const renderPartiesGrid = (
    parties: { id: string; name: string; pid?: number }[]
  ) => (
    <GridGenerator cols={3}>
      {parties.map((party) => {
        const messageCount = countMessagesWithParty(party.id);
        return (
          <LinkContainer
            style={{ cursor: "pointer" }}
            key={party.id}
            to={"chat/" + party.id}
          >
            <Card className="text-center">
              <Card.Body>
                <Card.Title>{formatName(party.name)}</Card.Title>
                <div className="d-flex justify-content-between">
                  {party.pid ? (
                    <Card.Text className="text-muted">
                      {`מס אישי : ${party.pid}`}
                    </Card.Text>
                  ) : (
                    <></>
                  )}
                  <Card.Text>
                    {!messageCount ? "" : `\n מספר הודעות: ${messageCount}`}
                  </Card.Text>
                </div>
              </Card.Body>
            </Card>
          </LinkContainer>
        );
      })}
    </GridGenerator>
  );

  if (!user._id) return <Navigate to="/login" />;
  switch (status) {
    case EStatus.Ready:
      if (userPublicName) {
        // Public user show all private user chats
        if (!user.chats.length)
          return <h4>עדיין לא שלחו לך הודעות</h4>
        return renderPartiesGrid(user.chats.map((chat) => chat.private));
      } else {
        // Private user show all public users
        if (!publicUsers.length)
          return <h4>עדיין אין משתמשים פומביים במערכת, נא לבקש ממנהל המערכת להגדיר משתמשים פומביים</h4>
        return renderPartiesGrid(
          publicUsers.map((publicUser) => {
            return {
              id: publicUser._id,
              name: publicUser.publicName,
              pid: publicUser.pid,
            };
          })
        );
      }

    case EStatus.Loading:
      return <LoadingScreen />;

    default:
      return (
        <h4>לא הצלחנו לטעון את נתוני הדף הפעם! לא נורא, תמיד יש פעם הבאה ;)</h4>
      );
  }
};

export default connector(Home);
