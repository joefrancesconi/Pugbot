const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: context.params.event.channel_id,
  content: `<@!${context.params.event.member.user.id}> just triggered the **clearteams** command!`
});

// Write some custom code here
await lib.airtable.query['@1.0.0'].delete({
  baseId: `app47jUZ5IjGJsUwM`,
  table: `game`,
  where: [{}],
  limit: {
    'count': 0,
    'offset': 0
  }
});

return lib.discord.channels['@0.3.2'].messages.create({
    channel_id: `${context.params.event.channel_id}`,
    content: `Teams Cleared. Please use **/play** and then **/runpug** to create new teams.`
});