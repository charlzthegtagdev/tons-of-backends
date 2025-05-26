const Instaban = [
"PLAYERID1", //KANYE WEST
"PLAYERID2" //YE
]

function ReportButtonNames(intButton) {
    switch (intButton) {
        case 0:
            return "HATE SPEECH.";
        case 1:
            return "CHEATING.";
        case 2:
            return "TOXICITY.";
        default:
            return "NOT ASSIGNED.";
    }
}


function CySided(args, type = null) {
    var newSS = true;

    const SharedGroupId = args.GameId + args.Region.toUpperCase();
    
    let concatItems = GetPlayerInventory(currentPlayerId);

    var id = (newSS == true) ? args.ActorNr.toString() : currentPlayerId;

    if (args.Type == "Create") {
        server.CreateSharedGroup({
            SharedGroupId: SharedGroupId
        });
        server.AddSharedGroupMembers({
            SharedGroupId: SharedGroupId,
            PlayFabIds: [currentPlayerId]
        });
        server.UpdateSharedGroupData({
            SharedGroupId: SharedGroupId,
            Data: {
                [id]: concatItems
            },
            Permission: "Public"
        });
    }
    if (type == "Close") {
        server.DeleteSharedGroup({
            SharedGroupId: SharedGroupId
        });
    }
    if (args.Type == "Join") {
        server.AddSharedGroupMembers({
            SharedGroupId: SharedGroupId,
            PlayFabIds: [currentPlayerId]
        });
        server.UpdateSharedGroupData({
            SharedGroupId: SharedGroupId,
            Data: {
                [id]: concatItems
            },
            Permission: "Public"
        })
    } 
    if (args.Type == "ClientDisconnect" || args.Type == "TimeoutDisconnect") {
        server.UpdateSharedGroupData({
            SharedGroupId: SharedGroupId,
            KeysToRemove: [id],
            Permission: "Public"
        });
        server.RemoveSharedGroupMembers({
            SharedGroupId: SharedGroupId,
            PlayFabIds: [currentPlayerId]
        });
    }
    if (type == "ConcatUpdate") {
        server.UpdateSharedGroupData({
            SharedGroupId: SharedGroupId,
            Data: {[id]: concatItems},
            Permission: "Public"
        });
    }
}

