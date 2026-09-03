const { connectRabbitMQ } = require("../config/rabbitmq");
const {
  EXCHANGES,
  QUEUE,
  logger,
  todayFormat,
  sendTelegramMessage,
} = require("../utils");

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const escapeJson = (value) => {
  if (value === undefined || value === null) return null;
  try {
    return escapeHtml(JSON.stringify(value));
  } catch (error) {
    return escapeHtml(String(value));
  }
};

const buildTelegramText = (payload) => {
  const {
    system,
    id,
    url,
    method,
    status_code: statusCode,
    status,
    curl,
    payload: requestPayload,
    response,
    created_at: createdAt,
    notes,
  } = payload;

  return [
    "<b>API Log Notification</b>",
    `System: ${escapeHtml(system)}`,
    // `ID: ${escapeHtml(id)}`,
    `Method: ${escapeHtml(method)}`,
    `URL: ${escapeHtml(url)}`,
    `Status: ${escapeHtml(status)} (${escapeHtml(statusCode)})`,
    // createdAt ? `Created At: ${escapeHtml(createdAt)}` : null,
    requestPayload !== undefined
      ? `Payload: <code>${escapeJson(requestPayload)}</code>`
      : null,
    response !== undefined
      ? `Response: <code>${escapeJson(response)}</code>`
      : null,
    curl ? `Curl: <code>${escapeHtml(curl)}</code>` : null,
    notes ? `Notes: ${escapeHtml(notes)}` : null,
  ]
    .filter(Boolean)
    .join("\n");
};

const methodExecution = async (payload) => {
  if (payload?.send !== true) {
    console.info("[ApiLogListener] send=false, skipping Telegram delivery");
    return;
  }

  await sendTelegramMessage(buildTelegramText(payload));
};

const initApiLogListener = async () => {
  const queueName = QUEUE.API_LOG;
  const { channel, connection } = await connectRabbitMQ();

  process.once("SIGINT", async () => {
    console.info("got sigint, closing api-log listener connection");
    await channel.close();
    await connection.close();
    process.exit(0);
  });

  try {
    await channel.assertExchange(EXCHANGES.API_LOG, "fanout", {
      durable: true,
    });
    await channel.assertQueue(queueName, { durable: true });
    await channel.bindQueue(queueName, EXCHANGES.API_LOG);
    await channel.prefetch(10);

    await channel.consume(
      queueName,
      async (msg) => {
        console.info(`Processing api-log ${msg?.fields?.consumerTag}`);
        const parseData = JSON.parse(msg.content.toString());
        try {
          await methodExecution(parseData);
          logger("api-log-services.txt", "api-log").write(
            `Success consume-api-log-${todayFormat("YYYY-MM-DD hh:mm:ss")}: ${JSON.stringify(parseData)}\n`,
          );
        } catch (error) {
          console.info("error job", error);
          logger("api-log-services.txt", "api-log").write(
            `Failed consume-api-log-${todayFormat("YYYY-MM-DD hh:mm:ss")}: ${JSON.stringify(error)}\n`,
          );
        }
        channel.ack(msg);
      },
      {
        noAck: false,
        consumerTag: `consumer_${queueName}`,
      },
    );
  } catch (error) {
    console.info(error);
    logger("api-log-services.txt", "api-log").write(
      `Error consume-api-log-${todayFormat("YYYY-MM-DD hh:mm:ss")}: ${error} - ${error.toString()}\n`,
    );
  }
};

module.exports = {
  initApiLogListener,
};
