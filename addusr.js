const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});

await lib.discord.channels['@0.0.6'].messages.create({
  channel_id: context.params.event.channel_id,
  content: `<@!${context.params.event.member.user.id}> just triggered the **addusr** command!`
});

//adds user to database
let uID = context.params.event.member.user.id;

let r = await lib.airtable.query['@1.0.0'].distinct({
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
  field: `player`
});
if (r.distinct.values[0] === uID){
  return lib.discord.channels['@0.3.2'].messages.create({
    channel_id: `${context.params.event.channel_id}`,
    content: `User is alread registered. Thanks! If you are trying to update your SR, please use /updatesr .`
  });
  
}else {
  let result = await lib.airtable.query['@1.0.0'].insert({
    baseId: `app47jUZ5IjGJsUwM`,
    table: `data`,
    fieldsets: [
      {
        'player': `${uID}`,
        'rank': `${context.params.event.data.options[0].value}`,
        'total': `1`,
        'won': `1`
      }
    ],
    typecast: true
  
  });
  
  return lib.discord.channels['@0.3.2'].messages.create({
  channel_id: `${context.params.event.channel_id}`,
  content: `Thank you for adding your information!`
  });
}