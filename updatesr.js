const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: context.params.event.channel_id,
  content: `<@!${context.params.event.member.user.id}> just triggered the **updatesr** command!`
});

// Write some custom code here
await lib.airtable.query['@1.0.0'].update({
  baseId: `app47jUZ5IjGJsUwM`,
  table: `data`,
  where: [
    {
      'player__is': `${context.params.event.member.user.id}`
    }
  ],
  limit: {
    'count': 1,
    'offset': 0
  },
  fields: {
    'rank': `${context.params.event.data.options[0].value}`
  },
  typecast: true
});