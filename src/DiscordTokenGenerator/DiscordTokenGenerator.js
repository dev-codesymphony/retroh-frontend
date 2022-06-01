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
      // Step 1: Make a request to Discord's API to get the user's server list
      fetch(`https://discordapp.com/api/users/@me/guilds`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((res) => {
          // Step 2: Check if our server is in the user's server
          const guilds = res.map((guild) => guild.id);

          const SERVER = "844635266009268254";
          const isInGuild = guilds.includes(SERVER);
          if (isInGuild) {
            // Step 3: If we are in the server, get the user's info
            fetch(
              `https://discordapp.com/api/users/@me/guilds/${SERVER}/member`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            )
              .then((res) => res.json())
              .then((res) => {
                // Step 4: Check if the user has a role in our server
                const roles = res.roles;
                const ROLE = "979614481766318140";
                const hasRole = roles.includes(ROLE);
                if (hasRole) {
                  // Step 5: If the user has the role, update in the database
                  fetch(`/users/verifyDiscord`, {
                    body: JSON.stringify({}),
                    headers: {
                      Authorization: `Bearer ${accessToken}`,
                      "Content-Type": "application/json",
                    },
                    method: "PATCH",
                  })
                    .then((res) => res.json())
                    .then((res) => {
                      alert("You have successfully verified your Discord!");
                    })
                    .catch((error) => {
                      console.log(error);
                    });
                } else {
                  alert("You don't have the role!");
                }
              });
          } else {
            // alert the user that they are not in the server
            alert("You are not in the server!");
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
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
          <a href="http://localhost:5000/api/discord/login">
            Login through Discord
          </a>
        )}
      </div>
    </div>
  );
};

export default DiscordTokenGenerator;