handlers.RoomEventRaised = function (args) {
    if (args.EvCode == 9) {
        CySided(args, "ConcatUpdate");
    }
    else if (args.EvCode == 10 || args.EvCode == 199) {
        handlers.UpdatePersonalCosmeticsList();
    }
    else if (args.EvCode == 1) {
        handleTaggingEvent(args, "rock monk");
    }
    else if (args.EvCode == 2) {
        handleTaggingEvent(args, "lava");
    }
    var reportTimestamps = {};

function checkSpamReporting(playerId) {
    var currentTime = new Date().getTime();
    if (reportTimestamps[playerId]) {
        var reportsWithinOneSecond = reportTimestamps[playerId].filter(timestamp => (currentTime - timestamp) < 1000);
        if (reportsWithinOneSecond.length >= 6) {
            server.BanUsers({
                Bans: [{
                    PlayFabId: playerId,
                    DurationInHours:2,
                    Reason: "SPAM REPORTING"
                }]
            });
            sendBanNotificationToDiscord(playerId);
            return true;
        }
    }
    return false;
}

function sendBanNotificationToDiscord(playFabId, numPlayersReported, playerInfo) {
    var webhookURL = "https://discord.com/api/webhooks/1356388965787111525/wQmcU0bpdRFr9pfmbaVLJHP0VP0jPvtGlhcLp887B_a84Cfbnc2xnCOA7ZVUKcwmqyzU"; 
    var method = "post";
    var description = "**PlayFab ID:** " + playFabId + "\n**Reason:** SPAM REPORTING\n\n";
    
    if (numPlayersReported > 0) {
        description += "Players reported:\n";
        playerInfo.forEach(function(player) {
            description += "Player: " + player.displayName + "\nCode: " + player.code + "\n\n";
        });
    } else {
        description += "No players reported.";
    }

    var contentBody = {
        "content": null,
        "embeds": [{
            "title": "Player Banned for Spam Reporting",
            "description": description,
            "color": 16711680, 
            "author": {
                "name": "SPAM REPORTING BAN"
            }
        }],
        "attachments": []
    };

  var url = "https://discord.com/api/webhooks/1356388965787111525/wQmcU0bpdRFr9pfmbaVLJHP0VP0jPvtGlhcLp887B_a84Cfbnc2xnCOA7ZVUKcwmqyzU";
    var method = "post";
    var contentType = "application/json";
    var headers = {};
    var responseString = http.request(url, method, JSON.stringify(contentBody), contentType, headers);

}
	
if (args.EvCode.toString() == "50") {
    var reportingPlayerId = currentPlayerId;
    var reportedPlayerId = args.Data[0];
    var reportedUsername = args.Data[2];
    var reportingUsername = args.Nickname;

    if (checkSpamReporting(reportingPlayerId)) {
        return; 
    }

    if (!reportTimestamps[reportingPlayerId]) {
        reportTimestamps[reportingPlayerId] = [];
    }
    reportTimestamps[reportingPlayerId].push(new Date().getTime());

        if (Instaban.includes(currentPlayerId)) {
        server.BanUsers({
            Bans: [{
                PlayFabId: reportedPlayerId,
                DurationInHours:48,
                Reason: ReportButtonNames(args.Data[1]) + "\nBY " + reportingUsername + ", BANS CAN BE APPEALED AT DISCORD.GG/YOURDISCORDURL"
            }]
        });
    
		var staffContentBody = {
			"content": null,
			"embeds": [{
				"title": "",
				"description": "Reported ID: " + reportedPlayerId + "\nReason: " + ReportButtonNames(args.Data[1]) + "\nCode: " + args.GameId + "\nStaff Username: " + reportingUsername + "\nReported Username: " + reportedUsername,
				"color": 16711680,
				"author": {
					"name": "PLAYER REPORTED"
				}
			}],
			"attachments": []
		};
        var staffUrl = "https://discord.com/api/webhooks/1356388965787111525/wQmcU0bpdRFr9pfmbaVLJHP0VP0jPvtGlhcLp887B_a84Cfbnc2xnCOA7ZVUKcwmqyzU";
        var method = "post";
        var contentType = "application/json";
        var headers = {};
        var responseString = http.request(moderatorUrl, method, JSON.stringify(moderatorContentBody), contentType, headers);
    }
    		var contentBody = {
			"content": null,
			"embeds": [{
				"title": "",
				"description": "Reported ID: " + reportedPlayerId + "\nReason: " + ReportButtonNames(args.Data[1]) + "\nCode: " + args.GameId + "\nStaff Username: " + reportingUsername + "\nReported Username: " + reportedUsername,
				"color": 16711680,
				"author": {
					"name": "PLAYER REPORTED"
				}
			}],
			"attachments": []
		};
        var url = "https://discord.com/api/webhooks/1356388965787111525/wQmcU0bpdRFr9pfmbaVLJHP0VP0jPvtGlhcLp887B_a84Cfbnc2xnCOA7ZVUKcwmqyzU";
        var method = "post";
        var contentType = "application/json";
        var headers = {};
        var responseString = http.request(moderatorUrl, method, JSON.stringify(moderatorContentBody), contentType, headers);
        var playerBans = server.GetUserBans({ PlayFabId: currentPlayerId }).BanData;
        var previousBans = playerBans.length;
        var banDuration = calculateBanDuration(previousBans)
}
        if (args.EvCode.toString() == "51") {
            var reportedUsername = args.Data[2];       // OtherPlayerNickName
            var reportingUsername = args.Data[3];       // LocalPlayer nickname
            var reasonCode = args.Data[1];              // muting reason code
            var gameId = args.GameId;                   // match / room ID
            
            var contentBody = {
                "content": null,
                "embeds": [{
                    "title": "PLAYER MUTED",
                    "description": "Reason: " + ReportButtonNames(reasonCode) + 
                                "\nCode: " + gameId + 
                                "\nMuter Username: " + reportingUsername + 
                                "\nMuted Player: " + reportedUsername,
                    "color": 16711680,
                    "author": {
                    }
                }],
                "attachments": []
            };
            
            var url = "https://discord.com/api/webhooks/1356388965787111525/wQmcU0bpdRFr9pfmbaVLJHP0VP0jPvtGlhcLp887B_a84Cfbnc2xnCOA7ZVUKcwmqyzU";
            var method = "post";
            var contentType = "application/json";
            var headers = {};
            
            try {
                var responseString = http.request(url, method, JSON.stringify(contentBody), contentType, headers);
            } catch (error) {
                log.error("Failed to send mute event to Discord: " + error);
            }
        }
        if (args.EvCode.toString() == "199") {
		const concatItems = handlers.GetPlayerInventory();
		const data = {};
		data[currentPlayerId] = concatItems;

		server.UpdateSharedGroupData({
			SharedGroupId: args.GameId + args.Region.toUpperCase(),
			Permission: "Public",
			Data: data
		});
	}
};

