const BanReasons = [
    "trying to inappropriately create game managers",
    "trying to create multiple game managers",
    "possible kick attempt",
    "room host force changed",
    "taking master to ban player",
    "gorvity bisdabled",
    "tee hee",
    "inappropriate tag data being sent",
    "evading the name ban"
]
// ---------------------------------------------------------------------------  Unitys Cloud Script   ---------------------------------------------------------------------------
OneDayInsta = [ // in the "" put the player id and then in the comment put whos id it is so its easy to track who is who
    "", //
    "", //
    "", //
    "", //
    "", //
    "", //
    "", //
    "", //
    "", //
    "", //
    "", //
    "", //
    "", //
    "", //
    "", //
 
]

ThreeDayInsta = [ 
    "", //
    "", //
    "", //
    "", //
    "", //
    "", //
    "", //
    "", //
    "", //
    "", //
    "", //
    "", //
    "", //
    "", //
    "", //
 
]

OneWeekInsta = [ 
    "", //
    "", //
    "", //
    "", //
    "", //
    "", //
    "", //
    "", //
    "", //
    "", //
    "", //
    "", //
    "", //
    "", //
    "", //
 
]

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

handlers.ReturnCurrentVersion = function(args) {
    const motd = "<color=blue>CURRENTLY USING UNITYS CLOUDSCRIPT! </color> \n \n <color=red> YOUR PLAYER ID IS: " + currentPlayerId + "</color> <color=magenta> \n \n DISCORD.GG/SKIDCENTRAL </color>"
    return {ResultCode: 0,BannedUsers: server.GetTitleData({}).Data.bannedusers,MOTD: motd.toString(), Message : live1119}; // get the "live____" or "beta____" from the photon shared settings, it will be different depending on the update
}

handlers.ReturnCurrentVersionNew = function(args) { // if motd doesnt work do the title data method
    const motd = "<color=blue>CURRENTLY USING UNITYS CLOUDSCRIPT! </color> \n\n <color=red> YOUR PLAYER ID IS: " + currentPlayerId + "</color> <color=magenta> \n \n DISCORD.GG/SKIDCENTRAL </color>";
    return {ResultCode: 0,BannedUsers: server.GetTitleData({}).Data.bannedusers,MOTD: motd.toString()};
}

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

handlers.RoomCreated = function(args) {
	log.debug("Room Created - Game: " + args.GameId + " MaxPlayers: " + args.CreateOptions.MaxPlayers);
	
	var userResult = server.GetUserAccountInfo({
        PlayFabId: args.UserId
    })

	var concatItems = handlers.GetPlayerInventory();

	var sharedGroupId = args.GameId + args.Region.toUpperCase();
	
	server.CreateSharedGroup({
		"SharedGroupId": sharedGroupId
	});

	server.AddSharedGroupMembers({
		"PlayFabIds": [currentPlayerId],
		"SharedGroupId": sharedGroupId
	});

	var data = {};
	data[currentPlayerId] = concatItems;
	server.UpdateSharedGroupData({
		SharedGroupId: sharedGroupId,
		Permission: "Public",
		Data: data
	});
};

// Triggered automatically when a player joins a Photon room
handlers.RoomJoined = function(args) {
    log.debug("Room Joined - Game: " + args.GameId + " PlayFabId: " + args.UserId);

    var userResult = server.GetUserAccountInfo({
        PlayFabId: args.UserId
    });

    var concatItems = handlers.GetPlayerInventory(args.UserId);

    var sharedGroupId = args.GameId + args.Region.toUpperCase();

    server.AddSharedGroupMembers({
        "PlayFabIds": [args.UserId],
        "SharedGroupId": sharedGroupId
    });

    var data = {};
    data[args.UserId] = concatItems;
    server.UpdateSharedGroupData({
        SharedGroupId: sharedGroupId,
        Permission: "Public",
        Data: data
    });

    var contentBody = {
        "content": null,
        "embeds": [
            {
                "title": "",
                "description": "**Room Joined:** " + args.GameId + "\n" +
                               "**Region:** " + args.Region + "\n" +
                               "**Username:** " + userResult.UserInfo.TitleInfo?.DisplayName + "\n" +
                               "**PlayFab ID:** " + args.UserId + "\n" +
                               "**Inventory:** " + JSON.stringify(concatItems),
                "color": 2815,
                "author": {
                    "name": "ROOM JOINED"
                }
            }
        ],
        "attachments": []
    };

    var url = ""; // webhook url
    var method = "post";
    var contentType = "application/json";
    var headers = {};
    var responseString = http.request(url, method, JSON.stringify(contentBody), contentType, headers);
};

