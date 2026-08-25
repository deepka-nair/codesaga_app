/**
 * CodeSaga Developer User Registry & Progress Database — Google Apps Script Web App
 * ==================================================================================
 * Deployment Endpoint:
 * https://script.google.com/macros/s/AKfycbwRywy8q7ZTx0eKR3vqmqGXiguPA3-QYkSg9w8AlukfDLvQhdHpN7ooI3z8etXUZ036/exec
 * 
 * Column Schema in "Users" Worksheet (16 Columns, A to P):
 * A: user_id
 * B: email
 * C: verified
 * D: created_at
 * E: last_login
 * F: xp
 * G: level
 * H: completed_missions
 * I: completed_chapters
 * J: current_world
 * K: certificate_issued
 * L: username
 * M: certificate_id
 * N: certificate_issued_at
 * O: role (Column 15, index 14)
 * P: world_certificates_json (Column 16, index 15)
 * ==================================================================================
 */

var DEVELOPER_EMAIL = "deepkav5008.sse@saveetha.com";

function handleRequest(params, postBody) {
  var output = { success: false, error: "Invalid request parameters" };

  try {
    var payload = {};
    if (postBody) {
      try {
        payload = JSON.parse(postBody);
      } catch (e) {
        payload = params || {};
      }
    } else {
      payload = params || {};
    }

    var action = payload.action || params.action || "";
    var rawEmail = payload.email || params.email || "";
    var email = String(rawEmail || "").trim().toLowerCase();

    if (!email) {
      return createJsonResponse({ success: false, error: "Email parameter is required" });
    }

    var isDev = (email === DEVELOPER_EMAIL);
    var userRole = isDev ? "developer" : "user";

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName("Users");
    
    // Auto-create "Users" worksheet if missing
    if (!sheet) {
      sheet = ss.insertSheet("Users");
      sheet.appendRow([
        "user_id", "email", "verified", "created_at", "last_login",
        "xp", "level", "completed_missions", "completed_chapters", 
        "current_world", "certificate_issued", "username",
        "certificate_id", "certificate_issued_at", "role", "world_certificates_json"
      ]);
    }

    var data = sheet.getDataRange().getValues();
    var now = new Date().toISOString();

    // Search existing user row by normalized email (Column B, index 1)
    var userRowIndex = -1;
    var userRecord = null;

    for (var i = 1; i < data.length; i++) {
      var rowEmail = String(data[i][1] || "").trim().toLowerCase();
      if (rowEmail === email) {
        userRowIndex = i + 1; // 1-based row index in Sheet
        userRecord = parseRowToUser(data[i]);
        break;
      }
    }

    // If existing account is developer, enforce role = "developer" in database
    if (userRowIndex !== -1 && isDev) {
      sheet.getRange(userRowIndex, 15).setValue("developer");
      if (userRecord) userRecord.role = "developer";
    }

    // 1. GET USER (GET / POST)
    if (action === "getUser" || action === "getProgress") {
      if (userRowIndex !== -1 && userRecord) {
        output = {
          success: true,
          exists: true,
          user: userRecord,
          progress: userRecord
        };
      } else {
        output = {
          success: true,
          exists: false
        };
      }
    }
    // 2. REGISTER USER (POST)
    else if (action === "registerUser" || action === "createUser") {
      var rawUsername = payload.username || params.username || "";
      var username = String(rawUsername).trim() || (isDev ? "Developer" : email.split("@")[0]);

      if (userRowIndex !== -1 && userRecord) {
        sheet.getRange(userRowIndex, 5).setValue(now);
        sheet.getRange(userRowIndex, 15).setValue(userRole);
        if (username && (!userRecord.username || userRecord.username === email.split("@")[0])) {
          sheet.getRange(userRowIndex, 12).setValue(username);
          userRecord.username = username;
        }
        userRecord.last_login = now;
        userRecord.role = userRole;

        output = {
          success: true,
          newUser: false,
          user: userRecord
        };
      } else {
        // Create new user with role in Column O
        var nextIdNum = data.length;
        var userId = "USR_" + ("00" + nextIdNum).slice(-3);

        var newRow = [
          userId,
          email,
          true,
          now, // created_at
          now, // last_login
          0,   // xp
          1,   // level
          0,   // completed_missions
          0,   // completed_chapters
          "World Selection", // current_world
          false, // certificate_issued
          username, // username (Column L, index 11)
          "",   // certificate_id (Column M)
          "",   // certificate_issued_at (Column N)
          userRole, // role (Column O, index 14)
          "{}"  // world_certificates_json (Column P, index 15)
        ];

        sheet.appendRow(newRow);

        output = {
          success: true,
          newUser: true,
          user: parseRowToUser(newRow)
        };
      }
    }
    // 3. ISSUE WORLD CERTIFICATE (POST)
    else if (action === "issueWorldCertificate") {
      if (userRowIndex !== -1 && userRecord) {
        var worldId = payload.world_id || payload.worldId || "sql";
        var existingWorldCerts = userRecord.world_certificates || {};
        
        if (existingWorldCerts[worldId]) {
          output = {
            success: true,
            certificate: existingWorldCerts[worldId],
            world_certificates: existingWorldCerts
          };
        } else {
          var worldPrefixMap = { sql: "W1", python: "W2", java: "W3", frontend: "W4", cpp: "W5", backend: "W6" };
          var wPrefix = worldPrefixMap[worldId] || "W1";
          var randHex = Math.random().toString(36).substring(2, 8).toUpperCase();
          var newCertId = "CS-" + wPrefix + "-" + randHex;
          var newCertObj = {
            id: newCertId,
            issued_at: now,
            world_id: worldId
          };

          existingWorldCerts[worldId] = newCertObj;
          sheet.getRange(userRowIndex, 16).setValue(JSON.stringify(existingWorldCerts));
          sheet.getRange(userRowIndex, 11).setValue(true); // set certificate_issued = true

          output = {
            success: true,
            certificate: newCertObj,
            world_certificates: existingWorldCerts
          };
        }
      } else {
        output = { success: false, error: "User not found for certificate issuance" };
      }
    }
    // 4. UPDATE PROGRESS / SAVE STATE (POST)
    else if (action === "updateProgress" || action === "saveProgress") {
      if (userRowIndex !== -1) {
        sheet.getRange(userRowIndex, 5).setValue(now); // last_login
        if (payload.xp !== undefined) sheet.getRange(userRowIndex, 6).setValue(payload.xp);
        if (payload.level !== undefined) sheet.getRange(userRowIndex, 7).setValue(payload.level);
        if (payload.completed_missions !== undefined || payload.completedMissions !== undefined) {
          var missionsVal = payload.completed_missions !== undefined ? payload.completed_missions : payload.completedMissions;
          sheet.getRange(userRowIndex, 8).setValue(Array.isArray(missionsVal) ? missionsVal.length : missionsVal);
        }
        if (payload.completed_chapters !== undefined || payload.completedChapters !== undefined) {
          var chaptersVal = payload.completed_chapters !== undefined ? payload.completed_chapters : payload.completedChapters;
          sheet.getRange(userRowIndex, 9).setValue(Array.isArray(chaptersVal) ? chaptersVal.length : chaptersVal);
        }
        if (payload.current_world !== undefined || payload.currentWorld !== undefined) {
          sheet.getRange(userRowIndex, 10).setValue(payload.current_world || payload.currentWorld);
        }
        if (payload.username) {
          sheet.getRange(userRowIndex, 12).setValue(String(payload.username).trim());
        }
        if (payload.world_certificates || payload.worldCertificates) {
          sheet.getRange(userRowIndex, 16).setValue(JSON.stringify(payload.world_certificates || payload.worldCertificates));
        }

        sheet.getRange(userRowIndex, 15).setValue(userRole);

        output = {
          success: true,
          message: "Progress updated successfully",
          role: userRole
        };
      } else {
        output = { success: false, exists: false, error: "User not found for progress update" };
      }
    } else {
      output = { success: false, error: "Unknown action." };
    }

  } catch (err) {
    output = { success: false, error: err.toString() };
  }

  return createJsonResponse(output);
}

