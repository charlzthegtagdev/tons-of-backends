handlers.ReturnCurrentVersionNew = function (args) {
    return { "ResultCode": 0, "BannedUsers": 21, "MOTD": "MOTD FR", "SynchTime": "30", "Version": "live", "Message": "live" }
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

// This an example of a function that calls a PlayFab Entity API. The function is called using the 
// 'ExecuteEntityCloudScript' API (https://api.playfab.com/documentation/CloudScript/method/ExecuteEntityCloudScript).
handlers.makeEntityAPICall = function (args, context) {

    // The profile of the entity specified in the 'ExecuteEntityCloudScript' request.
    // Defaults to the authenticated entity in the X-EntityToken header.
    var entityProfile = context.currentEntity;

    // The pre-defined 'entity' object has functions corresponding to each PlayFab Entity API,
    // including 'SetObjects' (https://api.playfab.com/documentation/Data/method/SetObjects).
    var apiResult = entity.SetObjects({
        Entity: entityProfile.Entity,
        Objects: [
            {
                ObjectName: "obj1",
                DataObject: {
                    foo: "some server computed value",
                    prop1: args.prop1
                }
            }
        ]
    });

    return {
        profile: entityProfile,
        setResult: apiResult.SetResults[0].SetResult
    };
};

// This is a simple example of making a web request to an external HTTP API.
handlers.makeHTTPRequest = function (args, context) {
    var headers = {
        "X-MyCustomHeader": "Some Value"
    };
    
    var body = {
        input: args,
        userId: currentPlayerId,
        mode: "foobar"
    };

    var url = "http://httpbin.org/status/200";
    var content = JSON.stringify(body);
    var httpMethod = "post";
    var contentType = "application/json";

    // The pre-defined http object makes synchronous HTTP requests
    var response = http.request(url, httpMethod, content, contentType, headers);
    return { responseContent: response };
};

// This is a simple example of a function that is called from a
// PlayStream event action. (https://playfab.com/introducing-playstream/)
handlers.handlePlayStreamEventAndProfile = function (args, context) {
    
    // The event that triggered the action 
    // (https://api.playfab.com/playstream/docs/PlayStreamEventModels)
    var psEvent = context.playStreamEvent;
    
    // The profile data of the player associated with the event
    // (https://api.playfab.com/playstream/docs/PlayStreamProfileModels)
    var profile = context.playerProfile;
    
    // Post data about the event to an external API
    var content = JSON.stringify({ user: profile.PlayerId, event: psEvent.EventName });
    var response = http.request('https://httpbin.org/status/200', 'post', content, 'application/json', null);

    return { externalAPIResponse: response };
};


// Below are some examples of using Cloud Script in slightly more realistic scenarios

// This is a function that the game client would call whenever a player completes
// a level. It updates a setting in the player's data that only game server
// code can write - it is read-only on the client - and it updates a player
// statistic that can be used for leaderboards. 
//
// A funtion like this could be extended to perform validation on the 
// level completion data to detect cheating. It could also do things like 
// award the player items from the game catalog based on their performance.
handlers.completedLevel = function (args, context) {
    var level = args.levelName;
    var monstersKilled = args.monstersKilled;
    
    var updateUserDataResult = server.UpdateUserInternalData({
        PlayFabId: currentPlayerId,
        Data: {
            lastLevelCompleted: level
        }
    });

    log.debug("Set lastLevelCompleted for player " + currentPlayerId + " to " + level);
    var request = {
        PlayFabId: currentPlayerId, Statistics: [{
                StatisticName: "level_monster_kills",
                Value: monstersKilled
            }]
    };
    server.UpdatePlayerStatistics(request);
    log.debug("Updated level_monster_kills stat for player " + currentPlayerId + " to " + monstersKilled);
};


// In addition to the Cloud Script handlers, you can define your own functions and call them from your handlers. 
// This makes it possible to share code between multiple handlers and to improve code organization.
handlers.updatePlayerMove = function (args) {
    var validMove = processPlayerMove(args);
    return { validMove: validMove };
};


// This is a helper function that verifies that the player's move wasn't made
// too quickly following their previous move, according to the rules of the game.
// If the move is valid, then it updates the player's statistics and profile data.
// This function is called from the "UpdatePlayerMove" handler above and also is 
// triggered by the "RoomEventRaised" Photon room event in the Webhook handler
// below. 
//
// For this example, the script defines the cooldown period (playerMoveCooldownInSeconds)
// as 15 seconds. A recommended approach for values like this would be to create them in Title
// Data, so that they can be queries in the script with a call to GetTitleData
// (https://api.playfab.com/Documentation/Server/method/GetTitleData). This would allow you to
// make adjustments to these values over time, without having to edit, test, and roll out an
// updated script.
function processPlayerMove(playerMove) {
    var now = Date.now();
    var playerMoveCooldownInSeconds = 15;

    var playerData = server.GetUserInternalData({
        PlayFabId: currentPlayerId,
        Keys: ["last_move_timestamp"]
    });

    var lastMoveTimestampSetting = playerData.Data["last_move_timestamp"];

    if (lastMoveTimestampSetting) {
        var lastMoveTime = Date.parse(lastMoveTimestampSetting.Value);
        var timeSinceLastMoveInSeconds = (now - lastMoveTime) / 1000;
        log.debug("lastMoveTime: " + lastMoveTime + " now: " + now + " timeSinceLastMoveInSeconds: " + timeSinceLastMoveInSeconds);

        if (timeSinceLastMoveInSeconds < playerMoveCooldownInSeconds) {
            log.error("Invalid move - time since last move: " + timeSinceLastMoveInSeconds + "s less than minimum of " + playerMoveCooldownInSeconds + "s.");
            return false;
        }
    }

    var playerStats = server.GetPlayerStatistics({
        PlayFabId: currentPlayerId
    }).Statistics;
    var movesMade = 0;
    for (var i = 0; i < playerStats.length; i++)
        if (playerStats[i].StatisticName === "")
            movesMade = playerStats[i].Value;
    movesMade += 1;
    var request = {
        PlayFabId: currentPlayerId, Statistics: [{
                StatisticName: "movesMade",
                Value: movesMade
            }]
    };
    server.UpdatePlayerStatistics(request);
    server.UpdateUserInternalData({
        PlayFabId: currentPlayerId,
        Data: {
            last_move_timestamp: new Date(now).toUTCString(),
            last_move: JSON.stringify(playerMove)
        }
    });

    return true;
}

// This is an example of using PlayStream real-time segmentation to trigger
// game logic based on player behavior. (https://playfab.com/introducing-playstream/)
// The function is called when a player_statistic_changed PlayStream event causes a player 
// to enter a segment defined for high skill players. It sets a key value in
// the player's internal data which unlocks some new content for the player.
handlers.unlockHighSkillContent = function (args, context) {
    var playerStatUpdatedEvent = context.playStreamEvent;
    var request = {
        PlayFabId: currentPlayerId,
        Data: {
            "HighSkillContent": "true",
            "XPAtHighSkillUnlock": playerStatUpdatedEvent.StatisticValue.toString()
        }
    };
    var playerInternalData = server.UpdateUserInternalData(request);
    log.info('Unlocked HighSkillContent for ' + context.playerProfile.DisplayName);
    return { profile: context.playerProfile };
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
handlers.RoomCreated = function (args) {
    log.debug("Room Created - Game: " + args.GameId + " MaxPlayers: " + args.CreateOptions.MaxPlayers);
};

// Triggered automatically when a player joins a Photon room
handlers.RoomJoined = function (args) {
    log.debug("Room Joined - Game: " + args.GameId + " PlayFabId: " + args.UserId);
};

// Triggered automatically when a player leaves a Photon room
handlers.RoomLeft = function (args) {
    log.debug("Room Left - Game: " + args.GameId + " PlayFabId: " + args.UserId);
};

// Triggered automatically when a Photon room closes
// Note: currentPlayerId is undefined in this function
handlers.RoomClosed = function (args) {
    log.debug("Room Closed - Game: " + args.GameId);
};

// Triggered automatically when a Photon room game property is updated.
// Note: currentPlayerId is undefined in this function
handlers.RoomPropertyUpdated = function (args) {
    log.debug("Room Property Updated - Game: " + args.GameId);
};

// Triggered by calling "OpRaiseEvent" on the Photon client. The "args.Data" property is 
// set to the value of the "customEventContent" HashTable parameter, so you can use
// it to pass in arbitrary data.
handlers.RoomEventRaised = function (args) {
    var eventData = args.Data;
    log.debug("Event Raised - Game: " + args.GameId + " Event Type: " + eventData.eventType);

    switch (eventData.eventType) {
        case "playerMove":
            processPlayerMove(eventData);
            break;

        default:
            break;
    }
};

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
