/* eslint-disable linebreak-style */
/* eslint-disable eol-last */
/* eslint-disable linebreak-style */
/* eslint-disable no-console */
/* eslint-disable linebreak-style */
const Koa = require('koa');
const koaBody = require('koa-body');
const cors = require('koa2-cors');

const faker = require('faker');
const Router = require('koa-router');

const app = new Koa();

app.use(
  cors({
    origin: '*',
    // credentials: true,
    // 'Access-Control-Allow-Origin': true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);

const PORT = process.env.PORT || 7070;

app.use(koaBody({
  text: true,
  urlencoded: true,
  multipart: true,
  json: true,
}));

const messages = [];

setInterval(() => {
  messages.push({
    id: faker.datatype.uuid(),
    from: faker.internet.email(),
    subject: faker.lorem.words(),
    body: faker.lorem.sentence(),
    received: faker.date.past(),
  });
}, Math.random() * 20000);

function getNewMsg(id) {
  if (id === '0') {
    return messages;
  }
  const index = messages.findIndex((elem) => elem.id === id);
  const newMsg = messages.slice(index + 1);
  return newMsg;
}

const router = new Router();
router.get('/messages/unread', async (ctx) => {
  const { id } = ctx.request.query;
  const newMessages = getNewMsg(id);
  ctx.response.body = newMessages;
});

app.use(router.routes()).use(router.allowedMethods());
app.listen(PORT, () => console.log(`Koa server has been started on port ${PORT} ...`));