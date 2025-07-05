// INSTA STUFF

const Instaban = [
"", //BLANK
"" //BLANK
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





// MOTD


handlers.ReturnCurrentVersionNew = function(args){
    return {"ResultCode":0,"BannedUsers":"999999","MOTD":"motd here","SynchTime":"-LOADING-","Version":"beta1.1.1.62", "Message":"beta1.1.1.62"}
}


handlers.ReturnCurrentVersion = function(args) {
    var messageoftheday = "motd here";
    var gameversion = "beta1.1.1.62";

	return {
        "ResultCode":0,
		"BannedUsers": "69420",
		"MOTD": messageoftheday.toString(),
		"SynchTime": "-LOADING-",
		"Message": gameversion.toString(),
		"Version": gameversion.toString(),
        
	}
}


// BAD NAMES
const BadNames = [
    "NIGGA",
    "NIGGER",
    "NIQQA",
    "NIGQA",
    "NIQGA",
    "NIKKA",
    "NIGGE",
    "NIGGGER",
    "NIGGGA",
    "NIGGERS",
    "NIGGAS",
    "N1GGA",
    "FAG",  
    "FAGGOT",
    "FAGS",
    "FAGGOTS",
    "FAQQOT",
    "FAQ",
    "FAGG0T",
    "KKK",
    "KKX",
    "KXK",
    "XKK",
    "KXX",
    "XKX",
    "XXK",
    "XXX",
    "PORN",
    "PORNHUB",
    "PHUB",
    "CP",
    "CHILDPORN",
    "RAPE",
    "RAPER",
    "RAPIST",
    "FUCK",
    "SHIT",
    "BITCH",
    "ASS",
    "RETARD",
    "COCK",
    "DICK",
    "ASSHOLE",
    "COCKSUCKER",
    "ELLIOT",
    "JMAN",
    "JMANCURLY",
    "VMT",
    "K9",
    "GAYMANCURLY",
    "FAADUE",
    "SAVA",
    "TTTPIG",
    "TTPIG",
    "PURSUIT",
    "CUBCUB",
    "FAGGOTVR",
    "FAGVR",
    "NIGGERVR",
    "NIGGAVR",
    "NUT",
    "SEMEN",
    "@everyone"
];




handlers.CheckForBadName = function (args, context) {
    const badNames = [
    "NIGGA",
    "NIGGER",
    "NIQQA",
    "NIGQA",
    "NIQGA",
    "NIKKA",
    "NIGGE",
    "NIGGGER",
    "NIGGGA",
    "NIGGERS",
    "NIGGAS",
    "N1GGA",
    "FAG",  
    "FAGGOT",
    "FAGS",
    "FAGGOTS",
    "FAQQOT",
    "FAQ",
    "FAGG0T",
    "KKK",
    "KKX",
    "KXK",
    "XKK",
    "KXX",
    "XKX",
    "XXK",
    "XXX",
    "PORN",
    "PORNHUB",
    "PHUB",
    "CP",
    "CHILDPORN",
    "RAPE",
    "RAPER",
    "RAPIST",
    "FUCK",
    "SHIT",
    "BITCH",
    "ASS",
    "RETARD",
    "COCK",
    "DICK",
    "ASSHOLE",
    "COCKSUCKER",
    "ELLIOT",
    "JMAN",
    "JMANCURLY",
    "VMT",
    "K9",
    "GAYMANCURLY",
    "FAADUE",
    "SAVA",
    "TTTPIG",
    "TTPIG",
    "PURSUIT",
    "CUBCUB",
    "FAGGOTVR",
    "FAGVR",
    "NIGGERVR",
    "NIGGAVR",
    "NUT",
    "SEMEN",
    "@everyone"
    ];

    var getPlayerProfileRequest = {
        PlayFabId: currentPlayerId
    };
    var playerProfile = server.GetPlayerProfile(getPlayerProfileRequest);
    var displayName = playerProfile.PlayerProfile.DisplayName;

    if (badNames.includes(displayName.toUpperCase())) {
        var banRequest = {
            PlayFabId: currentPlayerId,
            Reason: "BAD NAME.",
            DurationInHours: 6
        };
        server.BanUsers({ Bans: [banRequest] });
    }

    if (displayName.length == 0 && displayName > 12) {
        server.BanUsers({ 
            Bans:({
            PlayFabId: currentPlayerId,
            Reason: "CHEATING. INVALID NAME.",
            DurationInHours: 0
            })
        });
    }
}




handlers.BanMe = function(args) {
    var Hours = 1;
    var Name = args.Name;
    var result = server.BanUsers({
        Bans: [{
            PlayFabId: currentPlayerId,
            DurationInHours: Hours,
            Reason: "BANNED FOR PUTTING / JOINING NAME / CODE " + Name + ". " + Hours + ""
        }]
    });
}



handlers.BanMeNew = function(args) {
    var Hours = 1;
    var Name = args.Name;
    var result = server.BanUsers({
        Bans: [{
            PlayFabId: currentPlayerId,
            DurationInHours: Hours,
            Reason: "BANNED FOR PUTTING / JOINING NAME / CODE " + Name + ". " + Hours + ""
        }]
    });
}





// Triggered automatically when a Photon room is first created
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
    })

	var concatItems = handlers.GetPlayerInventory();

	var sharedGroupId = args.GameId + args.Region.toUpperCase();
	
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
	var contentBody = {
        
        "content": null,
        "embeds": [
        {
        "title": "",
        "description": "Room Joined: " + args.GameId + "\n" + "Region: " + args.Region + "\n" + "Username: " + userResult.UserInfo.TitleInfo?.DisplayName + "\n" + "ID: " + args.UserId,
        "color": 2815,
        "author": {
        "name": "UsersLog"
            }
        }   
        ],
        "attachments": []
    };
