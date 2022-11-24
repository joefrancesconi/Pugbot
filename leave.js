const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: context.params.event.channel_id,
  content: `<@!${context.params.event.member.user.id}> is **leaving** :( Thanks for playing!`
});

// Deletes user from queue
await lib.airtable.query['@1.0.0'].delete({
  baseId: `app47jUZ5IjGJsUwM`,
  table: `game`,
  where: [
    {
      'player__is': `${context.params.event.member.user.id}`
    }
  ],
  limit: {
    'count': 0,
    'offset': 0
  }
});