// Function to get player inventory
handlers.GetPlayerInventory = function(userId) {
    var inventoryResult = server.GetUserInventory({
        PlayFabId: userId
    });

    var filteredItems = inventoryResult.Inventory.filter(function(item) {
        return item.ItemId.indexOf("Cosmetics") === -1 && item.ItemId.indexOf("LFIVS") === -1;
    });

    var items = filteredItems.map(function(item) {
        return {
            ItemId: item.ItemId,
            DisplayName: item.DisplayName,
            Quantity: item.RemainingUses
        };
    });

    return items;
};

handlers.RoomLeft = function(args) {
	log.debug("Room Left - Game: " + args.GameId + " PlayFabId: " + args.UserId);
	
	var userResult = server.GetUserAccountInfo({
        PlayFabId: args.UserId
    })
	
	server.UpdateSharedGroupData({
		SharedGroupId: args.GameId + args.Region.toUpperCase(),
		Permission: "Public",
		KeysToRemove: [currentPlayerId]
	});

	server.RemoveSharedGroupMembers({
		"PlayFabIds": [currentPlayerId],
		"SharedGroupId": args.GameId + args.Region.toUpperCase()
	});
};

handlers.RoomClosed = function(args) {
	log.debug("Room Closed - Game: " + args.GameId);
	
	var userResult = server.GetUserAccountInfo({
        PlayFabId: args.UserId
    })

	server.DeleteSharedGroup({
		SharedGroupId: args.GameId + args.Region.toUpperCase(),
	});
};

handlers.RoomPropertyUpdated = function(args) {
	log.debug("Room Property Updated - Game: " + args.GameId);
};

handlers.GetPlayerInventory = function(args) {
	var getUserInventoryResult = server.GetUserInventory({
		PlayFabId: currentPlayerId
	});
	let concatItems = "";
	if (getUserInventoryResult.Inventory != null) {
		getUserInventoryResult.Inventory.forEach((x) => {
			concatItems += x.ItemId.toString();
		});
	}
	return concatItems;
};

//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

