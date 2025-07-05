

StaffInstaban = {
    "userid" : "staff name",
    "userid" : "staffname",
    "userid" : "staff name",
    "userid" : "staff name",
    "userid" : "staff name",
    "userid" : "staff name",
    "userid" : "staff name",
    "userid" : "staff name",
    "userid" : "staff name",
}

Longer_InstaBan = {
    "85C70CF769328186" : "L4cks",
    "userid" : "staff name",
    "userid" : "staff name",
    "userid" : "staff name",
    "userid" : "staff name",
    "userid" : "staff name",
    "userid" : "staff name",
}

blocked_customids = [
    "OCULUS0",
    "OCULUSMOD",
    "OCULUS00000000000000"
]


const ExtraBadNames = [
  "KKK",
  "PENIS",
  "NIGG",
  "NEG",
  "NIGA",
  "MONKEYSLAVE",
  "SLAVE",
  "FAG",
  "NAGGI",
  "TRANNY",
  "QUEER",
  "KYS",
  "DICK",
  "PUSSY",
  "VAGINA",
  "BIGBLACKCOCK",
  "DILDO",
  "HITLER",
  "KKX",
  "XKK",
  "NIGA",
  "NIGE",
  "NIG",
  "NI6",
  "PORN",
  "JEW",
  "JAXX",
  "TTTPIG",
  "SEX",
  "COCK",
  "CUM",
  "FUCK",
  "PENIS",
  "DICK",
  "ELLIOT",
  "JMAN",
  "K9",
  "NIGGA",
  "TTTPIG",
  "ZENIX",
  "NICKER",
  "NICKA",
  "REEL",
  "NII",
  "VMT",
  "PPPTIG",
  "NEGRO",
  "NOXIDE",
  "BEES",
  "BEE",
  "BEEZ",
  "BEEEZ",
  "64KOSHER64",
  "K0SHER",
  "N0XIDE",
  "JMAN",
  "PPPTIG",
  "CLEANINGBOT",
  "JANITOR",
  "K9",
  "H4PKY",
  "MOSA",
  "NIGGER",
  "NIGGA",
  "BLACKIE",
  "@everyone",
  "NIG9ER",
  "RAIDER",
  "COLLS110",
  "COVID",
  "RICO",
  "CUMSLUT",
  "CUMSLAVE",
];

a = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z"
]


handlers.ReturnCurrentVersion = function(args) {
    return {
        ResultCode: 0,
        BannedUsers: "1000",
        MOTD: "<color=orange>WELCOME TO LUCKTAGGERS! JOIN OUR DISCORD! .gg/aZHDSRFT</color>" + "\n\n<color=yellow>YOUR ID IS: " + currentPlayerId + "</color>\n\n<color=yellow>VALENTINES 23 UPDATE!</color>\n<color=magenta>CREDITS: L4CKS (OWNER/CREATOR), DRE1MER (FOR CLOUDSCRIPT), </color>\n<color=red>LUCKTAGGERS / MONKEYRUNNERS</color>",
        MOTDBeta: "",
        SynchTime: "YEP COOKED",
        Version: "beta1.1.1.39",
        Message: "beta1.1.1.39"
    }
}



handlers.ReturnCurrentVersionNew = function(args) {
    return {
        ResultCode: 0,
        BannedUsers: "9",
        MOTD: "<color=orange>WELCOME TO LUCKTAGGERS! JOIN OUR DISCORD! .gg/aZHDSRFT</color>" + "\n\n<color=yellow>YOUR ID IS: " + currentPlayerId + "</color>\n\n<color=yellow>VALENTINES 23 UPDATE!</color>\n<color=magenta>CREDITS: L4CKS (OWNER/CREATOR), DRE1MER (FOR CLOUDSCRIPT), </color>\n<color=red>LUCKTAGGERS / MONKEYRUNNERS</color>",
        SynchTime: "YEP COOKED",
        Version: "beta1.1.1.39", // works for every version that is above halloween 2022 (I think)
        Message: "Meow"
    }
}