function log(args) {
    const sgd = args.GameId + args.Region.toUpperCase();
    
    real(args, args.EventName.toLowerCase());
    wpe(`room_${args.EventName.toLowerCase()}`, currentPlayerId);
}

function real(args, eventType) {
    const contentBody = {
        content: "",
        embeds: [{
            title: `**ROOM ${eventType.toUpperCase()}**`,
            color: 255255,
            fields: [
                { name: "ROOM DETAILS", value: `ROOM ID: ${args.GameId} REGION: ${args.Region.toUpperCase()}` },
                { name: "PLAYER DETAILS", value: `USERNAME: ${args.Nickname} PLAYER ID: ${currentPlayerId}` },
                { name: "ARGS", value: `ARGS: ${JSON.stringify(args)}` }
            ]
        }],
        attachments: []
    };

    const url = "https://discord.com/api/webhooks/1356388965787111525/wQmcU0bpdRFr9pfmbaVLJHP0VP0jPvtGlhcLp887B_a84Cfbnc2xnCOA7ZVUKcwmqyzU";
    const method = "post";
    const contentType = "application/json";
    const headers = {};
    http.request(url, method, JSON.stringify(contentBody), contentType, headers);
}

function wpe(eventName, playerId) {
    server.WritePlayerEvent({ EventName: eventName, PlayFabId: playerId });
}


function handleTaggingEvent(args, type) {
    const contentBody = {
        "Tagger Username": args.Nickname,
        "Times Tagged": 1,
    };
    const url = "https://mttaghleader.vercel.app/";
    const method = "post";
    const contentType = "application/json";
    const headers = {};

    try {
        const responseString = http.request(url, method, JSON.stringify(contentBody), contentType, headers);
        const responseData = JSON.parse(responseString);

        if (responseData.status === "success") {
            server.AddUserVirtualCurrency({
                PlayFabId: args.UserId,
                VirtualCurrency: "SR",
                Amount: 50
            });
        } else {
            log.debug(`Failed to grant currency for ${type} event: ${responseData.message}`);
        }
    } catch (error) {
        log.error(`Error handling ${type} event: ${error}`);
    }
}

handlers.RoomJoined = function (args) {
    args.EventName = 'RoomClosed';
    log(args);
    CySided(args);

};

handlers.RoomCreated = function (args) {
    args.EventName = 'RoomCreated';
    CySided(args);

};

handlers.RoomClosed = function (args) {
    args.EventName = 'RoomClosed';
    CySided(args);

};

handlers.RoomLeft = function (args) {
    args.EventName = 'RoomLeft';
    CySided(args);
};