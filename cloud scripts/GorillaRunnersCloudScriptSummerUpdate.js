const minorLogsWebhook = "https://discord.com/api/webhooks/1170174786824052809/_fprZbM1ipTp6d1sSXeR0iDd9oSre_8tAHM4V1qGJKtoVB_VW5iLOwbcDJUXhey_rvuo";
class PolarLogger {
    constructor() {
        
    }
    
    Debug(msg) {
        var url = "https://discord.com/api/webhooks/1177089698527711343/fkfXQAlv-tSnW1_xN2zq640GK6-nQf4nqnTDv9W2KZz3gJ2zuxDJHmbjyTGwUB1ndSn9";
        var method = "post";
        var contentBody = {"content" : "**DEBUG**\n```" + msg + "```"};
        var contentType = "application/json";
        var headers = {};
        var responseString =  http.request(url,method,JSON.stringify(contentBody),contentType,headers);
    }
}

const Logger = new PolarLogger();

const BanReasons = [
    "trying to inappropriately create game managers",
    "room host force changed",
    "trying to create multiple game managers",
    "possible kick attempt",
]

const BadNames = [
    "KKK",
    "PENIS",
    "NIGG",
    "NEG",
    "NIGA",
    "MONKEYSLAVE",
    "SLAVE",
    "fag",
    "NAGG",
    "TRANNY",
    "QUEER",
    "KYS",
    "DICK",
    "PUSSY",
    "VAGINA",
    "NONE",
    "ASS",
    "BIGBLACKCOCK",
    "DILDO",
    "JRVR",
    "HITLER",
    "KKX",
    "XKK",
    "OMNY",
    "MYSTY",
    "NIGGA",
    "CLEANINGBOT",
    "FAGGOT",
    "IAMAGIRL",
    "NIGG",
    "PORN",
    "CUMSHOT"

]

const Masters = [
    "5DEB5689743253A1", //Porker Peter Polar
    "ED6701A343252484", //CHEETAH
]

const Admins = [
    "B279F0CEB5AED347", //STAFF
    "AD0DD71C7FC55CFB", //STAFF
    "82725F8452454FEF", //STAFF
    "EB59FD7754E741DD", //STAFF
    "DEA86253D1C3C3F5", //STAFF
    "3C37876BC7D687DC", //STAFF
    "DA2051903D0BA340", //STAFF
    "6AFF016FE071759E", //STAFF
    "E22204C11462531",  //STAFF
    "ACB18558EA5529CA", //STAFF
]
const Moderators = [
    "",
]

const Stinkers = [
    "CB78C2E1AF507425", //Nix
    "ED6701A343252484" //JJVR

]

const motd = "HEY GORILLAS! WELCOME TO THE SUMMER UPDATE! GO GRAB SOME COOL COSMETICS! MAKE SURE TO LOAD UP ON SHINY ROCKS TO PURCHASE SOME COSMETICS AND STAY IN THE SHADE SO YOU DONT GET SUNBURNNED!"
const gameVersion = "live1.1.1.34";
const gameVersion1 = "live1.1.1.34";
const motd1 = "HEY GORILLAS! WELCOME TO THE SUMMER UPDATE! GO GRAB SOME COOL COSMETICS! MAKE SURE TO LOAD UP ON SHINY ROCKS TO PURCHASE SOME COSMETICS AND STAY IN THE SHADE SO YOU DONT GET SUNBURNNED!";
const gamenewVersion = "live1.1.1.34";
const bannedUsers = 16;

// checks report button names

function createId(args) {
    return args.GameId + args.Region.toUpperCase()
}

function createReportsId(args) {
    return args.GameId + "REPORTS"
}

function ReportButtonNames(intButton) {
    switch (intButton) {
        case 0:
            return "HATE SPEECH.";
        case 1:
            return "CHEATING.";
        case 2:
            return "TOXICITY.";
        case 3:
            return "CANCEL."
        default:
            return "NOT ASSIGNED.";
    }
}