//This is for room logging
var url = "https://discord.com/api/webhooks/1357212156344668192/6K1Jm0PTFrw1vcWJ0YH6CE95ymxu8oiQqeEfbsfcvIxBq2JkiucUfcFbBISHaq5YZNQV";
var method = "post";
var contentType = "application/json";
var headers = {};
var responseString =  http.request(url,method,JSON.stringify(contentBody),contentType,headers);
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
            "title": "",
            "description": "**Reported: ** " + args.Data[0] + "\nReason: " + ReportButtonNames(args.Data[1]) + "\nIn Room: " + args.GameId + "\nUsername: " + args.Nickname + "\n**Reported Username: ** " + args.Data[2],
            "color": 65515,
            "author": {
            "name": "UsersLog"
                }
            }   
            ],
            "attachments": []
            };
            var url = "https://discord.com/api/webhooks/1357212156344668192/6K1Jm0PTFrw1vcWJ0YH6CE95ymxu8oiQqeEfbsfcvIxBq2JkiucUfcFbBISHaq5YZNQV";
            var method = "post";
            var contentType = "application/json";
            var headers = {};
            var responseString =  http.request(url,method,JSON.stringify(contentBody),contentType,headers);
        if(Admins.includes(currentPlayerId)){
            server.BanUsers({
				Bans: [{
					PlayFabId: args.Data[0],
					DurationInHours: "480",
					Reason: "BANNED FOR " + ReportButtonNames(args.Data[1]) + "\nBY: " + args.Nickname
				}]
			});
            var contentBody = {
        
            "content": null,
            "embeds": [
            {
            "title": "",
            "description": "**Reported: ** " + args.Data[0] + "\nReason: " + ReportButtonNames(args.Data[1]) + "\nIn Room: " + args.GameId + "\nModerator Username: " + args.Nickname + "\n**Reported Username: ** " + args.Data[2],
            "color": 65515,
            "author": {
            "name": "UsersLog"
                }
            }   
            ],
            "attachments": []
            };
            var url = "https://discord.com/api/webhooks/1357212156344668192/6K1Jm0PTFrw1vcWJ0YH6CE95ymxu8oiQqeEfbsfcvIxBq2JkiucUfcFbBISHaq5YZNQV";
            var method = "post";
            var contentType = "application/json";
            var headers = {};
            var responseString =  http.request(url,method,JSON.stringify(contentBody),contentType,headers);
        }
    }

    if (args.EvCode.toString() == "51") {
        
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

    var url = "https://discord.com/api/webhooks/1357212156344668192/6K1Jm0PTFrw1vcWJ0YH6CE95ymxu8oiQqeEfbsfcvIxBq2JkiucUfcFbBISHaq5YZNQV";
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
 


// SS
 function CySided(args, type = null) {
    var newSS = false;

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
}

handlers.RoomJoined = function (args) {
    CySided(args);
}

handlers.RoomCreated = function (args) {
    CySided(args);
}

handlers.RoomClosed = function (args) {
    CySided(args);
}

handlers.RoomLeft = function (args) {
    CySided(args);
}

handlers.UpdatePersonalCosmeticsList = function (args) {
    const id = currentPlayerId + "Inventory";
    
    try {
        server.GetSharedGroupData({
            SharedGroupId: id
        });
    }
    catch {
        server.CreateSharedGroup({
            SharedGroupId: id
        });
        server.AddSharedGroupMembers({
            PlayFabIds: [currentPlayerId],
            SharedGroupId: id
        });
    }
    finally {
        server.UpdateSharedGroupData({
            SharedGroupId: id,
            Data: {
                "Inventory": GetPlayerInventory(currentPlayerId)
            },
            Permission: "Public"
        });
    }
    
    return {};
}


function GetPlayerInventory(pid) {
    let concatItems = "ITEMS.";
    
    var req = server.GetUserInventory({
        PlayFabId: pid
    });

    req.Inventory?.forEach(x => {
        concatItems += x.ItemId.toString();
    });

    return concatItems;
}

// AUTH

handlers.CovidTagAuth = function() {
    const userResult = server.GetUserAccountInfo({ PlayFabId: currentPlayerId });
    if (userResult.UserInfo.CustomIdInfo?.CustomId &&
        userResult.UserInfo.CustomIdInfo.CustomId.length >= 20 &&
        userResult.UserInfo.CustomIdInfo.CustomId.length <= 23) {
        const validChars = 'OCULUS0123456789';
        const isValidContent = [...userResult.UserInfo.CustomIdInfo.CustomId].every(char => validChars.includes(char));
        if (!isValidContent) {
            banAndDeletePlayer(currentPlayerId, "BANNED FOR INVALID CHARACTERS IN CUSTOM ID");
            return;
        }
        switch (userResult.UserInfo.CustomIdInfo.CustomId) {
            case "OCULUS0":
                logger.Info(`Player ${currentPlayerId} modded the game!`);
                banAndDeletePlayer(currentPlayerId, "BANNED FOR MODDING THE GAME");
                break;
            default:
                break;
        }
    } else {
        banAndDeletePlayer(currentPlayerId, "BANNED FOR NOT MEETING CUSTOM ID CRITERIA");
    }
    server.UpdateUserReadOnlyData({
        PlayFabId: currentPlayerId,
        Data: { Verified: true }
    });
};

function banAndDeletePlayer(playerId, reason) {
    server.BanUsers({
        Bans: [{ PlayFabId: playerId, Reason: reason }]
    });
    server.DeletePlayer({ PlayFabId: playerId });
};



// ANIT CHEAT
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

    if(STAFF.hasOwnProperty(currentPlayerId)) {
       return;
    }

    if (anticheatReasons.includes(suspiciousReason)) {
        const isBanned = server.GetUserAccountInfo({ PlayFabId: playFabId }).UserInfo.TitleInfo.isBanned;
        if (isBanned){return}; // Stops multiple bans beacuse of anticheat
        server.BanUsers({
            Bans: [{
                DurationInHours: "72",
                IPAddress: 0,
                PlayFabId: suspiciousPlayerId,
                Reason: banReason + "\nPLAYER ID: " + currentPlayerId
            }]
        });
        logger.AntiCheat(`**ANTICHEAT**\nPlayer: ${suspiciousPlayerName}\nReason: ${suspiciousReason}\nRoom: ${room}\nPlayers: ${players}`);
    }
};

