"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetReminderNotified = exports.sendDueNotifications = void 0;
const admin = require("firebase-admin");
const firestore_1 = require("firebase-functions/v2/firestore");
const scheduler_1 = require("firebase-functions/v2/scheduler");
admin.initializeApp();
const db = admin.firestore();
const messaging = admin.messaging();
// ---------------------------------------------------------------------------
// Tipos internos
// ---------------------------------------------------------------------------
const OFFSETS = {
    "15m": 15,
    "30m": 30,
    "1h": 60,
    "6h": 360,
    "1d": 1440,
};
function offsetMinutes(key) {
    var _a;
    return (_a = OFFSETS[key]) !== null && _a !== void 0 ? _a : 30;
}
// ---------------------------------------------------------------------------
// Funções auxiliares
// ---------------------------------------------------------------------------
/**
 * Devolve os tokens FCM activos de um utilizador como array de strings.
 * Remove automaticamente tokens inválidos do Firestore.
 */
async function getUserTokens(userId) {
    const snap = await db
        .collection("users")
        .doc(userId)
        .collection("fcmTokens")
        .get();
    return snap.docs.map((d) => d.data().token).filter(Boolean);
}
/**
 * Remove tokens FCM que o FCM reportou como inválidos ou não-registados.
 */
async function purgeInvalidTokens(userId, invalidTokens) {
    if (invalidTokens.length === 0)
        return;
    const batch = db.batch();
    for (const token of invalidTokens) {
        const ref = db
            .collection("users")
            .doc(userId)
            .collection("fcmTokens")
            .doc(token);
        batch.delete(ref);
    }
    await batch.commit();
}
/**
 * Envia uma mensagem FCM multicast (um envio por lote de tokens) e grava
 * o histórico em `notifications/{id}`. Marca o item como notified=true.
 */
async function sendPush(params) {
    const { userId, entityId, entityType, title, body, itemRef } = params;
    const tokens = await getUserTokens(userId);
    if (tokens.length === 0)
        return;
    const message = {
        tokens,
        notification: { title, body },
        data: { entityType, entityId },
        android: { priority: "high" },
        apns: { payload: { aps: { sound: "default" } } },
    };
    const result = await messaging.sendEachForMulticast(message);
    // Remover tokens inválidos
    const invalidTokens = [];
    result.responses.forEach((resp, idx) => {
        var _a, _b;
        if (!resp.success &&
            (((_a = resp.error) === null || _a === void 0 ? void 0 : _a.code) === "messaging/registration-token-not-registered" ||
                ((_b = resp.error) === null || _b === void 0 ? void 0 : _b.code) === "messaging/invalid-registration-token")) {
            invalidTokens.push(tokens[idx]);
        }
    });
    await purgeInvalidTokens(userId, invalidTokens);
    // Gravar histórico em notifications/
    await db.collection("notifications").add({
        userId,
        entityId,
        entityType,
        title,
        body,
        sentAt: admin.firestore.FieldValue.serverTimestamp(),
        successCount: result.successCount,
        failureCount: result.failureCount,
    });
    // Marcar como notificado para evitar reenvio
    await itemRef.update({ notified: true });
}
// ---------------------------------------------------------------------------
// sendDueNotifications — cron a cada minuto
// ---------------------------------------------------------------------------
/**
 * Percorre tarefas e lembretes cujo prazo está próximo, aplica o offset
 * de preferência do utilizador e envia a notificação push.
 *
 * Regra de disparo:
 *   Para cada item com notified==false e due/scheduled dentro da janela
 *   [agora, agora+25h]: ler preferences do dono; se a flag estiver activa
 *   e agora >= dueDate - offset, enviar push.
 *
 * A janela de 25h garante que mesmo o offset maior (1 dia) seja apanhado
 * pelo primeiro ciclo após a criação do item.
 */
