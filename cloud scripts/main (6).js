handlers.ReturnCurrentVersionNew = function(args){
    return {"ResultCode":0,"BannedUsers":"1","MOTD":"<color=red>HELLO, WELCOME TO APPLE TAGGERS!</color>\n<color=cyan>NEW DISCORD SOON!</color>\n<color=lime>UPDATE IS: HALLOWEEN 22</color>\n<color=magenta>YOUR ID: " + currentPlayerId + "</color>\n<color=green>OWNERS ARE REDAPPLE, RYRO, DRYCHEETA, BREEZY, ASTRO AND YEETER</color>","SynchTime":"-LOADING-","Version":"live1.1.1.29", "Message":"live1.1.1.29"}
}
hostids = ["5F088440FE964EF", "7790041534B798C5"]
playerIds = "";
gamedown = false


handlers.ReturnCurrentVersion = function(args) {
	return {
		"BannedUsers": "1",
		"MOTD": "<color=red>HELLO, WELCOME TO APPLE TAGGERS!</color>\n<color=cyan>NEW DISCORD SOON!</color>\n<color=lime>UPDATE IS: HALLOWEEN 22</color>\n<color=magenta>YOUR ID: " + currentPlayerId + "</color>\n<color=green>OWNERS ARE REDAPPLE, RYRO, DRYCHEETA, BREEZY, ASTRO AND YEETER</color>",
		"SynchTime": "hi people in playfab ignore this line</color>",
		"Message": "live11129",
		"Version": "live11129"
	}
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
			"description": "**Details Of The Room Code:**\nRoom Code: " + args.GameId + "\nRegion: " + args.Region + "\n**Details Of The Player**\nUserId: " + currentPlayerId + "\nNickName: " + args.Username,
			"color": 1926580
		}],
		"attachments": []
	}


	var url = "https://discord.com/api/webhooks/1248437613094899794/uZjYlaj-qWHE9E0vI3ygc6VqUxIhsq6eghcX101-YqkSzHClyTDl2T2_4E6SB2SkL523";
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
			"description": "Details Of The Room Code:\nRoom Code: " + args.GameId + "\nRegion: " + args.Region + "\nDetails Of The Player\nUserId: " + currentPlayerId + "\nNickName: " + args.Username,
			"color": 720640
		}],
		"attachments": []

	}

	var url = "https://discord.com/api/webhooks/1248437613094899794/uZjYlaj-qWHE9E0vI3ygc6VqUxIhsq6eghcX101-YqkSzHClyTDl2T2_4E6SB2SkL523";
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
			"description": "Details Of The Room Code:\nRoom Code: " + args.GameId + "\nRegion: " + args.Region + "\nDetails Of The Player\nUserId: " + currentPlayerId + "\nNickName: " + args.Username,
			"color": 14680319
		}],
		"attachments": []

	}

	var url = "https://discord.com/api/webhooks/1248437613094899794/uZjYlaj-qWHE9E0vI3ygc6VqUxIhsq6eghcX101-YqkSzHClyTDl2T2_4E6SB2SkL523";
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
			"description": "Details Of The Room Code:\nRoom Code: " + args.GameId + "\nRegion: " + args.Region + "\nDetails Of The Player\nUserId: " + currentPlayerId + "\nNickName: " + args.Username,
			"color": 8716543
		}],
		"attachments": []

	}

	var url = "https://discord.com/api/webhooks/1248437613094899794/uZjYlaj-qWHE9E0vI3ygc6VqUxIhsq6eghcX101-YqkSzHClyTDl2T2_4E6SB2SkL523";
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
	var url = "https://discord.com/api/webhooks/1248437613094899794/uZjYlaj-qWHE9E0vI3ygc6VqUxIhsq6eghcX101-YqkSzHClyTDl2T2_4E6SB2SkL523";
	var method = "post";
	var contentType = "application/json";
	var headers = {};
	var responseString = http.request(url, method, JSON.stringify(contentBody), contentType, headers);
};

// Triggered by calling "OpRaiseEvent" on the Photon client. The "args.Data" property is 
// set to the value of the "customEventContent" HashTable parameter, so you can use
// it to pass in arbitrary data.
handlers.RoomEventRaised = function(args) {
    if (args.EvCode.toString() == "9") {
		const concatItems = handlers.GetPlayerInventory();
		const data = {};
		data[currentPlayerId] = concatItems;

		server.UpdateSharedGroupData({
			SharedGroupId: args.GameId + args.Region.toUpperCase(),
			Permission: "Public",
			Data: data
		});
	}
	
	if (args.EvCode == 50) {
		var ermmmdata = args.Data;
		var ReportedID = ermmmdata[0];
		var reasonCode = ermmmdata[1];
		var reportedname = ermmmdata[2];
		var reportername = ermmmdata[3];

		let mappedReasonType;

		switch (ermmmdata[1]) {
			case 0:
				mappedReasonType = "HATE SPEECH";
				break;
			case 1:
				mappedReasonType = "CHEATING";
				break;
			case 2:
				mappedReasonType = "TOXICITY";
				break;
			default:
				mappedReasonType = "UNKNOWN"; // Handle unknown reasonCode
		}

		// Construct the Discord message content
		var contentBody = {
			"content": null,
			"embeds": [{
				"title": "USER REPORTED",
				"description": "**DETAILS ABOUT REPORTER**\nReporter ID: " + currentPlayerId + "\nReporter Name: " + ermmmdata[3] + "\nReason: " + mappedReasonType + "\n**DETAILS ABOUT REPORTED**\nReported ID: " + ermmmdata[0] + "\nReported Name: " + ermmmdata[2] + "\n\n**IN CODE: " + args.GameId + "**",
				"color": 16711680,
				"author": {
					"name": "Apple Taggers"
				}
			}],
			"attachments": []
		};

		// Send the message to Discord
		var url = "https://discord.com/api/webhooks/1248437613094899794/uZjYlaj-qWHE9E0vI3ygc6VqUxIhsq6eghcX101-YqkSzHClyTDl2T2_4E6SB2SkL523";
		var method = "post";
		var contentType = "application/json";
		var headers = {};
		var responseString = http.request(url, method, JSON.stringify(contentBody), contentType, headers);
	}
};