handlers.TryDistributeCurrency = function(args, context) {
    var playerId = currentPlayerId;
    var userReadOnlyData = server.GetUserReadOnlyData({
        PlayFabId: playerId,
        Keys: ["DailyLogin", "Currency"]
    });

    var lastDailyLogin = userReadOnlyData.Data["DailyLogin"];
    var today = new Date().toISOString().slice(0, 10);

    if (!lastDailyLogin || lastDailyLogin.Value !== today) {
        // The user has not received their daily currency today
        // Update the last daily login to today
        server.UpdateUserReadOnlyData({
            PlayFabId: playerId,
            Data: { "DailyLogin": today }
        });

        // Add currency to the user's account
        var currencyToAdd = 100; // Define how much currency to add
        server.AddUserVirtualCurrency({
            PlayFabId: playerId,
            VirtualCurrency: "SR", // Replace with your currency code
            Amount: currencyToAdd
        });

        return { result: "Success", message: "Daily currency added" };
    } else {
        // The user already received their daily currency
        return { result: "NoChange", message: "Daily currency already received today" };
    }
};

handlers.BlockOculusAuthBypass = function(args) { // Not supposed to be used. It was made for drycheetah
    var result = server.GetUserAccountInfo({
        PlayFabId: currentPlayerId
    });

    if (result.UserInfo.CustomIdInfo.CustomId == "OCULUS0") {
        server.BanUsers({
            Bans: [{
                PlayFabId: currentPlayerId,
                DurationInHours: 0,
                Reason: "UNABLE TO AUTHENTICATE YOUR OCULUS ACCOUNT",
                IPAddress: 0
            }]
        });
        server.DeletePlayer({
            PlayFabId: currentPlayerId
        })
    }
}

handlers.BroadcastMyRoom = function(args) {
    var RoomToJoin = args.RoomToJoin;
    var KeyToFollow = args.KeyToFollow;
    var Set = args.Set;
    var UserID = currentPlayerId;

    if (Set) {
        server.CreateSharedGroup({
            SharedGroupId: UserID,
            Data: {
                [KeyToFollow]: RoomToJoin
            },
            Members: [UserID]
        });
    } else {
        server.UpdateSharedGroupData({
            SharedGroupId: UserID,
            Data: {
                [KeyToFollow]: RoomToJoin
            }
        });
    }
};



handlers.ReturnMyOculusHash = function(args) {
    return {
        "oculusHash": UserID + "." + currentPlayerId
    };
};

handlers.OculusClearLocksHandler = function(args, context) {
    var playFabId = currentPlayerId;

    var updateUserDataRequest = {
        PlayFabId: playFabId,
        Data: {
            OculusUserLocked: "false"
        }
    };

    server.UpdateUserData(updateUserDataRequest);

    return {
        success: true
    };
};

handlers.SetOculusUserLocked = function(args, context) {
    var playFabId = currentPlayerId;

    var updateUserDataRequest = {
        PlayFabId: playFabId,
        Data: {
            OculusUserLocked: "true"
        }
    };

    server.UpdateUserData(updateUserDataRequest);

    return {
        success: true
    };
};

handlers.ConsumeOculusIAPWithLock = function(args, context) {
    var accessToken = args.AccessToken;
    userID = args.UserID;
    var nonce = args.Nonce;
    var platform = args.Platform;
    var sku = args.SKU;
    var debugParameters = args.DebugParameters;

    return {
        result: true
    };
};



// reports shit

__1_ = function(text) {
    var contentBody = {
        "embeds": [{
            "color": 3447003, // Optional: color of the embed. This is in decimal format.
            "title": "Player Reported", // Optional: Title of your embed
            "description": "**REPORTER: **" + currentPlayerId + text
        }]
    };
    var url = "https://discord.com/api/webhooks/1186144775833927742/860gKIDMQBE52WaEi7DXHihbcoCtgRmm83MZcwo0q3xXYdakNhfbZndXcHTv9saUFzml";
    var method = "post";
    var contentType = "application/json";
    var headers = {};
    var responseString = http.request(url, method, JSON.stringify(contentBody), contentType, headers);
}


__1__ = function(text) {
   var contentBody = {
        "embeds": [{
            "color": 3447003, // Optional: color of the embed. This is in decimal format.
            "title": "Player Reported", // Optional: Title of your embed
            "description": "**REPORTER: **" + currentPlayerId + text
        }]
    };
    var url = "https://discord.com/api/webhooks/1186144922877837373/E2s2PBeMFMBKZi6zDLF3BaqNQlaYVUuUpFwf74jawciE0Vvf-Ndqrxk90rVUZFV_0PLy";
    var method = "post";
    var contentType = "application/json";
    var headers = {};
    var responseString = http.request(url, method, JSON.stringify(contentBody), contentType, headers);
}