exports.sendDueNotifications = (0, scheduler_1.onSchedule)({
    schedule: "every 1 minutes",
    timeZone: "America/Sao_Paulo",
    region: "southamerica-east1",
    memory: "256MiB",
}, async () => {
    const now = new Date();
    const windowEnd = new Date(now.getTime() + 25 * 60 * 60 * 1000);
    const nowTs = admin.firestore.Timestamp.fromDate(now);
    const windowEndTs = admin.firestore.Timestamp.fromDate(windowEnd);
    // ---- Tarefas ----
    const tasksSnap = await db
        .collection("tasks")
        .where("notified", "==", false)
        .where("dueDate", ">=", nowTs)
        .where("dueDate", "<=", windowEndTs)
        .get();
    const taskPromises = tasksSnap.docs.map(async (doc) => {
        var _a, _b, _c, _d, _e;
        const task = doc.data();
        const userId = task.userId;
        if (!userId)
            return;
        // Tarefas concluídas não recebem push
        if (task.status === "completed")
            return;
        const prefsDoc = await db.collection("preferences").doc(userId).get();
        const prefs = (_a = prefsDoc.data()) !== null && _a !== void 0 ? _a : {};
        if (!((_b = prefs.tasksNotificationsEnabled) !== null && _b !== void 0 ? _b : true))
            return;
        const offsetMins = offsetMinutes((_c = prefs.taskNotificationOffset) !== null && _c !== void 0 ? _c : "30m");
        const dueDate = task.dueDate.toDate();
        const notifyAt = new Date(dueDate.getTime() - offsetMins * 60 * 1000);
        if (now < notifyAt)
            return; // ainda não é hora
        const offsetLabel = (_d = prefs.taskNotificationOffset) !== null && _d !== void 0 ? _d : "30m";
        const humanOffset = offsetToLabel(offsetLabel);
        await sendPush({
            userId,
            entityId: doc.id,
            entityType: "task",
            title: `Tarefa em ${humanOffset}`,
            body: (_e = task.title) !== null && _e !== void 0 ? _e : "Você tem uma tarefa programada.",
            itemRef: doc.ref,
        });
    });
    // ---- Lembretes ----
    const remindersSnap = await db
        .collection("reminders")
        .where("notified", "==", false)
        .where("isRead", "==", false)
        .where("scheduledAt", ">=", nowTs)
        .where("scheduledAt", "<=", windowEndTs)
        .get();
    const reminderPromises = remindersSnap.docs.map(async (doc) => {
        var _a, _b, _c, _d, _e;
        const reminder = doc.data();
        const userId = reminder.userId;
        if (!userId)
            return;
        const prefsDoc = await db.collection("preferences").doc(userId).get();
        const prefs = (_a = prefsDoc.data()) !== null && _a !== void 0 ? _a : {};
        if (!((_b = prefs.remindersNotificationsEnabled) !== null && _b !== void 0 ? _b : true))
            return;
        const offsetMins = offsetMinutes((_c = prefs.reminderNotificationOffset) !== null && _c !== void 0 ? _c : "30m");
        const scheduledAt = reminder.scheduledAt.toDate();
        const notifyAt = new Date(scheduledAt.getTime() - offsetMins * 60 * 1000);
        if (now < notifyAt)
            return;
        const offsetLabel = (_d = prefs.reminderNotificationOffset) !== null && _d !== void 0 ? _d : "30m";
        const humanOffset = offsetToLabel(offsetLabel);
        await sendPush({
            userId,
            entityId: doc.id,
            entityType: "reminder",
            title: `Lembrete em ${humanOffset}`,
            body: (_e = reminder.title) !== null && _e !== void 0 ? _e : "Você tem um lembrete programado.",
            itemRef: doc.ref,
        });
    });
    await Promise.allSettled([...taskPromises, ...reminderPromises]);
});
// ---------------------------------------------------------------------------
// resetReminderNotified — repõe notified=false quando scheduledAt muda
// ---------------------------------------------------------------------------
/**
 * Quando o utilizador edita um lembrete e altera o `scheduledAt`,
 * repõe `notified=false` para que o push seja reenviado no novo horário.
 */
exports.resetReminderNotified = (0, firestore_1.onDocumentUpdated)({
    document: "reminders/{reminderId}",
    region: "southamerica-east1",
}, async (event) => {
    var _a, _b, _c, _d, _e;
    const before = (_a = event.data) === null || _a === void 0 ? void 0 : _a.before.data();
    const after = (_b = event.data) === null || _b === void 0 ? void 0 : _b.after.data();
    if (!before || !after)
        return;
    const scheduledBefore = (_c = before.scheduledAt) === null || _c === void 0 ? void 0 : _c.toMillis();
    const scheduledAfter = (_d = after.scheduledAt) === null || _d === void 0 ? void 0 : _d.toMillis();
    if (scheduledBefore !== scheduledAfter && after.notified === true) {
        await ((_e = event.data) === null || _e === void 0 ? void 0 : _e.after.ref.update({ notified: false }));
    }
});
// ---------------------------------------------------------------------------
// Auxiliar de rótulos
// ---------------------------------------------------------------------------
function offsetToLabel(key) {
    switch (key) {
        case "15m":
            return "15 minutos";
        case "30m":
            return "30 minutos";
        case "1h":
            return "1 hora";
        case "6h":
            return "6 horas";
        case "1d":
            return "1 dia";
        default:
            return "30 minutos";
    }
}
//# sourceMappingURL=index.js.map