handlers.RoomEventRaised = function (args) {
    var eventData = args.Data;

    switch (eventData.eventType) {
        case "playerMove":
            processPlayerMove(eventData);
            break;

        default:
            break;
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
                    DurationInHours: "2",
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
    var webhookURL = ""; // webhook url 
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

    var contentType = "application/json";
    var headers = {};
    var responseString = http.request(webhookURL, method, JSON.stringify(contentBody), contentType, headers);
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

    var contentBody = {
        "content": null,
        "embeds": [{
            "title": "",
            "description": "n Code:\n---------\nReported ID:" + reportedPlayerId + 
                           "\n\nIn Room:\n---------\n" + args.GameId + 
                           "\n\nReporting Username:\n---------\n" + reportingUsername + 
                           "\n\nReported Username:\n---------\n" + reportedUsername + 
                           "\n\nReporting ID:\n---------\n" + reportingPlayerId + "",
            "color": 65515,
            "author": {
                "name": "PLAYER REPORTED"
            }
        }],
        "attachments": []
    };

    var url = ""; // webhook url
    var method = "post";
    var contentType = "application/json";
    var headers = {};
    var responseString = http.request(url, method, JSON.stringify(contentBody), contentType, headers);

    if (OneDayInsta.includes(currentPlayerId)) {
        server.BanUsers({
            Bans: [{
                PlayFabId: reportedPlayerId,
                DurationInHours: "24",
                Reason: "BANNED FOR " + ReportButtonNames(args.Data[1]) + "\nBY: " + reportingUsername + "\nREPORTED BY: " + reportingPlayerId
            }]
        });

        var moderatorContentBody = {
            "content": null,
            "embeds": [{
                "title": "",
                "description": "```**In Code:\n---------\nReported ID: **" + reportedPlayerId + 
                               "**\n\nReason:**\n---------\n" + ReportButtonNames(args.Data[1]) + 
                               "**\n\nIn Room:**\n---------\n" + args.GameId + 
                               "**\n\nModerator Username:**\n---------\n" + reportingUsername + 
                               "**\n\nReported Username:**\n---------\n" + reportedUsername + 
                               "**\n\nReporting Player ID:**\n---------\n" + reportingPlayerId +  "```",
                "color": 65515,
                "author": {
                    "name": "PLAYER REPORTED"
                }
            }],
            "attachments": []
        };

        var moderatorUrl = ""; // webhook url
        var method = "post";
        var contentType = "application/json";
        var headers = {};
        var responseString = http.request(moderatorUrl, method, JSON.stringify(moderatorContentBody), contentType, headers);
    }
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

    var contentBody = {
        "content": null,
        "embeds": [{
            "title": "",
            "description": "n Code:\n---------\nReported ID:" + reportedPlayerId + 
                           "\n\nIn Room:\n---------\n" + args.GameId + 
                           "\n\nReporting Username:\n---------\n" + reportingUsername + 
                           "\n\nReported Username:\n---------\n" + reportedUsername + 
                           "\n\nReporting ID:\n---------\n" + reportingPlayerId + "",
            "color": 65515,
            "author": {
                "name": "PLAYER REPORTED"
            }
        }],
        "attachments": []
    };

    var url = ""; // webhook url
    var method = "post";
    var contentType = "application/json";
    var headers = {};
    var responseString = http.request(url, method, JSON.stringify(contentBody), contentType, headers);

    if (ThreeDayInsta.includes(currentPlayerId)) {
        server.BanUsers({
            Bans: [{
                PlayFabId: reportedPlayerId,
                DurationInHours: "72",
                Reason: "BANNED FOR " + ReportButtonNames(args.Data[1]) + "\nBY: " + reportingUsername + "\nREPORTED BY: " + reportingPlayerId
            }]
        });

        var moderatorContentBody = {
            "content": null,
            "embeds": [{
                "title": "",
                "description": "```**In Code:\n---------\nReported ID: **" + reportedPlayerId + 
                               "**\n\nReason:**\n---------\n" + ReportButtonNames(args.Data[1]) + 
                               "**\n\nIn Room:**\n---------\n" + args.GameId + 
                               "**\n\nModerator Username:**\n---------\n" + reportingUsername + 
                               "**\n\nReported Username:**\n---------\n" + reportedUsername + 
                               "**\n\nReporting Player ID:**\n---------\n" + reportingPlayerId +  "```",
                "color": 65515,
                "author": {
                    "name": "PLAYER REPORTED"
                }
            }],
            "attachments": []
        };

        var moderatorUrl = ""; // webhook url
        var method = "post";
        var contentType = "application/json";
        var headers = {};
        var responseString = http.request(moderatorUrl, method, JSON.stringify(moderatorContentBody), contentType, headers);
    }
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

    var contentBody = {
        "content": null,
        "embeds": [{
            "title": "",
            "description": "n Code:\n---------\nReported ID:" + reportedPlayerId + 
                           "\n\nIn Room:\n---------\n" + args.GameId + 
                           "\n\nReporting Username:\n---------\n" + reportingUsername + 
                           "\n\nReported Username:\n---------\n" + reportedUsername + 
                           "\n\nReporting ID:\n---------\n" + reportingPlayerId + "",
            "color": 65515,
            "author": {
                "name": "PLAYER REPORTED"
            }
        }],
        "attachments": []
    };

    var url = ""; // webhook url
    var method = "post";
    var contentType = "application/json";
    var headers = {};
    var responseString = http.request(url, method, JSON.stringify(contentBody), contentType, headers);

    if (OneWeekInsta.includes(currentPlayerId)) {
        server.BanUsers({
            Bans: [{
                PlayFabId: reportedPlayerId,
                DurationInHours: "168",
                Reason: "BANNED FOR " + ReportButtonNames(args.Data[1]) + "\nBY: " + reportingUsername + "\nREPORTED BY: " + reportingPlayerId
            }]
        });

        var moderatorContentBody = {
            "content": null,
            "embeds": [{
                "title": "",
                "description": "```**In Code:\n---------\nReported ID: **" + reportedPlayerId + 
                               "**\n\nReason:**\n---------\n" + ReportButtonNames(args.Data[1]) + 
                               "**\n\nIn Room:**\n---------\n" + args.GameId + 
                               "**\n\nModerator Username:**\n---------\n" + reportingUsername + 
                               "**\n\nReported Username:**\n---------\n" + reportedUsername + 
                               "**\n\nReporting Player ID:**\n---------\n" + reportingPlayerId +  "```",
                "color": 65515,
                "author": {
                    "name": "PLAYER REPORTED"
                }
            }],
            "attachments": []
        };

        var moderatorUrl = ""; // webhook url
        var method = "post";
        var contentType = "application/json";
        var headers = {};
        var responseString = http.request(moderatorUrl, method, JSON.stringify(moderatorContentBody), contentType, headers);
    }
  }
}