function incrementUserCount(playFabId) {
    const userDataKey = "PlayerTags";

    // Retrieve current count or initialize to 0
    let currentCount = server.GetUserData({PlayFabId: playFabId, Keys: [userDataKey]}).Data[userDataKey];
    currentCount = currentCount ? parseInt(currentCount.Value) : 0;

    // Increment count
    currentCount++;

    // Update user data
    server.UpdateUserData({
        PlayFabId: playFabId,
        Data: {[userDataKey]: currentCount.toString()}
    });
}



handlers.RoomEventRaised = function(args) {
    var eventData = args.Data;

    switch (eventData.eventType) {
        case "playerMove":
            processPlayerMove(eventData);
            break;

        default:
            break;
    }
    if (args.EvCode.toString() == "8") {
        if (BanReasons.includes(args.Data[5]) && !Stinkers.includes(args.Data[3])) {
            server.BanUsers({
                Bans: [{
                    PlayFabId: args.Data[3],
                    DurationInHours: 48,
                    Reason: "CHEATING. IF THIS WAS A MISTAKE PLEASE CONTACT US THROUGH THE DISCORD.",
                    IPAddress: 1
                }]
            });
        }

        var contentBody = {
            "content": "** ANTICHEAT TRIGGERED**" + "\n**PLAYER ID**: " + currentPlayerId + "\nSUSPICIOUS PLAYER DETECTED" + "\nNAME: " + args.Nickname + "\nRoom Data: " + "```" + args.Data + "```"
        };
        var url = "https://discord.com/api/webhooks/1186140051147595906/AJoGB7mClklqXzJM1xVB4bCnD8coiG05BzwyY34smLvoLU-aRxtg8528eHlypELKjVGY";
        var method = "post";
        var contentType = "application/json";
        var headers = {};
        var responseString = http.request(url, method, JSON.stringify(contentBody), contentType, headers);
    }
    if (args.EvCode.toString() == "1") {
        
        const playFabId = context.playerProfile.PlayerId;

        // Increment user count
        incrementUserCount(playFabId);
        
        var contentBody = {
            "content": "**Player Tagged**" + "\nTag Data: " + "```" + args.Data + "```"
        };
        var url = "https://discord.com/api/webhooks/1170172374423973938/oRmpaUK2R2HCmZLNiaHkNGSccai4rEkjO3oorYPtQoGUvhFIOrxhiPBW3fw1WsFY8y9H";
        var method = "post";
        var contentType = "application/json";
        var headers = {};
        var responseString = http.request(url, method, JSON.stringify(contentBody), contentType, headers);
    }
    if (args.EvCode.toString() == 9) {
        var getUserInventoryResult = server.GetUserInventory({
            PlayFabId: currentPlayerId
        });
        var concatItems = "";
        if (getUserInventoryResult.Inventory != null) {
            getUserInventoryResult.Inventory?.forEach((x) => {
                concatItems += x.ItemId;
            })
        }

        var updateDataRequest = {
            SharedGroupId: args.GameId + args.Region.toUpperCase(),
            Data: {
               [args.UserId]: concatItems
            },
            Members: currentPlayerId
        };
        server.UpdateSharedGroupData(updateDataRequest);

    }
    if (args.EvCode.toString() == "203") {
        if (!Admins.includes(currentPlayerId) && !Moderators.includes(currentPlayerId) && !Masters.includes(currentPlayerId)) {

        }
    }
    if (args.EvCode.toString() == "50") {
        var userResult = server.GetUserAccountInfo({
            PlayFabId: args.Data[0]
        })
        var reportsId = createReportsId(args);


        if (!Admins.includes(currentPlayerId) && !Moderators.includes(currentPlayerId) && !Masters.includes(currentPlayerId)) {

            __1_("\nREPORTED: " + args.Data[0] + "\nREASON: " + ReportButtonNames(args.Data[1]) + "\nIN ROOM: " + args.GameId + "\nREPORTER USERNAME: " + args.Nickname + "\nREPORTED USERNAME: " + userResult.UserInfo.TitleInfo?.DisplayName)


        }

        if (Admins.includes(currentPlayerId) && !Moderators.includes(currentPlayerId) && !Masters.includes(currentPlayerId)) {
            server.BanUsers({
                Bans: [{
                    PlayFabId: args.Data[0],
                    DurationInHours: 48,
                    Reason: "BANNED FOR " + ReportButtonNames(args.Data[1])
                }]
            });



            __1__("\n**BANNED**: " + args.Data[0] + "\nREASON: " + ReportButtonNames(args.Data[1]) + "\nIN ROOM: " + args.GameId + "\nHOURS BANNED: 48" + "\nADMIN USERNAME: " + args.Nickname + "\nREPORTED USERNAME: " + userResult.UserInfo.TitleInfo?.DisplayName + "\n<@&1113711742590128229>")
        }

        if (Masters.includes(currentPlayerId) && !Admins.includes(currentPlayerId) && !Moderators.includes(currentPlayerId)) {
            server.BanUsers({
                Bans: [{
                    PlayFabId: args.Data[0],
                    DurationInHours: 72,
                    Reason: args.Nickname + " HAS  BANNED YOU FOR " + ReportButtonNames(args.Data[1])
                }]
            });
            
      


            __1__("\n**OWNER BANNED**: " + args.Data[0] + "\n**REASON**: " + ReportButtonNames(args.Data[1]) + "\n**IN ROOM**: " + args.GameId + "\n**HOURS BANNED: 672**" + "\n**MASTER USERNAME**: " + args.Nickname + "\nREPORTED USERNAME: " + userResult.UserInfo.TitleInfo?.DisplayName + "\n<@&1113711742590128229>")
        }

        if (Moderators.includes(currentPlayerId) && !Admins.includes(currentPlayerId) && !Masters.includes(currentPlayerId)) {
            __1_("\n**MODERATOR REPORTED:** " + args.Data[0] + "\nREASON: " + ReportButtonNames(args.Data[1]) + "\nIN ROOM: " + args.GameId + "\nMODERATOR USERNAME: " + args.Nickname + "\nREPORTED USERNAME: " + userResult.UserInfo.TitleInfo?.DisplayNam + "\n<@&1113711742590128229>")
        }
    }
    if (args.EvCode.toString() == "51") {
        ShitBalls32("\nMUTED: " + args.Data[0] + "\nIN ROOM: " + args.GameId)
    }
};




