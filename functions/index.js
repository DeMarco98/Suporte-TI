const admin = require("firebase-admin");
const functions = require("firebase-functions");

admin.initializeApp();

const db = admin.firestore();
const MASTER_ADMIN_EMAIL = "eduarddo.black@gmail.com";

async function assertCanManageUsers(context) {
  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated", "Faça login novamente.");
  }

  const requesterUid = context.auth.uid;
  const requesterEmail = context.auth.token.email || "";
  const configuredAdminEmail = process.env.BOOTSTRAP_ADMIN_EMAIL || MASTER_ADMIN_EMAIL;

  if (configuredAdminEmail && requesterEmail.toLowerCase() === configuredAdminEmail.toLowerCase()) {
    return;
  }

  const requesterDoc = await db.collection("users").doc(requesterUid).get();

  if (!requesterDoc.exists) {
    throw new functions.https.HttpsError("permission-denied", "Usuario sem permissao administrativa.");
  }

  const requester = requesterDoc.data() || {};
  const isAllowed = requester.active !== false && (requester.role === "admin" || requester.fullControl === true);

  if (!isAllowed) {
    throw new functions.https.HttpsError("permission-denied", "Somente administrador ou Controle Total pode executar esta acao.");
  }
}

function validatePassword(password) {
  if (typeof password !== "string" || password.length < 6) {
    throw new functions.https.HttpsError("invalid-argument", "A senha precisa ter pelo menos 6 caracteres.");
  }
}

async function resolveUid(data) {
  const uid = String(data.uid || "").trim();

  if (uid) {
    return uid;
  }

  const email = String(data.email || "").trim();

  if (!email) {
    throw new functions.https.HttpsError("invalid-argument", "Informe uid ou email do usuario.");
  }

  try {
    const user = await admin.auth().getUserByEmail(email);
    return user.uid;
  } catch (error) {
    throw new functions.https.HttpsError("not-found", "Usuario nao encontrado no Firebase Authentication.");
  }
}

exports.updateUserPassword = functions.https.onCall(async (data, context) => {
  try {
    await assertCanManageUsers(context);
    validatePassword(data.password);

    const uid = await resolveUid(data);
    await admin.auth().updateUser(uid, {
      password: data.password
    });

    await db.collection("users").doc(uid).set(
      {
        updatedAt: new Date().toISOString()
      },
      { merge: true }
    );

    return { success: true };
  } catch (error) {
    console.error("updateUserPassword failed", error);

    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError("internal", error.message || "Erro interno ao alterar senha.");
  }
});

exports.deleteUserAccount = functions.https.onCall(async (data, context) => {
  try {
    await assertCanManageUsers(context);

    const uid = await resolveUid(data);
    await admin.auth().deleteUser(uid);

    return { success: true };
  } catch (error) {
    console.error("deleteUserAccount failed", error);

    if (error instanceof functions.https.HttpsError) {
      throw error;
    }

    throw new functions.https.HttpsError("internal", error.message || "Erro interno ao excluir usuario.");
  }
});