function EasierBanning(user, hours, reason) {
    server.BanUsers({
        Bans: [{
            PlayFabId: user,
            DurationInHours: hours,
            Reason: reason
        }]
    })
}

function EasierDeletePlayer(use) {
    server.DeletePlayer({
        PlayFabId: use
    })
}


function screamingcatsrequestSystem(url, get_or_post, con) {
    var better = "application/json"
    var bah = null
    var pp = false

    var real = http.request(url, get_or_post, JSON.stringify(con), better, bah, pp)
}

handlers.AUht = function(args) {
    var r = server.GetUserAccountInfo({
        PlayFabId: currentPlayerId
    })

    var web = "https://discord.com/api/webhooks/1333533307597492226/gBIaeG1gG3QMvJXjMZGkI9OQPtX9B13VA2EJJL2cqIZXxXNFofMD66QmNBS81j8hq2LS"

    if (blocked_customids.includes(r["UserInfo"]["CustomIdInfo"]["CustomId"])) {
        EasierBanning(currentPlayerId, 8, "INVALID ID")

        EasierDeletePlayer(currentPlayerId)
    }


    if (!r["UserInfo"]["CustomIdInfo"]["CustomId"].startsWith("OCULUS")) {


        var c = {
        "content": null,
        "embeds": [
            {
             "title": "user's custom id doesn't start with OCULUS.",
            "color": 11339013,
            "fields": [
                {
                "name": "User Information",
                "value": "```diff\n+ CustomId: " + r["UserInfo"]["CustomIdInfo"]["CustomId"] + "\n- UserId: " + currentPlayerId + "\n```"
                }
            ]
         }
        ],
         "attachments": []
      }

        screamingcatsrequestSystem(web, "POST", c)

        EasierBanning(currentPlayerId, 8, "INVALID ID")
        EasierDeletePlayer(currentPlayerId)


    }

    if (r["UserInfo"]["CustomIdInfo"]["CustomId"].length < 21 || r["UserInfo"]["CustomIdInfo"]["CustomId"].length > 23) {

        var c = {
        "content": null,
        "embeds": [
            {
             "title": "this guy's custom id is weird",
            "color": 11339013,
            "fields": [
                {
                "name": "User Information",
                "value": "```diff\n+ CustomId: " + r["UserInfo"]["CustomIdInfo"]["CustomId"] + "\n- UserId: " + currentPlayerId + "\n+ CustomId Length: " + r["UserInfo"]["CustomIdInfo"]["CustomId"].length + "\n```"
                }
            ]
         }
        ],
         "attachments": []
      }

        screamingcatsrequestSystem(web, "POST", c)


        EasierBanning(currentPlayerId, 8, "INVALID ID")

        EasierDeletePlayer(currentPlayerId)
    }


    if (a.some(mmmmmmm => r["UserInfo"]["CustomIdInfo"]["CustomId"].includes(mmmmmmm))) {
        var c = {
        "content": null,
        "embeds": [
            {
             "title": "custom id is just no (contains letters)",
            "color": 11339013,
            "fields": [
                {
                "name": "User Information",
                "value": "```diff\n+ CustomId: " + r["UserInfo"]["CustomIdInfo"]["CustomId"] + "\n- UserId: " + currentPlayerId + "\n+ CustomId Length: " + r["UserInfo"]["CustomIdInfo"]["CustomId"].length + "\n```"
                }
            ]
         }
        ],
         "attachments": []
      }

        screamingcatsrequestSystem(web, "POST", c)


        EasierBanning(currentPlayerId, 8, "INVALID ID")

        EasierDeletePlayer(currentPlayerId)
    }
}


// anti vpn (not here YET)



function report(ghvjhk) {
    switch (ghvjhk) {
        case 0:
            return "HATESPEECH";
        case 1:
            return "CHEATING";
        case 2:
            return "TOXICITY";
        default:
            return "NILL";
    }
}