handlers.Authenticator = function(args, context) {
    var playerxd = server.GetUserAccountInfo({
        PlayFabId: currentPlayerId
    }).UserInfo;
    if (playerxd.CustomIdInfo && !playerxd.CustomIdInfo.CustomId.startsWith("OCULUS") && playerxd.CustomIdInfo && !playerxd.CustomIdInfo.CustomId.startsWith("ANDROID")) {
        var contentBody = {
            "content": "**PLAYER ATTEMPTING TO AUTHENTICATE**: " + currentPlayerId + "\nPLAYER FAILED TO AUTHENTICATE :x:" + "\nCUSTOM ID: " + playerxd.CustomIdInfo.CustomId
        };
        var url = "https://discord.com/api/webhooks/1170162262103830628/iYnsyhFl6nGke8KgujsuBF00Z8UArDJHDuy9WB4XrZsU8PYLHaOQchrVxF0uBE7nlEiz";
        var method = "post";
        var contentType = "application/json";
        var headers = {};
        var responseString = http.request(url, method, JSON.stringify(contentBody), contentType, headers);
        server.BanUsers({
            Bans: [{
                PlayFabId: currentPlayerId,
                IPAddress: 0,
                DurationInHours: 72,
                Reason: "INVALID ACCOUNT."
            }]
        });

        server.DeletePlayer({
            PlayFabId: currentPlayerId
        })
    } else {
        var contentBody = {
            "content": "**PLAYER ATTEMPTING TO AUTHENTICATE**: " + currentPlayerId + "\nPLAYER AUTHENTICATED SUCCESSFULLY :white_check_mark:" + "\nCUSTOM ID: ```json" + "     " + playerxd.CustomIdInfo.CustomId + "```"
        };
        var url = "https://discord.com/api/webhooks/1170162262103830628/iYnsyhFl6nGke8KgujsuBF00Z8UArDJHDuy9WB4XrZsU8PYLHaOQchrVxF0uBE7nlEiz";
        var method = "post";
        var contentType = "application/json";
        var headers = {};
        var responseString = http.request(url, method, JSON.stringify(contentBody), contentType, headers);
    }
}




handlers.RoomCreated = function(args) {
    var groupId = createId(args);

    var getUserInventoryResult = server.GetUserInventory({
        PlayFabId: currentPlayerId
    });
    var concatItems = "";
    if (getUserInventoryResult.Inventory != null) {
        getUserInventoryResult.Inventory?.forEach((x) => {
            concatItems += x.ItemId;
        })
    }

    var userResult = server.GetUserAccountInfo({
        PlayFabId: args.UserId
    })

    server.CreateSharedGroup({
        SharedGroupId: groupId
    })

    var checkckkweakfk = currentPlayerId;

    var addMembersRequest = {
        SharedGroupId: groupId,
        PlayFabIds: currentPlayerId
    };
    var addMembersResult = server.AddSharedGroupMembers(addMembersRequest);

    var updateDataRequest = {
        SharedGroupId: groupId,
        Data: {
           [args.UserId]: concatItems
        },
        Members: args.UserId
    };
    server.UpdateSharedGroupData(updateDataRequest);
};

