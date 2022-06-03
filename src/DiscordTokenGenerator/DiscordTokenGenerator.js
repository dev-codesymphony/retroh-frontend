import React, { useEffect } from "react";

const qs = (key) => {
  key = key.replace(/[*+?^$.[\]{}()|\\/]/g, "\\$&"); // escape RegEx meta chars
  const match = window.location.search.match(
    new RegExp(`[?&]${key}=([^&]+)(&|$)`)
  );
  return match && decodeURIComponent(match[1].replace(/\+/g, " "));
};

const DiscordTokenGenerator = ({ accessToken }) => {
  useEffect(() => {
    const token = qs("token");
    if (token) {
      fetch(`/users/verifyDiscord`, {
        body: JSON.stringify({
          token,
        }),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        method: "POST",
      })
        .then((res) => res.json())
        .then((res) => {
          alert("You have successfully verified your Discord!");
        })
        .catch((error) => {
          alert(error.message);
        });
    }
    // eslint-disable-next-line
  }, [qs]);

  return (
    <div>
      <div>Get Discord Token</div>
      <div>
        {(qs("token") && (
          <div>
            <div>Your token</div>
            <div>{qs("token")}</div>
            <div>Scope</div>
            <div>identify</div>
          </div>
        )) || (
          <a href={`${process.env.REACT_APP_BACKEND_URL}/api/discord/login`}>
            Login through Discord
          </a>
        )}
      </div>
    </div>
  );
};

export default DiscordTokenGenerator;
