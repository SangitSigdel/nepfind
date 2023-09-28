import styled from "styled-components";

const SelectUserWrapper = styled.div`
  padding-right: 20px;
  p {
    font-size: 18px;
    margin: 0.2em;
  }

  background-color: #3f0e40;
  color: #ffff;
  padding-top: 20px;
  height: calc(100vh - 20px);
  padding-left: 2em;
`;

export const ChatUsers = () => {
  const onlineUsers = [
    {
      user: "Player 1 (yourself)",
      status: "online",
    },
    {
      user: "Player 2",
      status: "online",
    },
    {
      user: "Player 3",
      status: "online",
    },
  ];

  return (
    <SelectUserWrapper>
      {onlineUsers.map((el, index) => (
        <div key={index}>
          <p>{el.user}</p>
          <p style={{ color: "#d1d1d1", marginBottom: "20px" }}>{el.status}</p>
        </div>
      ))}
    </SelectUserWrapper>
  );
};