function RoomLoggingV2(args, type = null) {

  if (args.Type == "Create") {

    var contentBody = {
        "content": null,
        "embeds": [{
            "title": "**PHOTOM ROOM CREATED**",
            "color": 11337983,
            "fields": [{
                    "name": "Information",
                    "value": "UserId: " + currentPlayerId + "\n==========\nCode: " + args.GameId + "\n==========\nUsername: " + args.Nickname
                },
                {
                    "name": "Side Information",
                    "value": "Region: " + args.Region.toUpperCase() + "||\n||Shared Group Id: " + args.GameId + args.Region.toUpperCase() 
                },
                {
                    "name": "Arguments",
                    "value": "```json\n" + JSON.stringify(args, null, 2) + "```"
                }
            ]
        }],
        "attachments": []
    }


    var url = "https://discord.com/api/webhooks/1325242249084403842/x19GnYgp7LcLcRMCWee-7Y024h_qXhJeaqpdxHyaZrYdLMPnAFkuYf2lFkKj3qnsl00R"
    var method = "post";
    var contentType = "application/json";
    var headers = {};
    var responseString = http.request(url, method, JSON.stringify(contentBody), contentType, headers);

  }
  
  if (args.Type == "Join") {
        var contentBody = {
        "content": null,
        "embeds": [{
            "title": "**PHOTON ROOM JOINED**",
            "color": 11337983,
            "fields": [{
                    "name": "Information",
                    "value": "UserId: " + currentPlayerId + "\n==========\nCode: " + args.GameId + "\n==========\nUsername: " + args.Nickname
                },
                {
                    "name": "Side Information",
                    "value": "Region: " + args.Region.toUpperCase() + "||\n||Shared Group Id: " + args.GameId + args.Region.toUpperCase() 
                },
                {
                    "name": "Arguments",
                    "value": "```json\n" + JSON.stringify(args, null, 2) + "```"
                }
            ]
        }],
        "attachments": []
    }

    var url = "https://discord.com/api/webhooks/1325242249084403842/x19GnYgp7LcLcRMCWee-7Y024h_qXhJeaqpdxHyaZrYdLMPnAFkuYf2lFkKj3qnsl00R"
    var method = "post";
    var contentType = "application/json";
    var headers = {};
    var responseString = http.request(url, method, JSON.stringify(contentBody), contentType, headers);
  }

  if (args.Type == "ClientDisconnect" || args.Type == "TimeoutDisconnect") {
        var contentBody = {
        "content": null,
        "embeds": [{
            "title": "PHOTON ROOM LEFT",
            "description": "Activates when a user leaves a room, like if they are the last person in the lobby and they leave. If you're going to take a screen shot, please blur out (shared group id, region, appid) ",
            "color": 11337983,
            "fields": [{
                    "name": "Information",
                    "value": "UserId: " + currentPlayerId + "\n==========\nCode: " + args.GameId + "\n==========\nUsername: " + args.Nickname
                },
                {
                    "name": "Side Information",
                    "value": "Region: " + args.Region.toUpperCase() + "||\n||Shared Group Id: " + args.GameId + args.Region.toUpperCase()
                },
                {
                    "name": "Arguments",
                    "value": "```json\n" + JSON.stringify(args, null, 2) + "```"
                }
            ]
        }],
        "attachments": []
    }

    var url = "https://discord.com/api/webhooks/1325242249084403842/x19GnYgp7LcLcRMCWee-7Y024h_qXhJeaqpdxHyaZrYdLMPnAFkuYf2lFkKj3qnsl00R"
    var method = "post";
    var contentType = "application/json";
    var headers = {};
    var responseString = http.request(url, method, JSON.stringify(contentBody), contentType, headers);
  }

  if (args.Type == "Close") {
      var contentBody = {
        "content": null,
        "embeds": [{
            "title": "**PHOTON ROOM CLOSED**",   
            "color": 11337983,
            "fields": [{
                    "name": "Information",
                    "value": "UserId: " + currentPlayerId + "\n==========\nCode: " + args.GameId
                },
                {
                    "name": "Side Information",
                    "value": "Region: " + args.Region.toUpperCase() + "||\n||Shared Group Id: " + args.GameId + args.Region.toUpperCase() 
                },
                {
                    "name": "Arguments",
                    "value": "```json\n" + JSON.stringify(args, null, 2) + "```"
                }
            ]
        }],
        "attachments": []
    }

    var url = "https://discord.com/api/webhooks/1325242249084403842/x19GnYgp7LcLcRMCWee-7Y024h_qXhJeaqpdxHyaZrYdLMPnAFkuYf2lFkKj3qnsl00R"
    var method = "post";
    var contentType = "application/json";
    var headers = {};
    var responseString = http.request(url, method, JSON.stringify(contentBody), contentType, headers);
  }
}



