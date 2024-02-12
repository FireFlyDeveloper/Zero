const cron = require('node-cron');
const { load_friends } = require("../system/load");
const fs = require("fs").promises;

module.exports = async function ({ api }) {
  const config_json = await fs.readFile("config.json", "utf8");
  const config = {
    acceptPending: {
      status: JSON.parse(config_json).auto_accept,
      time: 30,
      note: 'Approve waiting messages after a certain time, time based on minute.',
      author: 'Saludes, Kim Eduard'
    },
  };


  function acceptPending(config) {
    if (config.status) {
      cron.schedule(`*/${config.time} * * * *`, async () => {
        const form = {
          av: api.getCurrentUserID(),
          fb_api_req_friendly_name: "FriendingCometFriendRequestsRootQueryRelayPreloader",
          fb_api_caller_class: "RelayModern",
          doc_id: "4499164963466303",
          variables: JSON.stringify({ input: { scale: 3 } })
        };
        const listRequest = JSON.parse(await api.httpPost("https://www.facebook.com/api/graphql/", form)).data.viewer.friending_possibilities.edges;
        if (listRequest[0]) {
          const _form = {
            av: api.getCurrentUserID(),
            fb_api_caller_class: "RelayModern",
            variables: {
              input: {
                source: "friends_tab",
                actor_id: api.getCurrentUserID(),
                client_mutation_id: Math.round(Math.random() * 19).toString()
              },
              scale: 3,
              refresh_num: 0
            }
          };

          const success = [];
          const failed = [];

          _form.fb_api_req_friendly_name = "FriendingCometFriendRequestConfirmMutation";
          _form.doc_id = "3147613905362928";

          let targetIDs = [];
          const lengthList = listRequest.length;
          for (let i = 1; i <= lengthList; i++) targetIDs.push(i);

          const newTargetIDs = [];
          const promiseFriends = [];

          for (const stt of targetIDs) {
            const u = listRequest[parseInt(stt) - 1];
            if (!u) {
              failed.push(`Can't find stt ${stt} in the list`);
              continue;
            }
            _form.variables.input.friend_requester_id = u.node.id;
            _form.variables = JSON.stringify(_form.variables);
            newTargetIDs.push(u);
            promiseFriends.push(api.httpPost("https://www.facebook.com/api/graphql/", _form));
            _form.variables = JSON.parse(_form.variables);
          }

          const lengthTarget = newTargetIDs.length;
          for (let i = 0; i < lengthTarget; i++) {
            try {
              const friendRequest = await promiseFriends[i];
              if (JSON.parse(friendRequest).errors) failed.push(newTargetIDs[i].node.name);
              else success.push(newTargetIDs[i].node.name);
            }
            catch (e) {
              failed.push(newTargetIDs[i].node.name);
            }
          }

          let _names = '==👾Auto-Accepted👾==';
          let i = 0;
          for (const user of listRequest) {
            i++;
            api.sendMessage(`You have been approved for the queue. (This is an automated message)`, user.node.id);
            _names += (`\n${i}. Name: ${user.node.name}` + `\nID: ${user.node.id}` + `\nUrl: ${user.node.url.replace("www.facebook", "fb")}`);
          }
          load_friends({ api });
        }
      });
    }
  }

  acceptPending(config.acceptPending);
}