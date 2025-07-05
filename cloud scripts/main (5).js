handlers.ReturnCurrentVersion = function(args) {
    var motd = "WELCOME TO RONIX TAG, WE HAVE SO MUCH FUN IN STORE FOR YOU!";
    return {
        Message: motd,
        Version: null,
        MOTD: motd,
        MOTDBeta: motd
    };
};

handlers.BetterOculusAuth = function(args, context) {
    var res = server.GetUserAccountInfo({ PlayFabId: currentPlayerId });
    var customid = res.UserInfo?.CustomIdInfo?.CustomId;

    if (!customid || !customid.startsWith("OCULUS")) {
        return banAndDelete(currentPlayerId, "INVALID OR MISSING CUSTOM ID");
    }

    if (customid.length < 22 || customid.length > 24 || customid.startsWith("OCULUS0")) {
        return banAndDelete(currentPlayerId, "SUSPICIOUS CUSTOM ID LENGTH OR PREFIX");
    }

    var httpResponse = http.request({
        url: "https://graph.oculus.com/me",
        method: "GET",
        headers: {
            "Authorization": "Bearer " + customid,
            "Content-Type": "application/json"
        }
    });

    if (httpResponse.statusCode !== 200) {
        return banAndDelete(currentPlayerId, "OCULUS TOKEN INVALID");
    }

    var oculusdata = JSON.parse(httpResponse.body);

    if (!oculusdata || !oculusdata.id) {
        return banAndDelete(currentPlayerId, "OCULUS RESPONSE INVALID");
    }

    var entitlementResult = entitlementChecker(currentPlayerId, customid);
    if (!entitlementResult.success) {
        return banAndDelete(currentPlayerId, "ENTITLEMENT CHECK FAILED");
    }

    return {
        success: true,
        message: "Oculus user validated successfully",
        oculusId: customid,
        entitlement: entitlementResult.data
    };
};

function banAndDelete(playerId, reason) {
    server.BanUsers({
        Bans: [{
            PlayFabId: playerId,
            DurationInHours: 0,
            Reason: reason
        }]
    });

    server.DeletePlayer({ PlayFabId: playerId });

    return {
        success: false,
        error: reason
    };
}

function entitlementChecker(playFabId, customid) {
    try {
        var entitlementKey = "Entitlement_" + playFabId;
        var titleData = server.GetTitleData({ Keys: [entitlementKey] });

        if (!titleData || !titleData.Data || !titleData.Data[entitlementKey]) {
            return { success: false, message: "Entitlement key missing" };
        }

        return {
            success: true,
            data: titleData.Data[entitlementKey]
        };
    } catch (e) {
        return {
            success: false,
            message: "Entitlement check failed: " + e.message
        };
    }
}

function sendReport(message, playerId, customId) {
    var payload = ReportSenderForEveryone(message, playerId, customId);
    http.request({
        url: "https://discord.com/api/webhooks/1380932485159849994/_LG5m2_tRQWs76Zpyh1-kq14vICA8TEqyoaaF1-ddADABxQlKydjRip9bZEue7M230KB", 
        method: "POST",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" }
    });
}

handlers.NormalAuth = function(args, context) {
    var ownerInfo = server.GetUserAccountInfo({ PlayFabId: currentPlayerId });
    var ownerCustomId = ownerInfo.UserInfo?.CustomIdInfo?.CustomId;

    if (!ownerCustomId || ownerCustomId.trim() === "") {
        sendReport("NO CUSTOM ID FOUND", currentPlayerId, ownerCustomId);
        return banPlayer(currentPlayerId, "NO CUSTOM ID FOUND");
    }

    if (ownerCustomId.toLowerCase() === "oculus0") {
        sendReport("CUSTOM ID IS OCULUS0", currentPlayerId, ownerCustomId);
        return banPlayer(currentPlayerId, "CHEATING.");
    }
    
    if (ownerCustomId === "OCULUS") {
        sendReport("CUSTOM ID IS JUST OCULUS", currentPlayerId, ownerCustomId);
        return banPlayer(currentPlayerId, "CHEATING.");
    }

    if (ownerCustomId.length >= 40) {
        sendReport("CUSTOM ID TOO LONG", currentPlayerId, ownerCustomId);
        return banPlayer(currentPlayerId, "CHEATING. CUSTOM ID TOO LONG");
    }

    return { result: "frick" };
}

function banPlayer(playerId, reason) {
    server.BanUsers({
        Bans: [{
            PlayFabId: playerId,
            DurationInHours: 0,
            Reason: reason
        }]
    });

    server.DeletePlayer({ PlayFabId: playerId });

    return {
        success: false,
        error: reason
    };
}

function ReportSenderForEveryone(message, playerId, customId) {
    return {
        "embeds": [{
            "title": "**ANTI CHEAT REPORT**",
            "description":
                "**REASON:** " + message + "\n" +
                "**PLAYERID:** " + playerId + "\n" +
                "**CUSTOMID:** " + customId,
            "color": 16711680
        }]
    };
}