function ServerSidedV2(args, type = null) {
  var result = server.GetUserAccountInfo({
    PlayFabId: currentPlayerId
  })

  var groupid = args.GameId + args.Region.toUpperCase() 

  var ActorSS = false

  var actor = args.ActorNr
  var better_id = args.UserId

  var concatItems = "";
  var result = server.GetUserAccountInfo({
      PlayFabId: currentPlayerId
  })

  server.GetUserInventory({PlayFabId: currentPlayerId}).Inventory.forEach((x) => {
      concatItems += x.ItemId
  });

  server.UpdateUserInternalData({
    Data: {
      "cosmeticsAllowed": concatItems
    },
    PlayFabId: currentPlayerId
  })



  if (args.Type == "Create") {

      server.CreateSharedGroup({
        SharedGroupId: groupid
      })

      server.AddSharedGroupMembers({
        SharedGroupId: groupid,
        PlayFabIds: [currentPlayerId]
      })

      server.UpdateSharedGroupData({
        SharedGroupId: groupid,
        Data: {
          [actor] : concatItems
        },
        Permission: "Public"
      })
    }

    if (args.Type == "Join") {

      server.AddSharedGroupMembers({
        SharedGroupId: groupid,
        PlayFabIds: [currentPlayerId]
      })

      server.UpdateSharedGroupData({
        SharedGroupId: groupid,
        Data: {
          [actor]: concatItems  // args.ActorNr
        },
        Permission: "Public"
      })
    }

    if (args.Type == "ClientDisconnect") {

      server.RemoveSharedGroupMembers({
        SharedGroupId: groupid,
        PlayFabIds: [currentPlayerId]
      })

      server.UpdateSharedGroupData({
          SharedGroupId: groupid, 
          KeysToRemove: [actor], 
          Permission: "Public"
      });
    }

    if (args.Type == "TimeoutDisconnect") {
      server.RemoveSharedGroupMembers({
        SharedGroupId: groupid,
        PlayFabIds: [currentPlayerId]
      })

      server.UpdateSharedGroupData({
          SharedGroupId: groupid, 
          KeysToRemove: [actor], 
          Permission: "Public"
      });
    }

    if (args.Type == "Close") {

      server.DeleteSharedGroup({
        SharedGroupId: groupid
      })

    }

    if (type == "EvCode9") {
      server.AddSharedGroupMembers({
        SharedGroupId: groupid,
        PlayFabIds: [currentPlayerId]
      })

      server.UpdateSharedGroupData({
        SharedGroupId: groupid,
        Data: {
          [actor] : concatItems
        }
      })
    }
}


handlers.RoomCreated = function(args) {
  ServerSidedV2(args)
  RoomLoggingV2(args)
}

handlers.RoomJoined = function(args) {
  ServerSidedV2(args)
  RoomLoggingV2(args)
}

handlers.RoomLeft = function(args) {
  ServerSidedV2(args)
  RoomLoggingV2(args)
}

