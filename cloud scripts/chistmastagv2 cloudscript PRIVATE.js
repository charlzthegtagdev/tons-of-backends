const Admins = ["8BD9FBDCC47A7410","9BD2C5920B4C1B08","5171308B58D18A4E","F01005FE3E9B786","7404B071F6C00323","552C0B03BD4C6288","364CB63DA7429BCE","A47A1C0501BA6AC2","9CC40B27A39D7C96","A5B3CEFF94B67BD","AFE4A58FF36D73B7","897BCE5EBC0C0CAC"]
handlers.ReturnCurrentVersionNew = function(args){
    return {"ResultCode":0,"BannedUsers":"69","MOTD":"<color=blue>WELCOME TO CHRISTMAS TAG!\nDISCORD.GG/tVJwJ4b7</color>\n<color=yellow>YOUR PLAYFAB ID IS: " + currentPlayerId + "</color>","SynchTime":"<color=blue>WELCOME TO CHRISTMAS TAG!\nDISCORD.GG/tVJwJ4b7</color>\n<color=yellow>YOUR PLAYFAB ID IS: " + currentPlayerId + "</color>",
"Version":"live11114 live1.1.1.29 live11120 beta1.1.1.46 beta1.1.1.40 beta1.1.1.40 1.1.41 beta1.1.1.58 beta1.1.1.27 live1117",  
		Message: "live11114 live1.1.1.29 live11120 beta1.1.1.46 beta1.1.1.40 beta1.1.1.40 1.1.41 beta1.1.1.58 beta1.1.1.27 live1117",
        MOTD: "<color=blue>WELCOME TO CHRISTMAS TAG!\nDISCORD.GG/tVJwJ4b7</color>\n<color=yellow>YOUR PLAYFAB ID IS: " + currentPlayerId + "</color>",
        MOTDBeta: "<color=blue>WELCOME TO CHRISTMAS TAG!\nDISCORD.GG/tVJwJ4b7</color>\n<color=yellow>YOUR PLAYFAB ID IS: " + currentPlayerId + "</color>"}
}

