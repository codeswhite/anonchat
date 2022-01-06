import React, { ChangeEvent, FC, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { connect, ConnectedProps } from "react-redux";
import { useMatch } from "react-router";
import { IRootState } from "../../../store";
import { sendMessage } from "../../../actions/chats";
import EStatus from "../../../../typings/models/estatus";
import User from "../../../../typings/models/user";
import LoadingScreen from "../../LoadingScreen/LoadingScreen";
import { getUserById } from "../../../services/user.service";

import "./ChatPage.css";
import Chat from "../../../../typings/models/chat";
import { formatDate, formatName } from "../../../utils/formatters";

const connector = connect(
  (state: IRootState) => {
    return {
      user: state.user,
    };
  },
  {
    sendMessage,
  }
);

const ChatPage: FC<ConnectedProps<typeof connector>> = ({
  user,
  sendMessage,
}) => {
  const [status, setStatus] = useState(EStatus.Loading);
  const [party, setParty] = useState<User | undefined>();
  const [chat, setChat] = useState<Chat | undefined>();
  const [awaitingResponse, setAwaitingResponse] = useState(false);

  // States for the "send message" form
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const match = useMatch("/chat/:partyId");
  const partyId = match?.params.partyId;
  if (match === null || !partyId) {
    // ERRORR
    console.error("[ERROR] Invalid match!!");
    setStatus(EStatus.Error);
  }

  useEffect(() => {
    if (!partyId) return;
    getUserById(partyId)
      .then((res) => {
        setParty(res.data);

        // Load chat
        user.chats.forEach((ichat) => {
          if (
            (user.publicName && ichat.private.id === res.data._id) ||
            (!user.publicName && ichat.public.id === res.data._id)
          ) {
            setChat(ichat);
            // Check who sent the last message
            const lastSenderName = ichat.messages.at(-1)?.from;
            const userSentLast =
              (user.publicName && lastSenderName === user.publicName) ||
              (!user.publicName && lastSenderName === user.hash);
            setAwaitingResponse(userSentLast);
          }
        });

        setStatus(EStatus.Ready);
      })
      .catch((err) => {
        console.error(err);
        setStatus(EStatus.Error);
      });
  }, [partyId, user.chats, user.hash, user.publicName]);

  const doSendMessage = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    setSubmitted(true);
    if (title === "" || text === "") return;

    if (!party) return console.error("[Error] party is undefined!!");
    const isPublic = user.publicName && user.publicName.length > 0;
    const privateId = isPublic ? party._id : user._id;
    const publicId = isPublic ? user._id : party._id;

    if (!match) {
      console.error("[ChatPage] Error no props.match!!");
      return;
    }

    sendMessage(
      privateId,
      publicId,
      isPublic ? user.pid.toString() : user.hash,
      title,
      text
    )
      .then((res) => {
        setChat(res.newChat);
        // setSubmitted(false);
        // setText("");
        setAwaitingResponse(true);
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
      return !party ? (
        <></>
      ) : (
        <>
          {chat ? (
            <>
              <h5 className="text-center">
                {"שיחה עם " +
                  formatName(party.publicName ? party.publicName : party.hash)}
              </h5>
              <ul className="chat">
                {chat?.messages.map((message, idx) => (
                  <li key={idx}>
                    <div className="chat-body d-flex flex-column">
                      <p className="text-muted mb-1">
                        {`[ ${formatDate(message.date)} ]`}
                      </p>
                      <p className="mb-0 text-muted">
                        {"מאת: "}
                        <strong className="text-dark">
                          {formatName(message.from)}
                        </strong>
                      </p>
                      <p className="text-muted">
                        {"נושא: "}
                        <strong className="text-dark">{message.title}</strong>
                      </p>
                      <p>{message.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <h5>
              {"עדיין אין לך הודעות עם " +
                formatName(party.publicName ? party.publicName : party.hash)}
            </h5>
          )}
          <hr />
          {awaitingResponse ? (
            <>
              <h6 className="p-3">
                יש להמתין לתשובת הנמען כדי לשלוח הודעה נוספת
              </h6>
            </>
          ) : (
            <Form className="needs-validation">
              <Form.Group className="mb-3">
                <Form.Label>נושא ההודעה</Form.Label>
                <Form.Control
                  isInvalid={submitted && title === ""}
                  required
                  as="select"
                  onChange={(
                    e: ChangeEvent<HTMLInputElement & HTMLSelectElement>
                  ) => {
                    setTitle(
                      e.target.selectedIndex === 0
                        ? ""
                        : e.target.options[e.target.selectedIndex].text
                    );
                  }}
                >
                  <option value="">נא לבחור נושא</option>
                  <option value="o1">נושא קצר</option>
                  <option value="o2">
                    נושא ארוך מאוד מאוווווווד מאודד מאוד
                  </option>
                </Form.Control>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label className="text-muted">
                  ההודעה נשלחת באופן אנונימי
                </Form.Label>
                <Form.Control
                  className={submitted && text === "" ? "is-invalid" : ""}
                  required
                  as="textarea"
                  rows={8}
                  placeholder="גוף ההודעה"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
              </Form.Group>
              <Form.Label className="text-muted d-flex">
                שימו לב: אחרי שליחת ההודעה לא תוכלו לשלוח הודעה נוספת עד לקבלת
                תשובה מהנמען, לא תהיה אפשרות לערוך או למחוק הודעות.
              </Form.Label>
              <Button
                className="mt-2 mb-5"
                variant="primary"
                type="submit"
                onClick={doSendMessage}
              >
                שלח הודעה
              </Button>
            </Form>
          )}
        </>
      );
    default:
      return (
        <h3>לא הצלחנו לטעון את נתוני הדף הפעם! לא נורא, תמיד יש פעם הבאה ;)</h3>
      );
  }
};

export default connector(ChatPage);