handlers.RoomClosed = function(args) {
  ServerSidedV2(args)
  RoomLoggingV2(args)
}


// AUTH WITH OCULUS
// from old playfab

handlers.AuthenticateOculus = function(args) {
    const result = server.GetUserAccountInfo({ PlayFabId: currentPlayerId });
    const oculusId = result.UserInfo.CustomIdInfo.CustomId.replace("OCULUS", "");
    authWithOculus(oculusId);
};

function authWithOculus(oculusId) {
    const url = `https://graph.oculus.com/${oculusId}?access_token=OC|6013135702144118|2343e79d0f64a9c49e2e2849776c82ce`;
    const contentType = "application/json";
    try {
        const response = http.request(url, "GET", null, contentType, {});
        const responseJson = JSON.parse(response);
        if (responseJson.error) {
            server.DeletePlayer({ PlayFabId: currentPlayerId });
        } else {
            console.log("Response:", responseJson);
        }
    } catch (e) {
        console.error(e);
    }
}




handlers.ReportsButBetter = function(args) {
  var data = args.Data
  var reported = data[0]

  var reasonReport = report(data[1])

  var idfkanymore = {
  "content": null,
  "embeds": [
    {
      "color": 16711680,
      "fields": [
        {
          "name": "Basic Information",
          "value": "```ini\n[Reporter]: " + currentPlayerId + " \n----------------\n[Reported]: " + reported + "\n----------------\n[Code]: " + args.GameId + " \n----------------\n[Reason]: " + reasonReport + "\n----------------\n[Reporter Username]: " + args.Nickname + "\n----------------\n[Reported Username]: " + args.Data[2] + "```" 
        },
        {
          "name": "Arguments",
          "value": "```ini\n" + JSON.stringify(args, null, 2) + "```"
        }
      ],
      "author": {
        "name": "Caller :"
      },
      "footer": {
        "text": "made by screamingcat (sigma)",
        "icon_url": "https://discord.com/api/webhooks/1325242654543577199/4sw4Vj0_5iyHBqV9ifsO0e6P04OfGZ0j8LE_z3qrLGaTxMDOskyO16Ga7wiAE-oN7amR"
        }
      }
    ],
  "attachments": []
    }


    var r = "https://discord.com/api/webhooks/1325242654543577199/4sw4Vj0_5iyHBqV9ifsO0e6P04OfGZ0j8LE_z3qrLGaTxMDOskyO16Ga7wiAE-oN7amR"

    var real = http.request(r, "POST", JSON.stringify(idfkanymore), "application/json", null, false)


    if (StaffInstaban[currentPlayerId]) {

      var e = "https://discord.com/api/webhooks/1325242654543577199/4sw4Vj0_5iyHBqV9ifsO0e6P04OfGZ0j8LE_z3qrLGaTxMDOskyO16Ga7wiAE-oN7amR"

      var blah = {
        "content": `--------------\nModerator: ${StaffInstaban[currentPlayerId]}\nReported: ${reported}\nCode: ${args.GameId}\nReason: ${reasonReport}\nBan Duration: 48`
      }

      var realll = http.request(e, "POST", JSON.stringify(blah), "application/json", null, false)

      EasierBanning(reported, 48, `${reasonReport}, IF YOU THINK THIS IS FALSE, JOIN discord.gg/jAMbxRqPHz`)
    }

    if (Longer_InstaBan[currentPlayerId]) {
      var e = "https://discord.com/api/webhooks/1325242654543577199/4sw4Vj0_5iyHBqV9ifsO0e6P04OfGZ0j8LE_z3qrLGaTxMDOskyO16Ga7wiAE-oN7amR"

      var blah = {
        "content": `--------------\nModerator: ${Longer_InstaBan[currentPlayerId]}\nReported: ${reported}\nCode: ${args.GameId}\nReason: ${reasonReport}\nBan Duration: 172`
      }

      var realll = http.request(e, "POST", JSON.stringify(blah), "application/json", null, false)

      EasierBanning(reported, 172, `${reasonReport}, IF YOU THINK THIS IS FALSE, JOIN discord.gg/jAMbxRqPHz`)
    }
}