function parseRowToUser(row) {
  var emailVal = String(row[1] || "").trim().toLowerCase();
  var isDevRow = (emailVal === DEVELOPER_EMAIL);
  var roleVal = row[14] ? String(row[14]).trim() : (isDevRow ? "developer" : "user");

  var worldCertsObj = {};
  if (row[15]) {
    try {
      worldCertsObj = JSON.parse(row[15]);
    } catch(e) {
      worldCertsObj = {};
    }
  }

  return {
    user_id: row[0],
    userId: row[0],
    email: row[1],
    verified: row[2],
    created_at: row[3],
    createdAt: row[3],
    last_login: row[4],
    lastLogin: row[4],
    xp: Number(row[5]) || 0,
    level: Number(row[6]) || 1,
    completed_missions: Number(row[7]) || 0,
    completed_chapters: Number(row[8]) || 0,
    current_world: row[9] || "World Selection",
    certificate_issued: Boolean(row[10]),
    username: String(row[11] || "").trim(),
    certificate_id: String(row[12] || "").trim(),
    certificateId: String(row[12] || "").trim(),
    certificate_issued_at: String(row[13] || "").trim(),
    certificateIssuedAt: String(row[13] || "").trim(),
    role: roleVal,
    world_certificates: worldCertsObj,
    worldCertificates: worldCertsObj
  };
}

function createJsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  return handleRequest(e ? e.parameter : {}, null);
}

function doPost(e) {
  var postData = (e && e.postData && e.postData.contents) ? e.postData.contents : null;
  return handleRequest(e ? e.parameter : {}, postData);
}