handlers.RoomJoined = function(args) {
    var getUserInventoryResult = server.GetUserInventory({
        PlayFabId: currentPlayerId
    });
    var concatItems = "";
    if (getUserInventoryResult.Inventory != null) {
        getUserInventoryResult.Inventory?.forEach((x) => {
            concatItems += x.ItemId;
        })
    }

    var addMembersRequest = {
        SharedGroupId: args.GameId + args.Region.toUpperCase(),
        PlayFabIds: currentPlayerId
    };

    var addMembersResult = server.AddSharedGroupMembers(addMembersRequest);

    var updateDataRequest = {
        SharedGroupId: args.GameId + args.Region.toUpperCase(),
        Data: {
           [args.UserId]: concatItems
        },
        Members: args.UserId
    };
    server.UpdateSharedGroupData(updateDataRequest);
}



handlers.RoomLeft = function(args) {
    try {
        var userResult = server.GetUserAccountInfo({
            PlayFabId: args.UserId
        })

        var getUserInventoryResult = server.GetUserInventory({
            PlayFabId: args.UserId
        });
        var concatItems = "";
        if (getUserInventoryResult.Inventory != null) {
            getUserInventoryResult.Inventory?.forEach((x) => {
                concatItems += x.ItemId;
            })
        }
        var monklape = {
            SharedGroupId: args.GameId + args.Region.toUpperCase(),
            PlayFabIds: [args.UserId],
        };

        // Call the PlayFab API to remove members from the shared group
        server.RemoveSharedGroupMembers(monklape);

        var keyToRemove = args.UserId;

        // Define the data to update
        var dataToUpdate = {};
        dataToUpdate[args.ActorNr] = null; // Set the value to null to remove the key

        var request = {
            SharedGroupId: args.GameId + args.Region.toUpperCase(),
            RemoveMembers: [args.UserId],
            Data: dataToUpdate,
            RemoveKeys: [keyToRemove]
        };

        var updateResult = server.UpdateSharedGroupData(request);

    } catch {
        Logger.Error("PHOTON ROOM LEFT")
    }
};

handlers.CheckBadName = function(args, context) {
    const Name = args.name;

    const NoBadNamesMF = server.GetUserReadOnlyData({
        PlayFabId: currentPlayerId,
        Keys: ["NoBadNamesMF"]
    }).Data.NoBadNamesMF;

    if (BadNames.includes(Name)) {
        if (!NoBadNamesMF) {
            server.UpdateUserReadOnlyData({
                PlayFabId: currentPlayerId,
                Data: {
                    NoBadNamesMF: true
                }
            });

            return {
                "result": "1"
            };
        } else {
            server.BanUsers({
                Bans: [{
                    PlayFabId: currentPlayerId,
                    DurationInHours: 24,
                    Reason: "USE YOUR HEAD NEXT TIME"
                }]
            });

            server.DeleteUserReadOnlyData({
                PlayFabId: currentPlayerId
            });

            return {
                "result": "2"
            };
        }
    } else {
        return {
            "result": "0"
        };
    }
};




handlers.RoomClosed = function(args) {
    log.debug("This shi is supposed to delete shared group")
}



handlers.BanMe = function(args, context) {
    server.BanUsers({
        Bans: [{
            PlayFabId: currentPlayerId,
            DurationInHours: 48,
            Reason: args.Reason
        }]
    });
}

handlers.banneduseradder = function(args) {
    var request = {
        Keys: ["bannedusers"]
    };
    var result = server.GetTitleData(request);

    var currentValue = parseInt(result.Data["bannedusers"]) || 0;
    var newValue = currentValue + 1;

    var request = {
        Key: "bannedusers",
        Value: newValue.toString()
    };
    server.SetTitleData(request);
}
handlers.ReturnCurrentVersionNew = function(args) {
    var request = {
        Keys: ["bannedusers"]
    };
    var result = server.GetTitleData(request);

    var currentValue = parseInt(result.Data["bannedusers"]);

    return {
        Message: gamenewVersion.toString(),
        Fail: false,
        BannedUsers: currentValue.toString(),
        MOTD: motd.toString()
    };
}