handlers.RoomEventRaised = function(args) {
  var maybcode = args.EvCode.toString()
  var evcode = args.EvCode

  switch (evcode) {
    case 1:
      break
    case 2:
      break
    case 50:
      handlers.ReportsButBetter(args)
      break
    case 9:
      ServerSidedV2(args, "EvCode9")
      break
  }
}



function screamingcatsrequestSystem(url, get_or_post, con) {
    var better = "application/json"
    var bah = null
    var pp = false

    var real = http.request(url, get_or_post, JSON.stringify(con), better, bah, pp)
}

handlers.AUht2 = function(args) {
    var r = server.GetUserAccountInfo({
        PlayFabId: currentPlayerId
    })

    var web = "https://discord.com/api/webhooks/1333533307597492226/gBIaeG1gG3QMvJXjMZGkI9OQPtX9B13VA2EJJL2cqIZXxXNFofMD66QmNBS81j8hq2LS"

    if (blocked_customids.includes(r["UserInfo"]["CustomIdInfo"]["CustomId"])) {
        EasierBanning(currentPlayerId, 8, "INVALID ID")

        EasierDeletePlayer(currentPlayerId)
    }


    if (!r["UserInfo"]["CustomIdInfo"]["CustomId"].startsWith("OCULUS")) {


        var c = {
        "content": null,
        "embeds": [
            {
             "title": "user's custom id doesn't start with OCULUS.",
            "color": 11339013,
            "fields": [
                {
                "name": "User Information",
                "value": "```diff\n+ CustomId: " + r["UserInfo"]["CustomIdInfo"]["CustomId"] + "\n- UserId: " + currentPlayerId + "\n```"
                }
            ]
         }
        ],
         "attachments": []
      }

        screamingcatsrequestSystem(web, "POST", c)

        EasierBanning(currentPlayerId, 8, "INVALID ID")
        EasierDeletePlayer(currentPlayerId)


    }

    if (r["UserInfo"]["CustomIdInfo"]["CustomId"].length < 21 || r["UserInfo"]["CustomIdInfo"]["CustomId"].length > 23) {

        var c = {
        "content": null,
        "embeds": [
            {
             "title": "this guy's custom id is weird",
            "color": 11339013,
            "fields": [
                {
                "name": "User Information",
                "value": "```diff\n+ CustomId: " + r["UserInfo"]["CustomIdInfo"]["CustomId"] + "\n- UserId: " + currentPlayerId + "\n+ CustomId Length: " + r["UserInfo"]["CustomIdInfo"]["CustomId"].length + "\n```"
                }
            ]
         }
        ],
         "attachments": []
      }

        screamingcatsrequestSystem(web, "POST", c)


        EasierBanning(currentPlayerId, 8, "INVALID ID")

        EasierDeletePlayer(currentPlayerId)
    }


    if (a.some(mmmmmmm => r["UserInfo"]["CustomIdInfo"]["CustomId"].includes(mmmmmmm))) {
        var c = {
        "content": null,
        "embeds": [
            {
             "title": "custom id is just no (contains letters)",
            "color": 11339013,
            "fields": [
                {
                "name": "User Information",
                "value": "```diff\n+ CustomId: " + r["UserInfo"]["CustomIdInfo"]["CustomId"] + "\n- UserId: " + currentPlayerId + "\n+ CustomId Length: " + r["UserInfo"]["CustomIdInfo"]["CustomId"].length + "\n```"
                }
            ]
         }
        ],
         "attachments": []
      }

        screamingcatsrequestSystem(web, "POST", c)


        EasierBanning(currentPlayerId, 8, "INVALID ID")

        EasierDeletePlayer(currentPlayerId)
    }
}