handlers.CheckForBadName = function(args) {
    if (BadNames.includes(args.name)) {
        server.BanUsers({
            Bans: [{
                PlayFabId: currentPlayerId,
                DurationInHours: 24,
                Reason: "USE YOUR HEAD NEXT TIME, BAD USERNAME! ID: " + currentPlayerId
            }]
        })

        return {result : 2}
    }else{
        return {result : 0}
    }
};

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
    var webhookURL = ""; 
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

  var url = "";
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
                Reason: ReportButtonNames(args.Data[1]) + "\nBY " + reportingUsername + "you got banned haha"
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
        var staffUrl = "";
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
        var url = "";
        var method = "post";
        var contentType = "application/json";
        var headers = {};
        var responseString = http.request(moderatorUrl, method, JSON.stringify(moderatorContentBody), contentType, headers);
        var playerBans = server.GetUserBans({ PlayFabId: currentPlayerId }).BanData;
        var previousBans = playerBans.length;
        var banDuration = calculateBanDuration(previousBans)
}
    if (args.EvCode.toString() == "51") {
        // mutes
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

handlers.RoomJoined = function (args) {
    CySided(args);

};

handlers.RoomCreated = function (args) {
    CySided(args);

};

handlers.RoomClosed = function (args) {
    CySided(args);

};

handlers.RoomLeft = function (args) {
    CySided(args);

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





//SS V2  (creds screamingcat)



function ScreamingcatServerSided(args, type=null) {

  var res = server.GetUserInventory({
    PlayFabId: args.UserId
  })

  var code = args.GameId;
  var region = args.Region.toUpperCase();

  var groupid = code + region

  var actor = args.ActorNr;
  var userid = args.UserId;
  
  let ItemIds = ""

  res.Inventory.forEach((x) => {
      ItemIds += x.ItemId
  })


  server.UpdateUserReadOnlyData({
    PlayFabId: userid,
    Data: {
      "Inventory": ItemIds
    }
  })

    // IM RUNNING OUT OF NAMES AHJBFHJRGHJKLFD

    // if your game is above Spring Cleaning 2023 update, set it to true.
    // if your game is below Spring Cleaning 2023 update, set it to false.
    var AdvancedServerSided = true;

    if (AdvancedServerSided) {
        if (args.Type == "Create") {

        server.CreateSharedGroup({
            SharedGroupId: groupid
        })

        server.AddSharedGroupMembers({
            SharedGroupId: groupid,
            PlayFabIds: [userid]
        })

        server.UpdateSharedGroupData({
            SharedGroupId: groupid,
            Data: {
                [actor] : ItemIds
            },
            Permission: "Public"
        })
       
        }

        if (args.Type == "Join") {

        server.AddSharedGroupMembers({
            SharedGroupId: groupid,
            PlayFabIds: [userid]
        })

        server.UpdateSharedGroupData({
            SharedGroupId: groupid,
            Data: {
                [actor]: ItemIds  // args.ActorNr
            },
            Permission: "Public"
        })
        
        }


        if (type == "EvCode10") {

        server.AddSharedGroupMembers({
            SharedGroupId: groupid,
            PlayFabIds: [userid]
        })

        server.UpdateSharedGroupData({
            SharedGroupId: groupid,
            Data: {
                [actor]: ItemIds  // args.ActorNr
            },
            Permission: "Public"
        })
        }

        if (type == "EvCode9") {

        server.AddSharedGroupMembers({
            SharedGroupId: groupid,
            PlayFabIds: [userid]
        })

        server.UpdateSharedGroupData({
            SharedGroupId: groupid,
            Data: {
                [actor]: ItemIds  // args.ActorNr
            },
            Permission: "Public"
        })
        }
        if (args.Type == "ClientDisconnect") {

        server.RemoveSharedGroupMembers({
            SharedGroupId: groupid,
            PlayFabIds: [userid]
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
            PlayFabIds: [userid]
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
    } else if (AdvancedServerSided == false) {
    if (args.Type == "Create") {

        server.CreateSharedGroup({
            SharedGroupId: groupid
        })

        server.AddSharedGroupMembers({
            SharedGroupId: groupid,
            PlayFabIds: [userid]
        })

        server.UpdateSharedGroupData({
            SharedGroupId: groupid,
            Data: {
                [userid] : ItemIds
            },
            Permission: "Public"
        })
        
        }

        if (args.Type == "Join") {

        server.AddSharedGroupMembers({
            SharedGroupId: groupid,
            PlayFabIds: [userid]
        })

        server.UpdateSharedGroupData({
            SharedGroupId: groupid,
            Data: {
                [userid]: ItemIds  // args.ActorNr
            },
            Permission: "Public"
        })
        }

        if (type == "EvCode9") {

        server.AddSharedGroupMembers({
            SharedGroupId: groupid,
            PlayFabIds: [userid]
        })

        server.UpdateSharedGroupData({
            SharedGroupId: groupid,
            Data: {
                [userid]: ItemIds  // args.ActorNr
            },
            Permission: "Public"
        })
        }
        if (args.Type == "ClientDisconnect") {

        server.RemoveSharedGroupMembers({
            SharedGroupId: groupid,
            PlayFabIds: [userid]
        })

        server.UpdateSharedGroupData({
            SharedGroupId: groupid, 
            KeysToRemove: [userid], 
            Permission: "Public"
        });
        }

        if (args.Type == "TimeoutDisconnect") {
        server.RemoveSharedGroupMembers({
            SharedGroupId: groupid,
            PlayFabIds: [userid]
        })

        server.UpdateSharedGroupData({
            SharedGroupId: groupid, 
            KeysToRemove: [userid], 
            Permission: "Public"
        });
        }

        if (args.Type == "Close") {

        server.DeleteSharedGroup({
            SharedGroupId: groupid
        })
        }
    }
}

handlers.RoomCreated = function(args) {
  ScreamingcatServerSided(args)
  return { ResultCode : 0, Message: "success" };
}
handlers.RoomJoined = function(args) {
  ScreamingcatServerSided(args)
  return { ResultCode : 0, Message: "success" };
}
handlers.RoomLeft = function(args) {
  ScreamingcatServerSided(args)
  return { ResultCode : 0, Message: "success" };
}
handlers.RoomClosed = function(args) {
  ScreamingcatServerSided(args)
  return { ResultCode : 0, Message: "success" };
}