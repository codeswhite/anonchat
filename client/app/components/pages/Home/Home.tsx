import React, { FC, useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { connect, ConnectedProps } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { IRootState } from "../../../store";
import EStatus from "../../../../typings/models/estatus";
import { retrievePublicUsers, retrieveUser } from "../../../actions/users";
import GridGenerator from "./GridGenerator/GridGenerator";
import LoadingScreen from "../../LoadingScreen/LoadingScreen";
import { formatName } from "../../../utils/formatters";

const HARD_USER = 8507102;

const connector = connect(
  (state: IRootState) => {
    return state;
  },
  {
    retrieveUser,
    retrievePublicUsers,
  }
);

const Home: FC<ConnectedProps<typeof connector>> = ({
  user,
  publicUsers,
  retrieveUser,
  retrievePublicUsers,
}) => {
  const [userPublicName, setIsPublic] = useState("");
  const [status, setStatus] = useState(EStatus.Loading);

  useEffect(() => {
    retrieveUser(HARD_USER)
      .then((user) => {
        const userPublicName = !user.publicName ? "" : user.publicName;
        setIsPublic(userPublicName);
        if (!userPublicName) return retrievePublicUsers();
      })
      .then(() => {
        setStatus(EStatus.Ready);
      })
      .catch((err) => {
        console.error("[Error] retrieve user failed:");
        console.error(err);
        setStatus(EStatus.Error);
      });
  }, [retrievePublicUsers, retrieveUser]);

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

  switch (status) {
    case EStatus.Ready:
      return (
        <div className="mt-4">
          {userPublicName
            ? // Public user show all private user chats
              renderPartiesGrid(user.chats.map((chat) => chat.private))
            : // Private user show all public users
              renderPartiesGrid(
                publicUsers.map((publicUser) => {
                  return {
                    id: publicUser._id,
                    name: publicUser.publicName,
                    pid: publicUser.pid,
                  };
                })
              )}
        </div>
      );

    case EStatus.Loading:
      return <LoadingScreen />;

    default:
      return (
        <h3>לא הצלחנו לטעון את נתוני הדף הפעם! לא נורא, תמיד יש פעם הבאה ;)</h3>
      );
  }
};

export default connector(Home);