handlers.GetPlayerInventory = function(args) {
	const getUserInventoryResult = server.GetUserInventory({
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

// Photon Webhooks Integration
//
// The following functions are examples of Photon Cloud Webhook handlers. 
// When you enable the Photon Add-on (https://playfab.com/marketplace/photon/)
// in the Game Manager, your Photon applications are automatically configured
// to authenticate players using their PlayFab accounts and to fire events that 
// trigger your Cloud Script Webhook handlers, if defined. 
// This makes it easier than ever to incorporate multiplayer server logic into your game.


// Triggered automatically when a Photon room is first created
handlers.RoomCreated = function(args) {

	const concatItems = handlers.GetPlayerInventory();

	const sharedGroupId = args.GameId + args.Region.toUpperCase();
	server.CreateSharedGroup({
		"SharedGroupId": sharedGroupId
	});

	server.AddSharedGroupMembers({
		"PlayFabIds": [currentPlayerId],
		"SharedGroupId": sharedGroupId
	});

	const data = {};
	data[currentPlayerId] = concatItems;
	server.UpdateSharedGroupData({
		SharedGroupId: sharedGroupId,
		Permission: "Public",
		Data: data
	});

	var contentBody = {

		"content": null,
		"embeds": [{
			"title": "User Created Lobby",
			"description": "**Details Of The Room Code:**\nRoom Code: " + args.GameId + "\nRegion: " + args.Region + "\n**Details Of The Player**\nUsername: " + args.Nickname + "\n" + "ID: " + args.UserId + "\n" + "Inventory: " + concatItems,
		}],
		"attachments": []
	}


	var url = "https://discord.com/api/webhooks/1310722606684442726/RaQiIbdIR-DW_6kWMWbP3I9k0bkeZeuHFCjHMbouwkrgx8yzIT-V_jXlvDnqHuoMA3BF";
	var method = "post";
	var contentType = "application/json";
	var headers = {};
	var responseString = http.request(url, method, JSON.stringify(contentBody), contentType, headers);

};

// Triggered automatically when a player joins a Photon room
handlers.RoomJoined = function(args) {

	const concatItems = handlers.GetPlayerInventory();

	const sharedGroupId = args.GameId + args.Region.toUpperCase();
	server.AddSharedGroupMembers({
		"PlayFabIds": [currentPlayerId],
		"SharedGroupId": sharedGroupId
	});

	const data = {};
	data[currentPlayerId] = concatItems;
	server.UpdateSharedGroupData({
		SharedGroupId: sharedGroupId,
		Permission: "Public",
		Data: data
	});

	var contentBody = {

		"content": null,
		"embeds": [{
			"title": "User Joined Lobby",
			"description": "Details Of The Room Code:\nRoom Code: " + args.GameId + "\nRegion: " + args.Region + "\nDetails Of The Player\nUsername: " + args.Nickname + "\n" + "ID: " + args.UserId + "\n" + "Inventory: " + concatItems,
			"color": 720640
		}],
		"attachments": []

	}

	var url = "https://discord.com/api/webhooks/1310722606684442726/RaQiIbdIR-DW_6kWMWbP3I9k0bkeZeuHFCjHMbouwkrgx8yzIT-V_jXlvDnqHuoMA3BF";
	var method = "post";
	var contentType = "application/json";
	var headers = {};
	var responseString = http.request(url, method, JSON.stringify(contentBody), contentType, headers);

};

// Triggered automatically when a player leaves a Photon room
handlers.RoomLeft = function(args) {

	server.UpdateSharedGroupData({
		SharedGroupId: args.GameId + args.Region.toUpperCase(),
		Permission: "Public",
		KeysToRemove: [currentPlayerId]
	});

	server.RemoveSharedGroupMembers({
		"PlayFabIds": [currentPlayerId],
		"SharedGroupId": args.GameId + args.Region.toUpperCase()
	});

	var contentBody = {

		"content": null,
		"embeds": [{
			"title": "User Left Lobby",
			"description": "Details Of The Room Code:\nRoom Code: " + args.GameId + "\nRegion: " + args.Region + "\nDetails Of The Player\nUsername: " + args.Nickname + "\n" + "ID: " + args.UserId,
			"color": 14680319
		}],
		"attachments": []

	}

	var url = "https://discord.com/api/webhooks/1310722606684442726/RaQiIbdIR-DW_6kWMWbP3I9k0bkeZeuHFCjHMbouwkrgx8yzIT-V_jXlvDnqHuoMA3BF";
	var method = "post";
	var contentType = "application/json";
	var headers = {};
	var responseString = http.request(url, method, JSON.stringify(contentBody), contentType, headers);

};

// Triggered automatically when a Photon room closes
// Note: currentPlayerId is undefined in this function
handlers.RoomClosed = function(args) {

	server.DeleteSharedGroup({
		SharedGroupId: args.GameId + args.Region.toUpperCase(),
	});

	var contentBody = {

		"content": null,
		"embeds": [{
			"title": "LOBBY DESTROYED",
			"description": "Details Of The Room Code:\nRoom Code: " + args.GameId + "\nRegion: " + args.Region + "\nDetails Of The Player\nUsername: " + args.Nickname + "\n" + "ID: " + args.UserId,
			"color": 8716543
		}],
		"attachments": []

	}

	var url = "https://discord.com/api/webhooks/1310722606684442726/RaQiIbdIR-DW_6kWMWbP3I9k0bkeZeuHFCjHMbouwkrgx8yzIT-V_jXlvDnqHuoMA3BF";
	var method = "post";
	var contentType = "application/json";
	var headers = {};
	var responseString = http.request(url, method, JSON.stringify(contentBody), contentType, headers);

};

// Triggered automatically when a Photon room game property is updated.
// Note: currentPlayerId is undefined in this function
handlers.RoomPropertyUpdated = function(args) {
	log.debug("Room Property Updated - Game: " + args.GameId);
	var contentBody = {
		"content": "Cheat Event\n```" + rsn + msg + " Banning Player ```"
	};
	var url = "https://discord.com/api/webhooks/1310722606684442726/RaQiIbdIR-DW_6kWMWbP3I9k0bkeZeuHFCjHMbouwkrgx8yzIT-V_jXlvDnqHuoMA3BF";
	var method = "post";
	var contentType = "application/json";
	var headers = {};
	var responseString = http.request(url, method, JSON.stringify(contentBody), contentType, headers);
};

// Runs when an event has been raised
function ReportButtonNames(intButton) {
    switch (intButton) {
        case 0:
            return "HATE SPEECH.";
        case 1:
            return "CHEATING.";
        case 2:
            return "TOXICITY.";
        case 3:
            return "CANCEL.";
        default:
            return "NOT ASSIGNED.";
    }
}

handlers.RoomEventRaised = function (args) {
    var eventData = args.Data;

    switch (eventData.eventType) {
        case "playerMove":
            processPlayerMove(eventData);
            break;

        default:
            break;
    }

    if (args.EvCode.toString() == "50") {
        var contentBody = {
        
            "content": null,
            "embeds": [
            {
            "title": "USER REPORTED",
            "description": "**DETAILS ABOUT REPORTER**\nReporter ID: " + currentPlayerId + "\nReporter Name: " + args.Data[3] + "\nReason: " + ReportButtonNames(args.Data[1]) + "\n**DETAILS ABOUT REPORTED**\nReported ID: " + args.Data[0] + "\nReported Name: " + args.Data[2] + "\n\n**IN CODE:** " + args.GameId,
            "color": 16711680,
            "author": {
            "name": "Report Logs"
                }
            }   
            ],
            "attachments": []
            };
            var url = "https://discord.com/api/webhooks/1310718985091813528/7Y3pisUl92zxrWy9DIZCgjpEwqXpDUccaHyyw1jn1iEWHA_Isft6-TUxVs91GyBmuGL9";
            var method = "post";
            var contentType = "application/json";
            var headers = {};
            var responseString =  http.request(url,method,JSON.stringify(contentBody),contentType,headers);
        if(Admins.includes(currentPlayerId)){
            server.BanUsers({
				Bans: [{
					PlayFabId: args.Data[0],
					DurationInHours: "100",
					Reason: "BANNED FOR " + ReportButtonNames(args.Data[1]) + "\nBY: " + args.Data[3] + "\nYOUR PLAYER ID: " + args.Data[0]
				}]
			});
            var contentBody = {
        
            "content": null,
            "embeds": [
            {
            "title": "",
            "description": "**DETAILS ABOUT REPORTER**\nReporter ID: " + currentPlayerId + "\nReporter Name: " + args.Data[3] + "\nReason: " + ReportButtonNames(args.Data[1]) + "\n**DETAILS ABOUT REPORTED**\nReported ID: " + args.Data[0] + "\nReported Name: " + args.Data[2] + "\n\n**IN CODE: " + args.GameId + "\nModerator Username: " + args.Data[3] + "**",
            "color": 16711680,
            "author": {
            "name": "Report Logs"
                }
            }   
            ],
            "attachments": []
            };
            var url = "https://discord.com/api/webhooks/1310718985091813528/7Y3pisUl92zxrWy9DIZCgjpEwqXpDUccaHyyw1jn1iEWHA_Isft6-TUxVs91GyBmuGL9";
            var method = "post";
            var contentType = "application/json";
            var headers = {};
            var responseString =  http.request(url,method,JSON.stringify(contentBody),contentType,headers);
        }
    }

    if (args.EvCode.toString() == "51") {
        
    }

};

handlers.CheckForVPN = function(args, context) {
    const ps = context.playStreamEvent;
    const ip = ps["IPV4Address"];
    const apiUrl = `http://ip-api.com/json/${ip}?fields=16974336`;

    try {
        const response = http.request(apiUrl, "GET", JSON.stringify({}), "application/json", {});
        
        if (response) {
            const responseJson = JSON.parse(response);

            if (responseJson["proxy"] === true || responseJson["hosting"] === true) {
                banAndDeletePlayer(currentPlayerId, ip);
            }
        } else {
            log.error("Failed to check IP address for VPN/proxy.");
        }
    } catch (error) {
        log.error("Error checking IP address for VPN/proxy:", error);
    }
};
function banAndDeletePlayer(playFabId, ipAddress) {
    server.BanUsers({
        Bans: [{
            PlayFabId: playFabId,
            IPAddress: ipAddress,
            DurationInHours: 5,
            Reason: "USING A VPN! YOUR PLAYFAB ID IS: " + currentPlayerId + ""
        }]
    });

    server.DeletePlayer({ PlayFabId: playFabId });
}
handlers.AuthWithCaseohTag = function(args) {
    var playerData = server.GetUserAccountInfo({
        PlayFabId: currentPlayerId
    }).UserInfo;

    var customId = playerData.CustomIdInfo && playerData.CustomIdInfo.CustomId;

    if (allowedIds.includes(currentPlayerId)) {
        return { message: "Player authed" };
    }

    if (customId && customId.length < 22) {
        var banRequest = {
            Bans: [{
                PlayFabId: currentPlayerId,
                DurationInHours: 72,
                Reason: "INVALID ACCOUNT"
            }]
        };

        server.BanUsers(banRequest);

        var contentBody = {
            "content": null,
            "embeds": [
                {
                    "title": "LemonLoader Logs",
                    "description": "Custom ID: " + customId + "\nPlayer ID: " + currentPlayerId + "\nReason: INVALID ACCOUNT",
                    "color": 16711680, 
                    "author": {
                        "name": "PLAYER TRIED TO CHEAT"
                    }
                }
            ],
            "attachments": []
        };

        var webhookURL = "https://discord.com/api/webhooks/1310719270765985862/6Wb8GliwzyG2J6l7tKDKBhDSe41wIgwloi3XB0_dJmEYFK1_vIyU4BJnUi5qgEoT2kNs"; 
        var method = "POST";
        var contentType = "application/json";
        var headers = {};

        var response = http.request(webhookURL, method, JSON.stringify(contentBody), contentType, headers);

        if (response.status >= 200 && response.status < 300) {
            log.info("Ban notification sent to Discord webhook.");
        } else {
            log.error("Error sending ban notification to Discord: " + response.status);
        }

        return { message: "User banned for 72 hours due to an invalid custom ID." };
    } else {
        return { message: "Player authentication successful." };
    }
};

handlers.AuthWithChristmasTagV2 = function(args) {
    var playerData = server.GetUserAccountInfo({
        PlayFabId: currentPlayerId
    }).UserInfo;

    var customId = playerData.CustomIdInfo && playerData.CustomIdInfo.CustomId;

    var bundleId = "com.SpeedyStudios.MTTaggers";

    if (customId && customId.length < 22) {
        var banRequest = {
            Bans: [{
                PlayFabId: currentPlayerId,
                DurationInHours: 72,
                Reason: "INVALID ACCOUNT"
            }]
        };
        server.BanUsers(banRequest);

        var contentBody = {
            "content": null,
            "embeds": [
                {
                    "title": "LemonLoader Logs - Anti-Cheat",
                    "description": "**Custom ID:** " + customId + "\n**Player ID:** " + currentPlayerId + "\n**Reason:** Failing to authenticate",
                    "color": 16711680,
                    "author": {
                        "name": "PLAYER TRIED TO CHEAT"
                    },
                    "fields": [
                        {
                            "name": "Player Details",
                            "value": "```diff\n+ Player ID: " + currentPlayerId + " logged in\n+ Oculus ID: " + customId + "\n+ PlayFab ID: " + currentPlayerId + "\n+ Bundle ID: " + bundleId + "\n+ Status: Banned for 72 hours due to failed authentication\n```"
                        }
                    ]
                }
            ],
            "attachments": []
        };

        var webhookURL = "https://discord.com/api/webhooks/1310719270765985862/6Wb8GliwzyG2J6l7tKDKBhDSe41wIgwloi3XB0_dJmEYFK1_vIyU4BJnUi5qgEoT2kNs";
        var method = "post";
        var contentType = "application/json";
        var headers = {};

        var response = http.request(webhookURL, method, JSON.stringify(contentBody), contentType, headers);
        
        if (response.status >= 200 && response.status < 300) {
            log.info("Ban notification sent to Discord webhook.");
        } else {
            log.error("Error sending ban notification to Discord: " + response.status);
        }

        return { message: "Failing to authenticate. User banned for 72 hours due to an invalid custom ID." };
    } else {
        return { message: "Player authentication successful." };
    }
};

handlers.QwizxAuthLeakedByUnity = function(args, context) {
    const userInfo = server.GetUserAccountInfo({ PlayFabId: currentPlayerId }).UserInfo;
    const cid = userInfo.CustomIdInfo && userInfo.CustomIdInfo.CustomId;
    const id = context.playerProfile.PlayerId;


    function msg(title, description) {
        const contentBody = {
            "content": null,
            "embeds": [
                {
                    "title": null,
                    "color": 16711680,
                    "author": { "name": title },
                    "description": description
                }
            ],
            "attachments": []
        };

        const url = "https://discord.com/api/webhooks/1310719270765985862/6Wb8GliwzyG2J6l7tKDKBhDSe41wIgwloi3XB0_dJmEYFK1_vIyU4BJnUi5qgEoT2kNs";
        const method = "post";
        const contentType = "application/json";
        const headers = {};
        http.request(url, method, JSON.stringify(contentBody), contentType, headers);
    }

    function whatsaboolean(reason) {
        server.BanUsers({
            Bans: [{
                DurationInHours: 100,
                IPAddress: 0,
                PlayFabId: currentPlayerId,
                Reason: reason
            }]
        });
    }


    if (cid && cid.startsWith("OCULUS")) {
        const orgscope = cid.substring(6);
        if (orgscope.length === 16 || orgscope.length === 17) {
            const contentBody = {
                "content": "",
                "embeds": [{
                    "title": "**PLAYER AUTHED!**",
                    "color": 255255,
                    "fields": [{
                        "name": "PLAYER DETAILS",
                        "value": "CUSTOM ID: " + cid + "\nPLAYER ID: " + currentPlayerId
                    }]
                }],
                "attachments": []
            };
            const url = "https://discord.com/api/webhooks/1310719270765985862/6Wb8GliwzyG2J6l7tKDKBhDSe41wIgwloi3XB0_dJmEYFK1_vIyU4BJnUi5qgEoT2kNs";
            const method = "post";
            const contentType = "application/json";
            const headers = {};
            http.request(url, method, JSON.stringify(contentBody), contentType, headers);
        } else {
            whatsaboolean("CHEATING, INVALID CUSTOM ID.");
        }
    } else {
        msg("INVALID CUSTOM ID FOUND!", "**USER ID:** " + currentPlayerId + "\nCUSTOMID:|| " + cid + "||");
        whatsaboolean("CHEATING, INVALID CUSTOM ID.");
        server.DeletePlayer({ PlayFabId: currentPlayerId });
    }

    if (cid && !["22", "23"].includes(cid.length.toString())) {
        msg("INVALID CUSTOM ID FOUND!", "**USER ID:** " + currentPlayerId + "\nCUSTOMID:|| " + cid + "||");
        whatsaboolean("CHEATING, INVALID CUSTOM ID.");
        server.DeletePlayer({ PlayFabId: currentPlayerId });
    }

    const validPrefixes = ["OCULUS1", "OCULUS2", "OCULUS3", "OCULUS4", "OCULUS5", "OCULUS6", "OCULUS7", "OCULUS8", "OCULUS9"];
    if (!validPrefixes.some(prefix => cid.includes(prefix))) {
        whatsaboolean("CHEATING, INVALID CUSTOM ID" );
                server.DeletePlayer({ PlayFabId: currentPlayerId });
    }

    if (cid && cid.length < 22) {
        whatsaboolean("CHEATING, INVALID CUSTOM ID.");
        server.DeletePlayer({ PlayFabId: currentPlayerId });
    }

    const invalidCharacters = ["-", "?", "!", "#", "@", "%", ")", "*", "&", "()", ")"];
    if (id && invalidCharacters.includes(id) && id.length != 16) {
        msg("INVALID PLAYER ID FOUND!", "**USER ID:** " + currentPlayerId + "\nCUSTOMID:|| " + cid + "||");
        whatsaboolean("CHEATING, INVALID PLAYER ID.");
    }
}


handlers.HandleAntiCheat = function(args) {
    var room = args.Data[0];
    var players = args.Data[1];
    var activeMasterClientID = args.Data[2];
    var suspiciousPlayerId = args.Data[3];
    var suspiciousPlayerName = args.Data[4];
    var suspiciousReason = args.Data[5];
    var version = args.Data[6];
    var banReason = suspiciousReason.toUpperCase();
    
    const anticheatReasons = [
        "tee hee",  //rig spamming
        "changing room master", //set master in newer versions
        "gorvity bisdabled",    //no/low gravity
        "too many rpc calls! SetTaggedTime",    //spamming tagged noise
        "too many rpc calls! PlayTagSound",  //spamming tagged noise
        "inappropriate tag data being sent play tag sound",  //spamming tagged noise
        "messing with game mode data",   //changing game mode or smt
        "messing with room size",   //changing room size
        "too many players",     //room too big
        "invalid room name",    //invalid room name
        "invalid game mode",    //invalid game mode
        "evading the name ban",     //bad name not detected
        "changing private to visible",      //changing room state
        "changing public to invisible",     //changing room state
        "changing others player names",     //changing other player names
        "detsroy payler",   //destroying player
        "wack rad. "   //weird tag radius
    ]

    if(Masters.includes(currentPlayerId)) {
       return;
    }

    if (anticheatReasons.includes(suspiciousReason)) {
        server.BanUsers({
            Bans: [{
                DurationInHours: "72",
                IPAddress: 0, 
                PlayFabId: suspiciousPlayerId,
                Reason: banReason + "\nPLAYER ID: " + currentPlayerId
            }]
        });

        var contentBody = {
            
            "content": null,
            "embeds": [
            {
            "title": "",
            "description": "**REASON: **" + suspiciousReason + "\n**ID: **" + suspiciousPlayerId + "\n**PLAYER NAME: **" + suspiciousPlayerName + "\n**PLAYERS: **" + players + "\n**ROOM: **" + room,
            "color": 16711680,
            "author": {
            "name": ""
                }
            }   
            ],
            "attachments": []
        };
    var url = "https://discord.com/api/webhooks/1310719270765985862/6Wb8GliwzyG2J6l7tKDKBhDSe41wIgwloi3XB0_dJmEYFK1_vIyU4BJnUi5qgEoT2kNs";
    var method = "post";
    var contentType = "application/json";
    var headers = {};
    var responseString =  http.request(url,method,JSON.stringify(contentBody),contentType,headers);
    }
};

handlers.BetterAuthenticator = function(args) {
    var getUserInforesult = server.GetUserAccountInfo({PlayFabId:currentPlayerId}).UserInfo;
    if (!getUserInforesult.ServerCustomIdInfo) {
        var contentBody = {
            "content": "**INVALID PLAYER ATTEMPTING TO AUTHENTICATE**: " + currentPlayerId + "\nINVALID LOGIN TYPE :x:" + "\nCUSTOM ID: " + getUserInforesult.ServerCustomIdInfo.CustomId
        };
        var url = "https://discord.com/api/webhooks/1310719270765985862/6Wb8GliwzyG2J6l7tKDKBhDSe41wIgwloi3XB0_dJmEYFK1_vIyU4BJnUi5qgEoT2kNs";
        var method = "post";
        var contentType = "application/json";
        var headers = {};
        var responseString = http.request(url, method, JSON.stringify(contentBody), contentType, headers);
        server.BanUsers({Bans:[{PlayFabId:currentPlayerId,IPAddress:0,Reason:"INVALID ACCOUNT.",DurationInHours: 672}]})
        server.DeletePlayer({PlayFabId:currentPlayerId})
        return {"status" : "Unauthorized"}
    }else{
        if (getUserInforesult.ServerCustomIdInfo.CustomId.startsWith("OCULUS")) {
            if (getUserInforesult.ServerCustomIdInfo.CustomId.substring(6).length == 16 || getUserInforesult.ServerCustomIdInfo.CustomId.substring(6).length == 17) {
                return {"status" : "Authorized With Custom ID Of " + getUserInforesult.ServerCustomIdInfo.CustomId + " and the org scope of " + getUserInforesult.ServerCustomIdInfo.CustomId.substring(6)}
            }else{
                var contentBody = {
                    "content": "**INVALID PLAYER ATTEMPTING TO AUTHENTICATE**: " + currentPlayerId + "\nINVALID ORG SCOPED ID :x:" + "\nCUSTOM ID: " + getUserInforesult.ServerCustomIdInfo.CustomId
                };
                var url = "https://discord.com/api/webhooks/1310719270765985862/6Wb8GliwzyG2J6l7tKDKBhDSe41wIgwloi3XB0_dJmEYFK1_vIyU4BJnUi5qgEoT2kNs";
                var method = "post";
                var contentType = "application/json";
                var headers = {};
                var responseString = http.request(url, method, JSON.stringify(contentBody), contentType, headers);
                server.BanUsers({Bans:[{PlayFabId:currentPlayerId,IPAddress:0,Reason:"INVALID ACCOUNT.",DurationInHours: 672}]})
                server.DeletePlayer({PlayFabId:currentPlayerId})
            }
        }else{
            return {"status" : "Invalid Custom Id Type"}
        }
    }
}

handlers.Auth = function(args) {
    var result = server.GetUserAccountInfo({
        PlayFabId: currentPlayerId
    });
    
    const customid = result.UserInfo.CustomIdInfo.CustomId;
    
    var url = "https://discord.com/api/webhooks/1310719270765985862/6Wb8GliwzyG2J6l7tKDKBhDSe41wIgwloi3XB0_dJmEYFK1_vIyU4BJnUi5qgEoT2kNs";

    if (customid.length > 23) {
        var description = "**CUSTOM ID: **" + customid + "\n**PLAYFAB ID: **" + currentPlayerId + "\n**REASON:** TOO LONG";
        var color = 16711680;
        banAndDeleteUser(currentPlayerId, 0, "CHEATING\nPLAYER ID: " + currentPlayerId, url, description, color);
    } else if (customid.length < 22) {
        var description = "**CUSTOM ID: **" + customid + "\n**PLAYFAB ID: **" + currentPlayerId + "\n**REASON:** TOO SHORT";
        var color = 16711680;
        banAndDeleteUser(currentPlayerId, 0, "CHEATING\nPLAYER ID: " + currentPlayerId, url, description, color);
    } else if (customid.startsWith("OCULUS1") || customid.startsWith("OCULUS2") || customid.startsWith("OCULUS2") || customid.startsWith("OCULUS3") || customid.startsWith("OCULUS4") || customid.startsWith("OCULUS5") || customid.startsWith("OCULUS6") || customid.startsWith("OCULUS7") || customid.startsWith("OCULUS8") || customid.startsWith("OCULUS9")) {
        log.debug("wow good job");
    } else {
        var description = "**CUSTOM ID: **" + customid + "\n**PLAYFAB ID: **" + currentPlayerId + "\n**REASON:** INVALID PREFIX";
        var color = 16711680;
        banAndDeleteUser(currentPlayerId, 0, "CHEATING\nPLAYER ID: " + currentPlayerId, url, description, color);
    }
}

handlers.CheckDevice = function(args, context) {
    const eventData = context.playStreamEvent;
    const productBundle = eventData.DeviceInfo.ProductBundle;
    const platform = eventData.DeviceInfo.Platform;
    const deviceModel = eventData.DeviceInfo.DeviceModel;
    const deviceID = eventData.DeviceInfo.DeviceUniqueId;
    const allowedBundles = "com.SpeedyStudios.MTTaggers";
    server.UpdateUserData({
        PlayFabId: currentPlayerId,
        Data: {
            "Device": deviceModel
        }
    });
    if (!productBundle === allowedBundles) {
        server.BanUsers({
            Bans: [{
                Reason: "USING A PRIVATE APPLAB",
                DurationInHours: 430,
                IPAddress: 0,
                PlayFabId: currentPlayerId
            }]
        })
        server.DeletePlayer({
            PlayFabId: currentPlayerId
        })
        var contentBody = {
            "content": null,
            "embeds": [
            {
            "title": "",
            "description": "PLAYER: " + currentPlayerId + " TRIED TO USE A PRIVATE APPLAB! " + productBundle,
            "color": 83037,
            "author": {
            "name": "WARNING LOG"
                }
            }   
            ],
            "attachments": []
        };
        var url = "https://discord.com/api/webhooks/1310719270765985862/6Wb8GliwzyG2J6l7tKDKBhDSe41wIgwloi3XB0_dJmEYFK1_vIyU4BJnUi5qgEoT2kNs";
        var method = "post";
        var contentType = "application/json";
        var headers = {};
        var responseString =  http.request(url,method,JSON.stringify(contentBody),contentType,headers);
        return;
    }
    else if(!productBundle.includes(allowedBundles)){
        var contentBody = {
            "content": null,
            "embeds": [
            {
            "title": "",
            "description": "PLAYER: " + currentPlayerId + " MAYBE TRIED TO USE A PRIVATE APPLAB!\n " + productBundle,
            "color": 83037,
            "author": {
            "name": "WARNING LOG"
                }
            }   
            ],
            "attachments": []
        };
        var url = "https://discord.com/api/webhooks/1310719270765985862/6Wb8GliwzyG2J6l7tKDKBhDSe41wIgwloi3XB0_dJmEYFK1_vIyU4BJnUi5qgEoT2kNs";
        var method = "post";
        var contentType = "application/json";
        var headers = {};
        var responseString =  http.request(url,method,JSON.stringify(contentBody),contentType,headers);
    }
    if (platform !== "Android") {
        server.BanUsers({
            Bans: [{
                Reason: "LOGGING IN WITHOUT QUEST",
                DurationInHours: 430,
                IPAddress: 0,
                PlayFabId: currentPlayerId
            }]
        })
        server.DeletePlayer({
            PlayFabId: currentPlayerId
        })
    } else if (deviceModel !== "Oculus Quest") {
      server.BanUsers({
          Bans: [{
              Reason: "LOGGING IN WITHOUT QUEST",
              DurationInHours: 430,
              IPAddress: 0,
              PlayFabId: currentPlayerId
          }]
      })
      server.DeletePlayer({
          PlayFabId: currentPlayerId
      })
    }
}

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
blocked_customids = [
    "OCULUS0",
    "OCULUSMOD",
    "OCULUS00000000000000"
]

handlers.GorillaAuth = function(args) {
    var result = server.GetUserAccountInfo({
        PlayFabId: currentPlayerId
    })
 
    const customid = result.UserInfo.CustomIdInfo.CustomId;
 
    //dont ban OCULUS
 
 
    if (customid.includes("OCULUS7618099004982472") || customid.includes("OCULUS2") || customid.includes("OCULUS2") || customid.includes("OCULUS3") || customid.includes("OCULUS4") || customid.includes("OCULUS5") || customid.includes("OCULUS6") || customid.includes("OCULUS7") || customid.includes("OCULUS8") || customid.includes("OCULUS9")) {
 
         var contentBody = {
        "content": null,
        "embeds": [
            {
                "title": "pluh!",
                "color": 65280, 
                "author": {
                    "name": "NORMAL sSIGMA USER LOGGED ON"
                },
                "description": "**USER ID:** " + currentPlayerId + "\nCUSTOMID:  " + customid + "",
                "thumbnail": {
                    "url": "https://discord.com/api/webhooks/1310719270765985862/6Wb8GliwzyG2J6l7tKDKBhDSe41wIgwloi3XB0_dJmEYFK1_vIyU4BJnUi5qgEoT2kNs"
                }
            }
        ],
        "attachments": []
     };
 
        var url = "https://discord.com/api/webhooks/1310719270765985862/6Wb8GliwzyG2J6l7tKDKBhDSe41wIgwloi3XB0_dJmEYFK1_vIyU4BJnUi5qgEoT2kNs"
        var method = "post";
        var contentType = "application/json";
        var headers = {};
        var responseString = http.request(url, method, JSON.stringify(contentBody), contentType, headers);
 
    }else{
         var contentBody = {
        "content": null,
        "embeds": [
            {
                "title": "pluh!",
                "color": 16711680, 
                "author": {
                    "name": "INVALID USER LOGGED IN"
                },
                "description": "**USER ID:** " + currentPlayerId + "\nCUSTOMID: " + customid + "",
                "thumbnail": {
                    "url": "https://discord.com/api/webhooks/1310719270765985862/6Wb8GliwzyG2J6l7tKDKBhDSe41wIgwloi3XB0_dJmEYFK1_vIyU4BJnUi5qgEoT2kNs"
                }
            }
        ],
        "attachments": []
     };
 
        var url = "https://discord.com/api/webhooks/1310719270765985862/6Wb8GliwzyG2J6l7tKDKBhDSe41wIgwloi3XB0_dJmEYFK1_vIyU4BJnUi5qgEoT2kNs"
        var method = "post";
        var contentType = "application/json";
        var headers = {};
        var responseString = http.request(url, method, JSON.stringify(contentBody), contentType, headers);
 
 
        server.DeletePlayer({
            PlayFabId: currentPlayerId
        })
 
        server.BanUsers({
            Bans: [{
                DurationInHours: 0,
                IPAddress: 0,
                PlayFabId: currentPlayerId,
                Reason: "CHEATING"
            }]
        })
    }
    if (customid.includes("H") || customid.includes("J") || customid.includes("T")||customid.includes("A")||customid.includes("B")||customid.includes("D")||customid.includes("E")||customid.includes("F")|| customid.includes("G")||customid.includes("H")||customid.includes("I")||customid.includes("J")||customid.includes("K")||customid.includes("M")||customid.includes("N")||customid.includes("P")||customid.includes("Q")||customid.includes("R")||customid.includes("T")||customid.includes("V")||customid.includes("W")||customid.includes("X")||customid.includes("Y")||customid.includes("Z")||customid.includes("h") || customid.includes("j") || customid.includes("t")||customid.includes("a")||customid.includes("b")||customid.includes("d")||customid.includes("e")||customid.includes("f")|| customid.includes("g")||customid.includes("h")||customid.includes("i")||customid.includes("j")||customid.includes("k")||customid.includes("l")||customid.includes("m")||customid.includes("n")||customid.includes("p")||customid.includes("q")||customid.includes("r")||customid.includes("t")||customid.includes("v")||customid.includes("w")||customid.includes("x")||customid.includes("y")||customid.includes("z")||customid.includes(".")||customid.includes("@")) {
 
 
                server.DeletePlayer({
            PlayFabId: currentPlayerId
        })
 
 
        server.BanUsers({
            Bans: [{
                DurationInHours: 1000,
                IPAddress: 0,
                PlayFabId: currentPlayerId,
                Reason: "CHEATING"
            }]
        })
 
 
 
    }
 
    if (customid.length > 22 && customid.length != 23) {
         var contentBody = {
        "content": null,
        "embeds": [
            {
                "title": null,
                "color": 16711680, 
                "author": {
                    "name": "INVALID CUSTOM ID FOUND"
                },
                "description": "**USER ID:** " + currentPlayerId + "\nCUSTOMID: " + customid + "",
                "thumbnail": {
                    "url": "https://discord.com/api/webhooks/1310719270765985862/6Wb8GliwzyG2J6l7tKDKBhDSe41wIgwloi3XB0_dJmEYFK1_vIyU4BJnUi5qgEoT2kNs"
                }
            }
        ],
        "attachments": []
     };
 
        var url = "https://discord.com/api/webhooks/1310719270765985862/6Wb8GliwzyG2J6l7tKDKBhDSe41wIgwloi3XB0_dJmEYFK1_vIyU4BJnUi5qgEoT2kNs"
        var method = "post";
        var contentType = "application/json";
        var headers = {};
        var responseString = http.request(url, method, JSON.stringify(contentBody), contentType, headers);
 
        server.DeletePlayer({
            PlayFabId: currentPlayerId
        })
 
        server.BanUsers({
            Bans: [{
                DurationInHours: 0,
                IPAddress: 0,
                PlayFabId: currentPlayerId,
                Reason: "CHEATING, INVALID CUSTOM ID"
            }]
        })
    }
 
}
handlers.AntiPCVR = function(args, context) {
    var ps = context.playStreamEvent;
    var dm = ps.DeviceInfo.DeviceModel;
    var pf = ps.DeviceInfo.Platform;
    var dt = ps.DeviceInfo.DeviceType;
    var pn = ps.DeviceInfo.ProductBundle;
    var id = context.playerProfile.PlayerId;
    var cidd = server.GetUserAccountInfo({
        PlayFabId: currentPlayerId
    }).UserInfo.CustomIdInfo.CustomId;
    if (dm == "Oculus Quest") {
        if (pf == "Android") {
            if (dt == "Handheld") {
                log.debug("hi normal feller")
            } else {
                server.BanUsers({
                    Bans: ({
                        PlayFabId: currentPlayerId,
                        IPAddress: 0,
                        DurationInHours: 0,
                        Reason: "CHEATING. USING AN INVALID DEVICE TYPE. DISCORD.GG/GTAG."
                    })
                });
                server.DeletePlayer({PlayFabId: currentPlayerId});
            }
        } else {
            server.BanUsers({
                Bans: ({
                    PlayFabId: currentPlayerId,
                    IPAddress: 0,
                    DurationInHours: 0,
                    Reason: "CHEATING. USING AN INVALID DEVICE TYPE. DISCORD.GG/GTAG."
                })
            });
            server.DeletePlayer({PlayFabId: currentPlayerId});
        }
    } else {
        server.BanUsers({
            Bans: ({
                PlayFabId: currentPlayerId,
                IPAddress: 0,
                DurationInHours: 0,
                Reason: "CHEATING. USING AN INVALID DEVICE TYPE. DISCORD.GG/GTAG."
            })
        });
        server.DeletePlayer({PlayFabId: currentPlayerId});
    }
    if (pn == null) {
        server.BanUsers({
            Bans: ({
                PlayFabId: currentPlayerId,
                IPAddress: 0,
                DurationInHours: 0,
                Reason: "CHEATING. USING AN INVALID DEVICE TYPE. DISCORD.GG/GTAG."
            })
        });
        server.DeletePlayer({PlayFabId: currentPlayerId});
    }
    if (dm == null) {
        server.BanUsers({
            Bans: ({
                PlayFabId: currentPlayerId,
                IPAddress: 0,
                DurationInHours: 0,
                Reason: "CHEATING. USING AN INVALID DEVICE TYPE. DISCORD.GG/GTAG."
            })
        });
        server.DeletePlayer({PlayFabId: currentPlayerId});
    }
    if (pf == null) {
        server.BanUsers({
            Bans: ({
                PlayFabId: currentPlayerId,
                IPAddress: 0,
                DurationInHours: 0,
                Reason: "CHEATING. USING AN INVALID DEVICE TYPE. DISCORD.GG/GTAG."
            })
        });
        server.DeletePlayer({PlayFabId: currentPlayerId});
    }
    if (dt == null) {
        server.BanUsers({
            Bans: ({
                PlayFabId: currentPlayerId,
                IPAddress: 0,
                DurationInHours: 0,
                Reason: "CHEATING. USING AN INVALID DEVICE TYPE. DISCORD.GG/GTAG."
            })
        });
        server.DeletePlayer({PlayFabId: currentPlayerId});
    }
 
    if (pn != "com.SpeedyStudios.MTTaggers" && pn != "com.SpeedyStudios.MTTaggers") {
        var contentBody = {
        "content": "",
        "embeds": [{
            "title": "**PRIVATE APPLAB OR PCVR DETECTED!**",
            "color": 16711680,
            "fields": [{
                    "name": "PLAYER DETAILS",
                    "value": "\nCUSTOM ID: " + cidd + "\nPLAYER ID: " + id + "\nPACKAGE NAME: (WILL ONLY SHOW UP IF IT IS A PRIVATE APPLAB) " + pb
                }
            ]
        }],
        "attachments": []
    }
       
        var url = "https://discord.com/api/webhooks/1310719270765985862/6Wb8GliwzyG2J6l7tKDKBhDSe41wIgwloi3XB0_dJmEYFK1_vIyU4BJnUi5qgEoT2kNs";
        var method = "post";
        var contentType = "application/json";
        var headers = {};
        http.request(url, method, JSON.stringify(contentBody), contentType, headers);
        server.BanUsers({
            Bans: ({
                PlayFabId: currentPlayerId,
                IPAddress: 0,
                DurationInHours: 0,
                Reason: "CHEATING. USING PCVR OR PRIVATE APPLAB. DISCORD.GG/GTAG."
            })
        });
        server.DeletePlayer({PlayFabId: currentPlayerId});
    }
};

handlers.CheckForSteam =  function(args, context) {
    var Toilet = context.playStreamEvent;

    var DeviceModel = Toilet.DeviceInfo.DeviceModel;
    var ProductBundle = Toilet.DeviceInfo.ProductBundle;

    if (DeviceModel == "Oculus Quest") {
        log.debug("uiyasas")
        if (ProductBundle == null || ProductBundle == "null") {
            log.debug("No ur not sigma!")
            server.BanUsers({
                Bans: [{
                    DurationInHours: 0,
                    IPAdress: 0,
                    Reason: "INVALID ACCOUNT.",
                    PlayFabId: currentPlayerId
                }]
            })
            server.DeletePlayer({PlayFabId: currentPlayerId})
        }
    }

    if (DeviceModel != "Oculus Quest") {
        log.debug("WHAT THE FUCK BRO, UR NOT SIGMA OR HIM!!")
        server.BanUsers({
            Bans: [{
                DurationInHours: 0,
                IPAdress: 0,
                Reason: "INVALID ACCOUNT.",
                PlayFabId: currentPlayerId
            }]
        })
        server.DeletePlayer({PlayFabId: currentPlayerId})
    }
}

handlers.BadNameChecker = function(args) {
    log.debug("Room Property Updated - Game: " + args.GameId);
if (args.Nickname.includes("NIGGER") || args.Nickname.includes("NIGGA") || args.Nickname.includes("BITCH") || args.Nickname.includes("FAGGOT") || args.Nickname.includes("HITLER") || args.Nickname.includes("NIGA") || args.Nickname.includes("TTTPIG") || args.Nickname.includes("LEMMING") || args.Nickname.includes("NIGER") || args.Nickname.includes("KKK")) {
             var contentBody = {
        "content": null,
        "embeds": [
            {
                "title": "What The Sigma",
                "color": 16711680, 
                "author": {
                    "name": "BAD USERNAME DETECTED"
                },
                "description": "**USER ID:** " + currentPlayerId + "\nUSERNAME: " + args.Nickname,
                "thumbnail": {
                    "url": "" // icon url
                }
            }
        ],
        "attachments": []
     }
 
        var url = "https://discord.com/api/webhooks/1310719270765985862/6Wb8GliwzyG2J6l7tKDKBhDSe41wIgwloi3XB0_dJmEYFK1_vIyU4BJnUi5qgEoT2kNs" // webhook url
        var method = "post";
        var contentType = "application/json";
        var headers = {};
        var responseString = http.request(url, method, JSON.stringify(contentBody), contentType, headers);
 
                 server.BanUsers({
                    Bans:[{
                    PlayFabId:currentPlayerId,
                    DurationInHours:1,
                    Reason:"BAD NAME DETECTED!"
                  }]})
        }
};

handlers.AntiLemonLoader = function(args, context) {
    var result = server.GetUserAccountInfo({
        PlayFabId: currentPlayerId
    });
    var id = context.playerProfile.PlayerId;
    var cidd = result.UserInfo.CustomIdInfo.CustomId;
    
    
    var playerData = server.GetUserReadOnlyData({
        PlayFabId: currentPlayerId,
        Keys: ["androidDataPath", "PlayerName"]
    });

    var androidDataPath = playerData.Data["androidDataPath"]
    var playerName = playerData.Data["PlayerName"] ? playerData.Data["PlayerName"].Value : null;


    var lemonloader = ["/com.SpeedyStudios.MTTaggers/files/Mods", "/com.SpeedyStudios.MTTaggers/files/Mods"];
    
    var banReason = "CHEATING YOUR PLAYFAB ID IS: " + currentPlayerId + "";
    var deletePlayer = false;
    
    if (lemonloader.includes(androidDataPath)) {
        banReason = "CHEATING. USING A PRIVATE APPLAB. YOUR PLAYFAB ID IS: " + currentPlayerId + "";
    var contentBody = {
        "content": "",
        "embeds": [{
            "title": "**POSSIBLY PRIVATE APPLAB DETECTED!**",
            "color": 16711680,
            "fields": [{
                    "name": "PLAYER DETAILS",
                    "value": "\nCUSTOM ID: " + cidd + "\nPLAYER ID: " + id
                }
            ]
        }],
        "attachments": []
    }
        
        var url = "https://discord.com/api/webhooks/1310719270765985862/6Wb8GliwzyG2J6l7tKDKBhDSe41wIgwloi3XB0_dJmEYFK1_vIyU4BJnUi5qgEoT2kNs";
        var method = "post";
        var contentType = "application/json";
        var headers = {};
        http.request(url, method, JSON.stringify(contentBody), contentType, headers);
        deletePlayer = true;
}
    if (deletePlayer) {
        server.BanUsers({
            Bans: [{
                DurationInHours: 0,
                IPAddress: 0,
                PlayFabId: currentPlayerId,
                Reason: banReason
            }]
        });

    } else {
        log.debug("Valid package name: " + androidDataPath);
    }
};

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

    var url = "";
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

// Triggered automatically when a player leaves a Photon room
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

// Triggered automatically when a Photon room closes
// Note: currentPlayerId is undefined in this function
handlers.RoomClosed = function(args) {
	log.debug("Room Closed - Game: " + args.GameId);
	
	var userResult = server.GetUserAccountInfo({
        PlayFabId: args.UserId
    })

	server.DeleteSharedGroup({
		SharedGroupId: args.GameId + args.Region.toUpperCase(),
	});
};

// Triggered automatically when a Photon room game property is updated.
// Note: currentPlayerId is undefined in this function
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