// crazy server sided

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

